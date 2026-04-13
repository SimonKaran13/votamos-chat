# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import logging
import os
import sys
from datetime import datetime, timedelta, timezone
from typing import Optional
import firebase_admin
from firebase_admin import firestore, credentials, firestore_async
import google.auth
import google.auth.transport.requests
from google.auth.exceptions import RefreshError
from pathlib import Path

from src.models.chat import CachedResponse
from src.models.context import Context, ContextParty, DEFAULT_CONTEXT_ID
from src.utils import load_env

load_env()

logger = logging.getLogger(__name__)

ENV = os.getenv("ENV")
credentials_filenames = (
    [
        "votamos-chat-prod-firebase-adminsdk.json",
        "votamos-chat-firebase-adminsdk.json",
        "wahl-chat-firebase-adminsdk.json",
    ]
    if ENV == "prod"
    else ["votamos-chat-dev-firebase-adminsdk.json", "wahl-chat-dev-firebase-adminsdk.json"]
)


def _find_credentials_path() -> Optional[Path]:
    for filename in credentials_filenames:
        path = Path(filename)
        if path.exists():
            return path
    return None


credentials_path = _find_credentials_path()

# If the credentials file does not exist, use the application default credentials
if credentials_path is not None:
    logger.info("Using Firebase service account file: %s", credentials_path.name)
    cred = credentials.Certificate(str(credentials_path))
    firebase_admin.initialize_app(cred)
else:
    firebase_admin.initialize_app()

db = firestore.client()
async_db = firestore_async.client()


def _validate_credentials():
    """Validate ADC credentials at startup by attempting a token refresh.

    This catches expired tokens immediately with a clear message instead of
    letting the first Firestore request fail with a cryptic stack trace.
    Only runs when using Application Default Credentials (no JSON file).
    """
    if credentials_path is not None:
        return  # Using service account JSON — no expiry issues

    try:
        adc_credentials, _ = google.auth.default()
        adc_credentials.refresh(google.auth.transport.requests.Request())
    except RefreshError:
        logger.error(
            "\n"
            "============================================================\n"
            " Firebase credentials have expired.\n"
            " Run 'make auth' or 'gcloud auth application-default login'\n"
            " to re-authenticate, then restart the backend.\n"
            "============================================================\n"
        )
        sys.exit(1)
    except Exception as e:
        logger.warning(f"Could not validate Firebase credentials: {e}")


_validate_credentials()


async def aget_parties() -> list[ContextParty]:
    """Deprecated: Use aget_parties_for_context instead."""
    parties = async_db.collection("parties").stream()
    return [ContextParty(**party.to_dict()) async for party in parties]


async def aget_party_by_id(party_id: str) -> Optional[ContextParty]:
    """Deprecated: Use aget_party_for_context instead."""
    party_ref = async_db.collection("parties").document(party_id)
    party = await party_ref.get()
    if party.exists:
        return ContextParty(**party.to_dict())
    return None


async def aget_proposed_questions_for_party(party_id: str) -> list[str]:
    questions = async_db.collection(f"proposed_questions/{party_id}/questions").stream()
    return [question.get("content") async for question in questions]


async def aget_proposed_questions_for_party_in_context(
    context_id: str, party_id: str
) -> list[str]:
    questions = (
        async_db.collection("contexts")
        .document(context_id)
        .collection("proposed_questions")
        .document(party_id)
        .collection("questions")
        .stream()
    )
    return [question.get("content") async for question in questions]


def _normalize_datetime_to_utc(timestamp: datetime) -> datetime:
    if timestamp.tzinfo is None or timestamp.tzinfo.utcoffset(timestamp) is None:
        return timestamp.replace(tzinfo=timezone.utc)
    return timestamp.astimezone(timezone.utc)


def _is_cached_response_fresh(
    cached_response: CachedResponse, now_utc: Optional[datetime] = None
) -> bool:
    now_utc = now_utc or datetime.now(timezone.utc)
    cutoff = now_utc - timedelta(hours=48)
    return _normalize_datetime_to_utc(cached_response.created_at) >= cutoff


async def aget_cached_answers_for_party(
    party_id: str, cache_key: str
) -> list[CachedResponse]:
    cached_answers = async_db.collection(
        f"cached_answers/{party_id}/{cache_key}"
    ).stream()
    cached_responses = [
        CachedResponse(**cached_answer.to_dict())
        async for cached_answer in cached_answers
    ]
    now_utc = datetime.now(timezone.utc)
    return [
        cached_response
        for cached_response in cached_responses
        if _is_cached_response_fresh(cached_response, now_utc)
    ]


async def awrite_cached_answer_for_party(
    party_id: str, cache_key: str, cached_answer: CachedResponse
) -> None:
    cached_answer_ref = async_db.collection(
        f"cached_answers/{party_id}/{cache_key}"
    ).document()
    await cached_answer_ref.set(cached_answer.model_dump())


async def awrite_llm_status(is_at_rate_limit: bool) -> None:
    llm_status_ref = async_db.collection("system_status").document("llm_status")
    await llm_status_ref.set({"is_at_rate_limit": is_at_rate_limit})


# =============================================================================
# Context Methods
# =============================================================================


async def aget_contexts() -> list[Context]:
    """Get all contexts."""
    contexts = async_db.collection("contexts").stream()
    return [Context(**context.to_dict()) async for context in contexts]


async def aget_context_by_id(context_id: str) -> Optional[Context]:
    """Get a context by its ID."""
    context_ref = async_db.collection("contexts").document(context_id)
    context = await context_ref.get()
    if context.exists:
        return Context(**context.to_dict())
    return None


async def aget_default_context() -> Optional[Context]:
    """Get the default context (default context id)."""
    contexts = (
        async_db.collection("contexts").document(DEFAULT_CONTEXT_ID).limit(1).stream()
    )
    async for context in contexts:
        return Context(**context.to_dict())
    return None


async def aget_parties_for_context(context_id: str) -> list[ContextParty]:
    """Get all parties for a context from the sub-collection."""
    parties = (
        async_db.collection("contexts")
        .document(context_id)
        .collection("parties")
        .stream()
    )
    return [ContextParty(**party.to_dict()) async for party in parties]


async def aget_party_for_context(
    context_id: str, party_id: str
) -> Optional[ContextParty]:
    """Get a specific party from the context's sub-collection."""
    party_ref = (
        async_db.collection("contexts")
        .document(context_id)
        .collection("parties")
        .document(party_id)
    )
    party = await party_ref.get()
    if party.exists:
        return ContextParty(**party.to_dict())
    return None
