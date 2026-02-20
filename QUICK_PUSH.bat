@echo off
echo ========================================
echo  Student Grievance System - Git Push
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git is installed. Proceeding...
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Initialize Git if not already done
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding all files...
git add .
echo.

REM Show status
echo Files to be committed:
git status --short
echo.

REM Get commit message
set /p COMMIT_MSG="Enter commit message (or press Enter for default): "
if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=feat: update Student Grievance System with latest changes
)

REM Commit
echo Committing changes...
git commit -m "%COMMIT_MSG%"
echo.

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo  SETUP REQUIRED
    echo ========================================
    echo No GitHub repository linked yet!
    echo.
    echo Please follow these steps:
    echo 1. Create a new repository on GitHub.com
    echo 2. Copy the repository URL
    echo 3. Run this command:
    echo.
    echo    git remote add origin YOUR_REPO_URL
    echo    git branch -M main
    echo    git push -u origin main
    echo.
    pause
    exit /b 1
)

REM Push to GitHub
echo Pushing to GitHub...
git push
echo.

if errorlevel 1 (
    echo.
    echo ========================================
    echo  PUSH FAILED
    echo ========================================
    echo.
    echo Common solutions:
    echo 1. Make sure you're logged into GitHub
    echo 2. Use a Personal Access Token as password
    echo 3. Check your internet connection
    echo.
    echo To set up Personal Access Token:
    echo 1. Go to GitHub.com
    echo 2. Settings > Developer settings > Personal access tokens
    echo 3. Generate new token with 'repo' scope
    echo 4. Use the token as your password
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS!
echo ========================================
echo Your code has been pushed to GitHub!
echo.
pause
