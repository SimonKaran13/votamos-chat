# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0

from datetime import datetime, timedelta, timezone
import importlib
from types import SimpleNamespace
from unittest.mock import AsyncMock
import sys

import pytest

from src.models.chat import CachedResponse, GroupChatSession
from src.models.context import ContextParty, DEFAULT_CONTEXT_ID
from src.models.general import LLMSize


class FakeSessionContext:
    def __init__(self, session_data):
        self.session_data = session_data

    async def __aenter__(self):
        return self.session_data

    async def __aexit__(self, exc_type, exc, tb):
        return False


class FakeSio:
    def __init__(self, session_data):
        self.session_data = session_data
        self.emitted = []

    def session(self, sid: str):
        return FakeSessionContext(self.session_data)

    async def emit(self, event: str, data: dict, to: str | None = None):
        self.emitted.append((event, data, to))


def load_backend_modules(monkeypatch):
    import firebase_admin
    from firebase_admin import firestore, firestore_async
    import google.auth

    class DummyCredentials:
        def refresh(self, request):
            return None

    monkeypatch.setattr(google.auth, "default", lambda: (DummyCredentials(), None))
    monkeypatch.setattr(firebase_admin, "initialize_app", lambda *args, **kwargs: None)
    monkeypatch.setattr(firestore, "client", lambda *args, **kwargs: object())
    monkeypatch.setattr(firestore_async, "client", lambda *args, **kwargs: object())

    for module_name in [
        "src.firebase_service",
        "src.llms",
        "src.chatbot_async",
        "src.chat_service",
    ]:
        sys.modules.pop(module_name, None)

    firebase_service = importlib.import_module("src.firebase_service")
    chat_service = importlib.import_module("src.chat_service")
    return firebase_service, chat_service


def make_party(party_id: str = "pacto") -> ContextParty:
    return ContextParty(
        party_id=party_id,
        name="Pacto",
        long_name="Pacto Historico",
        website_url="https://example.com",
        candidate="Candidate",
        manifesto_url="https://example.com/manifesto",
    )


def make_chat_session(session_id: str = "session-1") -> GroupChatSession:
    return GroupChatSession(
        session_id=session_id,
        context_id=DEFAULT_CONTEXT_ID,
        chat_history=[],
        title="Test Chat",
        chat_response_llm_size=LLMSize.LARGE,
        last_quick_replies=[],
        is_cacheable=True,
    )


@pytest.mark.asyncio
async def test_generate_chat_answer_uses_frontend_flag_for_cache_read_only(
    monkeypatch,
):
    _, chat_service = load_backend_modules(monkeypatch)
    party = make_party()
    chat_session = make_chat_session()
    sio = FakeSio({"chat_sessions": {chat_session.session_id: chat_session}})

    monkeypatch.setattr(
        chat_service, "aget_parties_for_context", AsyncMock(return_value=[party])
    )
    monkeypatch.setattr(
        chat_service,
        "get_question_targets_and_type",
        AsyncMock(return_value=([party.party_id], "Pregunta libre", False)),
    )
    monkeypatch.setattr(
        chat_service,
        "generate_chat_title_and_chick_replies",
        AsyncMock(
            return_value=SimpleNamespace(quick_replies=[], chat_title="Test Chat")
        ),
    )
    monkeypatch.setattr(
        chat_service,
        "is_valid_proposed_question",
        AsyncMock(return_value=False),
    )
    fetch_mock = AsyncMock()
    monkeypatch.setattr(chat_service, "fetch_and_emit_party_response", fetch_mock)

    await chat_service.generate_chat_answer(
        sio=sio,
        sid="sid-1",
        session_id=chat_session.session_id,
        user_message_content="Pregunta libre",
        party_ids=[party.party_id],
        user_is_logged_in=False,
        is_proposed_question=True,
    )

    assert fetch_mock.await_args.kwargs["is_proposed_question"] is True
    assert fetch_mock.await_args.kwargs["allow_proposed_cache_write"] is False
    assert chat_session.is_cacheable is False


@pytest.mark.asyncio
async def test_generate_chat_answer_keeps_validated_proposed_flag(monkeypatch):
    _, chat_service = load_backend_modules(monkeypatch)
    party = make_party()
    chat_session = make_chat_session()
    sio = FakeSio({"chat_sessions": {chat_session.session_id: chat_session}})

    monkeypatch.setattr(
        chat_service, "aget_parties_for_context", AsyncMock(return_value=[party])
    )
    monkeypatch.setattr(
        chat_service,
        "get_question_targets_and_type",
        AsyncMock(return_value=([party.party_id], "Pregunta propuesta", False)),
    )
    monkeypatch.setattr(
        chat_service,
        "generate_chat_title_and_chick_replies",
        AsyncMock(
            return_value=SimpleNamespace(quick_replies=[], chat_title="Test Chat")
        ),
    )
    monkeypatch.setattr(
        chat_service,
        "is_valid_proposed_question",
        AsyncMock(return_value=True),
    )
    fetch_mock = AsyncMock()
    monkeypatch.setattr(chat_service, "fetch_and_emit_party_response", fetch_mock)

    await chat_service.generate_chat_answer(
        sio=sio,
        sid="sid-1",
        session_id=chat_session.session_id,
        user_message_content="Pregunta propuesta",
        party_ids=[party.party_id],
        user_is_logged_in=False,
        is_proposed_question=True,
    )

    assert fetch_mock.await_args.kwargs["is_proposed_question"] is True
    assert fetch_mock.await_args.kwargs["allow_proposed_cache_write"] is True
    assert chat_session.is_cacheable is True


def test_cached_response_ttl_handles_naive_datetimes(monkeypatch):
    firebase_service, _ = load_backend_modules(monkeypatch)
    now_utc = datetime(2026, 4, 13, tzinfo=timezone.utc)
    fresh_response = CachedResponse(
        content="fresh",
        created_at=(now_utc - timedelta(hours=47)).replace(tzinfo=None),
    )
    stale_response = CachedResponse(
        content="stale",
        created_at=(now_utc - timedelta(hours=49)).replace(tzinfo=None),
    )

    assert firebase_service._is_cached_response_fresh(fresh_response, now_utc) is True
    assert firebase_service._is_cached_response_fresh(stale_response, now_utc) is False
