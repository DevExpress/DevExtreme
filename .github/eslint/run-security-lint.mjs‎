import { ESLint } from "eslint";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const CONFIG = path.resolve(ROOT, ".github/eslint/security.config.mjs");
const FORMATTER = path.resolve(ROOT, ".github/eslint/only-problems-html.mjs");
const OUTPUT = path.resolve(ROOT, "eslint-report.html");

const QUIET = true;
const EXT_GLOB = "**/*.{js,ts}"; // all js and ts files

const patterns = process.argv.slice(2);

const eslint = new ESLint({
  overrideConfigFile: CONFIG,
});
const results = await eslint.lintFiles(patterns.length ? patterns : [EXT_GLOB]);

const filtered = await filterDefinitionNotFound(results, { quiet: QUIET });

const formatterFn = (await import(pathToFileURL(FORMATTER))).default;
const html = await formatterFn(filtered, {});
await fs.writeFile(OUTPUT, html, "utf8");

process.exitCode = filtered.some(r => (r.errorCount ?? 0) > 0) ? 1 : 0;

function isDefinitionNotFound(m) {
  return typeof m?.message === "string"
    && m.message.startsWith("Definition for rule '")
    && m.message.endsWith("' was not found.");
}

function lineHasEslintDirective(line) {
  return /eslint-(disable|enable|disable-next-line|disable-line)|\/\*\s*eslint\b/i.test(line);
}

async function filterDefinitionNotFound(results, { quiet }) {
  const cache = new Map(); // filePath -> lines[]
  const out = [];

  for (const r of results) {
    const kept = [];

    for (const m of (r.messages ?? [])) {
      if (quiet && m.severity === 1) continue;

      if (isDefinitionNotFound(m)) {
        try {
          let lines = cache.get(r.filePath);
          if (!lines) {
            lines = (await fs.readFile(r.filePath, "utf8")).split(/\r?\n/);
            cache.set(r.filePath, lines);
          }
          const line = lines[(m.line ?? 1) - 1] ?? "";
          if (lineHasEslintDirective(line)) continue;
        } catch { }
      }

      kept.push(m);
    }

    const errorCount = kept.filter(x => x.severity === 2).length;
    const warningCount = kept.filter(x => x.severity === 1).length;
    out.push({ ...r, messages: kept, errorCount, warningCount });
  }

  return out;
}