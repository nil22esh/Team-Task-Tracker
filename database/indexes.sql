-- users
CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_users_organization
ON users(organization_id);

-- projects
CREATE INDEX idx_projects_organization
ON projects(organization_id);

CREATE INDEX idx_projects_creator
ON projects(created_by);

-- tasks
CREATE INDEX idx_tasks_status
ON tasks(status);

CREATE INDEX idx_tasks_assignee
ON tasks(assignee_id);

CREATE INDEX idx_tasks_due_date
ON tasks(due_date);

CREATE INDEX idx_tasks_project
ON tasks(project_id);

-- composite indexes
CREATE INDEX idx_tasks_assignee_status
ON tasks(assignee_id, status);

CREATE INDEX idx_tasks_project_status
ON tasks(project_id, status);

CREATE INDEX idx_tasks_due_date_status
ON tasks(due_date, status);

-- refresh tokens
CREATE INDEX idx_refresh_tokens_user
ON refresh_tokens(user_id);

CREATE INDEX idx_refresh_tokens_token
ON refresh_tokens(token);