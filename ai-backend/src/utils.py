# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0

import os
from pathlib import Path
from typing import Optional, Union
import re
import logging

from dotenv import load_dotenv
from pydantic import SecretStr
from langchain_core.documents import Document

from openai.types.chat import ChatCompletion
import xxhash

from src.models.chat import Message, Role
from src.models.context import ContextParty
from src.models.party import WAHL_CHAT_PARTY

BASE_DIR = Path(__file__).resolve().parent.parent
EXPECTED_API_NAME = "votamos-chat-api"

logger = logging.getLogger(__name__)


def load_env():
    """Load environment variables from the .env file if API_NAME is not already set to the expected value (used as an indicator of correctly provided environment variables)."""
    api_name = os.getenv("API_NAME")

    if api_name == EXPECTED_API_NAME:
        return

    if api_name is not None:
        raise ValueError(
            f"API_NAME environment variable is set to '{api_name}' but expected '{EXPECTED_API_NAME}'. "
            "Please check your environment configuration."
        )

    env_path = BASE_DIR / ".env"
    if env_path.exists():
        print(f"Loading environment variables from {env_path}...")
        load_dotenv(env_path, override=True)
        print(f"Loaded environment variables from {env_path}.")

    api_name = os.getenv("API_NAME")
    if not api_name:
        raise ValueError(
            "API_NAME environment variable not set. Please set it in your environment or .env file."
        )
    if api_name != EXPECTED_API_NAME:
        raise ValueError(
            f"API_NAME environment variable is set to '{api_name}' but expected '{EXPECTED_API_NAME}'. "
            "Please check your environment configuration or .env file."
        )


def safe_load_api_key(api_key: str) -> Optional[SecretStr]:
    key = os.getenv(api_key)
    if not key:
        return None
    return SecretStr(key)


def get_cors_allowed_origins(env: Optional[str]) -> Union[str, list[str]]:
    configured_origins = os.getenv("CORS_ALLOWED_ORIGINS")
    if configured_origins:
        return [
            origin.strip()
            for origin in configured_origins.split(",")
            if origin.strip()
        ]
    if env == "dev":
        return "*"
    else:
        return [
            "https://votamos.chat",
            "https://www.votamos.chat",
            "http://localhost:3000",
            "http://localhost:8080",
        ]


def build_chat_history_string(
    chat_history: list[Message],
    parties: list[ContextParty],
    default_assistant_name=WAHL_CHAT_PARTY.name,
) -> str:
    chat_history_string = ""
    for i, message in enumerate(chat_history):
        sender = ""
        if message.role == Role.USER:
            sender = "Usuario"
        else:
            sending_party = next(
                (party for party in parties if party.party_id == message.party_id),
                None,
            )
            if sending_party:
                sender = sending_party.name
            else:
                sender = default_assistant_name
        chat_history_string += f'{i + 1}. {sender}: "{message.content}"\n'
    return chat_history_string


def build_document_string_for_context(
    doc_num: int, doc: Document, doc_num_label="ID"
) -> str:
    return f"""{doc_num_label}: {doc_num}
- Nombre del documento: {doc.metadata.get("document_name", "desconocido")}
- Fecha de publicación: {doc.metadata.get("document_publish_date", "desconocido")}
- Contenido: "{doc.page_content}"
"""


def build_party_str(party: ContextParty):
    return f"""ID: {party.party_id}
- Abreviatura: {party.name}
- Nombre completo: {party.long_name}
- Descripción: {party.description}
- Candidatura principal en el contexto actual: {party.candidate}
- Tiene representacion parlamentaria actual: {party.is_already_in_parliament}
"""


def build_message_from_perplexity_response(response: ChatCompletion) -> Message:
    logger.debug(f"Processing raw perplexity response: {response}")
    # construct a source dict from response citations
    sources = []
    # type ignore because citations actually exists but is not typed
    for link in response.citations:  # type: ignore
        sources.append({"source": link})

    # postprocess perplexity response
    response_text = response.choices[0].message.content

    # give sources addition space before "[id]" -> " [id-1]" or "[id_1, id_2, ...]" --> " [id_1 - 1, id_2 - 1, ...]"
    def replacement(match):
        source_numbers = match.group(1).replace(", ", ",").split(",")
        new_ids = [int(num) - 1 for num in source_numbers]
        new_ids_str = ", ".join([str(num) for num in new_ids])
        # Return the modified string with a space in front
        return f" [{new_ids_str}]"

    # Match patterns like [1], [3], [5] or [1, 2, 3]
    sources_pattern = r"\[((\d+|(\d+, ))*)\]"
    response_text = re.sub(sources_pattern, replacement, response_text or "")
    logger.debug(f"Processed perplexity response text: {response_text}")

    return Message(role=Role.ASSISTANT, content=response_text, sources=sources)


def sanitize_references(text: str) -> str:
    # GPT 4o-mini sometimes references with [id1], [<1>], ... instead of [1]
    # This function sanitizes the references to [1], [2], ... by removing any non-numeric characters from the reference
    # Only matches citation-like patterns (containing digits), not markdown links like [text](url)

    def sanitize_citation(match):
        content = match.group(1)
        cleaned_content = re.sub(r"[^0-9, ]", "", content)
        return f"[{cleaned_content}]"

    # Only match brackets that contain at least one digit (citations), not followed by (url)
    # This avoids breaking markdown links like [text](url)
    citations_pattern = r"\[([^\]]*\d[^\]]*)\](?!\()"

    sanitized_text = re.sub(citations_pattern, sanitize_citation, text)
    return sanitized_text


def get_chat_history_hash_key(conversation_history_str: str) -> str:
    return xxhash.xxh64(conversation_history_str).hexdigest()


def sanitize_text_for_speech(text: str) -> str:
    """Remove markdown formatting and citations for TTS output."""
    # Remove citations like [1], [1, 2, 3]
    text = re.sub(r"\s*\[\d+(?:,\s*\d+)*\]", "", text)

    # Remove markdown bold/italic
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)  # **bold** → bold
    text = re.sub(r"\*(.+?)\*", r"\1", text)  # *italic* → italic

    # Clean up extra whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()

    logger.debug(f"Sanitized text: {text}")

    return text
