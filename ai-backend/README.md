<!--
SPDX-FileCopyrightText: 2025 2025 wahl.chat

SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
-->

# AI Backend

Python AI/RAG backend for [votamos.chat](https://votamos.chat/).

Built with aiohttp, Socket.IO, LangChain, and Qdrant.

## Localization

This project was initially implemented for the German political system.
To adapt it for use in other countries, you will need to adjust the prompts and data schemas to fit the target locale and political context.

## Setup

> Need help? Contact us at [info@votamos.chat](mailto:info@votamos.chat).

### 1. Install dependencies

```bash
poetry install
# With dev dependencies:
poetry install --with dev
```

### 2. Install pre-commit hooks

```bash
poetry run pre-commit install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in the values. For the LangChain API key (used for tracing on [smith.langchain.com](https://smith.langchain.com)):
1. Set up your own project and API key, or
2. Set `LANGCHAIN_TRACING_V2=false` to deactivate tracing.

### 4. Authenticate with Firebase

The recommended approach for local development is **Google Application Default Credentials (ADC)**:

```bash
gcloud auth application-default login
gcloud config set project votamos-chat-dev
```

Or from the repo root:

```bash
make auth
```

> **Note:** ADC tokens expire periodically (typically daily). When you see a `RefreshError`, simply re-run the command above. The backend will print a clear message when this happens.

**Alternative: Service account JSON file**

For CI/CD or Docker deployments, place a `votamos-chat-dev-firebase-adminsdk.json` file in this directory. Generate it at the Firebase Console for the `votamos-chat-dev` project. The backend auto-detects and uses it when present. For production, use `votamos-chat-prod-firebase-adminsdk.json`. Legacy `votamos-chat-firebase-adminsdk.json` and `wahl-chat-*.json` filenames are still accepted as fallbacks while migrating. Note that [Google recommends ADC over service account keys](https://cloud.google.com/docs/authentication#auth-decision-tree) for local development.

## Run

### Locally

```bash
poetry run python -m src.aiohttp_app --debug
```

### Docker

```bash
# Build
docker build -t votamos-chat:latest .

# Run (dev)
docker run --env-file .env -p 8080:8080 votamos-chat:latest

# Run with gcloud ADC (no service account file needed)
ADC=~/.config/gcloud/application_default_credentials.json && \
docker run --env-file .env \
  -e GOOGLE_APPLICATION_CREDENTIALS=/tmp/keys/application_default_credentials.json \
  -e GOOGLE_CLOUD_PROJECT=votamos-chat-dev \
  -v ${ADC}:/tmp/keys/application_default_credentials.json:ro \
  -p 8080:8080 \
  votamos-chat:latest
```

### Production configuration

Use [`ai-backend/.env.prod.example`](./.env.prod.example) as the starting point for production. The minimum production-specific changes are:

- `ENV=prod`
- `GOOGLE_CLOUD_PROJECT=votamos-chat-prod`
- `LANGCHAIN_PROJECT=votamos-chat-prod`
- `CORS_ALLOWED_ORIGINS=https://votamos.chat,https://www.votamos.chat`

For ADC-based production auth:

```bash
make auth-prod
```

For service-account-based deployments, provide `votamos-chat-prod-firebase-adminsdk.json` next to the backend code.

## Test

Prerequisite: run the backend locally.

```bash
# All websocket tests
poetry run pytest tests/test_websocket_app.py -s

# Specific test
poetry run pytest tests/test_websocket_app.py -k test_get_chat_answer -s
```
