# Finance Data Processing and Access Control Backend

A backend application for managing financial records, user roles, access control, and dashboard analytics.

This project is built as part of a backend development assignment to demonstrate:
- backend architecture
- API design
- SQL database integration
- role-based access control
- validation and error handling
- business logic structuring
- maintainable code organization

---

## Project Objective

The goal of this project is to build a backend for a finance dashboard system where different users can interact with financial data based on their assigned roles.

The system supports:
- user registration and login
- role-based permissions
- active/inactive user status
- financial record CRUD operations
- filtering financial data
- dashboard summary APIs
- validation and centralized error handling

---

## Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Neon Database**
- **pg**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **Joi**
- **dotenv**

---

## Project Structure

```bash
finance-data-processing-and-access-control-backend/
│
├── sql/
│   └── schema.sql
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── record.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── record.routes.js
│   │   └── dashboard.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── record.service.js
│   │   └── dashboard.service.js
│   │
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── constants.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   └── record.validator.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md