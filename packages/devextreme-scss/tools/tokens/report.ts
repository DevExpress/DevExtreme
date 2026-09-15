/*
 * What a design-token package bump did, as data and as the markdown tools/tokens/update.mjs prints.
 *
 * Kept free of the file system and of `process` so both sides can use it: the update command loads
 * it through Node's type stripping, tests/tokens-report.test.ts imports it directly. The same split
 * build/tokens/consumed-tokens.ts uses.
 */

/** Custom property name -> value, as one generated file declares them. */
export type Declarations = Map<string, string>;

/** Generated file path -> its declarations. */
export type GeneratedOutput = Map<string, Declarations>;

export type NameDiff = { added: string[]; removed: string[] };

export type ValueChange = { file: string; name: string; was: string; now: string };

export type DeclarationRef = { file: string; name: string };

export type OutputDiff = {
  changed: ValueChange[];
  gone: DeclarationRef[];
  appeared: DeclarationRef[];
};

export type Report = {
  package: string;
  versionBefore: string;
  versionAfter: string;
  countBefore: number;
  countAfter: number;
  names: NameDiff;
  lostConsumed: string[];
  output: OutputDiff;
};

/*
 * Declarations only. A `var(--dxds-x)` read carries no value of its own, and counting it would
 * report a change every time an unrelated reference moved.
 */
export const parseDeclarations = (css: string): Declarations => new Map(
  [...css.matchAll(/(--dxds-[\w-]+)\s*:\s*([^;\n}]+)/g)].map(([, name, value]) => [name, value.trim()]),
);

const byCodepoint = (left: string, right: string): number => (left < right ? -1 : 1);

const missingFrom = (names: Iterable<string>, present: ReadonlySet<string>): string[] => [
  ...new Set([...names].filter((name) => !present.has(name))),
].sort(byCodepoint);

export const diffNames = (before: Iterable<string>, after: Iterable<string>): NameDiff => ({
  added: missingFrom(after, new Set(before)),
  removed: missingFrom(before, new Set(after)),
});

/** Names the theme reads that the package no longer offers — the build refuses to run on these. */
export const findLostConsumed = (
  consumed: Iterable<string>,
  available: ReadonlySet<string>,
): string[] => missingFrom(consumed, available);

const byFileThenName = (
  left: DeclarationRef,
  right: DeclarationRef,
): number => (left.file === right.file
  ? byCodepoint(left.name, right.name)
  : byCodepoint(left.file, right.file));

export const diffGenerated = (before: GeneratedOutput, after: GeneratedOutput): OutputDiff => {
  const changed: ValueChange[] = [];
  const gone: DeclarationRef[] = [];
  const appeared: DeclarationRef[] = [];

  before.forEach((declarations, file) => {
    const now = after.get(file) ?? new Map<string, string>();

    declarations.forEach((was, name) => {
      const value = now.get(name);

      if (value === undefined) {
        gone.push({ file, name });
      } else if (value !== was) {
        changed.push({ file, name, was, now: value });
      }
    });
  });

  after.forEach((declarations, file) => {
    const previously = before.get(file) ?? new Map<string, string>();

    declarations.forEach((_, name) => {
      if (!previously.has(name)) {
        appeared.push({ file, name });
      }
    });
  });

  return {
    changed: changed.sort(byFileThenName),
    gone: gone.sort(byFileThenName),
    appeared: appeared.sort(byFileThenName),
  };
};

const section = (title: string, lines: string[]): string => [
  `## ${title}`,
  '',
  lines.length ? lines.join('\n') : '_none_',
  '',
].join('\n');

const reference = ({ file, name }: DeclarationRef): string => `- \`${file}\`: \`${name}\``;

export const renderReport = (report: Report): string => {
  const { names, output } = report;

  const heading = report.versionBefore === report.versionAfter
    ? `# ${report.package} ${report.versionAfter}`
    : `# ${report.package}: ${report.versionBefore} → ${report.versionAfter}`;

  return [
    heading,
    '',
    '| | before | after |',
    '|---|---|---|',
    `| tokens | ${report.countBefore} | ${report.countAfter} |`,
    `| added | | ${names.added.length} |`,
    `| removed | | ${names.removed.length} |`,
    '',
    section(
      `Read by the theme, gone from the package (${report.lostConsumed.length})`,
      report.lostConsumed.map((name) => `- \`${name}\` — the token build will refuse to run`),
    ),
    section(
      `Values that moved in the generated output (${output.changed.length})`,
      output.changed.map(({ file, name, was, now }) => `- \`${file}\`: \`${name}\`\n`
        + `  - was: \`${was}\`\n  - now: \`${now}\``),
    ),
    section(`Gone from the generated output (${output.gone.length})`, output.gone.map(reference)),
    section(
      `New in the generated output (${output.appeared.length})`,
      output.appeared.map(reference),
    ),
    ...(output.changed.length || output.gone.length
      ? ['This is what the bump costs: values moved, so the etalon screenshots have to be '
        + 're-recorded and looked at.', '']
      : []),
  ].join('\n');
};

