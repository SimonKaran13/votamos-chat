# SPDX-FileCopyrightText: 2025 2025 wahl.chat
#
# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0

from typing import Literal

from pydantic import BaseModel, Field


def create_party_list_generator(valid_party_ids: list[str]) -> type[BaseModel]:
    """
    Create a PartyListGenerator model with dynamic party IDs.

    Args:
        valid_party_ids: List of valid party IDs for the current context.

    Returns:
        A Pydantic model class with party_id_list constrained to valid IDs.
    """
    if not valid_party_ids:
        raise ValueError("valid_party_ids must not be empty")

    # Create a Literal type from the valid party IDs
    party_id_literal = Literal[tuple(valid_party_ids)]  # type: ignore[valid-type]

    class DynamicPartyListGenerator(BaseModel):
        """Output of the Party List Generator."""

        party_id_list: list[party_id_literal] = Field(  # type: ignore[valid-type]
            description=f"Lista de IDs de partidos de los que el usuario quiere una respuesta. Valores válidos: {', '.join(valid_party_ids)}"
        )

    return DynamicPartyListGenerator


class RAG(BaseModel):
    """Output of the RAG Chain."""

    chat_answer: str = Field(
        description="Tu respuesta breve a la pregunta del usuario en formato Markdown con resaltados y párrafos."
    )
    chat_title: str = Field(
        description="El título corto del chat en texto plano. Debe describir el chat de forma breve y concisa en 3-5 palabras."
    )


class QuickReplyGenerator(BaseModel):
    """Output of the Quick Reply Generator."""

    quick_replies: list[str] = Field(
        description="Lista de las tres respuestas rápidas como strings."
    )


class QuestionTypeClassifier(BaseModel):
    """Output of the Question Type Classifier."""

    non_party_specific_question: str = Field(
        description="La pregunta que hizo el usuario, pero formulada como si estuviera dirigida directamente a un partido."
    )
    is_comparing_question: bool = Field(
        description="True si es una pregunta de comparación explícita, de lo contrario False."
    )


class ChatSummaryGenerator(BaseModel):
    """Output of the Chat Summary Generator."""

    chat_summary: str = Field(
        description="Las preguntas guía más importantes que fueron respondidas por los partidos."
    )


class GroupChatTitleQuickReplyGenerator(BaseModel):
    """Output of the Chat Title & Quick Reply Generator."""

    chat_title: str = Field(
        description="Un título corto que describe el chat de forma breve y concisa en 3-5 palabras."
    )
    quick_replies: list[str] = Field(
        description="Lista de las tres respuestas rápidas como strings."
    )


class RerankingOutput(BaseModel):
    """Output of the Reranking Model."""

    reranked_doc_indices: list[int] = Field(
        description="Lista de índices de documentos ordenada de mayor a menor utilidad"
    )
