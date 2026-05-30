import pool from "../../config/db.js";

export const createProject = async (payload) => {
  const query = `
    INSERT INTO projects
    (
      organization_id,
      name,
      description,
      created_by
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING *
  `;

  const values = [
    payload.organization_id,
    payload.name,
    payload.description,
    payload.createdBy,
  ];

  const { rows } = await pool.query(query, values);
  console.log(rows);
  return rows[0];
};

export const findProjectById = async (projectId, organization_id) => {
  const query = `
      SELECT *
      FROM projects
      WHERE id = $1
      AND organization_id = $2
      LIMIT 1
    `;

  const { rows } = await pool.query(query, [projectId, organization_id]);
  return rows[0];
};

export const findProjectByName = async (name, organization_id) => {
  console.log("---", name, organization_id);
  const query = `
      SELECT *
      FROM projects
      WHERE LOWER(name) = LOWER($1)
      AND organization_id = $2
      LIMIT 1
    `;

  const { rows } = await pool.query(query, [name, organization_id]);
  console.log(rows);
  return rows[0];
};

export const getProjects = async ({
  organization_id,
  search,
  limit,
  offset,
}) => {
  const values = [organization_id];
  let index = 2;
  let query = `
    SELECT *
    FROM projects
    WHERE organization_id = $1
  `;

  if (search) {
    query += `
      AND (
        name ILIKE $${index}
        OR description ILIKE $${index}
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

export const countProjects = async ({ organization_id, search }) => {
  const values = [organization_id];
  let index = 2;
  let query = `
      SELECT COUNT(*) AS total
      FROM projects
      WHERE organization_id = $1
    `;

  if (search) {
    query += `
        AND (
          name ILIKE $${index}
          OR description ILIKE $${index}
        )
      `;
    values.push(`%${search}%`);
  }

  const { rows } = await pool.query(query, values);
  return Number(rows[0].total);
};

export const updateProject = async (projectId, payload) => {
  const fields = [];
  const values = [];
  let index = 1;
  Object.entries(payload).forEach(([key, value]) => {
    fields.push(`${key} = $${index++}`);
    values.push(value);
  });

  values.push(projectId);
  const query = `
      UPDATE projects
      SET
        ${fields.join(", ")},
        updated_at = NOW()
      WHERE id = $${index}
      RETURNING *
    `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteProject = async (projectId) => {
  const query = `
      DELETE FROM projects
      WHERE id = $1
    `;
  await pool.query(query, [projectId]);
};
