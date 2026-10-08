#!/usr/bin/env node
// Counts the strict ESLint errors and warnings of `m_` files: what a file gets once the `m_` prefix is gone.
//
//   node .claude/skills/typing-m-files/scripts/strict-lint.mjs <file> ... [--summary] [--errors] [--json] [--check]
//
// A <file> is given in either form (one argument may hold several lines, one file per line):
//   path/m_x.ts   or   path/m_x.ts:1-542
//   '`path/m_x.ts`'   or   '`path/m_x.ts`, lines 1–542 (part 1 of 4: …)'   (a checklist line; a leading `- [ ] ` is fine)
// Quote the second form in single quotes, or the shell runs the backticks.
// Paths may be absolute, relative to the current directory, to the repo root or to packages/devextreme.
// A range limits the count to those lines (a part of a split file).
// --summary  counts only, no message list
// --errors   list error messages only (warnings are still counted)
// --json     machine-readable output
// --check    exit code 1 when any file (or range) still has strict errors (warnings don't fail it)
//
// The strict rules are not hard-coded: for every file, the script asks ESLint for the config of its
// strict twin (same path, basename without `m_`, `module*` folders renamed) and applies the rules that
// differ. So the count follows `packages/devextreme/eslint.config.mjs` as it changes.
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const PKG = path.join(REPO, 'packages/devextreme');
const { ESLint } = createRequire(path.join(PKG, 'package.json'))('eslint');

// Kept on purpose by the typing plan, not part of the typing work.
const KEPT = new Set(['spellcheck/spell-checker', 'max-classes-per-file', 'simple-import-sort/imports']);

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const specs = args.filter((a) => !a.startsWith('--'));
if (specs.length === 0) {
  console.error('usage: strict-lint.mjs <file>[:from-to] | \'`<file>`, lines <from>–<to>\' ... [--summary] [--errors] [--json] [--check]');
  process.exit(2);
}

const resolveFile = (p) => {
  const candidates = path.isAbsolute(p) ? [p] : [path.resolve(p), path.join(REPO, p), path.join(PKG, p)];
  return candidates.find((c) => existsSync(c));
};

