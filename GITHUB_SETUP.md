# GitHub Repository Setup Guide

To push your project to GitHub, follow these steps in your Replit Shell.

### 1. Initialize Git
If you haven't initialized git in this project yet:
```bash
git init
git add .
git commit -m "Initial commit for TELsTP Command Center"
```

### 2. Connect to GitHub
Replace `YOUR_GITHUB_REPO_URL` with your actual repository URL (e.g., `https://github.com/username/repo.git`):
```bash
git remote add origin YOUR_GITHUB_REPO_URL
```

### 3. Push your code
```bash
git branch -M main
git push -u origin main
```

> **Tip:** If prompted for credentials, use a [GitHub Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) instead of your password.
