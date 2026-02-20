# Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register Student
Create a new student account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "password": "securePassword123"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Registered successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or duplicate email
- `500 Internal Server Error`: Server error

---

### 2. Login
Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john.doe@university.edu",
  "password": "securePassword123"
}
```

**Success Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "student"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid credentials
- `500 Internal Server Error`: Server error

---

### 3. Register Admin
Create a new admin account (requires secret key).

**Endpoint:** `POST /auth/register-admin`

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@university.edu",
  "password": "adminPassword123",
  "adminSecret": "admin@secure2024"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Admin registered successfully"
}
```

---

### 4. Forgot Password
Request password reset token.

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john.doe@university.edu"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Password reset token generated",
  "token": "reset_token_here",
  "note": "In production, this would be sent via email"
}
```

---

### 5. Reset Password
Reset password using token.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "newSecurePassword123"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Password reset successful"
}
```

---

## Grievance Endpoints

### 1. Submit Grievance
Submit a new grievance with optional file attachment.

**Endpoint:** `POST /grievances`

**Authentication:** Required

**Request:** `multipart/form-data`
- `category` (required): One of ["Academic Issues", "Administration Issues", "Infrastructure Issues", "Hostel Issues", "Other"]
- `description` (required): Detailed description (10-2000 characters)
- `attachment` (optional): File upload (max 5MB, types: JPEG, PNG, PDF)

**Success Response:** `200 OK`
```json
{
  "message": "Grievance submitted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error

---

### 2. Get My Grievances
Retrieve all grievances submitted by the authenticated user.

**Endpoint:** `GET /grievances/my`

**Authentication:** Required

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "student_id": 5,
    "category": "Academic Issues",
    "description": "Cannot access online course materials",
    "attachment_path": "/uploads/file123.pdf",
    "status": "In Progress",
    "admin_remark": "IT team is working on it",
    "assigned_department": "IT Department",
    "created_at": "2026-02-15T10:30:00.000Z",
    "updated_at": "2026-02-16T14:20:00.000Z"
  }
]
```

---

### 3. Get Grievance History
Get status change history for a specific grievance.

**Endpoint:** `GET /grievances/history/:id`

**Authentication:** Required

**Parameters:**
- `id`: Grievance ID

**Success Response:** `200 OK`
```json
[
  {
    "status": "Pending",
    "admin_remark": null,
    "assigned_department": null,
    "changed_at": "2026-02-15T10:30:00.000Z"
  },
  {
    "status": "In Progress",
    "admin_remark": "IT team is investigating",
    "assigned_department": "IT Department",
    "changed_at": "2026-02-16T14:20:00.000Z"
  }
]
```

**Error Responses:**
- `404 Not Found`: Grievance not found or not owned by user

---

## Admin Endpoints

### 1. Get Statistics
Get overview statistics of all grievances.

**Endpoint:** `GET /admin/stats`

**Authentication:** Required (Admin role)

**Success Response:** `200 OK`
```json
{
  "total": 150,
  "pending": 30,
  "inProgress": 50,
  "resolved": 70
}
```

---

### 2. Get All Grievances
Retrieve all grievances with student information.

**Endpoint:** `GET /admin/all`

**Authentication:** Required (Admin role)

**Success Response:** `200 OK`
```json
[
  {
    "id": 1,
    "student_id": 5,
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "category": "Academic Issues",
    "description": "Cannot access course materials",
    "status": "In Progress",
    "admin_remark": "Working on it",
    "assigned_department": "IT Department",
    "created_at": "2026-02-15T10:30:00.000Z"
  }
]
```

---

### 3. Update Grievance
Update grievance status and add admin remarks.

**Endpoint:** `PUT /admin/update/:id`

**Authentication:** Required (Admin role)

**Parameters:**
- `id`: Grievance ID

**Request Body:**
```json
{
  "status": "Resolved",
  "admin_remark": "Issue has been fixed. You should now be able to access the materials.",
  "assigned_department": "IT Department"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Grievance updated successfully"
}
```

---

### 4. Get Grievance History (Admin)
Get complete history with admin names.

**Endpoint:** `GET /admin/history/:id`

**Authentication:** Required (Admin role)

