import {
  diffGenerated,
  diffNames,
  findLostConsumed,
  parseDeclarations,
  renderPreamble,
  renderReport,
  renderTerminal,
  type GeneratedOutput,
  type Report,
} from '../tools/tokens/report';

const declarations = (entries: Record<string, string>): Map<string, string> => new Map(
  Object.entries(entries),
);

const generated = (files: Record<string, Record<string, string>>): GeneratedOutput => new Map(
  Object.entries(files).map(([file, entries]) => [file, declarations(entries)]),
);

const refs = (file: string, count: number): { file: string; name: string }[] => Array.from(
  { length: count },
  (_, index) => ({ file, name: `--dxds-${file.replace('.scss', '')}-${index}` }),
);

/*
 * One section of the terminal view as data. The layout is spelled out here and nowhere else, so an
 * expectation can be about what the section says rather than about how many spaces a line starts
 * with — and it still fails when the layout moves, because a tally printed at the entry indent
 * parses as the last file's entry and leaves `omitted` at zero.
 */
const grouped = (rendered: string, heading: string): {
  files: { file: string; names: string[] }[];
  omitted: number;
  filesNotShown: number;
} => {
  const lines = rendered.split('\n');
  const start = lines.indexOf(heading);

  if (start === -1) {
    throw new Error(`no section headed ${heading}`);
  }

  const files: { file: string; names: string[] }[] = [];
  let omitted = 0;
  let filesNotShown = 0;

  lines.slice(start + 1, lines.indexOf('', start + 1)).forEach((line) => {
    const tally = /^ {2}… and (\d+) more(?:, (\d+) file\(s\) not shown)?$/.exec(line);
    const current = files.at(-1);

    if (tally) {
      omitted = Number(tally[1]);
      filesNotShown = Number(tally[2] ?? 0);
    } else if (!line.startsWith('    ')) {
      files.push({ file: line.trim(), names: [] });
    } else if (current) {
      /* An entry line carries the name first; a value change pads it out to the column width. */
      current.names.push(line.trim().split(/\s{2,}/)[0]);
    } else {
      throw new Error(`entry with no file above it: ${line}`);
    }
  });

  return { files, omitted, filesNotShown };
};

const report = (overrides: Partial<Report> = {}): Report => ({
  package: '@devexpress/design-tokens-internal',
  versionBefore: '262.23.0',
  versionAfter: '262.24.0',
  countBefore: 2,
  countAfter: 3,
  names: { added: [], removed: [] },
  lostConsumed: [],
  output: { changed: [], gone: [], appeared: [] },
  ...overrides,
});

describe('parseDeclarations', () => {
  it('reads every declaration of a generated file, minified or not', () => {
    expect([...parseDeclarations(':root {\n  --dxds-color-bg: #242424;\n}\n')]).toEqual([
      ['--dxds-color-bg', '#242424'],
    ]);
    expect([...parseDeclarations(':root{--dxds-a:1rem;--dxds-b:2rem}')]).toEqual([
      ['--dxds-a', '1rem'],
      ['--dxds-b', '2rem'],
    ]);
  });

  it('keeps a reference as the value but does not mistake a read for a declaration', () => {
    const parsed = parseDeclarations(
      '--dxds-color-bg: var(--dxds-neutral-250);\ncolor: var(--dxds-color-content);',
    );

    expect([...parsed]).toEqual([['--dxds-color-bg', 'var(--dxds-neutral-250)']]);
  });

  it('ignores properties outside the token namespace', () => {
    expect([...parseDeclarations('--dx-button-bg: red;\ncolor: blue;')]).toEqual([]);
  });
});

describe('diffNames', () => {
  it('reports what appeared and what is gone, sorted and deduplicated', () => {
    expect(diffNames(['b:x', 'a:y', 'a:y'], ['a:y', 'c:z'])).toEqual({
      added: ['c:z'],
      removed: ['b:x'],
    });
  });

  it('says nothing when the package did not move', () => {
    expect(diffNames(['a', 'b'], ['b', 'a'])).toEqual({ added: [], removed: [] });
  });
});

