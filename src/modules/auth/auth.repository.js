import pool from "../../config/db.js";

// find user by email
export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email=$1 LIMIT 1`;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

// find user by id
export const findUserById = async (userId) => {
  const query = `SELECT * FROM users WHERE id=$1 LIMIT 1`;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

// check organisation exists or nit
export const findOrganizationByName = async (name) => {
  const query = `SELECT * FROM organizations WHERE name=$1 LIMIT 1`;
  const { rows } = await pool.query(query, [name]);
  return rows[0];
};

// create organization
export const createOrganization = async (orgData) => {
  const name = typeof orgData === "string" ? orgData : orgData.name;
  const query = `INSERT INTO organizations (name) VALUES ($1) RETURNING *`;
  const { rows } = await pool.query(query, [name]);
  return rows[0];
};

// create user
export const createUser = async (userData) => {
  const query = `
    INSERT INTO users
    (organization_id, name, email, password, role)
    VALUES
    ( $1, $2, $3, $4, $5)
    RETURNING
      id, organization_id, name, email, role, created_at
  `;
  const values = [
    userData.organization_id,
    userData.name,
    userData.email,
    userData.password,
    userData.role,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// save refresh token
export const createRefreshToken = async (tokenData) => {
  const query = `
      INSERT INTO refresh_tokens
      (
        user_id,
        token,
        expires_at
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *
    `;
  const values = [tokenData.userId, tokenData.token, tokenData.expiresAt];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// find refresh token
export const findRefreshToken = async (token) => {
  const query = `
      SELECT *
      FROM refresh_tokens
      WHERE token = $1
      LIMIT 1
    `;
  const { rows } = await pool.query(query, [token]);
  return rows[0];
};

// revoke refresh token
export const revokeRefreshToken = async (token) => {
  const query = `
      UPDATE refresh_tokens
      SET is_revoked = true
      WHERE token = $1
    `;
  await pool.query(query, [token]);
};

// revoke all user tokens
export const revokeAllUserTokens = async (userId) => {
  const query = `
      UPDATE refresh_tokens
      SET is_revoked = true
      WHERE user_id = $1
    `;
  await pool.query(query, [userId]);
};
