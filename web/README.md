<!--
SPDX-FileCopyrightText: 2025 2025 wahl.chat

SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
-->

# Wahl.chat app
Frontend of the leading political information chatbot for the German federal elections 2025.

## About wahl.chat
#### Links
Application URL: https://wahl.chat/ </br>
About page: https://wahl.chat/about-us </br>
Press: https://wahlchat.notion.site </br>

#### Our goal in a nutshell
The aim of wahl.chat is to enable users to engage in a contemporary way with the positions of political parties and to receive answers to individual questions that can be substantiated with sources.

#### Contributions welcome
We appreciate contributions from our community. Please take a look at the open issues, if you are interested.  
If you are unsure where to start, please contact robin@wahl.chat. 
Further specifications coming soon.

## License
This project is **source-available** under the **PolyForm Noncommercial 1.0.0** license.
- Free for **non-commercial** use (see LICENSE for permitted purposes)
- Share the license text and any `Required Notice:` lines when distributing
- Please contact us at info@wahl.chat to
a. Inform us about your use case
b. Get access to assets required for a reference to wahl.chat on your project page
- Do not use the wahl.chat name or logo in your project without our permission

## Setup

### 1. Install dependencies

This project uses [Bun](https://bun.sh/).

```bash
bun install
```

### 2. Configure environment variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in the required values in `.env.local`. 
   - **Backend**: By default, `NEXT_PUBLIC_API_URL` is set to `http://localhost:8080`. For this to work, you must run the AI backend locally (see [ai-backend/](../ai-backend/)). Alternatively, you can point it to a publicly hosted backend endpoint.
   - **Firebase**: These variables are required for the app to function. You can find them in the [Firebase Console](https://console.firebase.google.com/) under Project Settings.
   - **Stripe**: These variables are optional for local development unless you are working on donation features.

### 3. Configure regional election contexts

The app uses geo-detection to redirect users to their regional election context. The mapping is defined in `lib/constants.ts` under `REGION_TO_CONTEXT`.

**Important**: This mapping must be updated to reflect which elections are currently supported in each German state. Each region code (e.g., `HH` for Hamburg) maps to a context ID (e.g., `hh2029`) that must exist in the Firestore `contexts` collection. If a context doesn't exist, users will be automatically redirected to the default context (`bundestagswahl-2025`).

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Cache Revalidation

The app caches Firestore data (sources, parties, contexts) for performance. If you update data in Firestore and it doesn't appear on production, you may need to revalidate the cache.

Use the `/api/revalidate` endpoint with the `REVALIDATE_SECRET` environment variable:

```bash
# Revalidate by cache tag
curl -X POST https://wahl.chat/api/revalidate \
  -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"tag": "source_documents"}'

# Or revalidate by path
curl -X POST https://wahl.chat/api/revalidate \
  -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"path": "/bundestagswahl-2025/sources"}'
```

Available cache tags (defined in `lib/cache-tags.ts`):
- `source_documents` - Source documents for the sources page
- `parties` - Global party data
- `contexts` - Election contexts
- `context_parties` - Parties per context
- `proposed_questions` - Suggested questions