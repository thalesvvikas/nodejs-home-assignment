# Node.js Task Manager API

This is a home assignment to build a Task Manager API using Node.js, Express, and PostgreSQL. It includes JWT for authentication, Sequelize as the ORM, Jest for testing, and ESLint/Prettier for code quality.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Candidate Assignment Instructions](#candidate-assignment-instructions)
- [Getting Started](#getting-started)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Setup PostgreSQL](#3-setup-postgresql)
  - [4. Setup Environment Variables](#4-setup-environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## Features

- User registration and authentication using JWT.
- CRUD operations for tasks.
- Input validation.
- Secure password hashing.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Testing**: Jest, Supertest
- **Linting/Formatting**: ESLint, Prettier

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Candidate Assignment Instructions

1.  **Fork the Repository**: Start by forking this repository to your personal GitHub account. Do not clone this repository directly.

2.  **Clone Your Fork**: Clone your forked repository to your local machine to begin working on the assignment.

3.  **Complete the Tasks**: Follow the setup guide in the "Getting Started" section below. Your main goal is to implement the features listed under "Next Steps / Future Enhancements". We encourage you to attempt as many tasks as your time allows; the more you complete, the better we can assess your skills.

4.  **Submit for Review**: Once you are finished, ensure all your changes are pushed to your forked repository. Then, add `thalesvvikas` as a collaborator to your private forked repository so we can review your work.

---

## Getting Started

Follow these steps to get your development environment set up.

### 1. Clone the repository

```bash
git clone https://github.com/thalesvvikas/nodejs-home-assignment.git
cd nodejs-home-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup PostgreSQL

1.  **Install PostgreSQL**: If you don't have it installed, download it from the [official PostgreSQL website](https://www.postgresql.org/download/). Follow the installation instructions for your operating system. During installation, you will be prompted to set a password for the default `postgres` user.

2.  **Create a database user and database**:
    Open your terminal and use `psql` (PostgreSQL's command-line utility) to create a new user and database. You might need to switch to the `postgres` user first.

    ```bash
    # On macOS (using Homebrew) or Linux
    psql postgres

    # On Windows, you can use the SQL Shell (psql) installed with Postgres.
    ```

    Now, run the following SQL commands. Replace `'your_password'` with a secure password.

    ```sql
    -- Create a new user (role)
    CREATE ROLE taskmanager_user WITH LOGIN PASSWORD 'your_password';

    -- Create the database
    CREATE DATABASE task_manager_db;

    -- Grant all privileges on the new database to the new user
    GRANT ALL PRIVILEGES ON DATABASE task_manager_db TO taskmanager_user;
    ```

### 4. Setup Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. Use the credentials for the database you just created.

```env
# .env

# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_USER=taskmanager_user
DB_PASSWORD=your_password
DB_NAME=task_manager_db
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
```

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in production mode.
- `npm run dev`: Runs the app in development mode using `nodemon`. The server will automatically restart if you change any file.
- `npm test`: Runs the test suite using Jest.
- `npm run lint`: Lints the code using ESLint.
- `npm run format`: Formats the code using Prettier.

## API Endpoints

Here are the main API endpoints available:

### Authentication
*   `POST /api/auth/register` - Register a new user.
*   `POST /api/auth/login` - Login a user and get a JWT token.

### Tasks
*   `GET /api/tasks` - Get all tasks for the authenticated user.
*   `POST /api/tasks` - Create a new task.
*   `GET /api/tasks/:id` - Get a single task by ID.
*   `PUT /api/tasks/:id` - Update a task by ID.
*   `DELETE /api/tasks/:id` - Delete a task by ID.

## Project Structure

The main application code is located in the `src/` directory.

```
src/
├── config/       # Database configuration, etc.
├── controllers/  # Request handlers
├── middleware/   # Express middleware (e.g., auth)
├── models/       # Sequelize models
├── routes/       # API routes
├── services/     # Business logic
├── utils/        # Utility functions
└── server.js     # The application entry point
```

## Next Steps / Future Enhancements

Here are some suggestions for the next set of tasks for candidates to further enhance the project:

-   **Pagination & Filtering**:
    -   Implement pagination and filtering for the task list endpoint: `/api/tasks?page=1&limit=10&status=pending`.

-   **Role-based Access Control (RBAC)**:
    -   Introduce an `admin` role that has privileges to view all tasks from all users.

-   **Soft Deletes**:
    -   Implement a soft delete mechanism. Instead of permanently deleting tasks, mark them as `deleted` and add a `deletedAt` timestamp.

-   **API Documentation**:
    -   Integrate Swagger/OpenAPI to generate interactive API documentation, available at an endpoint like `/api/docs`.

-   **Request Logging**:
    -   Add a request logging middleware using a library like `morgan` or `winston` to log all incoming requests.

-   **Enhanced Unit Test Coverage**:
    -   Expand the Jest test suite to cover the complete authentication flow (login, register) and all CRUD operations for tasks.

-   **Rate Limiting**:
    -   Implement rate limiting on sensitive endpoints, especially login, to prevent brute-force attacks using a library like `express-rate-limit`.

-   **Asynchronous Job Queue**:
    -   Implement a background job queue for sending email notifications (e.g., on task creation or completion) using a library like `BullMQ` with Redis.

-   **React Frontend Integration (If React knowledge)**:
    -   Create a basic React application to consume the Task Manager API. It should allow users to perform CRUD operations on their tasks. Pay special attention to state management (e.g., using Context API, Redux, or Zustand) to handle task data.

## Extra Merits

-   **React Frontend Authentication (If React knowledge)**:
    -   Integrate the Register and Login functionality into the React application. This should include managing user authentication state and tokens securely.

-   **Dockerization**:
    -   Create a `Dockerfile` for the Node.js application and a `docker-compose.yml` file to orchestrate the application and the PostgreSQL database services.

-   **Continuous Integration (CI)**:
    -   Set up a CI pipeline using GitHub Actions to automatically run tests and lint checks on every push and pull request.
```
