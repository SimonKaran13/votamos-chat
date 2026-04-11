# SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0

import logging
import os
from typing import AsyncIterator, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import AzureChatOpenAI, ChatOpenAI
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages.base import BaseMessage, BaseMessageChunk
from pydantic import BaseModel
from src.firebase_service import awrite_llm_status
from src.models.general import LLM, LLMSize
from src.utils import load_env, safe_load_api_key

load_env()

logger = logging.getLogger(__name__)

RATE_LIMIT_ERROR_PATTERNS = (
    "429",
    "rate limit",
    "rate_limit",
    "resource exhausted",
    "too many requests",
    "quota exceeded",
)

def _azure_configured() -> bool:
    return bool(
        os.getenv("AZURE_OPENAI_ENDPOINT")
        and os.getenv("AZURE_OPENAI_API_KEY")
        and os.getenv("OPENAI_API_VERSION")
    )


def _google_configured() -> bool:
    return bool(os.getenv("GOOGLE_API_KEY"))


def _openai_configured() -> bool:
    return bool(os.getenv("OPENAI_API_KEY"))


def _build_llm(
    name: str,
    model: Optional[BaseChatModel],
    sizes: list[LLMSize],
    priority: int,
    premium_only: bool = False,
    back_up_only: bool = False,
) -> Optional[LLM]:
    if model is None:
        return None
    return LLM(
        name=name,
        model=model,
        sizes=sizes,
        priority=priority,
        is_at_rate_limit=False,
        premium_only=premium_only,
        back_up_only=back_up_only,
    )


azure_gpt_4o = (
    AzureChatOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        deployment_name="gpt-4o-2024-08-06",
        openai_api_version=os.getenv("OPENAI_API_VERSION"),
        api_key=safe_load_api_key("AZURE_OPENAI_API_KEY"),
        max_retries=0,
    )
    if _azure_configured()
    else None
)

azure_gpt_4o_mini = (
    AzureChatOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        deployment_name="gpt-4o-mini-2024-07-18",
        openai_api_version=os.getenv("OPENAI_API_VERSION"),
        api_key=safe_load_api_key("AZURE_OPENAI_API_KEY"),
        max_retries=0,
    )
    if _azure_configured()
    else None
)

google_gemini_2_flash = (
    ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        api_key=safe_load_api_key("GOOGLE_API_KEY"),
        max_retries=0,
    )
    if _google_configured()
    else None
)

google_gemini_3_flash_preview = (
    ChatGoogleGenerativeAI(
        model="gemini-3-flash-preview",
        api_key=safe_load_api_key("GOOGLE_API_KEY"),
        max_retries=0,
        temperature=1.0,
        thinking_level="low",
    )
    if _google_configured()
    else None
)

google_gemini_2_5_flash = (
    ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        api_key=safe_load_api_key("GOOGLE_API_KEY"),
        max_retries=0,
        thinking_budget=0,
    )
    if _google_configured()
    else None
)

openai_gpt_4o = (
    ChatOpenAI(
        model="gpt-4o-2024-08-06",
        api_key=safe_load_api_key("OPENAI_API_KEY"),
        max_retries=0,
    )
    if _openai_configured()
    else None
)

openai_gpt_4o_mini = (
    ChatOpenAI(
        model="gpt-4o-mini",
        api_key=safe_load_api_key("OPENAI_API_KEY"),
        max_retries=0,
    )
    if _openai_configured()
    else None
)

RESPONSE_GENERATION_LLMS: list[LLM] = [
    llm
    for llm in [
        _build_llm(
            "google-gemini-3.0-flash-preview",
            google_gemini_3_flash_preview,
            [LLMSize.SMALL, LLMSize.LARGE],
            100,
        ),
        _build_llm(
            "google-gemini-2.5-flash",
            google_gemini_2_5_flash,
            [LLMSize.SMALL, LLMSize.LARGE],
            95,
        ),
        _build_llm(
            "google-gemini-2.0-flash",
            google_gemini_2_flash,
            [LLMSize.SMALL, LLMSize.LARGE],
            92,
        ),
        _build_llm(
            "azure-gpt-4o",
            azure_gpt_4o,
            [LLMSize.LARGE],
            90,
            premium_only=True,
        ),
        _build_llm(
            "openai-gpt-4o",
            openai_gpt_4o,
            [LLMSize.LARGE],
            60,
        ),
        _build_llm(
            "azure-gpt-4o-mini",
            azure_gpt_4o_mini,
            [LLMSize.SMALL],
            50,
        ),
        _build_llm(
            "openai-gpt-4o-mini",
            openai_gpt_4o_mini,
            [LLMSize.SMALL],
            40,
        ),
    ]
    if llm is not None
]

