# POLP - Proof of Listenership Platform

A full-stack music streaming application designed to help emerging artists discover and build their first 1000 fans.

**Created by Matt Lee**

## Overview

POLP is a modern music streaming platform built with Next.js and AWS, featuring real-time audio playback, cloud-based storage, and a collection system that connects artists with their listeners. The application demonstrates proficiency in React architecture, cloud services integration, and full-stack TypeScript development.

## Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe component development
- **Next.js 13** for server-side rendering and API routes
- **Tailwind CSS** with custom theming for responsive UI design
- **Material Tailwind** component library integration

### Backend & Cloud Services
- **AWS Amplify** for authentication and storage orchestration
- **Amazon Cognito** for secure user authentication with OAuth 2.0
- **Amazon S3** for scalable media and metadata storage
- **CloudFront CDN** for optimized content delivery

## Features

- **Music Discovery Feed** - Browse and discover tracks from various artists
- **Full Audio Player** - Play/pause, next/previous, progress bar, and duration tracking
- **Track Upload System** - Upload MP3s with metadata, cover art, and custom "vibe" colors
- **Personal Collections** - Save favorite tracks to a personal collection
- **Fan Tracking** - Artists can view listeners who've added their music
- **User Profiles** - Manage artist profiles with bio, name, and profile pictures

## Architecture

```
/pages                    # Next.js pages (SSR + routing)
├── index.tsx            # Home/discovery feed
├── profile.tsx          # User profile management
├── uploadPage.tsx       # Track upload interface
├── collectionPage.tsx   # Personal collection view
└── listenersPage.tsx    # Artist's fan list

/components               # Reusable React components
├── MediaProvider.tsx    # Audio context provider
├── Feed.tsx             # Track listing component
├── Track.tsx            # Individual track card
├── ControlBar.tsx       # Audio player controls
├── Upload.tsx           # Upload form with metadata
└── ...

/amplify                  # AWS Amplify backend config
└── backend/
    ├── auth/            # Cognito configuration
    └── storage/         # S3 bucket configuration
```

### Key Design Patterns

- **Context API** for centralized media state management
- **Component composition** for reusable UI elements
- **Serverless architecture** with AWS managed services
- **Optimized media delivery** via CDN distribution

## Local Development

### Prerequisites

- Node.js 16+
- AWS Account with Amplify CLI configured
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mattleesounds/polp.git
cd polp

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID=your_identity_pool_id
NEXT_PUBLIC_AWS_USER_POOLS_ID=your_user_pool_id
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/
NEXT_PUBLIC_AWS_USER_FILES_S3_BUCKET=your_s3_bucket
```

### Running the App

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint for code quality checks |

## Data Flow

```
User Authentication (Cognito)
        ↓
    App Session
        ↓
┌───────┴───────┐
↓               ↓
Feed (S3)    Upload (S3)
↓               ↓
Play Track   Store Media
↓               ↓
Collection ←→ Artist Listeners
```

**Storage Structure:**
- `/media/{trackId}/` - Audio files and metadata
- `/profile-pictures/{userSub}` - User avatars
- `/collections/{userSub}/{artistSub}/` - User collection data
- `/collectors/{artistSub}/{userSub}/` - Artist fan tracking

## Skills Demonstrated

- **Full-Stack Development** - End-to-end implementation from UI to cloud infrastructure
- **React/TypeScript** - Modern hooks, context API, and type-safe development
- **AWS Cloud Services** - Integration of Cognito, S3, Amplify, and CloudFront
- **State Management** - Centralized audio state with React Context
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Authentication** - OAuth 2.0 federated sign-in implementation
- **Media Handling** - Audio streaming, file uploads, and CDN delivery

## License

MIT
