# # Finance Data Processing and Access Control Backend

Backend for managing financial records, user roles, access control, and dashboard analytics.

## Overview

This project is built for a finance dashboard system where different users can interact with financial data based on their role.

### Main features
- User registration and login
- JWT authentication
- Role and permission based access control
- User management
- Financial record CRUD
- Record filtering
- Dashboard summary APIs
- Joi validation
- Centralized error handling
- PostgreSQL with Neon

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Neon
- pg
- bcrypt
- jsonwebtoken
- Joi
- dotenv

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
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── record.controller.js
│   │   └── dashboard.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── record.routes.js
│   │   └── dashboard.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── record.service.js
│   │   └── dashboard.service.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── constants.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   └── record.validator.js
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Roles and Permissions

### Viewer
- Can access dashboard APIs only

### Analyst
- Can access dashboard APIs
- Can read financial records

### Admin
- Can access dashboard APIs
- Can manage users
- Can create, update, and delete records
- Can read records

## Database Tables

### users
- id
- name
- email
- password
- role
- is_active
- created_at
- updated_at

### financial_records
- id
- amount
- type
- category
- record_date
- notes
- is_deleted
- created_by
- created_at
- updated_at

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000
DATABASE_URL=postgresql://username:password@your-neon-hostname/neondb?sslmode=verify-full
JWT_SECRET=replace_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/GovindKumar04/Finance-Data-Processing-and-Access-Control-Backend.git
cd Finance-Data-Processing-and-Access-Control-Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run database schema

Open Neon SQL Editor and run the SQL from:

```bash
sql/schema.sql
```

This creates:
- `users`
- `financial_records`

### 4. Start the server

```bash
npm run dev
```

Expected output:

```bash
Database connected successfully
Server is running on port 5000
```

## Base URL

```bash
http://localhost:5000
```

## Authentication Header

Protected routes require this header:

```http
Authorization: Bearer <your_jwt_token>
```

## Standard Response Format

### Success
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# API Documentation

## 1. Health Check

### GET /api/health/db

Check database connection.

#### Access
Public

#### Request
```http
GET /api/health/db
```

#### Example
```http
GET http://localhost:5000/api/health/db
```

#### Success Response
```json
{
  "success": true,
  "message": "Database connection is working",
  "data": {
    "now": "2026-04-06T12:34:56.789Z"
  }
}
```

---

## 2. Authentication APIs

### POST /api/auth/register

Register a new user. New users are created with role `viewer`.

#### Access
Public

#### Request Body
```json
{
  "name": "Govind",
  "email": "govind@example.com",
  "password": "123456"
}
```

#### Validation
- `name` required
- `name` minimum 2 characters
- `email` must be valid
- `password` minimum 6 characters

#### Example
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json
```

#### Success Response
```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "5d37c462-7f4f-4b44-8c39-5f7d4a7bb111",
      "name": "Govind",
      "email": "govind@example.com",
      "role": "viewer",
      "isActive": true,
      "createdAt": "2026-04-06T10:10:10.000Z",
      "updatedAt": "2026-04-06T10:10:10.000Z"
    },
    "token": "your_jwt_token"
  }
}
```

#### Possible Errors
- `400` Validation failed
- `409` User with this email already exists

---

### POST /api/auth/login

Login user and return JWT token.

#### Access
Public

#### Request Body
```json
{
  "email": "govind@example.com",
  "password": "123456"
}
```

#### Validation
- `email` required and valid
- `password` required

#### Example
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "5d37c462-7f4f-4b44-8c39-5f7d4a7bb111",
      "name": "Govind",
      "email": "govind@example.com",
      "role": "admin",
      "isActive": true,
      "createdAt": "2026-04-06T10:10:10.000Z",
      "updatedAt": "2026-04-06T10:10:10.000Z"
    },
    "token": "your_jwt_token"
  }
}
```

#### Possible Errors
- `400` Validation failed
- `401` Invalid email or password
- `403` Your account is inactive. Please contact admin

---

### GET /api/auth/me

Get current logged-in user.

#### Access
Authenticated user

#### Headers
```http
Authorization: Bearer <token>
```