// `path`, `path:1-542`, or a checklist line: `- [ ] \`path\`, lines 1–542 (part 1 of 4: …)`
const parseSpec = (spec) => {
  const text = spec.trim().replace(/^- \[[ xX]\]\s*/, '');
  const quoted = /^`([^`]+)`(?:,\s*lines\s+(\d+)\s*[–-]\s*(\d+))?/.exec(text);
  const plain = /^(.*?)(?::(\d+)\s*[–-]\s*(\d+))?$/.exec(text);
  const [, file, from, to] = quoted ?? plain;
  return { file, from, to };
};

const targets = specs.flatMap((s) => s.split('\n')).filter((s) => s.trim()).map((spec) => {
  const { file, from, to } = parseSpec(spec);
  const abs = resolveFile(file);
  if (!abs) {
    console.error(`not found: ${file} (from "${spec.trim()}")`);
    process.exit(2);
  }
  const rel = path.relative(PKG, abs).split(path.sep).join('/');
  const ranged = from !== undefined;
  return { spec, abs, rel, from: ranged ? Number(from) : 1, to: ranged ? Number(to) : Infinity, ranged };
});

const twinOf = (rel) => {
  const parts = rel.split('/');
  const base = parts.pop().replace(/^m_/, '');
  const dirs = parts.map((d) => (/^module/.test(d) ? `twin_${d}` : d));
  return [...dirs, base].join('/');
};

const probe = new ESLint({ cwd: PKG });
const overrideConfig = [];
for (const t of targets) {
  const own = (await probe.calculateConfigForFile(t.rel)).rules;
  const strict = (await probe.calculateConfigForFile(twinOf(t.rel))).rules;
  const rules = {};
  for (const [rule, value] of Object.entries(strict)) {
    if (JSON.stringify(value) !== JSON.stringify(own[rule])) {
      rules[rule] = value;
    }
  }
  if (Object.keys(rules).length > 0) {
    overrideConfig.push({ files: [t.rel], rules });
  }
}

const eslint = new ESLint({ cwd: PKG, overrideConfig });
const results = await eslint.lintFiles([...new Set(targets.map((t) => t.rel))]);
const byFile = new Map(results.map((r) => [path.relative(PKG, r.filePath).split(path.sep).join('/'), r]));

const isStrict = (m) => m.severity === 2 && m.ruleId && !KEPT.has(m.ruleId);
const isWarning = (m) => m.severity === 1 && m.ruleId && !KEPT.has(m.ruleId);
const shortRule = (id) => id.replace('@typescript-eslint/', 'ts/').replace('@stylistic/', '');

const report = targets.map((t) => {
  const r = byFile.get(t.rel);
  const inRange = (m) => m.line >= t.from && m.line <= t.to;
  const errors = r.messages.filter(isStrict);
  const ranged = errors.filter(inRange);
  const fatal = r.messages.filter((m) => m.fatal || (!m.ruleId && m.severity === 2));
  const warnings = r.messages.filter(isWarning);
  const rangedWarnings = warnings.filter(inRange);
  const other = r.messages.filter((m) => !m.ruleId && m.severity === 1);
  const countByRule = (list) => {
    const byRule = {};
    for (const m of list) {
      byRule[m.ruleId] = (byRule[m.ruleId] ?? 0) + 1;
    }
    return Object.fromEntries(Object.entries(byRule).sort((a, b) => b[1] - a[1]));
  };
  const toMessage = (m) => ({ line: m.line, column: m.column, rule: m.ruleId, message: m.message });
  return {
    file: `packages/devextreme/${t.rel}`,
    from: t.from,
    to: t.ranged ? t.to : readFileSync(t.abs, 'utf8').split('\n').length,
    ranged: t.ranged,
    errors: ranged.length,
    errorsInFile: errors.length,
    warnings: rangedWarnings.length,
    warningsInFile: warnings.length,
    suppressed: (r.suppressedMessages ?? []).filter(isStrict).filter(inRange).length,
    byRule: countByRule(ranged),
    warningsByRule: countByRule(rangedWarnings),
    messages: ranged.map(toMessage),
    warningMessages: rangedWarnings.map(toMessage),
    fatal: fatal.map((m) => `${m.line}:${m.column} ${m.message}`),
    notes: other.map((m) => m.message),
  };
});

if (flags.has('--json')) {
  console.log(JSON.stringify(report, null, 1));
} else {
  for (const f of report) {
    console.log(f.ranged ? `\`${f.file}\`, lines ${f.from}–${f.to}` : `\`${f.file}\``);
    const inFile = (n) => (f.ranged ? ` (${n} in the whole file)` : '');
    console.log(`  strict errors: ${f.errors}${inFile(f.errorsInFile)}; hidden by inline disables: ${f.suppressed}`);
    console.log(`  warnings: ${f.warnings}${inFile(f.warningsInFile)}`);
    for (const x of f.fatal) {
      console.log(`  FATAL ${x}`);
    }
    for (const x of f.notes) {
      console.log(`  note: ${x}`);
    }
    const rules = (byRule) => Object.entries(byRule).map(([k, v]) => `${shortRule(k)} ${v}`).join(', ');
    if (f.errors > 0) {
      console.log(`  errors by rule: ${rules(f.byRule)}`);
    }
    if (f.warnings > 0) {
      console.log(`  warnings by rule: ${rules(f.warningsByRule)}`);
    }
    if (!flags.has('--summary')) {
      for (const m of f.messages) {
        console.log(`  ${m.line}:${m.column}  error  ${shortRule(m.rule)}  ${m.message}`);
      }
      if (!flags.has('--errors')) {
        for (const m of f.warningMessages) {
          console.log(`  ${m.line}:${m.column}  warn   ${shortRule(m.rule)}  ${m.message}`);
        }
      }
    }
  }
  if (report.length > 1) {
    const sum = (key) => report.reduce((a, f) => a + f[key], 0);
    console.log(`total: ${sum('errors')} strict errors, ${sum('warnings')} warnings`);
  }
}

if (flags.has('--check') && report.some((f) => f.errors > 0 || f.fatal.length > 0)) {
  process.exit(1);
}
