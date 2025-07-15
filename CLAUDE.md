# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

nicepfp.art is a Web3-enabled monorepo for creating and minting custom profile picture NFTs. It uses Turborepo to manage three microservices: a Next.js web frontend, an image generation service, and an NFT minting service.

## Development Commands

```bash
# Development
yarn dev                          # Run all apps in development mode
yarn dev --filter=@nicepfp/web    # Run only the web app
yarn dev --filter=@nicepfp/generate_image  # Run only generate_image service
yarn dev --filter=@nicepfp/mint   # Run only mint service

# Building
yarn build                        # Build all apps
yarn build --filter=@nicepfp/web  # Build specific app

# Database Operations
yarn prisma:generate              # Generate Prisma client after schema changes
yarn prisma:migrate:dev          # Create and apply migrations in development
yarn prisma:migrate:deploy       # Deploy migrations to production
yarn prisma:studio               # Open Prisma Studio GUI

# Code Quality
yarn lint                        # Run ESLint across all apps
yarn format                      # Format code with Prettier

# Docker Stack
docker-compose up                # Start PostgreSQL, Redis, and Browserless services
```

## Architecture

### Microservices Structure

1. **Web App** (`/apps/web/`): Next.js 14+ frontend
   - Pages use App Router (`app/` directory)
   - API routes in `app/api/`
   - Farcaster Frames implementation in `app/api/frames/`
   - p5.js canvas for drawing in `components/Canvas.tsx`
   - Web3 integration via Wagmi/Viem

2. **Generate Image Service** (`/apps/generate_image/`): Express microservice
   - Puppeteer-based image generation
   - IPFS upload functionality
   - Ethereum signature generation for content authenticity

3. **Mint Service** (`/apps/mint/`): Express microservice
   - NFT minting operations
   - Blockchain interaction via Viem

### Key Technologies

- **Frontend**: Next.js, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Prisma ORM
- **Blockchain**: Viem, Wagmi, Ethers, RainbowKit
- **Creative**: p5.js (react-p5), ml5.js
- **Infrastructure**: PostgreSQL, Redis, IPFS, Browserless Chrome

### Database Schema

Two main models in Prisma:
- `Entry`: Stores generated profile pictures with metadata
- `Minter`: Tracks users who mint NFTs

### Environment Variables

Each app has its own `.env` file. Key variables include:
- Database URLs
- Redis connection strings
- IPFS API credentials
- Ethereum private keys for signing
- Browserless WebSocket endpoints

## Important Implementation Details

### Image Generation Flow
1. User creates art on p5.js canvas in web app
2. Canvas data sent to generate_image service
3. Puppeteer renders the canvas and captures screenshot
4. Image uploaded to IPFS
5. Metadata signed and stored in database

### NFT Minting Flow
1. User connects wallet via RainbowKit
2. Mint request sent to mint service
3. Service interacts with smart contract
4. Transaction hash returned to frontend

### Farcaster Frames
The app implements Farcaster Frames protocol for social media integration. Frame routes are in `apps/web/app/api/frames/`.

## Common Development Patterns

### API Routes (Next.js)
All API routes use the App Router pattern:
```typescript
export async function GET(request: Request) { }
export async function POST(request: Request) { }
```

### Prisma Usage
Always regenerate Prisma client after schema changes:
```bash
yarn prisma:generate
```

### Component Structure
- UI components use shadcn/ui primitives
- Custom components in `apps/web/components/`
- Utility functions in `apps/web/lib/`

### Testing Individual Services
When testing microservices locally, ensure Docker services are running:
```bash
docker-compose up -d postgres redis browserless
```

Then run the specific service you're working on.