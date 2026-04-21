---
name: fix-lint
description: Fix lint errors on files with uncommitted changes so the pre-commit hook passes. Use when the user says "fix lint", "my commit is failing on lint", "fix the linter", or when a `git commit` fails due to lint-staged / husky errors in this repo.
---

# fix-lint

Fix lint errors on changed files in this monorepo so `git commit` passes the husky pre-commit hook.

## Repo layout

This workspace contains multiple sibling repos under `/Users/simonkaran/Code/wahl-chat-oss/`:
- `wahl-chat-app/`
- `votamos-chat/`
- others

Each repo shares the same structure (`web/`, `ai-backend/`) and identical lint-staged config.

## Pre-commit setup (applies to each repo)

- Hook: `.husky/pre-commit` runs `cd web && npx lint-staged`.
- `web/package.json` lint-staged config: `"*.{js,jsx,ts,tsx}": ["next lint --file", "biome check"]`.
- `ai-backend/` is **not** part of the pre-commit hook, but `make lint-backend` runs `ruff check src/` and should still be clean before commit.

Only staged files in `web/` are checked by the hook. Unstaged changes are ignored by lint-staged but will block the commit if already staged.

## Workflow

1. **Determine the correct repo root.** Check any file path the user mentioned or that is open in the IDE — derive the repo root from that path (e.g. a file at `.../votamos-chat/web/...` means the repo root is `.../votamos-chat/`). If unclear, scan all sibling repos for changes:
   ```bash
   for d in /Users/simonkaran/Code/wahl-chat-oss/*/; do git -C "$d" status --short 2>/dev/null | grep -q . && echo "$d"; done
   ```
   Use that repo root for all subsequent commands.

2. **Find changed files.** Run `git -C <repo-root> diff --name-only --cached` (staged) plus `git -C <repo-root> diff --name-only` (unstaged). Focus only on files that are/will be staged.

3. **Scope by area:**
   - `web/**/*.{js,jsx,ts,tsx}` → Next lint + Biome (pre-commit blocker).
   - `web/**/*.{json,jsonc,css}` → Biome only if user asks (not in hook).
   - `ai-backend/**/*.py` → Ruff (not in hook, but fix if changed).

4. **Reproduce the failure first.** Run the same commands lint-staged runs, against the actual changed files:
   ```bash
   cd <repo-root>/web && bunx next lint --file <relative-path> [...]
   cd <repo-root>/web && bunx biome check <relative-path> [...]
   ```
   Pass file paths relative to `<repo-root>/web/`. Capture the real errors before attempting fixes.

5. **Auto-fix what's safe:**
   ```bash
   cd <repo-root>/web && bunx biome check --write --unsafe <files>
   cd <repo-root>/web && bunx next lint --fix --file <files>
   ```
   For Python: `cd <repo-root>/ai-backend && poetry run ruff check --fix src/<path>`.

6. **Hand-fix the rest.** Read each remaining diagnostic, open the file, and fix it. Common cases in this repo:
   - Unused imports / variables → remove.
   - `any` types from Biome's `noExplicitAny` → give the value a real type.
   - `useExhaustiveDependencies` (Biome) → add missing deps, or restructure if that would cause a loop (don't blindly suppress).
   - Tailwind class ordering / `noUnknownAtRules` → auto-fixable with Biome.
   - Do **not** add `// biome-ignore` or `// eslint-disable` comments unless the user explicitly asks. Fix the underlying issue instead.

7. **Verify.** Re-run the lint-staged commands on the same files until both exit 0. Then simulate the hook:
   ```bash
   cd <repo-root>/web && npx lint-staged
   ```
   (Only if the user has already staged their intended changes.)

7. **Report** which files were changed, which errors were auto-fixed, and which required manual edits. Don't commit unless the user asks.

## Guardrails

- Never run `git add -A` or stage files the user didn't touch.
- Never bypass the hook (`--no-verify`) — the user's intent is to pass lint, not skip it.
- If a lint error points at a real bug (e.g. a missing effect dep that would cause a stale closure), flag it to the user instead of silently "fixing" it in a way that changes runtime behavior.
- If the error is in code the user didn't change (e.g. lint rules tightened on a neighboring file that's now staged only because of a rename), ask before touching it.
