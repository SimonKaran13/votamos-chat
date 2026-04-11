# SPDX-FileCopyrightText: 2025 2025 wahl.chat
#
# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0

from src.models.context import ContextParty

WAHL_CHAT_PARTY = ContextParty(
    party_id="wahl-chat",
    name="votamos.chat",
    long_name="Asistente de votamos.chat",
    description=(
        "El asistente de votamos.chat puede responder preguntas generales sobre las elecciones presidenciales de Colombia de 2026, "
        "sobre el sistema electoral y sobre el uso de votamos.chat. "
        "Si se comparan partidos o candidaturas, responde de forma neutral y con base en fuentes."
    ),
    website_url="https://votamos.chat",
    candidate="votamos.chat",
    manifesto_url="https://votamos.chat",
    is_small_party=False,
    is_already_in_parliament=False,
)
