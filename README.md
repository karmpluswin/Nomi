# Nomi

**Turn a product photo into an ad people notice.**

Nomi is an AI-powered ad creative generator. Upload a single product photo, describe the product, and get back polished advertising creative: no design tool required.

## Overview

1. **Upload**: drop in a product photo.
2. **Describe**: add the product name, description, and optional reference images (brand/logo, style inspiration, environment).
3. **Generate**: Nomi produces multiple advertising directions using your choice of AI provider.

## Features

- **Bring your own API key (BYOK)**: connect your own key for Google Gemini, fal.ai, OpenRouter, or Cloudflare Workers AI; a mock provider is included for local development without any key.
- **Reference images**: guide the output with up to 3 reference images tagged as brand/logo, style, environment, or other.
- **Advanced creative controls**: fine-tune creative direction, ad copy (headline, subheadline, CTA), typography (font family/weight), and color palette (auto-extracted from the product photo or custom).
- **Before/after preview**: interactive slider comparing the source photo against the generated ad.
- **Generation progress UI**: staged progress feedback while a creative is being produced.
- **Auth**: user accounts via Clerk.
- **Clean, minimal UI**: built with shadcn/ui, Radix primitives, and Motion for animation.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| Language | TypeScript |
| UI | React 19, shadcn/ui, Radix UI, Tailwind CSS v4 |
| Animation | Motion |
| Auth | Clerk |
| AI Providers | Google Gemini, fal.ai, OpenRouter, Cloudflare Workers AI |
| Icons / Fonts | Lucide, Geist |

## Getting Started

### Prerequisites

- Node.js 18+
- An API key for at least one supported AI provider (Gemini, fal.ai, OpenRouter, or Cloudflare). Or use the built-in mock provider to try the flow without one

### Installation

```bash
git clone https://github.com/<your-username>/Nomi.git
cd Nomi
npm install
```

### Environment Variables

Create a `.env.local` file for Clerk authentication:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

AI provider keys are supplied by the user at runtime (BYOK) rather than stored as environment variables.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page, and go to `/create` to generate a creative.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/                # The ad creation flow
│   └── api/generate/          # Generation API route
├── components/
│   ├── nomi/                  # App-specific UI (form, controls, gallery, etc.)
│   └── ui/                    # shadcn/ui primitives
└── lib/
    ├── ai/                    # Provider abstraction (Gemini, fal, OpenRouter, Cloudflare, Mock)
    ├── composite-text.ts       # Text overlay compositing
    └── extract-palette.ts      # Color palette extraction
```

## Adding a New AI Provider

Providers implement a shared `AIProvider` interface (`src/lib/ai/types.ts`). To add one:

1. Create a new provider class under `src/lib/ai/providers/`.
2. Register it in `src/lib/ai/get-provider.ts`.
3. Add it as an option in the provider connection UI.

## License

All rights reserved © 2026 Karmjeet Chauhan.
