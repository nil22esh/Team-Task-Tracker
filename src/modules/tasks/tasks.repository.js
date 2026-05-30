import pool from "../../config/db.js";

export const createTask = async (payload) => {
  const query = `
    INSERT INTO tasks
    (
      organization_id,
      project_id,
      title,
      description,
      priority,
      assignee_id,
      due_date,
      created_by
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7,$8
    )
    RETURNING *
  `;

  const values = [
    payload.organization_id,
    payload.projectId,
    payload.title,
    payload.description,
    payload.priority,
    payload.assignee_id,
    payload.due_date,
    payload.createdBy,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findTaskById = async (taskId, organization_id) => {
  const query = `
    SELECT *
    FROM tasks
    WHERE id = $1
    AND organization_id = $2
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [taskId, organization_id]);
  return rows[0];
};

export const updateTask = async (taskId, payload) => {
  const fields = [];
  const values = [];
  let index = 1;

  Object.entries(payload).forEach(([key, value]) => {
    fields.push(`${key} = $${index++}`);
    values.push(value);
  });
  values.push(taskId);

  const query = `
    UPDATE tasks
    SET
      ${fields.join(", ")},
      updated_at = NOW()
    WHERE id = $${index}
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteTask = async (taskId) => {
  await pool.query(
    `
      DELETE FROM tasks
      WHERE id = $1
    `,
    [taskId],
  );
};

export const getTasks = async ({
  organization_id,
  status,
  priority,
  assignee_id,
  limit,
  offset,
}) => {
  const values = [organization_id];

  let index = 2;

  let query = `
    SELECT *
    FROM tasks
    WHERE organization_id = $1
  `;

  if (status) {
    query += `
      AND status = $${index}
    `;

    values.push(status);

    index++;
  }

  if (priority) {
    query += `
      AND priority = $${index}
    `;

    values.push(priority);

    index++;
  }

  if (assignee_id) {
    query += `
      AND assignee_id = $${index}
    `;

    values.push(assignee_id);

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

export const countTasks = async ({
  organization_id,
  status,
  priority,
  assignee_id,
}) => {
  const values = [organization_id];

  let index = 2;

  let query = `
    SELECT COUNT(*) AS total
    FROM tasks
    WHERE organization_id = $1
  `;

  if (status) {
    query += `
      AND status = $${index}
    `;

    values.push(status);

    index++;
  }

  if (priority) {
    query += `
      AND priority = $${index}
    `;

    values.push(priority);

    index++;
  }

  if (assignee_id) {
    query += `
      AND assignee_id = $${index}
    `;

    values.push(assignee_id);
  }

  const { rows } = await pool.query(query, values);

  return Number(rows[0].total);
};
