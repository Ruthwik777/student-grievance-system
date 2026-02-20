# Student Grievance System - Complete Setup and Push to GitHub
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Student Grievance System Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Get project directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir

Write-Host "Project directory: $projectDir" -ForegroundColor Cyan
Write-Host ""

# Initialize Git if needed
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git initialized" -ForegroundColor Green
    Write-Host ""
}

# Configure Git user (if not already configured)
$gitUser = git config --global user.name
$gitEmail = git config --global user.email

if (-not $gitUser) {
    Write-Host "Git user not configured. Let's set it up:" -ForegroundColor Yellow
    $userName = Read-Host "Enter your name"
    $userEmail = Read-Host "Enter your email"
    git config --global user.name "$userName"
    git config --global user.email "$userEmail"
    Write-Host "✓ Git user configured" -ForegroundColor Green
    Write-Host ""
}

# Add all files
Write-Host "Adding all files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files staged" -ForegroundColor Green
Write-Host ""

# Show what will be committed
Write-Host "Files to be committed:" -ForegroundColor Cyan
git status --short
Write-Host ""

# Commit
Write-Host "Creating commit..." -ForegroundColor Yellow
$commitMessage = @"
feat: Student Grievance Management System v2.0.0

Complete system with:
- Security features (validation, rate limiting, Helmet)
- Email notification system
- Analytics and reporting
- Comprehensive documentation
- UI component library
- Database schema with triggers
- Logging system
"@

git commit -m $commitMessage
Write-Host "✓ Changes committed" -ForegroundColor Green
Write-Host ""

# Check for remote
$hasRemote = git remote get-url origin 2>$null

if (-not $hasRemote) {
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host " GitHub Repository Setup Required" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps to complete:" -ForegroundColor Cyan
    Write-Host "1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: student-grievance-system" -ForegroundColor White
    Write-Host "3. Choose Public or Private" -ForegroundColor White
    Write-Host "4. DO NOT initialize with README" -ForegroundColor White
    Write-Host "5. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    
    $repoUrl = Read-Host "Paste your repository URL (https://github.com/username/repo.git)"
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        git branch -M main
        
        Write-Host ""
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host " SUCCESS!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Your code is now on GitHub!" -ForegroundColor Green
            Write-Host "Repository: $repoUrl" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "Push failed. This might be due to authentication." -ForegroundColor Red
            Write-Host ""
            Write-Host "Solutions:" -ForegroundColor Yellow
            Write-Host "1. Use a Personal Access Token instead of password" -ForegroundColor White
            Write-Host "2. Get it from: GitHub > Settings > Developer settings > Personal access tokens" -ForegroundColor White
            Write-Host "3. Generate token with 'repo' scope" -ForegroundColor White
            Write-Host "4. Try pushing again: git push -u origin main" -ForegroundColor White
        }
    }
} else {
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host " SUCCESS!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your changes have been pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Push failed. Check your authentication." -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "Press Enter to exit"
