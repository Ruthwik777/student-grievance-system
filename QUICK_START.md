# Quick Setup Guide

Follow these steps to get the Student Grievance Management System running on your local machine.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://dev.mysql.com/downloads/) (v5.7 or higher)
- [Git](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd student-grievance-system
```

## Step 2: Database Setup

### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
source database/schema.sql

# Exit MySQL
exit
```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to File → Run SQL Script
4. Select `database/schema.sql`
5. Execute

## Step 3: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac

# Edit .env and update these values:
# DB_PASSWORD=your_mysql_password
# JWT_SECRET=your_random_secret_key
```

## Step 4: Frontend Setup

```bash
# Navigate to frontend folder
cd ../frontend

# Install dependencies
npm install
```

## Step 5: Start the Application

### Terminal 1 - Start Backend

```bash
cd backend
npm start

# You should see:
# ✓ Database connected successfully
# ✓ Backend running on http://localhost:5000
```

### Terminal 2 - Start Frontend

```bash
cd frontend
npm start

# Browser will automatically open http://localhost:3000
```

## Step 6: Test the Application

### Login with Default Admin Account

- Email: `admin@grievance.edu`
- Password: `admin123`

**Important:** Change this password after first login!

### Create a Student Account

1. Click "Register" on homepage
2. Fill in your details
3. Login with your new account
4. Submit a test grievance

## Common Issues

### Database Connection Error

**Problem:** `Database connection failed`

**Solution:**
1. Check MySQL is running
2. Verify credentials in `.env` file
3. Ensure database `grievance_system` exists

### Port Already in Use

**Problem:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill
```

### CORS Error

**Problem:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Ensure backend is running on port 5000
- Check `CORS_ORIGIN` in backend `.env` is set to `http://localhost:3000`

### npm Install Fails

**Problem:** `npm ERR! code EACCES`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

## Next Steps

1. **Explore Features:**
   - Submit grievances
   - Track status
   - View dashboard
   - Admin panel (if admin)

2. **Read Documentation:**
   - [README.md](README.md) - Complete documentation
   - [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) - API reference
   - [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

3. **Customize:**
   - Update email configuration for notifications
   - Modify categories in database
   - Customize UI colors and branding

## Production Deployment

For production deployment, see the "Deployment" section in [README.md](README.md).

## Getting Help

- Check [README.md](README.md) for detailed information
- Review [Issues](https://github.com/yourusername/student-grievance-system/issues) on GitHub
- Email: support@grievance.edu

---

**🎉 Congratulations! Your Student Grievance Management System is now running!**
