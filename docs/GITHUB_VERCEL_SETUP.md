# GitHub + Vercel Setup

## GitHub

Create a repository and connect it as the project's origin.

Keep production on main.

Protect main with required checks where practical.

## Vercel

Import the GitHub repository into Vercel.

Configure:
- framework: Next.js
- build settings appropriate to the package manager
- environment variables for development/preview/production

Enable Git-based deployments.

Expected:

push to GitHub
-> Vercel detects commit
-> build
-> deployment