#### Example
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "id": "5d37c462-7f4f-4b44-8c39-5f7d4a7bb111",
    "name": "Govind",
    "email": "govind@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2026-04-06T10:10:10.000Z",
    "updatedAt": "2026-04-06T10:10:10.000Z"
  }
}
```

#### Possible Errors
- `401` Access token is missing
- `401` Invalid or expired token
- `401` User not found for this token
- `403` Your account is inactive

---

## 3. User Management APIs

> All routes in this section require **admin** permission.

### GET /api/users

Get all users.

#### Access
Admin only

#### Headers
```http
Authorization: Bearer <admin_token>
```

#### Example
```http
GET http://localhost:5000/api/users
Authorization: Bearer <admin_token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true,
      "createdAt": "2026-04-06T10:00:00.000Z",
      "updatedAt": "2026-04-06T10:00:00.000Z"
    }
  ]
}
```

#### Possible Errors
- `401` Unauthorized
- `403` Forbidden

---

### GET /api/users/:id

Get user by ID.

#### Access
Admin only

#### Path Parameter
- `id` = user UUID

#### Example
```http
GET http://localhost:5000/api/users/11111111-1111-1111-1111-111111111111
Authorization: Bearer <admin_token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2026-04-06T10:00:00.000Z",
    "updatedAt": "2026-04-06T10:00:00.000Z"
  }
}
```

#### Possible Errors
- `401` Unauthorized
- `403` Forbidden
- `404` User not found

---

### PATCH /api/users/:id/role

Update user role.

#### Access
Admin only

#### Path Parameter
- `id` = user UUID

#### Request Body
```json
{
  "role": "analyst"
}
```

#### Allowed Values
- `viewer`
- `analyst`
- `admin`

#### Example
```http
PATCH http://localhost:5000/api/users/22222222-2222-2222-2222-222222222222/role
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "22222222-2222-2222-2222-222222222222",
    "name": "Analyst User",
    "email": "analyst@example.com",
    "role": "analyst",
    "isActive": true,
    "createdAt": "2026-04-06T10:05:00.000Z",
    "updatedAt": "2026-04-06T10:20:00.000Z"
  }
}
```

#### Possible Errors
- `400` Validation failed
- `404` User not found

---

### PATCH /api/users/:id/status

Update user active status.

#### Access
Admin only

#### Path Parameter
- `id` = user UUID

#### Request Body
```json
{
  "isActive": false
}
```

#### Example
```http
PATCH http://localhost:5000/api/users/22222222-2222-2222-2222-222222222222/status
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User active status updated successfully",
  "data": {
    "id": "22222222-2222-2222-2222-222222222222",
    "name": "Analyst User",
    "email": "analyst@example.com",
    "role": "analyst",
    "isActive": false,
    "createdAt": "2026-04-06T10:05:00.000Z",
    "updatedAt": "2026-04-06T10:30:00.000Z"
  }
}
```

#### Possible Errors
- `400` Validation failed
- `404` User not found

---

## 4. Financial Record APIs

### POST /api/records

Create financial record.

#### Access
Admin only

#### Request Body
```json
{
  "amount": 50000,
  "type": "income",
  "category": "Salary",
  "recordDate": "2026-04-06",
  "notes": "Monthly salary"
}
```

#### Validation
- `amount` must be positive
- `type` must be `income` or `expense`
- `category` required
- `recordDate` must be valid ISO date
- `notes` optional

#### Example
```http
POST http://localhost:5000/api/records
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Success Response
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Record created successfully",
  "data": {
    "id": "7f0fdd4d-4444-4444-4444-777777777777",
    "amount": 50000,
    "type": "income",
    "category": "Salary",
    "recordDate": "2026-04-06",
    "notes": "Monthly salary",
    "isDeleted": false,
    "createdBy": "11111111-1111-1111-1111-111111111111",
    "createdByName": null,
    "createdByEmail": null,
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

#### Possible Errors
- `400` Validation failed
- `403` Forbidden

---

### GET /api/records

Get all non-deleted records.

#### Access
Admin, Analyst

#### Optional Query Parameters
- `type`
- `category`
- `fromDate`
- `toDate`

#### Examples
```http
GET http://localhost:5000/api/records
Authorization: Bearer <token>
```

```http
GET http://localhost:5000/api/records?type=income
Authorization: Bearer <token>
```

```http
GET http://localhost:5000/api/records?category=Salary
Authorization: Bearer <token>
```

```http
GET http://localhost:5000/api/records?fromDate=2026-04-01&toDate=2026-04-30
Authorization: Bearer <token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Records fetched successfully",
  "data": [
    {
      "id": "7f0fdd4d-4444-4444-4444-777777777777",
      "amount": 50000,
      "type": "income",
      "category": "Salary",
      "recordDate": "2026-04-06",
      "notes": "Monthly salary",
      "isDeleted": false,
      "createdBy": "11111111-1111-1111-1111-111111111111",
      "createdByName": "Admin User",
      "createdByEmail": "admin@example.com",
      "createdAt": "2026-04-06T12:00:00.000Z",
      "updatedAt": "2026-04-06T12:00:00.000Z"
    }
  ]
}
```

#### Possible Errors
- `400` Validation failed
- `403` Forbidden

---

### GET /api/records/:id

Get record by ID.

#### Access
Admin, Analyst

#### Path Parameter
- `id` = record UUID

#### Example
```http
GET http://localhost:5000/api/records/7f0fdd4d-4444-4444-4444-777777777777
Authorization: Bearer <token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Record fetched successfully",
  "data": {
    "id": "7f0fdd4d-4444-4444-4444-777777777777",
    "amount": 50000,
    "type": "income",
    "category": "Salary",
    "recordDate": "2026-04-06",
    "notes": "Monthly salary",
    "isDeleted": false,
    "createdBy": "11111111-1111-1111-1111-111111111111",
    "createdByName": "Admin User",
    "createdByEmail": "admin@example.com",
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

#### Possible Errors
- `403` Forbidden
- `404` Record not found

---

### PATCH /api/records/:id

Update record.

#### Access
Admin only

#### Path Parameter
- `id` = record UUID

#### Request Body
Send at least one field.

```json
{
  "amount": 55000,
  "notes": "Updated monthly salary"
}
```

#### Allowed Fields
- `amount`
- `type`
- `category`
- `recordDate`
- `notes`

#### Example
```http
PATCH http://localhost:5000/api/records/7f0fdd4d-4444-4444-4444-777777777777
Authorization: Bearer <admin_token>
Content-Type: application/json
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Record updated successfully",
  "data": {
    "id": "7f0fdd4d-4444-4444-4444-777777777777",
    "amount": 55000,
    "type": "income",
    "category": "Salary",
    "recordDate": "2026-04-06",
    "notes": "Updated monthly salary",
    "isDeleted": false,
    "createdBy": "11111111-1111-1111-1111-111111111111",
    "createdByName": null,
    "createdByEmail": null,
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:20:00.000Z"
  }
}
```

#### Possible Errors
- `400` Validation failed
- `404` Record not found

---

### DELETE /api/records/:id

Soft delete record.

#### Access
Admin only

#### Path Parameter
- `id` = record UUID

#### Example
```http
DELETE http://localhost:5000/api/records/7f0fdd4d-4444-4444-4444-777777777777
Authorization: Bearer <admin_token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Record deleted successfully",
  "data": {
    "id": "7f0fdd4d-4444-4444-4444-777777777777"
  }
}
```

#### Possible Errors
- `403` Forbidden
- `404` Record not found

---

## 5. Dashboard APIs

> Allowed roles: Viewer, Analyst, Admin

### GET /api/dashboard/summary

Get dashboard summary.

#### Returns
- `totalIncome`
- `totalExpense`
- `netBalance`
- `totalRecords`

#### Example
```http
GET http://localhost:5000/api/dashboard/summary
Authorization: Bearer <token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Dashboard summary fetched successfully",
  "data": {
    "totalIncome": 50000,
    "totalExpense": 18000,
    "netBalance": 32000,
    "totalRecords": 7
  }
}
```

---

### GET /api/dashboard/category-totals

Get totals grouped by category and type.

#### Example
```http
GET http://localhost:5000/api/dashboard/category-totals
Authorization: Bearer <token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Category totals fetched successfully",
  "data": [
    {
      "category": "Salary",
      "type": "income",
      "total": 50000
    },
    {
      "category": "Food",
      "type": "expense",
      "total": 5000
    }
  ]
}
```

---

### GET /api/dashboard/recent-activity

Get recent activity.

#### Optional Query Parameter
- `limit` = integer between 1 and 50

#### Examples
```http
GET http://localhost:5000/api/dashboard/recent-activity
Authorization: Bearer <token>
```

```http
GET http://localhost:5000/api/dashboard/recent-activity?limit=5
Authorization: Bearer <token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Recent activity fetched successfully",
  "data": [
    {
      "id": "7f0fdd4d-4444-4444-4444-777777777777",
      "amount": 50000,
      "type": "income",
      "category": "Salary",
      "recordDate": "2026-04-06",
      "notes": "Monthly salary",
      "createdBy": "11111111-1111-1111-1111-111111111111",
      "createdByName": "Admin User",
      "createdByEmail": "admin@example.com",
      "createdAt": "2026-04-06T12:00:00.000Z",
      "updatedAt": "2026-04-06T12:00:00.000Z"
    }
  ]
}
```

#### Possible Errors
- `400` Validation failed

---

### GET /api/dashboard/monthly-trends

Get monthly income, expense, and net balance trends.

#### Example
```http
GET http://localhost:5000/api/dashboard/monthly-trends
Authorization: Bearer <token>
```

#### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Monthly trends fetched successfully",
  "data": [
    {
      "month": "2026-03",
      "totalIncome": 40000,
      "totalExpense": 15000,
      "netBalance": 25000
    },
    {
      "month": "2026-04",
      "totalIncome": 50000,
      "totalExpense": 18000,
      "netBalance": 32000
    }
  ]
}
```