azure_gpt_4o_mini_det = (
    AzureChatOpenAI(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        deployment_name="gpt-4o-mini-2024-07-18",
        openai_api_version=os.getenv("OPENAI_API_VERSION"),
        api_key=safe_load_api_key("AZURE_OPENAI_API_KEY"),
        temperature=0.0,
        max_retries=0,
    )
    if _azure_configured()
    else None
)

google_gemini_2_5_flash_lite_det = (
    ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite",
        api_key=safe_load_api_key("GOOGLE_API_KEY"),
        temperature=0.0,
        max_retries=0,
    )
    if _google_configured()
    else None
)

google_gemini_2_flash_det = (
    ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        api_key=safe_load_api_key("GOOGLE_API_KEY"),
        temperature=0.0,
        max_retries=0,
    )
    if _google_configured()
    else None
)

openai_gpt_4o_mini_det = (
    ChatOpenAI(
        model="gpt-4o-mini",
        api_key=safe_load_api_key("OPENAI_API_KEY"),
        temperature=0.0,
        max_retries=0,
    )
    if _openai_configured()
    else None
)

PRE_AND_POST_PROCESSING_LLMS: list[LLM] = [
    llm
    for llm in [
        _build_llm(
            "google-gemini-2.5-flash-lite-det",
            google_gemini_2_5_flash_lite_det,
            [LLMSize.SMALL],
            100,
        ),
        _build_llm(
            "google-gemini-2.0-flash-det",
            google_gemini_2_flash_det,
            [LLMSize.SMALL, LLMSize.LARGE],
            95,
        ),
        _build_llm(
            "azure-gpt-4o-mini-det",
            azure_gpt_4o_mini_det,
            [LLMSize.SMALL],
            90,
        ),
        _build_llm(
            "openai-gpt-4o-mini-det",
            openai_gpt_4o_mini_det,
            [LLMSize.SMALL],
            80,
        ),
    ]
    if llm is not None
]


async def handle_rate_limit_hit_for_all_llms():
    await _write_global_llm_status(is_at_rate_limit=True)


async def _write_global_llm_status(is_at_rate_limit: bool) -> None:
    try:
        await awrite_llm_status(is_at_rate_limit=is_at_rate_limit)
    except Exception as error:
        logger.warning(
            "Failed to persist global LLM status %s: %s",
            is_at_rate_limit,
            error,
        )


def _is_rate_limit_error(error: Exception) -> bool:
    status_code = getattr(error, "status_code", None)
    if status_code == 429:
        return True

    response = getattr(error, "response", None)
    if getattr(response, "status_code", None) == 429:
        return True

    message = str(error).lower()
    return any(pattern in message for pattern in RATE_LIMIT_ERROR_PATTERNS)


async def get_answer_from_llms(
    llms: list[LLM], messages: list[BaseMessage]
) -> BaseMessage:
    llms = sorted(llms, key=lambda x: x.priority, reverse=True)
    back_up_llms = [llm for llm in llms if llm.back_up_only]
    llms = [llm for llm in llms if not llm.back_up_only]
    all_errors_rate_limit = True
    last_error: Optional[Exception] = None
    for llm in llms:
        try:
            logger.debug(f"Invoking LLM {llm.name}...")
            response = await llm.model.ainvoke(messages)
            llm.is_at_rate_limit = False
            await _write_global_llm_status(is_at_rate_limit=False)
            return response
        except Exception as e:
            last_error = e
            llm.is_at_rate_limit = _is_rate_limit_error(e)
            all_errors_rate_limit = all_errors_rate_limit and llm.is_at_rate_limit
            logger.warning(f"Error invoking LLM {llm.name}: {e}")
            continue

    for llm in back_up_llms:
        try:
            logger.debug(f"Invoking LLM {llm.name}...")
            response = await llm.model.ainvoke(messages)
            llm.is_at_rate_limit = False
            await _write_global_llm_status(is_at_rate_limit=False)
            return response
        except Exception as e:
            last_error = e
            llm.is_at_rate_limit = _is_rate_limit_error(e)
            all_errors_rate_limit = all_errors_rate_limit and llm.is_at_rate_limit
            logger.warning(f"Error invoking LLM {llm.name}: {e}")

    if last_error is None:
        await _write_global_llm_status(is_at_rate_limit=False)
        raise RuntimeError("No LLMs are configured.")

    if all_errors_rate_limit:
        await handle_rate_limit_hit_for_all_llms()
        raise Exception("All LLMs are at rate limit.")

    await _write_global_llm_status(is_at_rate_limit=False)
    raise last_error


