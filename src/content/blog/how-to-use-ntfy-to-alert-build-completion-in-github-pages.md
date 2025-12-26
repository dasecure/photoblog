---
title: "How to Use NTFY to Alert Build Completion in GitHub Pages"
description: "A step-by-step guide to configure NTFY notifications for GitHub Pages build completions."
pubDate: 2024-06-18
heroImage: '../../assets/blog-placeholder-1.jpg'
---

## Introduction

When hosting your project on GitHub Pages, you rely on continuous integration (CI) to build and deploy your site. While GitHub Actions provide logs and status badges, you might want real-time alerts when a build finishes or fails. NTFY (Notify) is a simple, self-hostable notification service that integrates seamlessly with GitHub Actions. In this post, we'll cover how to send NTFY alerts on build completion or failure for your GitHub Pages repository.

## Prerequisites

Before getting started, ensure you have:

- A GitHub repository configured for Pages (using a branch or `/docs` folder).  
- Basic familiarity with GitHub Actions workflows.  
- An NTFY instance URL (for cloud, use https://ntfy.sh; for self-hosted, your server address).  
- A client or app that can receive NTFY notifications on your device.

## Setting Up NTFY

1. **Choose or deploy your NTFY server**  
   - Public (no authentication): https://ntfy.sh  
   - Self-hosted: follow the [NTFY documentation](https://ntfy.sh/docs/) to deploy on Docker, k8s, or a VM.

2. **Create a topic**  
   Topics are simple strings. For example:
   ```bash
   TOPIC="github-pages-build"
   ```

3. **Subscribe to the topic**  
   On your mobile or desktop NTFY client, subscribe to `github-pages-build`:
   ```bash
   ntfy subscribe github-pages-build
   ```
   Or use a web client:
   ```
   https://ntfy.sh/subscribe/github-pages-build
   ```

## Configuring GitHub Actions

Add or update your workflow file (e.g., `.github/workflows/pages.yml`) to post NTFY notifications after build and deployment.

1. **Define secrets**  
   In your repository settings, add:
   - `NTFY_SERVER` (e.g., `https://ntfy.sh` or `https://ntfy.myserver.com`)
   - `NTFY_TOPIC` (e.g., `github-pages-build`)
   - Optionally, `NTFY_USER` and `NTFY_PASS` if your server requires basic auth.

2. **Update your workflow**  
   ```yaml
   name: Deploy GitHub Pages

   on:
     push:
       branches:
         - main

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout repository
           uses: actions/checkout@v3

         - name: Set up Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '16'

         - name: Install dependencies
           run: npm ci

         - name: Build site
           run: npm run build

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./public

         - name: Send NTFY Notification
           if: always()
           env:
             NTFY_SERVER: ${{ secrets.NTFY_SERVER }}
             NTFY_TOPIC: ${{ secrets.NTFY_TOPIC }}
             NTFY_USER: ${{ secrets.NTFY_USER }}
             NTFY_PASS: ${{ secrets.NTFY_PASS }}
           run: |
             STATUS=$([[ "${{ job.status }}" == "success" ]] && echo "✅ Success" || echo "❌ Failure")
             MESSAGE="GitHub Pages build: $STATUS\nRepository: ${{ github.repository }}\nBranch: ${{ github.ref_name }}"
             AUTH_OPTS=""
             if [ -n "$NTFY_USER" ] && [ -n "$NTFY_PASS" ]; then
               AUTH_OPTS="-u $NTFY_USER:$NTFY_PASS"
             fi
             curl -s $AUTH_OPTS -d "$MESSAGE" "$NTFY_SERVER/$NTFY_TOPIC"
   ```

### Key Points

- The `if: always()` condition ensures the notification step runs on both success and failure.
- We build a custom message that includes status, repo, and branch.
- Credentials are passed via GitHub Secrets to keep them secure.

## Testing Notifications

1. Commit and push your changes to the `main` branch.
2. Open the Actions tab in GitHub to monitor the workflow.
3. Upon completion or failure, check your NTFY client for a notification titled “GitHub Pages build.”

## Advanced Tips

- **Custom headers**: Use `curl -H "Title: Build Status"` to set notification titles.
- **Rich formatting**: NTFY supports Markdown. Include links to build logs:
  ```bash
  curl -d "**Build**: $STATUS  
  [View logs]($GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID)"
  ```
- **Multiple topics**: Send different topics for staging vs. production branches.

## Conclusion

By integrating NTFY into your GitHub Actions workflow, you gain instant visibility into your GitHub Pages builds. This lightweight setup allows you to stay informed without checking logs manually. Whether you use the public NTFY service or self-host, notifications can be tailored for any CI/CD pipeline. Try it out and streamline your deployment alerts today!