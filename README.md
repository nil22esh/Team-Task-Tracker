# Team Task Tracker API

A production-grade REST API for managing team tasks within an organization. The system supports authentication, role-based access control (RBAC), task lifecycle management, Redis caching, and containerized deployment.

---

# Project Planning & Approach

Before implementation, the requirements were analyzed from both a backend engineering and system design perspective. The goal was to build a scalable, maintainable, and production-ready task management platform while keeping the architecture simple enough for rapid development.

## Requirement Analysis

The assignment required the following major capabilities:

- User authentication with JWT access and refresh tokens
- Role-based access control (ADMIN, MANAGER, MEMBER)
- Organization-based multi-user system
- Project and task management
- Controlled task status transitions
- Pagination and filtering support
- PostgreSQL database design with indexing
- Redis caching with invalidation strategy
- Centralized error handling
- Dockerized deployment
- Production-grade project structure

Based on these requirements, the application was designed using a layered architecture with clear separation of responsibilities.

---

## High-Level System Design

```text
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐
│ Express API │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│ Middleware Layer            │
│ - Authentication            │
│ - Authorization (RBAC)      │
│ - Validation                │
│ - Rate Limiting             │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Controller Layer            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Service Layer               │
│ - Business Logic            │
│ - Task Workflow Rules       │
│ - Token Management          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Repository Layer            │
│ - SQL Queries               │
└──────┬──────────────────────┘
       │
 ┌─────┴─────────┐
 ▼               ▼
PostgreSQL     Redis
(Persistent)   (Cache)
```

---

## Architecture Approach

The application follows a modular feature-based architecture.

### Request Flow

```text
Route
  ↓
Validation
  ↓
Authentication Middleware
  ↓
Authorization Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

## Authentication & Authorization

- User Registration
- User Login
- JWT Access Tokens
- Refresh Token Rotation
- Secure Logout
- Password Hashing using bcrypt
- Middleware-based RBAC

## Roles

### ADMIN

Can:

- Manage Users
- Manage Projects
- Manage Tasks
- Assign Tasks
- Update Task Status

### MANAGER

Can:

- Manage Projects
- Manage Tasks
- Assign Tasks
- Update Task Status

Cannot:

- Manage Users

### MEMBER

Can:

- View Assigned Tasks
- Update Assigned Task Status

Cannot:

- Manage Users
- Manage Projects
- Create Tasks
- Delete Tasks

---

# Authentication Flow

```text
Register
   │
   ▼
Create Organization
   │
   ▼
Create Admin User
   │
   ▼
Generate Access Token
   │
   ▼
Generate Refresh Token
```

---

# Login Flow

```text
Email + Password
      │
      ▼
Verify Credentials
      │
      ▼
Generate Access Token
      │
      ▼
Generate Refresh Token
      │
      ▼
Store Refresh Token
```

---

# Refresh Token Rotation

```text
Old Refresh Token
       │
       ▼
Verify Token
       │
       ▼
Delete Old Token
       │
       ▼
Create New Token
       │
       ▼
Return New Access Token
```

Benefits:

- Better security
- Reduced token replay attacks
- Session control

---

# RBAC Design

Authorization is enforced through middleware.

```text
Request
   │
   ▼
Authenticate User
   │
   ▼
Check Role
   │
   ▼
Allow / Reject
```

Example:

```javascript
authorize(ROLES.ADMIN, ROLES.MANAGER);
```

No role checks are embedded inside controllers.

---

# Task Workflow

Task statuses are not free-form.

Allowed transitions:

```text
TODO
  │
  ▼
IN_PROGRESS
  │
  ▼
IN_REVIEW
  │
  ▼
DONE
```

Blocked path:

```text
TODO ----------┐
IN_PROGRESS ---┼──► BLOCKED
IN_REVIEW -----┘
```

Invalid Example:

```text
TODO → DONE
```

Rejected by the service layer.

---

# Task Status Permissions

Status updates are restricted.

Allowed:

```text
MANAGER
ADMIN
ASSIGNEE
```

Not Allowed:

```text
Other Members
```

---

# Redis Caching Strategy

Assignment Requirement:

> Cache task list per assignee.

Cache Key Pattern:

```text
tasks:{assigneeId}:{page}:{limit}:{status}:{priority}
```

Example:

```text
tasks:123:1:10:TODO:HIGH
```

---

# Cache Invalidation Strategy

Cache is cleared whenever:

```text
Task Created
Task Updated
Task Deleted
Task Reassigned
Task Status Changed
```

Implementation:

```text
tasks:*
```

keys are invalidated to guarantee consistency.

---

# API Endpoints

## Health

```http
GET /api/v1/health
```

---

## Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
```

