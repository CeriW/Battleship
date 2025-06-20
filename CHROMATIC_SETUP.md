# Chromatic Setup Guide

This guide will help you set up Chromatic to automatically publish your Storybook on every push.

## Prerequisites

1. A Chromatic account (sign up at https://www.chromatic.com)
2. A GitHub repository with Storybook already configured

## Setup Steps

### 1. Get Your Chromatic Project Token

1. Go to [Chromatic](https://www.chromatic.com) and sign in
2. Create a new project or select an existing one
3. Go to Project Settings → Project Token
4. Copy your project token

### 2. Add the Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `CHROMATIC_PROJECT_TOKEN`
5. Value: Paste your Chromatic project token
6. Click "Add secret"

### 3. Verify Your Setup

The following files have been configured for you:

- `.github/workflows/chromatic.yml` - GitHub Actions workflow
- `chromatic.config.json` - Chromatic configuration
- `scripts/test-chromatic.sh` - Test script (optional)

### 4. Test Locally (Optional)

If you want to test the setup locally:

```bash
# Set your token as an environment variable
export CHROMATIC_PROJECT_TOKEN=your_token_here

# Run the test script
chmod +x scripts/test-chromatic.sh
./scripts/test-chromatic.sh
```

### 5. Push to Trigger the Workflow

The workflow will automatically run when you push to any of these branches:

- `main` or `master`
- `develop`
- `feature/*`
- `bugfix/*`
- `hotfix/*`

It will also run on pull requests to `main`, `master`, or `develop`.

## How It Works

1. **On Push**: The workflow builds your Storybook and publishes it to Chromatic
2. **On Pull Request**: The workflow creates a preview build for review
3. **Visual Testing**: Chromatic automatically compares screenshots with previous builds
4. **Auto-accept**: Changes on main/master branches are automatically accepted

## Configuration Options

The workflow includes these optimizations:

- `exitZeroOnChanges: true` - Won't fail the build if there are visual changes
- `onlyChanged: true` - Only tests stories that have changed (TurboSnap)
- `autoAcceptChanges` - Automatically accepts changes on main/master branches
- `cache: 'npm'` - Caches npm dependencies for faster builds

## Troubleshooting

### Workflow Not Running

1. Check that your branch name matches the patterns in the workflow
2. Verify the `CHROMATIC_PROJECT_TOKEN` secret is set correctly
3. Check the Actions tab in GitHub for any error messages

### Build Failures

1. Ensure your Storybook builds locally: `npm run build-storybook`
2. Check for any linting errors that might prevent the build
3. Verify all dependencies are properly installed

### Chromatic Issues

1. Check your project token is valid
2. Ensure you have the correct permissions in Chromatic
3. Check the [Chromatic status page](https://status.chromatic.com)

## Next Steps

Once set up, you can:

1. View your published Storybook at your Chromatic URL
2. Set up visual regression testing
3. Configure team notifications
4. Set up branch protection rules that require Chromatic to pass

## Support

- [Chromatic Documentation](https://www.chromatic.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Storybook Documentation](https://storybook.js.org/docs)
