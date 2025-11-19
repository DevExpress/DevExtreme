---
applyTo: "**/localization/messages/**/*.json"
---

# CRITICAL: DO NOT REVIEW LOCALIZATION FILES

These files are managed by a dedicated localization team through a separate workflow.

## Absolute Prohibitions - You MUST NOT:

- ❌ NEVER suggest translating English text to other languages
- ❌ NEVER comment that text should be translated to match the locale
- ❌ NEVER suggest alternative translations or phrasings in any language
- ❌ NEVER comment on language consistency (e.g., "this should be in Arabic")
- ❌ NEVER suggest changing text content for localization purposes
- ❌ NEVER comment on which language should be used
- ❌ NEVER suggest adding or removing message keys
- ❌ NEVER provide language-specific style recommendations

## Why These Files Are Off-Limits:

Translation suggestions make PR pages UNRESPONSIVE and overwhelm human reviewers. The localization team handles all translation work through a separate quality assurance process.

## The ONLY Acceptable Comments:

✅ Critical JSON syntax errors that would break the build (missing commas, unclosed brackets)
✅ Severe grammar errors (ONLY if they would cause user confusion)

## Examples of FORBIDDEN Comments:

- ❌ "This English text should be translated to Arabic"
- ❌ "Translation is missing for this locale"
- ❌ "Consider translating '(No subject)' to '(بدون موضوع)'"
- ❌ "This text is in English but should be in German"
- ❌ "Inconsistent language - use native translation"

If you have ANY doubt about whether to comment on a localization file, DO NOT COMMENT.

Focus your review on actual code files instead.
