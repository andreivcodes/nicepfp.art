# nicepfp.art 🎨

AI-powered profile picture NFTs on Polygon - Simple. Free. Unlimited. Forever.

nicepfp.art is a Web3 application that uses machine learning to generate unique doodle profile pictures and mint them as NFTs on the Polygon blockchain. Built with AI creativity and blockchain technology, it makes personalized NFT profile pictures accessible to everyone.

## Features

- **AI Face Generation** - Uses ML5.js and SketchRNN to generate unique face doodles
- **Free NFT Minting** - No minting fees, only gas costs on Polygon
- **Unlimited Creations** - Generate as many unique faces as you want
- **Web3 Integration** - Connect wallet and mint directly to blockchain
- **IPFS Storage** - Decentralized storage for permanence
- **Farcaster Frames** - Social integration for Farcaster users
- **NFT Gallery** - Showcase of all minted profile pictures

## Quick Start

### Prerequisites

- Node.js 20+
- Yarn 4.6.0+
- Docker & Docker Compose
- PostgreSQL 15
- Redis

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nicepfp.art.git
cd nicepfp.art
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
# Create .env files for each service based on the requirements below
```

4. Start infrastructure services:
```bash
docker-compose up -d postgres redis browserless
```

5. Run database migrations:
```bash
yarn prisma:migrate:dev
```

6. Start development:
```bash
yarn dev
```

Visit http://localhost:3000 to see the application.

## Architecture

nicepfp.art is built as a microservices monorepo using Turborepo:

```
apps/
├── web/                    # Next.js frontend with Web3 integration
├── generate_image/         # Image generation service (Puppeteer + IPFS)
└── mint/                   # NFT minting service (blockchain interactions)
```

### Services Overview

- **Web App**: Next.js 14 with App Router, React 18, TypeScript, Tailwind CSS
- **Generate Service**: Express.js microservice for AI image generation and IPFS uploads
- **Mint Service**: Express.js microservice for NFT minting on Polygon
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session management
- **Browser**: Browserless Chrome for headless rendering

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Blockchain**: Wagmi, Viem, Ethers.js, Polygon network
- **AI/ML**: ML5.js, p5.js, SketchRNN model
- **Backend**: Express.js, Prisma, PostgreSQL, Redis
- **Infrastructure**: Docker, Turborepo, IPFS
- **Web3**: Smart contracts on Polygon, IPFS for storage

## Development

### Common Commands

```bash
# Development
yarn dev                    # Run all services
yarn dev --filter=@nicepfp/web    # Run specific service

# Database
yarn prisma:generate        # Generate Prisma client
yarn prisma:studio          # Open database GUI

# Code Quality
yarn lint                   # Run ESLint
yarn format                 # Format with Prettier

# Building
yarn build                  # Build all services
```

### Docker Stack

```bash
docker-compose up           # Start all services
docker-compose up web       # Start specific service
```

## Environment Variables

Each service requires specific environment variables:

### Web App (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/nicepfp
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_HOST=http://localhost:3000
```

### Generate Image Service (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/nicepfp
REDIS_URL=redis://localhost:6379
IPFS_PROJECT_ID=your_infura_project_id
IPFS_PROJECT_SECRET=your_infura_secret
BROWSERLESS_URL=ws://localhost:3000
BROWSERLESS_TOKEN=your_token
PRIVATE_KEY=your_ethereum_private_key
```

### Mint Service (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/nicepfp
REDIS_URL=redis://localhost:6379
PRIVATE_KEY=your_ethereum_private_key
```

## User Flow

1. **Generate**: AI creates unique face doodles using ML5.js
2. **Preview**: Keep generating until you find the perfect one
3. **Connect**: Link your Web3 wallet (MetaMask, etc.)
4. **Mint**: Click mint to create your NFT (free + gas)
5. **Own**: NFT is yours on Polygon blockchain forever

## Smart Contract

- **Network**: Polygon Mainnet
- **Contract**: `0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34`
- **Standard**: ERC-721 NFT
- **Features**: Signature verification, one mint per address for Farcaster

## License

This project is open source and available under the [MIT License](LICENSE).