describe('findLostConsumed', () => {
  it('lists the names the theme reads that the package no longer offers', () => {
    expect(findLostConsumed(['color-bg', 'spacing-40'], new Set(['spacing-40']))).toEqual([
      'color-bg',
    ]);
  });

  it('is empty when every consumed name survived', () => {
    expect(findLostConsumed(['color-bg'], new Set(['color-bg', 'spacing-40']))).toEqual([]);
  });
});

describe('diffGenerated', () => {
  it('separates a moved value from a name that left and a name that arrived', () => {
    const before = generated({ 'dark.scss': { '--dxds-a': '1rem', '--dxds-b': '2rem' } });
    const after = generated({ 'dark.scss': { '--dxds-a': '3rem', '--dxds-c': '4rem' } });

    expect(diffGenerated(before, after)).toEqual({
      changed: [{
        file: 'dark.scss', name: '--dxds-a', was: '1rem', now: '3rem',
      }],
      gone: [{ file: 'dark.scss', name: '--dxds-b' }],
      appeared: [{ file: 'dark.scss', name: '--dxds-c' }],
    });
  });

  it('counts a whole file as gone or arrived', () => {
    const before = generated({ 'dropped.scss': { '--dxds-a': '1rem' } });
    const after = generated({ 'added.scss': { '--dxds-b': '2rem' } });

    expect(diffGenerated(before, after)).toEqual({
      changed: [],
      gone: [{ file: 'dropped.scss', name: '--dxds-a' }],
      appeared: [{ file: 'added.scss', name: '--dxds-b' }],
    });
  });

  it('holds its peace when nothing moved', () => {
    const output = generated({ 'light.scss': { '--dxds-a': '1rem' } });

    expect(diffGenerated(output, generated({ 'light.scss': { '--dxds-a': '1rem' } }))).toEqual({
      changed: [],
      gone: [],
      appeared: [],
    });
  });

  /* Two modes declare the same name, and a value moving in one of them is not the other's news. */
  it('keeps files apart and orders the findings by file, then by name', () => {
    const before = generated({
      'light.scss': { '--dxds-a': '1rem' },
      'dark.scss': { '--dxds-b': '2rem', '--dxds-a': '1rem' },
    });
    const after = generated({
      'light.scss': { '--dxds-a': '1rem' },
      'dark.scss': { '--dxds-b': '9rem', '--dxds-a': '8rem' },
    });

    expect(diffGenerated(before, after).changed).toEqual([
      {
        file: 'dark.scss', name: '--dxds-a', was: '1rem', now: '8rem',
      },
      {
        file: 'dark.scss', name: '--dxds-b', was: '2rem', now: '9rem',
      },
    ]);
  });
});

