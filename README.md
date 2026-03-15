# Tilt Journey Platform

A Next.js 14 MVP application for guided self-reflection using the Tilt framework. Short, 7-minute sessions help you learn from real work situations across four dimensions: Resilience, Humanity, Courage, and Wisdom.

## Features

- **5-Step Reflection Sessions** – Check-in → Situation → Tilt Lens → Pattern → Micro-Action
- **Tilt Quadrant Dashboard** – Visual overview of dimension activity and session stats
- **Reflection History** – Full log of past sessions with patterns and micro-actions
- **AI Companion** – OpenAI gpt-4o-mini integration with graceful fallback when no key is set
- **File-based Storage** – Sessions stored in `data/sessions.json` (no database required)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key (optional — fallback responses work without it)
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Optional | OpenAI API key for AI-powered reflections |
| `NEXT_PUBLIC_BASE_URL` | Optional | Base URL of the app (default: http://localhost:3000) |

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/        # OpenAI chat endpoint
│   │   ├── patterns/    # Pattern summary endpoint
│   │   └── sessions/    # Session CRUD endpoint
│   ├── dashboard/       # Dashboard with quadrant visualization
│   ├── history/         # Reflection history page
│   ├── session/         # Guided session interface
│   └── page.tsx         # Landing page
├── components/
│   ├── SessionChat.tsx  # Conversational chat UI (client)
│   └── TiltQuadrant.tsx # SVG quadrant visualization (client)
├── lib/
│   └── storage.ts       # File-based session storage utilities
└── types/
    └── index.ts         # TypeScript type definitions
data/
└── sessions.json        # Session data (auto-created, gitignored)
```

## The Four Tilt Dimensions

| Dimension | Metaphor | Focus |
|---|---|---|
| 💧 Resilience | Water & Lake | Stability, recovery, grounding |
| 🌿 Humanity | Forest & Community | Connection, empathy, belonging |
| ⛰️ Courage | Arena & Mountain | Boldness, action, speaking truth |
| 🔭 Wisdom | Observatory | Insight, clarity, perspective |
