import bcrypt from "bcrypt";
import ApiError from "../../utils/ApiError.js";
import { AUTH_ERRORS, DATABASE_ERRORS } from "../../utils/errorMessages.js";
import {
  createOrganization,
  createRefreshToken,
  createUser,
  findOrganizationByName,
  findRefreshToken,
  findUserByEmail,
  findUserById,
  revokeAllUserTokens,
  revokeRefreshToken,
} from "./auth.repository.js";
import { ROLES } from "../../constants/roles.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

const buildTokenPayload = (user) => ({
  userId: user.id,
  organization_id: user.organization_id,
  role: user.role,
});

export const register = async (payload) => {
  const { organizationName, name, email, password } = payload;
  const organizationExists = await findOrganizationByName(organizationName);

  if (organizationExists) {
    throw new ApiError({
      status: 409,
      code: "ORGANIZATION_ALREADY_EXISTS",
      message: "organization already exists",
    });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError({
      status: 409,
      code: "USER_ALREADY_EXISTS",
      message: "user already exists",
    });
  }

  const organization = await createOrganization({
    name: organizationName,
  });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    organization_id: organization.id,
    role: ROLES.ADMIN,
  });

  const accessToken = generateAccessToken(buildTokenPayload(user));
  const refreshToken = generateRefreshToken(buildTokenPayload(user));

  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new ApiError(AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  const accessToken = generateAccessToken(buildTokenPayload(user));
  const refreshToken = generateRefreshToken(buildTokenPayload(user));

  await createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const storedToken = await findRefreshToken(refreshToken);

  if (!storedToken || storedToken.is_revoked) {
    throw new ApiError(AUTH_ERRORS.INVALID_REFRESH_TOKEN);
  }

  await revokeRefreshToken(refreshToken);
  const user = await findUserById(decoded.userId);
  const newAccessToken = generateAccessToken(buildTokenPayload(user));
  const newRefreshToken = generateRefreshToken(buildTokenPayload(user));

  await createRefreshToken({
    userId: user.id,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (userId) => {
  await revokeAllUserTokens(userId);
};