**Success Response:** `200 OK`
```json
[
  {
    "status": "Pending",
    "admin_remark": null,
    "assigned_department": null,
    "changed_at": "2026-02-15T10:30:00.000Z",
    "changed_by_name": "John Doe",
    "changed_by_role": "student"
  },
  {
    "status": "Resolved",
    "admin_remark": "Fixed",
    "assigned_department": "IT Department",
    "changed_at": "2026-02-17T09:00:00.000Z",
    "changed_by_name": "Admin User",
    "changed_by_role": "admin"
  }
]
```

---

## Analytics Endpoints

### 1. Get Category Statistics
Get grievance counts grouped by category.

**Endpoint:** `GET /analytics/category-stats`

**Authentication:** Required (Admin role)

**Success Response:** `200 OK`
```json
[
  {
    "category": "Academic Issues",
    "count": 50,
    "resolved_count": 30,
    "pending_count": 15,
    "in_progress_count": 5
  },
  {
    "category": "Infrastructure Issues",
    "count": 40,
    "resolved_count": 25,
    "pending_count": 10,
    "in_progress_count": 5
  }
]
```

---

### 2. Get Monthly Trends
Get grievance trends over the last 6 months.

**Endpoint:** `GET /analytics/monthly-trend`

**Authentication:** Required (Admin role)

**Success Response:** `200 OK`
```json
[
  {
    "month": "2025-09",
    "total": 45,
    "resolved": 30,
    "pending": 15
  },
  {
    "month": "2025-10",
    "total": 52,
    "resolved": 35,
    "pending": 17
  }
]
```

---

### 3. Get Resolution Time
Get average resolution time by category.

**Endpoint:** `GET /analytics/resolution-time`

**Authentication:** Required (Admin role)

**Success Response:** `200 OK`
```json
[
  {
    "category": "Academic Issues",
    "avg_hours": 48.5,
    "resolved_count": 30
  },
  {
    "category": "Infrastructure Issues",
    "avg_hours": 72.3,
    "resolved_count": 25
  }
]
```

---

### 4. Get Department Workload
Get grievance distribution by department.

**Endpoint:** `GET /analytics/department-workload`

**Authentication:** Required (Admin role)

**Success Response:** `200 OK`
```json
[
  {
    "department": "IT Department",
    "total_grievances": 45,
    "resolved": 30,
    "in_progress": 10,
    "pending": 5
  },
  {
    "department": "Administration",
    "total_grievances": 35,
    "resolved": 25,
    "in_progress": 5,
    "pending": 5
  }
]
```

---

### 5. Get Recent Activity
Get recent grievance status changes.

**Endpoint:** `GET /analytics/recent-activity?limit=10`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 10)

**Success Response:** `200 OK`
```json
[
  {
    "grievance_id": 15,
    "status": "Resolved",
    "changed_at": "2026-02-20T14:30:00.000Z",
    "admin_remark": "Issue fixed",
    "changed_by_name": "Admin User",
    "category": "Academic Issues",
    "student_name": "John Doe"
  }
]
```

---

### 6. Get My Statistics
Get personal statistics for the authenticated user.

**Endpoint:** `GET /analytics/my-stats`

**Authentication:** Required

**Success Response:** `200 OK`
```json
{
  "total": 5,
  "pending": 1,
  "in_progress": 2,
  "resolved": 2
}
```

---

## Error Response Format

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message here",
  "details": "Additional details (only in development mode)"
}
```

### Common HTTP Status Codes

- `200 OK`: Successful request
- `400 Bad Request`: Invalid request parameters or validation errors
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 attempts per 15 minutes per IP
- **Grievance submissions**: 10 submissions per hour per IP

When rate limit is exceeded, the API returns:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## File Upload Specifications

### Allowed File Types
- `image/jpeg`
- `image/png`
- `image/jpg`
- `application/pdf`

### Maximum File Size
- 5 MB (5,242,880 bytes)

### File Naming
Files are automatically renamed to prevent conflicts:
```
grievance-<timestamp>-<random>.<extension>
```

Example: `grievance-1708527600000-a1b2c3.pdf`

---

## Pagination (Future Enhancement)

For endpoints returning large datasets, pagination will be implemented:

```
GET /admin/all?page=1&limit=20&sortBy=created_at&order=desc
```

---

## Webhooks (Future Enhancement)

Webhook endpoints for real-time notifications will be available in future versions.

---

For more information or support, contact: support@grievance.edu
