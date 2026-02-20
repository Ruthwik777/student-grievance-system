# Contributing to Student Grievance Management System

Thank you for considering contributing to this project! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

1. **Install required software:**
   - Node.js (v14+)
   - MySQL (v5.7+)
   - Git

2. **Fork the repository:**
   - Click the "Fork" button on GitHub

3. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/student-grievance-system.git
   cd student-grievance-system
   ```

4. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/student-grievance-system.git
   ```

5. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

6. **Set up environment:**
   - Copy `.env.example` to `.env` in backend folder
   - Configure your local database credentials
   - Run database migrations

## 💻 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clear, concise code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Manual testing
npm start
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "type: brief description"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Fill in the PR template
- Wait for review

## 📝 Coding Standards

### JavaScript/React

#### General Rules
- Use ES6+ features
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use async/await over promises chains

#### Formatting
```javascript
// ✅ Good
const getUserGrievances = async (userId) => {
  try {
    const [grievances] = await pool.query(
      'SELECT * FROM grievances WHERE student_id = ?',
      [userId]
    );
    return grievances;
  } catch (error) {
    logger.error('Failed to fetch grievances', { error: error.message, userId });
    throw error;
  }
};

// ❌ Bad
function get(id){
const g=await pool.query("SELECT * FROM grievances WHERE student_id="+id)
return g
}
```

#### React Component Structure
```javascript
// 1. Imports
import { useState, useEffect } from 'react';
import api from '../services/api';

// 2. Component definition
export default function ComponentName() {
  // 3. State declarations
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 4. Effects
  useEffect(() => {
    fetchData();
  }, []);

  // 5. Functions
  const fetchData = async () => {
    // implementation
  };

  // 6. Return JSX
  return (
    <div>
      {/* content */}
    </div>
  );
}

// 7. Styles (if inline)
const styles = {
  container: {
    // styles
  }
};
```

### SQL

```sql
-- ✅ Good: Use parameterized queries
const [result] = await pool.query(
  'SELECT * FROM users WHERE email = ?',
  [email]
);

-- ❌ Bad: Never concatenate user input
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

### File Organization

```
backend/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── routes/          # API routes
├── utils/           # Utility functions
├── tests/           # Test files
└── server.js        # Main entry point

frontend/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── utils/       # Utility functions
│   └── App.js       # Main component
```

## 📋 Commit Guidelines

### Commit Message Format

```
type(scope): subject

body

footer
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(auth): add password reset functionality

- Implement forgot password endpoint
- Add email service for reset links
- Create reset password page

Closes #123
```

```
fix(grievance): resolve file upload size validation

The file size validation was not working correctly for PDF files.
Updated multer configuration to properly check file sizes.

Fixes #456
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch with latest upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests:**
   ```bash
   npm test
   ```

3. **Check for linting errors:**
   ```bash
   npm run lint
   ```

### PR Title Format

Follow the same format as commit messages:
```
type(scope): brief description
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Other (please describe)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #issue_number

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. No merge conflicts
4. Documentation updated (if needed)

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Try latest version
3. Reproduce the bug

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 90]
- Node version: [e.g., 16.14.0]

**Additional context**
Any other relevant information.
```

## ✨ Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other relevant information, mockups, etc.
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Unit tests for backend routes
- [ ] Integration tests
- [ ] Mobile responsive improvements
- [ ] Accessibility enhancements

### Medium Priority
- [ ] Real-time notifications
- [ ] Advanced search filters
- [ ] Export to multiple formats
- [ ] Email template improvements

### Good First Issues
- [ ] UI improvements
- [ ] Documentation enhancements
- [ ] Bug fixes
- [ ] Code comments

## 📚 Resources

### Documentation
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MySQL Docs](https://dev.mysql.com/doc/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - Database management
- [VS Code](https://code.visualstudio.com/) - Recommended editor

## 💬 Getting Help

- **Discord**: [Join our server](#)
- **Email**: dev@grievance.edu
- **Issues**: Use GitHub Issues for questions

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Recognized in project README

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
