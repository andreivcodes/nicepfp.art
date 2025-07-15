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
- IPFS API credentials (Infura project ID and secret)
- Ethereum private keys for signing (IMPORTANT: Include 0x prefix, code handles both formats)
- Browserless WebSocket endpoints

**Critical Environment Variables:**
```bash
# Web App
PRIVATE_KEY=0x...  # Required for signing IPFS metadata
IPFS_PROJECT_ID=...
IPFS_PROJECT_SECRET=...

# Generate Image Service  
PRIVATE_KEY=0x...  # Required for signing
BROWSERLESS_URL=...
BROWSERLESS_TOKEN=...

# Mint Service
PRIVATE_KEY=0x...  # Required for blockchain transactions
```

## Important Implementation Details

### Image Generation Flow

**Direct Web Minting:**
1. User generates AI face doodle using ML5.js/SketchRNN on p5.js canvas
2. Canvas captured as base64 image
3. Server action (`app/actions.ts`) uploads to IPFS
4. NFT metadata created and signed with private key
5. Frontend calls smart contract directly to mint

**Background Generation (for Farcaster Frames):**
1. Generate service uses Puppeteer with Browserless Chrome
2. Navigates to `https://nicepfp.art/frame/img`
3. Captures rendered AI-generated face
4. Uploads to IPFS with signed metadata
5. Stores in database as unlocked entry

### NFT Minting Flow

**Web App Direct Minting:**
1. User connects wallet via Wagmi/Web3 button
2. Generates and captures desired face
3. Clicks mint button
4. Server action handles IPFS upload and signing
5. Frontend executes smart contract mint function

**Farcaster Frame Minting:**
1. User views frame with pre-generated image
2. Must recast to unlock minting
3. Mint request published to Redis channel
4. Mint service processes request asynchronously
5. Validates one-mint-per-address limit
6. Executes blockchain transaction

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

## Known Issues and Solutions

### Private Key Format Error
If you encounter "Expected private key to be an Uint8Array with length 32":
- The code expects private keys with 0x prefix (e.g., `0x1234...`)
- eth-crypto library requires removing the 0x prefix internally
- The code handles this automatically in `actions.ts` and `generate_image/index.ts`
- Ensure PRIVATE_KEY env var is set in docker-compose.yml for ALL services that need it

### Docker Compose Configuration
The web service MUST have the PRIVATE_KEY environment variable:
```yaml
web:
  environment:
    - PRIVATE_KEY=${PRIVATE_KEY}  # Critical for minting functionality
```

### Smart Contract Details
- **Network**: Polygon Mainnet
- **Contract Address**: `0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34`
- **Features**: Signature verification, ERC-721 standard
- **Limits**: One mint per address for Farcaster integration

### Service Communication
- **Redis Channels**:
  - `gen-img`: Triggers image generation
  - `mint`: Triggers NFT minting
- **Database**: Shared PostgreSQL instance
- **IPFS**: Uses Infura gateway (requires project credentials)