<!--
SPDX-FileCopyrightText: 2025 2025 wahl.chat

SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
-->

# wahl.chat

The leading political information chatbot for the German federal elections 2025.

**Application**: https://wahl.chat/
**About**: https://wahl.chat/about-us
**Press**: https://wahlchat.notion.site

## About

The aim of wahl.chat is to enable users to engage in a contemporary way with the positions of political parties and to receive answers to individual questions that can be substantiated with sources.

## Repository Structure

This monorepo contains the main application code for wahl.chat:

| Directory | Description |
|---|---|
| [`web/`](web/) | Next.js frontend application |
| [`ai-backend/`](ai-backend/) | Python AI/RAG backend (aiohttp + Socket.IO + LangChain) |
| [`firebase/`](firebase/) | Firebase configuration (Firestore rules, Cloud Functions, seed data) |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ and [Bun](https://bun.sh/) (for `web/`)
- [Python](https://www.python.org/) 3.11+ and [Poetry](https://python-poetry.org/) (for `ai-backend/`)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for `firebase/`)

## Getting Started

### 1. Install dependencies

```bash
make install
```

Or install individually:

```bash
cd web && bun install
cd ai-backend && poetry install
```

### 2. Configure environment variables

Each sub-project has its own `.env.example`:

```bash
cp web/.env.example web/.env.local
cp ai-backend/.env.example ai-backend/.env
```

See the individual READMEs for details on the required variables:
- [web/README.md](web/README.md) -- Firebase credentials, backend URL, Stripe (optional)
- [ai-backend/README.md](ai-backend/README.md) -- OpenAI/Google API keys, Qdrant, LangChain

### 3. Run development servers

Start both the frontend and backend simultaneously:

```bash
make dev
```

Or run them separately:

```bash
make dev-web       # Next.js on http://localhost:3000
make dev-backend   # Python backend on http://localhost:8080
```

## Contributions

We appreciate contributions from our community. Please take a look at the open issues if you are interested.
If you are unsure where to start, please contact robin@wahl.chat.

## License

This project is **source-available** under the **PolyForm Noncommercial 1.0.0** license.
- Free for **non-commercial** use (see LICENSE for permitted purposes)
- Share the license text and any `Required Notice:` lines when distributing
- Please contact us at info@wahl.chat to
  a. Inform us about your use case
  b. Get access to assets required for a reference to wahl.chat on your project page
- Do not use the wahl.chat name or logo in your project without our permission
