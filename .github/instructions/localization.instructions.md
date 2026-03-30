---
applyTo: "**/localization/messages/**/*.json"
---

# Localization File Review Guidelines

## When to Engage

**Review is required ONLY when `en.json` has changes** — specifically:
- A new key is **added** to `en.json`
- An existing key's value is **modified** in `en.json`

If `en.json` has no additions or modifications, **do not review or comment on any localization files**.

## Required Action When `en.json` Changes

### New key added to `en.json`

If a key was **added** to `en.json` but the other locale JSON files do **not yet contain that key**, suggest that the user runs the `build:community-localization` script first (from the `devextreme` package) before providing translations:

```bash
cd packages/devextreme
pnpm run build:community-localization
```

This script propagates new keys from `en.json` into all other locale files (with the English value as a placeholder). Once the key is present in all files, translations can be provided for each locale.

### Modified key in `en.json`

For every key that is **modified** in `en.json`, provide updated translations for **all other locale JSON files** in the same directory.

### Translation Quality Standards

- Always align translations with **official Microsoft UX terminology** for that language (e.g., use the same phrasing as Microsoft Office, Windows, or Azure UI in the target language).
- Where Microsoft standards are not applicable, defer to widely accepted **native-language dictionary and UX conventions** for the target locale.
- Preserve the **tone and register** of the source string (e.g., if the English string is a button label, use a concise imperative form in the target language).
- Do **not** translate placeholders, variable tokens, or format specifiers (e.g., `{0}`, `%s`).

## Absolute Prohibitions - You MUST NOT:

- ❌ NEVER review or comment on localization files when `en.json` is unchanged
- ❌ NEVER suggest removing existing message keys from any locale file
- ❌ NEVER provide language-specific style recommendations unrelated to a changed key
- ❌ NEVER comment on language consistency for keys that were not changed in `en.json`

## The ONLY Acceptable Comments (outside of `en.json` changes):

✅ Critical JSON syntax errors that would break the build (missing commas, unclosed brackets)

## Examples

**Trigger (change in `en.json`):**
```json
"dxDataGrid-exportAll": "Export all data"
```

**Expected action:** Add or update `"dxDataGrid-exportAll"` in every other locale file (`de.json`, `fr.json`, `ja.json`, etc.) using Microsoft-aligned UX terminology for each language.

**No trigger (no change in `en.json`):** Do not comment on any locale file, regardless of what other files contain.

If you have ANY doubt about whether a key changed in `en.json`, DO NOT COMMENT on the locale files.
