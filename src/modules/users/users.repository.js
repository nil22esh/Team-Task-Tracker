import pool from "../../config/db.js";

export const findUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const findUserById = async (userId) => {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

export const createUser = async (payload) => {
  const query = `
    INSERT INTO users
    (
      organization_id,
      name,
      email,
      password,
      role
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4,
      $5
    )
    RETURNING
      id,
      organization_id,
      name,
      email,
      role,
      created_at
  `;
  const values = [
    payload.organization_id,
    payload.name,
    payload.email,
    payload.password,
    payload.role,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getUsers = async ({
  organization_id,
  role,
  search,
  limit,
  offset,
}) => {
  // console.log("organization_id--", organization_id);
  const values = [organization_id];
  let index = 2;
  let query = `
    SELECT
      id,
      name,
      email,
      role,
      created_at
    FROM users
    WHERE organization_id = $1
  `;

  if (role) {
    query += `
      AND role = $${index}
    `;
    values.push(role);
    index++;
  }

  if (search) {
    query += `
      AND (
        name ILIKE $${index}
        OR email ILIKE $${index}
      )
    `;
    values.push(`%${search}%`);
    index++;
  }

  query += `
    ORDER BY created_at DESC
    LIMIT $${index}
    OFFSET $${index + 1}
  `;

  values.push(limit);
  values.push(offset);

  const { rows } = await pool.query(query, values);
  return rows;
};

export const countUsers = async ({ organization_id, role, search }) => {
  const values = [organization_id];
  let index = 2;
  let query = `
    SELECT COUNT(*) AS total
    FROM users
    WHERE organization_id = $1
  `;

  if (role) {
    query += `
      AND role = $${index}
    `;
    values.push(role);
    index++;
  }

  if (search) {
    query += `
      AND (
        name ILIKE $${index}
        OR email ILIKE $${index}
      )
    `;
    values.push(`%${search}%`);
  }
  const { rows } = await pool.query(query, values);
  return Number(rows[0].total);
};

export const updateUser = async (userId, payload) => {
  const fields = [];
  const values = [];
  let index = 1;

  Object.entries(payload).forEach(([key, value]) => {
    fields.push(`${key} = $${index++}`);

    values.push(value);
  });
  values.push(userId);

  const query = `
    UPDATE users
    SET
      ${fields.join(", ")},
      updated_at = NOW()
    WHERE id = $${index}
    RETURNING
      id,
      name,
      email,
      role,
      updated_at
  `;
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteUser = async (userId) => {
  const query = `
    DELETE FROM users
    WHERE id = $1
  `;
  await pool.query(query, [userId]);
};