---

## Users

ADMIN only

```http
POST   /api/v1/users
GET    /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

Features:

- Pagination
- Search
- Role Filtering

Examples:

```http
GET /users?page=1&limit=10

GET /users?role=MANAGER

GET /users?search=john
```

---

## Projects

ADMIN and MANAGER

```http
POST   /api/v1/projects
GET    /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
```

Features:

- Pagination
- Search

---

## Tasks

Create Task

```http
POST /api/v1/tasks
```

Get Tasks

```http
GET /api/v1/tasks
```

Filters:

```http
?page=1
&limit=10
&status=TODO
&priority=HIGH
&assigneeId=<uuid>
```

Additional APIs:

```http
GET    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id/status
```

---

# Consistent Error Response Format

Example:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "due_date must be a future date"
}
```

Benefits:

- Predictable API contracts
- Better frontend integration
- Easier debugging

---

# Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Run production:

```bash
npm start
```

---

# Docker

Start everything:

```bash
docker compose up --build
```

Services:

- API
- PostgreSQL
- Redis

The reviewer should be able to run:

```bash
docker compose up
```

and start testing immediately.

---

# Future Improvements

Given more time, I would add:

- Swagger/OpenAPI Documentation
- Unit Tests
- Integration Tests
- WebSocket Notifications
- Analytics Dashboard
- Audit Logs
- Background Job Processing
- Task Comments
- File Attachments
- Email Notifications

---

# Extra Features Implemented Beyond Assignment

- Layered Architecture
- Repository Pattern
- Refresh Token Persistence
- Refresh Token Rotation
- User Search
- User Pagination
- User Role Filtering
- Self Delete Protection
- Composite Database Indexes
- Organization Isolation
- Centralized Error Handling
- Redis Caching Layer
- Multi-Tenant Security Design

---

# Author Notes

The project prioritizes:

- Maintainability
- Scalability
- Security
- Separation of Concerns
- Production-Grade Design

Business logic is isolated in services, database access is isolated in repositories, and authorization is enforced through middleware to keep the codebase clean and extensible.

### Responsibilities

#### Routes

- Define API endpoints
- Apply validation middleware
- Apply authentication and authorization middleware

#### Middleware

- JWT authentication
- Role-based authorization
- Request validation
- Rate limiting
- Error handling

#### Controllers

- Handle HTTP requests and responses
- Delegate business logic to services
- Keep controllers thin and maintainable

#### Services

- Implement business rules
- Handle task status transitions
- Manage authentication flow
- Coordinate repository operations

#### Repositories

- Execute SQL queries
- Isolate database access from business logic
- Improve maintainability and testability

---

# Database Design Planning

The database was designed using normalization principles while keeping query performance in mind.

The system revolves around five core entities:

- Organizations
- Users
- Projects
- Tasks
- Refresh Tokens

The design supports:

- Multi-tenancy through organizations
- Role-based access control
- Task assignment workflows
- Secure session management
- Efficient filtering and reporting

---

## Entity Relationship Diagram (ERD)

```text
┌─────────────────────┐
│   ORGANIZATIONS     │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ created_at          │
└─────────┬───────────┘
          │ 1
          │
          │ N
┌─────────▼───────────┐
│       USERS         │
├─────────────────────┤
│ id (PK)             │
│ organization_id(FK) │
│ name                │
│ email (UNIQUE)      │
│ password            │
│ role                │
│ created_at          │
└───────┬───────┬─────┘
        │       │
        │       │
        │       │ assigned_to
        │       │
        │       ▼
        │   ┌───────────────┐
        │   │     TASKS     │
        │   ├───────────────┤
        │   │ id (PK)       │
        │   │ project_id FK │
        │   │ assignee_idFK │
        │   │ title         │
        │   │ description   │
        │   │ status        │
        │   │ priority      │
        │   │ due_date      │
        │   │ created_at    │
        │   └───────▲───────┘
        │           │
        │           │ N
        │           │
        │           │ 1
        │           │
┌───────▼───────────┴─────┐
│       PROJECTS          │
├─────────────────────────┤
│ id (PK)                 │
│ organization_id (FK)    │
│ name                    │
│ description             │
│ created_by (FK)         │
│ created_at              │
└─────────────────────────┘


┌─────────────────────────┐
│    REFRESH_TOKENS       │
├─────────────────────────┤
│ id (PK)                 │
│ user_id (FK)            │
│ token                   │
│ expires_at              │
│ is_revoked              │
│ created_at              │
└───────────▲─────────────┘
            │
            │ N
            │
            │ 1
            │
┌───────────┴─────────────┐
│         USERS           │
└─────────────────────────┘
```

