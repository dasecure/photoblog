---
title: "Generating and Using an NTFY_TOKEN on GitHub Pages"
description: "Learn how to create an NTFY_TOKEN and integrate ntfy notifications into your GitHub Pages workflow."
pubDate: 2024-07-01
heroImage: '../../assets/blog-placeholder-1.jpg'
---

In this post, we’ll walk through how to generate an NTFY_TOKEN and use it in a GitHub Pages workflow to send notifications via ntfy.sh. This allows you to get real-time alerts when your site is built or updated.

## Prerequisites

- A GitHub repository configured for Pages (typically with a `gh-pages` branch or via Actions).
- A topic name on ntfy.sh (for example, `my-github-pages`).
- (Optional) A self-hosted ntfy instance or use the public ntfy.sh service.

## 1. Generate an NTFY_TOKEN

There are two common ways to create a token:

### A. Using the ntfy CLI

1. Install the client:
   ```bash
   brew install ntfy            # macOS
   sudo apt install ntfy-cli    # Debian/Ubuntu
   ```
2. Authenticate and generate a token:
   ```bash
   ntfy login
   ```
3. The CLI will open a browser window and prompt for authentication. Upon success, your token is stored in `~/.config/ntfy/config.json`. To view it:
   ```bash
   jq -r .token ~/.config/ntfy/config.json
   ```

### B. Using the HTTP API (self-hosted or public)

If you are using a self-hosted ntfy instance or the public API that supports token creation, run:

```bash
curl -X POST https://ntfy.sh/api/token \
  -u "username:password" \
  -d '{}' \
  | jq -r .token
```

Replace `username:password` with your credentials. The response JSON contains the field `token`.

Copy the resulting token for the next step.

## 2. Store the Token as a GitHub Secret

1. In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
2. Click **New repository secret**.
3. Name it `NTFY_TOKEN` and paste the token value.
4. Save the secret.

## 3. Create or Update Your GitHub Actions Workflow

Add a workflow file (for example, `.github/workflows/notify.yml`) to your repo:

```yaml
name: Build and Notify

on:
  push:
    branches:
      - main

jobs:
  deploy-and-notify:
    runs-on: ubuntu-latest
    steps:

      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build site
        run: |
          # Replace with your build commands
          npm install
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public

      - name: Send Deployment Notification via ntfy
        env:
          TOPIC: "my-github-pages"
          NTFY_TOKEN: ${{ secrets.NTFY_TOKEN }}
        run: |
          payload="{
            \"title\": \"GitHub Pages Deployed\",
            \"message\": \"Your site has been successfully deployed.\",
            \"priority\": \"high\"
          }"
          curl -X POST https://ntfy.sh/$TOPIC \
            -H "Authorization: Bearer $NTFY_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$payload"
```

### Workflow Breakdown

- **Checkout code**: Pulls your repository.
- **Build site**: Runs your static site generator (replace with your commands).
- **Deploy to GitHub Pages**: Uses `actions-gh-pages` to publish the `public` directory.
- **Send Deployment Notification**: Posts a JSON payload to your ntfy topic with the token injected from GitHub Secrets.

## 4. Test Your Setup

1. Push a commit to the `main` branch.
2. Watch the GitHub Actions run.
3. Confirm you receive a notification (mobile, desktop, or curl subscription).

For instance, if you subscribe on your device:

```bash
curl -N https://ntfy.sh/my-github-pages
```

You should see the JSON payload when the workflow completes.

## Conclusion

By following these steps, you’ve secured your ntfy integration with a private `NTFY_TOKEN`, stored safely in GitHub Secrets, and automated notifications for your GitHub Pages deployments. Enjoy real-time alerts and faster feedback loops!