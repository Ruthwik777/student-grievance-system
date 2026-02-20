# Student Grievance Management System

A comprehensive web-based platform for managing and resolving student complaints efficiently with role-based access control, real-time tracking, and analytics.

## 🚀 Features

### For Students
- **Easy Submission**: Submit grievances with detailed descriptions and file attachments
- **Real-time Tracking**: Monitor the status of your complaints in real-time
- **Status History**: View complete history of status changes and admin remarks
- **Dashboard Analytics**: Personal statistics dashboard showing all your grievances
- **Email Notifications**: Receive email updates when your grievance status changes
- **Profile Management**: Update your profile information and password

### For Administrators
- **Comprehensive Dashboard**: View all grievances with advanced filtering and search
- **Status Management**: Update grievance status, add remarks, and assign departments
- **Analytics & Reporting**: 
  - Category-wise statistics
  - Monthly trend analysis
  - Average resolution time tracking
  - Department workload distribution
- **Export Functionality**: Export grievances to CSV for reporting
- **Role-based Access**: Secure admin panel with proper authentication

## 📋 Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database with optimized queries
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email notifications
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection

### Frontend
- **React.js** (v19.2.4)
- **React Router** for navigation
- **Axios** for API requests
- **Custom UI Components** for consistent design

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=grievance_system
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. **Set up the database**
   ```bash
   mysql -u root -p < ../database/schema.sql
   ```
   Or import `database/schema.sql` using MySQL Workbench

5. **Start the backend server**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed)
   - Update the baseURL in `src/services/api.js` if your backend runs on a different port

4. **Start the frontend application**
   ```bash
   npm start
   ```

   Application will open in your browser at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register Student
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Register Admin (requires secret key)
```http
POST /api/auth/register-admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "adminSecret": "admin@secure2024"
}
```

### Grievance Endpoints (Requires Authentication)

#### Submit Grievance
```http
POST /api/grievances
Authorization: Bearer <token>
Content-Type: multipart/form-data

category: Academic Issues
description: Unable to access course materials
attachment: <file>
```

#### Get My Grievances
```http
GET /api/grievances/my
Authorization: Bearer <token>
```

#### Get Grievance History
```http
GET /api/grievances/history/:id
Authorization: Bearer <token>
```

### Admin Endpoints (Requires Admin Role)

#### Get All Grievances
```http
GET /api/admin/all
Authorization: Bearer <token>
```

#### Update Grievance
```http
PUT /api/admin/update/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "admin_remark": "Working on it",
  "assigned_department": "IT Department"
}
```

#### Get Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

### Analytics Endpoints

#### Get Category Statistics
```http
GET /api/analytics/category-stats
Authorization: Bearer <token>
```

#### Get Monthly Trends
```http
GET /api/analytics/monthly-trend
Authorization: Bearer <token>
```

#### Get My Statistics
```http
GET /api/analytics/my-stats
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password
- `role`: student/admin/faculty
- `reset_token`: For password reset
- `created_at`, `updated_at`: Timestamps

### Grievances Table
- `id`: Primary key
- `student_id`: Foreign key to users
- `category`: Grievance category
- `description`: Detailed description
- `attachment_path`: File path (optional)
- `status`: Pending/In Progress/Resolved/Rejected
- `admin_remark`: Admin's comment
- `assigned_department`: Department handling the issue
- `priority`: Low/Medium/High/Critical
- `created_at`, `updated_at`, `resolved_at`: Timestamps

### Grievance Status History Table
- Tracks all status changes
- Maintains audit trail
- Links to user who made the change

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Express-validator for all inputs
- **Rate Limiting**: Prevents brute force attacks
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Helmet.js security headers
- **CORS Configuration**: Controlled cross-origin requests
- **File Upload Restrictions**: Type and size limitations

## 📊 Project Structure

```
student-grievance-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── middleware/
│   │   ├── upload.js             # File upload middleware
│   │   ├── verifyToken.js        # JWT verification
│   │   ├── validation.js         # Input validation
│   │   └── rateLimiter.js        # Rate limiting
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── grievanceRoutes.js    # Grievance CRUD
│   │   ├── adminRoutes.js        # Admin operations
│   │   └── analyticsRoutes.js    # Analytics endpoints
│   ├── utils/
│   │   ├── logger.js             # Logging utility
│   │   └── emailService.js       # Email notifications
│   ├── uploads/                  # Uploaded files
│   ├── logs/                     # Application logs
│   ├── server.js                 # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── UIComponents.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── SubmitGrievance.js
│   │   │   ├── MyGrievances.js
│   │   │   ├── AdminPanel.js
│   │   │   └── Profile.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── database/
    └── schema.sql                # Database schema
```

## 🎯 Usage Guide

### For Students

1. **Register**: Create an account with your email
2. **Login**: Access your dashboard
3. **Submit Grievance**: 
   - Choose appropriate category
   - Provide detailed description
   - Attach supporting documents (optional)
4. **Track Status**: Monitor your grievances in real-time
5. **View History**: Check status change history and admin remarks

### For Administrators

1. **Login**: Use admin credentials
2. **Dashboard**: View all grievances with filters
3. **Update Status**: 
   - Click on any grievance
   - Change status
   - Add admin remarks
   - Assign to department
4. **Analytics**: View comprehensive reports and statistics
5. **Export**: Download grievance data as CSV

## 🔧 Configuration

### Email Configuration

To enable email notifications, configure SMTP settings in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use that password in EMAIL_PASS

### File Upload Configuration

Configure in `backend/middleware/upload.js`:
- Maximum file size: 5MB (default)
- Allowed types: JPEG, PNG, PDF
- Upload directory: `backend/uploads/`

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. Set environment variables on your hosting platform
2. Ensure MySQL database is accessible
3. Deploy backend code
4. Run database migrations

### Frontend Deployment (Netlify/Vercel)

1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables
4. Set up redirects for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 Default Credentials

**Admin Account** (created by schema.sql):
- Email: admin@grievance.edu
- Password: admin123

**Note**: Change these credentials immediately after first login!

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database `grievance_system` exists

### CORS Error
- Update `CORS_ORIGIN` in backend `.env`
- Check frontend API baseURL

### File Upload Error
- Verify `uploads` directory exists and is writable
- Check file size and type restrictions

### Email Not Sending
- Verify SMTP credentials
- Check firewall settings
- Enable less secure app access (if using Gmail)

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 👨‍💻 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@grievance.edu

## 🎓 Future Enhancements

- [ ] Real-time notifications using WebSockets
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] AI-powered grievance categorization
- [ ] Integration with university systems

---

**Built with ❤️ for better student experience**