describe('renderReport', () => {
  it('opens with the versions and the counts', () => {
    expect(renderReport(report())).toContain(
      '# @devexpress/design-tokens-internal: 262.23.0 → 262.24.0',
    );
    expect(renderReport(report())).toContain('| tokens | 2 | 3 |');
  });

  /* Nothing moved from one version to another when only one version is involved. */
  it('heads a run over an unchanged version as a state, not a transition', () => {
    const rendered = renderReport(report({ versionBefore: '262.23.0', versionAfter: '262.23.0' }));

    expect(rendered).toContain('# @devexpress/design-tokens-internal 262.23.0');
    expect(rendered).not.toContain('→');
  });

  it('marks an empty section instead of leaving it blank', () => {
    expect(renderReport(report())).toContain('## Values that moved in the generated output (0)\n\n_none_');
  });

  it('prints a moved value with both sides', () => {
    const rendered = renderReport(report({
      output: {
        changed: [{
          file: 'dark.scss', name: '--dxds-a', was: '1rem', now: '3rem',
        }],
        gone: [],
        appeared: [],
      },
    }));

    expect(rendered).toContain('- `dark.scss`: `--dxds-a`\n  - was: `1rem`\n  - now: `3rem`');
  });

  it('says what a lost token costs, in the words of the build that will refuse it', () => {
    expect(renderReport(report({ lostConsumed: ['color-bg'] })))
      .toContain('- `color-bg` — the token build will refuse to run');
  });

  /* The closing line is the call to re-record etalons: it belongs to runs that changed pixels. */
  it('adds the etalon warning only when something moved or left', () => {
    const warning = 'etalon screenshots';

    expect(renderReport(report())).not.toContain(warning);
    expect(renderReport(report({ names: { added: ['a'], removed: ['b'] } }))).not.toContain(warning);
    expect(renderReport(report({
      output: {
        changed: [{
          file: 'dark.scss', name: '--dxds-a', was: '1rem', now: '3rem',
        }],
        gone: [],
        appeared: [],
      },
    }))).toContain(warning);
    expect(renderReport(report({
      output: { changed: [], gone: [{ file: 'dark.scss', name: '--dxds-a' }], appeared: [] },
    }))).toContain(warning);
  });

  /* A name that only arrived costs nothing to look at, so it must not raise the alarm. */
  it('treats an added name as free', () => {
    expect(renderReport(report({
      output: { changed: [], gone: [], appeared: [{ file: 'dark.scss', name: '--dxds-c' }] },
    }))).not.toContain('etalon screenshots');
  });
});