---

## Validation Rules

### Auth
- `name` required for register
- `email` must be valid
- `password` minimum 6 characters

### User
- `role` must be `viewer`, `analyst`, or `admin`
- `isActive` must be boolean

### Record
- `amount` must be a positive number
- `type` must be `income` or `expense`
- `category` required
- `recordDate` must be valid ISO date
- update request must include at least one field
- recent activity `limit` must be between 1 and 50

## Common Error Examples

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "A valid email is required",
    "Password must be at least 6 characters long"
  ]
}
```

### Missing Token
```json
{
  "success": false,
  "message": "Access token is missing",
  "errors": []
}
```

### Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "errors": []
}
```

### Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "errors": []
}
```

### Not Found
```json
{
  "success": false,
  "message": "Route not found: GET /api/unknown",
  "errors": []
}
```

### Duplicate User
```json
{
  "success": false,
  "message": "User with this email already exists",
  "errors": []
}
```

## Testing Order

1. `GET /api/health/db`
2. `POST /api/auth/register` for admin, analyst, viewer
3. update user roles in Neon SQL Editor
4. `POST /api/auth/login` for all users
5. `GET /api/auth/me`
6. test user APIs with admin token
7. test record CRUD APIs
8. test dashboard APIs with all roles
9. test validation failures
10. test permission failures

### Role Promotion Query for Testing

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
UPDATE users SET role = 'analyst' WHERE email = 'analyst@example.com';
UPDATE users SET role = 'viewer' WHERE email = 'viewer@example.com';
```

After changing roles, log in again to get fresh JWT tokens.

## Technical Decisions and Trade-offs

For this project, I chose **Node.js with Express** because it keeps the backend simple, readable, and easy to organize. I used **PostgreSQL on Neon** since the data here is structured — users, roles, financial records, and summaries — so SQL is a better fit than a flexible document database. I also chose **pg** instead of an ORM because it gives me direct control over queries, especially for filtering and dashboard totals. The trade-off is that it requires writing more SQL manually, but it makes the logic clearer and easier to explain. For security, I used **JWT** for authentication and **bcrypt** for password hashing. I added **permission-based access control**, **Joi validation**, and centralized error handling to keep the API consistent and reliable. Overall, I preferred clarity and control over extra abstraction, even though that means a bit more manual setup.

## Short Note

This project was built with a strong focus on **clarity, control, and backend correctness**. Every technical choice was made to keep the system structured, reliable, and easy to understand, while still showing solid engineering decisions around **data modeling, access control, validation, and API design**.

## Author

**Govind Kumar**
