---
applyTo: "**/packages/devextreme/js/**/*.d.ts"
---

When helping me write code or reviewing my existing code, please follow these specific code style conventions:

1. **Acronym Casing in Identifiers:**
   - Treat all acronyms as regular words in camelCase and PascalCase
   - Capitalize only the first letter of each acronym, not the entire acronym
   - Examples:
     - ✓ `testDom` (not `testDOM`)
     - ✓ `parseHtml` (not `parseHTML`)
     - ✓ `createJsonParser` (not `createJSONParser`)
     - ✓ `apiEndpoint` (not `APIEndpoint`)
   - This applies to all acronyms regardless of length (DOM, HTML, JSON, API, etc.)

2. **JSDoc Format - Omit @type:**
   - Do not include the `@type` tag in JSDoc comments when the type is already indicated by TypeScript type annotation
   - Note: This is correct only when the type is the same in both TS annotation and JSDoc comment.

Consistently apply these conventions to all code you review, suggest, complete.