describe('renderTerminal', () => {
  const change = (name: string, file = 'dark.scss'): {
    file: string; name: string; was: string; now: string;
  } => ({
    file, name, was: '1rem', now: '2rem',
  });

  it('leads with the versions and the size of the move', () => {
    const rendered = renderTerminal(report({
      countBefore: 16822,
      countAfter: 17004,
      names: { added: ['a', 'b'], removed: ['c'] },
    }));

    expect(rendered).toContain('@devexpress/design-tokens-internal 262.23.0 → 262.24.0');
    expect(rendered).toContain('tokens 16822 → 17004  (+2 −1)');
  });

  /* Four empty sections are what makes the markdown unreadable in a terminal. */
  it('says only what happened, and says so when nothing did', () => {
    const quiet = renderTerminal(report());

    expect(quiet).toContain('nothing moved in the generated output');
    expect(quiet).not.toContain('values that moved');
    expect(quiet).not.toContain('gone from the generated output');
  });

  it('names the file once and lines the names up under it', () => {
    const rendered = renderTerminal(report({
      output: {
        changed: [change('--dxds-a'), change('--dxds-longer-name'), change('--dxds-b', 'light.scss')],
        gone: [],
        appeared: [],
      },
    }));

    expect(rendered).toContain('  dark.scss\n'
      + '    --dxds-a            1rem → 2rem\n'
      + '    --dxds-longer-name  1rem → 2rem');
    expect(rendered).toContain('  light.scss\n    --dxds-b  1rem → 2rem');
  });

  /* A bump can add thousands of names; the terminal is not where that list belongs. */
  it('caps a long section and says how much it left out', () => {
    const rendered = renderTerminal(report({
      output: { changed: [], gone: [], appeared: refs('base.scss', 9) },
    }), { limit: 4 });

    expect(grouped(rendered, 'new in the generated output (9)')).toEqual({
      files: [{
        file: 'base.scss',
        names: ['--dxds-base-0', '--dxds-base-1', '--dxds-base-2', '--dxds-base-3'],
      }],
      omitted: 5,
      filesNotShown: 0,
    });
  });

  /*
   * Several files is what tells the two readings of the limit apart. One file hides the difference:
   * its header shifts what is shown and what is counted by the same one, so a cap taken on the
   * printed lines comes out right by accident. Here the budget is four entries, the second file
   * has to keep the header that carries them, and five entries are left over — not seven lines.
   */
  it('caps entries rather than the lines they are printed as', () => {
    const rendered = renderTerminal(report({
      output: {
        changed: [],
        gone: [],
        appeared: [...refs('base.scss', 3), ...refs('light.scss', 6)],
      },
    }), { limit: 4 });

    expect(grouped(rendered, 'new in the generated output (9)')).toEqual({
      files: [
        { file: 'base.scss', names: ['--dxds-base-0', '--dxds-base-1', '--dxds-base-2'] },
        { file: 'light.scss', names: ['--dxds-light-0'] },
      ],
      omitted: 5,
      filesNotShown: 0,
    });
  });

  /*
   * The budget can run out before a file is reached at all. The tally is then not the last printed
   * file's remainder, and saying so is the difference between "one long file was cut short" and
   * "there is another file here you cannot see".
   */
  it('says when the cap left whole files out of the section', () => {
    const rendered = renderTerminal(report({
      output: {
        changed: [],
        gone: [],
        appeared: [...refs('base.scss', 3), ...refs('light.scss', 1), ...refs('dark.scss', 5)],
      },
    }), { limit: 4 });

    expect(grouped(rendered, 'new in the generated output (9)')).toEqual({
      files: [
        { file: 'base.scss', names: ['--dxds-base-0', '--dxds-base-1', '--dxds-base-2'] },
        { file: 'light.scss', names: ['--dxds-light-0'] },
      ],
      omitted: 5,
      filesNotShown: 1,
    });
  });

  it('puts a lost token first and says what it will cost', () => {
    const rendered = renderTerminal(report({ lostConsumed: ['color-bg'] }));

    expect(rendered).toContain('the theme reads 1 name(s) this package no longer has');
    expect(rendered).toContain('    color-bg');
    expect(rendered).toContain('the token build will refuse to run');
    expect(rendered).not.toContain('nothing moved in the generated output');
  });

  it('calls for the etalons only when the pixels are at stake', () => {
    const etalons = 're-record the etalon screenshots';

    expect(renderTerminal(report({ names: { added: ['a'], removed: [] } }))).not.toContain(etalons);
    expect(renderTerminal(report({
      output: { changed: [change('--dxds-a')], gone: [], appeared: [] },
    }))).toContain(etalons);
  });

  it('paints nothing unless asked', () => {
    const plain = renderTerminal(report({ output: { changed: [change('--dxds-a')], gone: [], appeared: [] } }));
    const painted = renderTerminal(
      report({ output: { changed: [change('--dxds-a')], gone: [], appeared: [] } }),
      { color: true },
    );

    // eslint-disable-next-line no-control-regex
    expect(plain).not.toMatch(/\u001B\[/);
    // eslint-disable-next-line no-control-regex
    expect(painted).toMatch(/\u001B\[/);
  });

  it('heads an unchanged version without a transition', () => {
    expect(renderTerminal(report({ versionBefore: '262.23.0', versionAfter: '262.23.0' })))
      .toContain('@devexpress/design-tokens-internal 262.23.0\ntokens');
  });
});

describe('renderPreamble', () => {
  /* Printed while the rebuild is still ahead, so it must not pretend to know how it went. */
  it('says what is known before the rebuild and stops there', () => {
    const rendered = renderPreamble(report({
      lostConsumed: ['color-none'],
      output: {
        changed: [{
          file: 'dark.scss', name: '--dxds-a', was: '1rem', now: '2rem',
        }],
        gone: [],
        appeared: [],
      },
    }));

    expect(rendered).toContain('262.23.0 → 262.24.0');
    expect(rendered).toContain('the theme reads 1 name(s) this package no longer has');
    expect(rendered).toContain('    color-none');
    expect(rendered).not.toContain('values that moved');
    expect(rendered).not.toContain('nothing moved in the generated output');
  });

  it('is the head of the terminal report, not a second version of it', () => {
    const full = report({ output: { changed: [], gone: [], appeared: [] } });

    expect(renderTerminal(full).startsWith(renderPreamble(full))).toBe(true);
  });
});
