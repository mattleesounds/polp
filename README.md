# Polp

## Created by Matt Lee

## About

POLP (Proof of Listenership Platform) is a music streaming application specializing in helping new artists find their first 1000 fans. The platform allows artists to upload their music, share it with listeners, and track their growing fanbase through a proof-of-listenership system.

Built with Next.js and AWS.

## Features

- **Music Upload & Streaming** - Artists can upload audio tracks to the platform and stream them to listeners
- **User Authentication** - Secure sign-in with AWS Cognito and Google OAuth integration
- **Music Feed** - Browse and discover new music from emerging artists
- **Personal Collection** - Save and organize your favorite tracks
- **Artist Profiles** - View artist information and their music catalog
- **Listener Tracking** - Artists can see who's listening to their music and track their fanbase growth
- **Media Player Controls** - Built-in audio player with playback controls

## How It Works

### For Artists

1. **Sign Up** - Create an account using email or Google OAuth
2. **Upload Music** - Upload your tracks with cover art and metadata
3. **Share** - Your music appears in the public feed for listeners to discover
4. **Track Listeners** - Monitor who's listening to your music and building your first 1000 fans

### For Listeners

1. **Browse** - Explore the feed to discover new artists
2. **Listen** - Stream music directly in the browser
3. **Collect** - Save tracks to your personal collection
4. **Support** - Help artists reach their goal of 1000 fans by listening and sharing

## Tech Stack

### Frontend
- **Next.js 13** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Material Tailwind** - UI component library
- **React Icons** - Icon library

### Backend & Services
- **AWS Amplify** - Backend framework and hosting
- **AWS Cognito** - User authentication and authorization
- **AWS S3** - Media file storage for audio tracks and cover art
- **AWS SDK** - Integration with AWS services

### Authentication
- **Google OAuth** - Social login integration
- **Email/Password** - Traditional authentication via Cognito

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

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mattleesounds/polp.git
   cd polp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (see Environment Variables section above)

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Starts the development server on http://localhost:3000
- `npm run build` - Creates an optimized production build
- `npm run start` - Runs the production server (requires build first)
- `npm run lint` - Runs ESLint to check code quality

### AWS Setup

To fully configure the application, you'll need to set up the following AWS services:

1. **AWS Amplify**:
   - Initialize Amplify in your AWS account
   - Configure hosting (optional)

2. **AWS Cognito**:
   - Create a User Pool for authentication
   - Create an Identity Pool for AWS resource access
   - Add email as a required attribute
   - Configure OAuth providers (Google)
   - Note the User Pool ID, Identity Pool ID, and Web Client ID

3. **AWS S3**:
   - Create an S3 bucket for media storage
   - Configure CORS for browser uploads
   - Set appropriate bucket policies for authenticated users

4. **Google OAuth**:
   - Create a project in Google Cloud Console
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs
   - Note the Client ID

## Project Structure

```
polp/
├── components/          # React components
│   ├── Collection.tsx   # User's saved tracks
│   ├── ControlBar.tsx   # Audio player controls
│   ├── Feed.tsx         # Main music feed
│   ├── Listeners.tsx    # Listener tracking for artists
│   ├── NavBar.tsx       # Navigation bar
│   ├── Profile.tsx      # User profile
│   ├── SignIn.tsx       # Authentication component
│   ├── Track.tsx        # Individual track component
│   └── Upload.tsx       # Music upload component
├── pages/              # Next.js pages
│   ├── index.tsx       # Home page with feed
│   ├── collectionPage.tsx
│   ├── listenersPage.tsx
│   ├── profile.tsx
│   └── uploadPage.tsx
├── amplify/            # AWS Amplify configuration
├── src/
│   └── aws-exports.js  # AWS configuration
└── utils.ts            # Utility functions
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