---

## Entity Design Decisions

### Organizations

Represents a company or workspace.

Why separate table?

- Supports multi-tenancy
- Enables future organization-level analytics
- Allows isolation of projects and users

### Users

Users belong to exactly one organization.

Supported roles:

- ADMIN
- MANAGER
- MEMBER

Design considerations:

- Email is globally unique
- Passwords are stored as bcrypt hashes
- Role stored as ENUM for consistency

### Projects

Projects act as containers for tasks.

Benefits:

- Logical grouping of work
- Easier reporting
- Better scalability for large organizations

### Tasks

Core business entity responsible for workflow management.

Key attributes:

- Assignee
- Status
- Priority
- Due date

Tasks are linked to:

- One project
- One assignee

This relationship simplifies querying and ownership checks.

### Refresh Tokens

Stores refresh tokens for session management.

Benefits:

- Token rotation
- Logout support
- Session revocation
- Improved security

---

## Security Planning

The authentication design follows modern JWT practices.

### Access Token

- Short-lived token
- Used for API authorization
- Sent in Authorization header
- Stateless verification

### Refresh Token

- Long-lived token
- Stored in database
- Rotated on every refresh request
- Revoked during logout

This approach reduces risks associated with stolen refresh tokens and enables secure session management.

---

## RBAC Planning

Authorization is enforced through middleware instead of controller-level checks.

### ADMIN

Can manage:

- Users
- Projects
- Tasks

### MANAGER

Can manage:

- Projects
- Tasks
- Task assignments

Cannot manage users.

### MEMBER

Can:

- View assigned tasks
- Update assigned tasks
- Change task status when permitted

Cannot manage users or projects.

---

## Task Workflow Planning

Task status updates are intentionally restricted.

Allowed transitions:

```text
TODO
  ↓
IN_PROGRESS
  ↓
IN_REVIEW
  ↓
DONE
```

Additional rule:

```text
TODO
IN_PROGRESS
IN_REVIEW
        │
        ▼
     BLOCKED
```

BLOCKED can be reached from any active state.

This logic is enforced at the service layer to ensure consistency across all APIs.

---

## Performance Planning

Performance considerations were incorporated during schema design.

### Database Indexes

Single-column indexes:

- status
- assignee_id
- due_date
- project_id
- organization_id

Composite indexes:

- (assignee_id, status)
- (project_id, status)
- (due_date, status)

Benefits:

- Faster task filtering
- Faster pagination
- Improved dashboard queries
- Reduced full-table scans

---

## Caching Strategy Planning

Redis caching will be implemented for task listing endpoints.

### Cache Key Structure

```text
tasks:assignee:{userId}:page:{page}:limit:{limit}
```

### Cache Invalidation Rules

Cache is invalidated when:

- Task is created
- Task is updated
- Task is deleted
- Task status changes
- Task assignment changes

This prevents stale data while significantly reducing database reads for frequently accessed task lists.

---

## Error Handling Strategy

A centralized error handling mechanism is used across the application.

### Standard Error Response

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "due_date must be a future date"
}
```

Benefits:

- Consistent API responses
- Easier frontend integration
- Better debugging experience
- Simplified monitoring and logging

---

## Development Principles

The implementation follows:

- Separation of concerns
- Modular architecture
- Reusable middleware
- SQL query isolation through repositories
- Centralized error handling
- Secure authentication practices
- Production-ready folder structure
- Docker-first deployment approach

The goal is to build a maintainable, scalable, and production-ready backend that closely resembles real-world engineering systems.
