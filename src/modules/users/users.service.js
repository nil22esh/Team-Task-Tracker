import bcrypt from "bcrypt";
import ApiError from "../../utils/ApiError.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getUsers,
  countUsers,
  updateUser,
  deleteUser,
} from "./users.repository.js";

export const createNewUser = async (payload, currentUser) => {
  const existingUser = await findUserByEmail(payload.email);
  if (existingUser) {
    throw new ApiError({
      status: 409,
      code: "USER_ALREADY_EXISTS",
      message: "user already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  return createUser({
    ...payload,
    password: hashedPassword,
    organization_id: currentUser.organization_id,
  });
};

export const getAllUsers = async (query, currentUser) => {
  // console.log("currentUser---->>>", currentUser);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;
  const role = query.role;
  const search = query.search;

  const users = await getUsers({
    organization_id: currentUser.organization_id,
    role,
    search,
    limit,
    offset,
  });

  const total = await countUsers({
    organization_id: currentUser.organization_id,
    role,
    search,
  });

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
    filters: {
      role,
      search,
    },
  };
};

export const getUserById = async (userId, currentUser) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError({
      status: 404,
      code: "USER_NOT_FOUND",
      message: "user not found",
    });
  }
  if (user.organization_id !== currentUser.organization_id) {
    throw new ApiError({
      status: 403,
      code: "FORBIDDEN",
      message: "access denied",
    });
  }
  return user;
};

export const updateExistingUser = async (userId, payload, currentUser) => {
  const user = await getUserById(userId, currentUser);
  return updateUser(user.id, payload);
};

export const removeUser = async (userId, currentUser) => {
  if (userId === currentUser.id) {
    throw new ApiError({
      status: 400,
      code: "SELF_DELETE_NOT_ALLOWED",
      message: "cannot delete your own account",
    });
  }
  const user = await getUserById(userId, currentUser);
  await deleteUser(user.id);
};