async def get_structured_output_from_llms(
    llms: list[LLM], messages: list[BaseMessage], schema: dict | type
) -> dict | BaseModel:
    llms = sorted(llms, key=lambda x: x.priority, reverse=True)
    back_up_llms = [llm for llm in llms if llm.back_up_only]
    llms = [llm for llm in llms if not llm.back_up_only]
    all_errors_rate_limit = True
    last_error: Optional[Exception] = None
    for llm in llms:
        try:
            logger.debug(f"Invoking LLM {llm.name}...")
            prepared_model = llm.model.with_structured_output(schema)
            response = await prepared_model.ainvoke(messages)
            llm.is_at_rate_limit = False
            await _write_global_llm_status(is_at_rate_limit=False)
            return response
        except Exception as e:
            last_error = e
            llm.is_at_rate_limit = _is_rate_limit_error(e)
            all_errors_rate_limit = all_errors_rate_limit and llm.is_at_rate_limit
            logger.warning(f"Error invoking LLM {llm.name}: {e}")
            continue

    for llm in back_up_llms:
        try:
            logger.debug(f"Invoking LLM {llm.name}...")
            prepared_model = llm.model.with_structured_output(schema)
            response = await prepared_model.ainvoke(messages)
            llm.is_at_rate_limit = False
            await _write_global_llm_status(is_at_rate_limit=False)
            return response
        except Exception as e:
            last_error = e
            llm.is_at_rate_limit = _is_rate_limit_error(e)
            all_errors_rate_limit = all_errors_rate_limit and llm.is_at_rate_limit
            logger.warning(f"Error invoking LLM {llm.name}: {e}")

    if last_error is None:
        await _write_global_llm_status(is_at_rate_limit=False)
        raise RuntimeError("No LLMs are configured.")

    if all_errors_rate_limit:
        await handle_rate_limit_hit_for_all_llms()
        raise Exception("All LLMs are at rate limit.")

    await _write_global_llm_status(is_at_rate_limit=False)
    raise last_error


async def stream_answer_from_llms(
    llms: list[LLM],
    messages: list[BaseMessage],
    preferred_llm_size: LLMSize = LLMSize.LARGE,
    use_premium_llms: bool = False,
) -> AsyncIterator[BaseMessageChunk]:
    logger.debug(f"Preferred LLM size: {preferred_llm_size}")
    if not use_premium_llms:
        llms = [llm for llm in llms if not llm.premium_only]
    if preferred_llm_size == LLMSize.LARGE:
        large_llms = [llm for llm in llms if LLMSize.LARGE in llm.sizes]
        small_llms = [
            llm
            for llm in llms
            if LLMSize.SMALL in llm.sizes and LLMSize.LARGE not in llm.sizes
        ]
        large_llms = sorted(large_llms, key=lambda x: x.priority, reverse=True)
        small_llms = sorted(small_llms, key=lambda x: x.priority, reverse=True)
        llms = large_llms + small_llms
    elif preferred_llm_size == LLMSize.SMALL:
        small_llms = [llm for llm in llms if LLMSize.SMALL in llm.sizes]
        large_llms = [
            llm
            for llm in llms
            if LLMSize.LARGE in llm.sizes and LLMSize.SMALL not in llm.sizes
        ]
        large_llms = sorted(large_llms, key=lambda x: x.priority, reverse=True)
        small_llms = sorted(small_llms, key=lambda x: x.priority, reverse=True)
        llms = small_llms + large_llms
    else:
        raise ValueError(f"Invalid preferred LLM size: {preferred_llm_size}")
    all_errors_rate_limit = True
    last_error: Optional[Exception] = None
    for llm in llms:
        try:
            logger.debug(f"Invoking LLM {llm.name}...")
            response = llm.model.astream(messages)
            llm.is_at_rate_limit = False
            await _write_global_llm_status(is_at_rate_limit=False)
            return response
        except Exception as e:
            last_error = e
            llm.is_at_rate_limit = _is_rate_limit_error(e)
            all_errors_rate_limit = all_errors_rate_limit and llm.is_at_rate_limit
            logger.warning(f"Error invoking LLM {llm.name}: {e}")
            continue

    if last_error is None:
        await _write_global_llm_status(is_at_rate_limit=False)
        raise RuntimeError("No LLMs are configured.")

    if all_errors_rate_limit:
        await handle_rate_limit_hit_for_all_llms()
        raise Exception("All LLMs are at rate limit.")

    await _write_global_llm_status(is_at_rate_limit=False)
    raise last_error