/*
 * The same report for a person watching it happen. Markdown belongs in a pull request; in a
 * terminal its pipes and its four `_none_` sections are noise, so this view drops what did not
 * happen, groups the values by file, and caps the long lists. update.mjs picks by `isTTY`, which
 * keeps `> report.md` markdown.
 */

export type TerminalOptions = {
  /** ANSI colour. Off by default so the output stays comparable. */
  color?: boolean;
  /** How many entries a section shows before it says how many more there are. */
  limit?: number;
};

const DEFAULT_LIMIT = 12;

const paint = (code: string, text: string, color: boolean): string => (color ? `\u001B[${code}m${text}\u001B[0m` : text);

const bold = (text: string, color: boolean): string => paint('1', text, color);
const dim = (text: string, color: boolean): string => paint('2', text, color);
const red = (text: string, color: boolean): string => paint('31', text, color);
const yellow = (text: string, color: boolean): string => paint('33', text, color);

const capped = (lines: string[], limit: number): string[] => (lines.length > limit
  ? [...lines.slice(0, limit), `    … and ${lines.length - limit} more`]
  : lines);

const pad = (text: string, width: number): string => text + ' '.repeat(Math.max(0, width - text.length));

/* Same file, several names: say the file once and line the names up under it. */
const groupByFile = <T extends DeclarationRef>(
  entries: T[],
  line: (entry: T, width: number) => string,
): string[] => {
  const files = [...new Set(entries.map(({ file }) => file))];

  return files.flatMap((file) => {
    const inFile = entries.filter((entry) => entry.file === file);
    const width = Math.max(...inFile.map(({ name }) => name.length));

    return [`  ${file}`, ...inFile.map((entry) => line(entry, width))];
  });
};

/*
 * What can be said before the rebuild: which package, how much it moved, and what the theme reads
 * that is no longer there. update.mjs prints this first, because the rebuild stops at the first
 * missing name and never gets to the rest of them.
 */
export const renderPreamble = (report: Report, options: TerminalOptions = {}): string => {
  const color = options.color ?? false;
  const limit = options.limit ?? DEFAULT_LIMIT;
  const { names } = report;
  const lines: string[] = [];

  lines.push(report.versionBefore === report.versionAfter
    ? `${bold(report.package, color)} ${report.versionAfter}`
    : `${bold(report.package, color)} ${report.versionBefore} → ${bold(report.versionAfter, color)}`);

  const delta = names.added.length || names.removed.length
    ? dim(`  (+${names.added.length} −${names.removed.length})`, color)
    : '';

  lines.push(`tokens ${report.countBefore} → ${report.countAfter}${delta}`, '');

  if (report.lostConsumed.length) {
    lines.push(red(`the theme reads ${report.lostConsumed.length} name(s) this package no longer has`, color));
    lines.push(...capped(report.lostConsumed.map((name) => `    ${name}`), limit));
    lines.push(dim('    the token build will refuse to run', color), '');
  }

  return lines.join('\n');
};

export const renderTerminal = (report: Report, options: TerminalOptions = {}): string => {
  const color = options.color ?? false;
  const limit = options.limit ?? DEFAULT_LIMIT;
  const { output } = report;
  const lines: string[] = [renderPreamble(report, options)];

  if (output.changed.length) {
    lines.push(`values that moved (${output.changed.length})`);
    lines.push(...capped(
      groupByFile(
        output.changed,
        ({ name, was, now }, width) => `    ${pad(name, width)}  ${was} → ${bold(now, color)}`,
      ),
      limit,
    ), '');
  }

  if (output.gone.length) {
    lines.push(`gone from the generated output (${output.gone.length})`);
    lines.push(...capped(groupByFile(output.gone, ({ name }) => `    ${name}`), limit), '');
  }

  if (output.appeared.length) {
    lines.push(`new in the generated output (${output.appeared.length})`);
    lines.push(...capped(groupByFile(output.appeared, ({ name }) => `    ${name}`), limit), '');
  }

  if (output.changed.length || output.gone.length) {
    lines.push(yellow('values moved — re-record the etalon screenshots and look at them', color), '');
  } else if (!report.lostConsumed.length) {
    lines.push(dim('nothing moved in the generated output', color), '');
  }

  return lines.join('\n');
};
