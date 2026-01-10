# Polp

## Created by Matt Lee

### Description

POLP (Proof of Listenership Platform) is a music streaming application specializing in helping new artists find their first 1000 fans.

Built with Next.js and AWS.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- AWS Account with Amplify, Cognito, and S3 configured
- Google OAuth Client ID (for social login)

### Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local`:
   - AWS Cognito credentials (from AWS Console)
   - Google OAuth Client ID (from Google Cloud Console)
   - S3 bucket name for media storage
   - OAuth redirect URLs

3. Never commit `.env.local` or `.env` files to version control.

### Installation

```bash
npm install
npm run dev
```

## Security Best Practices

### For Contributors

To prevent accidentally committing secrets:

1. **Install git-secrets** (recommended):
   ```bash
   # macOS
   brew install git-secrets

   # Other platforms: https://github.com/awslabs/git-secrets

   # Setup for this repo
   git secrets --install
   git secrets --register-aws
   ```

2. **Use pre-commit hooks** to scan for sensitive data before commits

3. **Never commit**:
   - `.env` or `.env.local` files
   - `amplify/team-provider-info.json` (contains AWS resource IDs)
   - AWS credentials, API keys, or secrets
   - Private keys or certificates

4. **Always use environment variables** for sensitive configuration

### Additional Security Tools

- [detect-secrets](https://github.com/Yelp/detect-secrets) - Scan codebase for secrets
- [truffleHog](https://github.com/trufflesecurity/trufflehog) - Search git history for secrets