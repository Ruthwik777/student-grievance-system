# Cloud-Based Student Grievance Management System (Backend)

This backend provides secure authentication, grievance submission, status tracking, and admin management for the Student Grievance Management System.

## Core Features

- Student registration and login
- Admin login with role-based access control
- Grievance submission with optional file attachment
- Status tracking (Pending → In Progress → Resolved)
- Admin assignment and remarks
- Password reset using time-limited tokens

## API Overview

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/admin-login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `PUT /auth/update-profile`

### Grievances
- `POST /grievances` (auth required)
- `GET /grievances/my` (auth required)
- `GET /grievances/history/:id` (auth required)

### Admin
- `GET /admin/stats` (admin only)
- `GET /admin/all` (admin only)
- `PUT /admin/update/:id` (admin only)
- `GET /admin/history/:id` (admin only)

## Setup

1. Install dependencies:
   - `npm install`
2. Configure environment:
   - `backend/.env`
   - `JWT_SECRET` (if used)
3. Run migrations:
   - Execute `backend/migrations/add_status_history.sql` in your MySQL database
4. Start the server:
   - `node server.js`

## Notes

- This project uses MySQL and expects a database named `grievance_system`.
- Update database credentials in `backend/config/db.js`.
