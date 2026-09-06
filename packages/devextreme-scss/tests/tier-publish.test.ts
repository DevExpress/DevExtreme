/*
 * The emitter of the fluent-next component tier (tools/naming/publish.mjs) and the pure module behind
 * it (tools/naming/tier.ts), exercised on synthetic files so every case names one rule. The real tree
 * is covered by tests/fluent-next-naming.test.ts, which reads the same module.
 */

import { stripScssComments } from '../build/tokens/consumed-tokens';
import {
  type Registries, type SourceFile,
  COLLECTOR_PATH, GENERATED_MARKER,
  byCodepoint, parseLinksFile, planPublication, renderCollector, renderPublicFile, stalePaths,
  tierRecords, useSpecFor,
} from '../tools/naming/tier';

const file = (path: string, raw: string): SourceFile => {
  const segments = path.split('/');
  return {
    path,
    folder: segments.length > 2 ? segments[1] : '',
    raw,
    stripped: stripScssComments(raw, path),
  };
};

const registries = (overrides: Partial<Registries> = {}): Registries => ({
  components: {
    badge: 'badge', menu: 'menu', menuBase: 'menu', gridBase: 'grid', icons: 'icon', overlay: 'overlay',
  },
  declarationHome: { grid: 'gridBase', menu: 'menuBase', icon: 'icons' },
  exemptFolders: {},
  systemTier: ['common', 'typography'],
  migrated: ['badge', 'menu', 'grid', 'icon', 'overlay', 'typography'],
  rootSelectors: {
    common: [':root'],
    typography: [':root'],
    icon: [':root'],
    badge: ['.dx-badge'],
    menu: ['.dx-menu', '.dx-menu-base'],
    grid: ['.dx-datagrid', '.dx-treelist'],
    overlay: ['.dx-overlay-wrapper'],
  },
  ...overrides,
});

const badge = (colors = '$badge-bg: ds.$color-primary;\n$badge-color: ds.$color-content;\n'): SourceFile[] => [
  file('fluent-next/badge/_colors.scss', colors),
  file('fluent-next/badge/_sizes.scss', '$badge-size: 16px;\n'),
];

const plan = (
  themeFiles: SourceFile[],
  existing: Record<string, string> = {},
  overrides: Partial<Registries> = {},
  baseFiles: SourceFile[] = [],
) => planPublication(themeFiles, baseFiles, registries(overrides), new Map(Object.entries(existing)));

const lines = (content: string): string[] => content.split('\n').filter((line) => line.startsWith('  --dx-'));

// ---------------------------------------------------------------------------------------------
// the generated file
// ---------------------------------------------------------------------------------------------

describe('_public.scss', () => {
  test('the @use header names the modules that declare the projected variables, in codepoint order', () => {
    expect(useSpecFor('fluent-next/badge/_public.scss', 'fluent-next/badge/_colors.scss')).toBe('colors');
    expect(useSpecFor('fluent-next/gridBase/_public.scss', 'fluent-next/gridBase/layout/aiChat/_sizes.scss'))
      .toBe('layout/aiChat/sizes');
    expect(useSpecFor('fluent-next/tabs/_public.scss', 'fluent-next/tabs/variables/_colors.scss'))
      .toBe('variables/colors');
    expect(useSpecFor('fluent-next/menu/_public.scss', 'fluent-next/menuBase/_colors.scss')).toBe('../menuBase/colors');

    const content = renderPublicFile('fluent-next/badge/_public.scss', [
      { property: '--dx-badge-size', variable: '$badge-size', sources: ['fluent-next/badge/_sizes.scss'] },
      { property: '--dx-badge-bg', variable: '$badge-bg', sources: ['fluent-next/badge/_colors.scss'] },
    ], false);
    expect(content.split('\n').slice(0, 4)).toEqual([
      GENERATED_MARKER,
      '@use "colors" as *;',
      '@use "sizes" as *;',
      '',
    ]);
  });

  test('a module with no eligible declarations is not imported', () => {
    const files = [...badge(), file('fluent-next/badge/_variables.scss', '$badge-flag: true;\n')];
    const content = plan(files).files.get('fluent-next/badge/_public.scss')!;
    expect(content).not.toContain('@use "variables"');
    expect(content).toContain('@use "colors" as *;');
    expect(content).toContain('@use "sizes" as *;');
  });

  test('the body is sorted by codepoint', () => {
    const content = renderPublicFile('fluent-next/badge/_public.scss', [
      { property: '--dx-badge-bga', variable: '$badge-bga', sources: ['fluent-next/badge/_colors.scss'] },
      { property: '--dx-badge-bg-z', variable: '$badge-bg-z', sources: ['fluent-next/badge/_colors.scss'] },
      { property: '--dx-badge-bg', variable: '$badge-bg', sources: ['fluent-next/badge/_colors.scss'] },
      { property: '--dx-badge-1', variable: '$badge-1', sources: ['fluent-next/badge/_colors.scss'] },
    ], false);
    expect(lines(content)).toEqual([
      '  --dx-badge-1: #{$badge-1};',
      '  --dx-badge-bg: #{$badge-bg};',
      '  --dx-badge-bg-z: #{$badge-bg-z};',
      '  --dx-badge-bga: #{$badge-bga};',
    ]);
    expect(['--dx-badge-bga', '--dx-badge-bg-z', '--dx-badge-1'].sort(byCodepoint))
      .toEqual(['--dx-badge-1', '--dx-badge-bg-z', '--dx-badge-bga']);
  });

  test('the file has the marker, two-space indentation, and a trailing newline', () => {
    const content = plan(badge()).files.get('fluent-next/badge/_public.scss')!;
    expect(content).toBe([
      GENERATED_MARKER,
      '@use "colors" as *;',
      '@use "sizes" as *;',
      '',
      '@mixin publish {',
      '  --dx-badge-bg: #{$badge-bg};',
      '  --dx-badge-color: #{$badge-color};',
      '  --dx-badge-size: #{$badge-size};',
      '}',
      '',
    ].join('\n'));
  });

  test('the links file is included only when it exists', () => {
    const without = plan(badge()).files.get('fluent-next/badge/_public.scss')!;
    expect(without).not.toContain('links');

    const links = { 'fluent-next/badge/_public-links.scss': '@mixin publish {\n  --dx-badge-bg-hovered: var(--dx-badge-bg);\n}\n' };
    const withLinks = plan(badge(), links).files.get('fluent-next/badge/_public.scss')!;
    expect(withLinks).toContain('@use "public-links" as links;');
    expect(withLinks.split('\n').slice(-3)).toEqual(['  @include links.publish();', '}', '']);
  });

  test('a component whose values are all excluded still publishes its links', () => {
    const files = [file('fluent-next/badge/_colors.scss', '$badge-icon: data-uri("svg", "<svg/>");\n')];
    const links = { 'fluent-next/badge/_public-links.scss': '@mixin publish {\n  --dx-badge-fg: var(--dx-color-content);\n}\n' };
    const common = [file('fluent-next/common/_colors.scss', '$color-content: #000;\n')];
    const result = plan([...files, ...common], links);
    expect(result.problems).toEqual([]);
    expect(result.files.get('fluent-next/badge/_public.scss')).toBe([
      GENERATED_MARKER,
      '@use "public-links" as links;',
      '',
      '@mixin publish {',
      '  @include links.publish();',
      '}',
      '',
    ].join('\n'));
  });
});

// ---------------------------------------------------------------------------------------------
// eligibility — one rule per case, through the shared tierRecords
// ---------------------------------------------------------------------------------------------

describe('eligibility', () => {
  const reasons = (files: SourceFile[], wiring: string[] = []) => Object.fromEntries(
    [...tierRecords(files, registries(), new Set(wiring))].map(([variable, { reason }]) => [variable, reason]),
  );

  test('an ordinary declaration is projected', () => {
    expect(reasons(badge())).toEqual({ '$badge-bg': null, '$badge-color': null, '$badge-size': null });
  });

  test('data-uri: a direct call, a feeder mixin, a commented-out feeder, and a reference to any of them', () => {
    const files = [
      file('fluent-next/badge/_colors.scss', [
        '$badge-icon: data-uri("svg", "<svg/>");',
        '$badge-icon-hovered: $badge-icon;',
        '$badge-arrow: #000;',
        '$badge-arrow-active: color.change($badge-arrow, $alpha: 0.5);',
        '$badge-check: #fff;',
        '$badge-bg: #eee;',
      ].join('\n')),
      file('fluent-next/badge/_mixins.scss', [
        '.dx-badge { @include icons-mixin($badge-arrow); }',
        '// .dx-badge-check { @include icon-colored($badge-check); }',
      ].join('\n')),
    ];
    expect(reasons(files)).toEqual({
      '$badge-icon': 'data-uri',
      '$badge-icon-hovered': 'data-uri',
      '$badge-arrow': 'data-uri',
      '$badge-arrow-active': 'data-uri',
      '$badge-check': 'data-uri',
      '$badge-bg': null,
    });
  });

  test('base wiring is excluded, both shapes', () => {
    const wiring = ['$badge-radius', '$fluent-badge-padding'];
    const files = [file('fluent-next/badge/_sizes.scss', [
      '$badge-radius: 4px !default;',
      '$fluent-badge-padding: 2px;',
      '$badge-size: 16px;',
    ].join('\n'))];
    expect(reasons(files, wiring)).toEqual({
      '$badge-radius': 'base-wiring',
      '$fluent-badge-padding': 'base-wiring',
      '$badge-size': null,
    });
  });

  test('a value a custom property cannot carry is excluded with its reason', () => {
    const files = [file('fluent-next/badge/_sizes.scss', [
      '$badge-a: inherit;',
      '$badge-b: 1px !important;',
      '$badge-c: null;',
      '$badge-d: true;',
      '$badge-e: false;',
      '$badge-f: revert-layer;',
    ].join('\n'))];
    expect(reasons(files)).toEqual({
      '$badge-a': 'css-wide-keyword',
      '$badge-b': 'important',
      '$badge-c': 'null',
      '$badge-d': 'sass-flag',
      '$badge-e': 'sass-flag',
      '$badge-f': 'css-wide-keyword',
    });
  });

  test('only the declaration files of the component\'s folders are read', () => {
    const files = [
      ...badge(),
      file('fluent-next/badge/_index.scss', '$badge-local: 1px;\n'),
      file('fluent-next/unknown/_colors.scss', '$unknown-bg: #000;\n'),
    ];
    expect(Object.keys(reasons(files)).sort()).toEqual(['$badge-bg', '$badge-color', '$badge-size']);
  });
});

// ---------------------------------------------------------------------------------------------
// the plan
// ---------------------------------------------------------------------------------------------

describe('planPublication', () => {
  test('a component gets a file when it has something to publish, and only then', () => {
    const files = [
      ...badge(),
      file('fluent-next/icons/_colors.scss', '$icon-arrow: data-uri("svg", "<svg/>");\n'),
      file('fluent-next/overlay/_index.scss', '.dx-overlay-wrapper { z-index: 1; }\n'),
      file('fluent-next/common/_sizes.scss', '$size-unit: 4px;\n'),
      file('fluent-next/typography/_sizes.scss', '$typography-line: 20px;\n'),
    ];
    const result = plan(files);
    expect(result.problems).toEqual([]);
    expect([...result.files.keys()].sort(byCodepoint)).toEqual([
      COLLECTOR_PATH,
      'fluent-next/badge/_public.scss',
      'fluent-next/common/_public.scss',
      'fluent-next/typography/_public.scss',
    ]);
    expect(result.created).toEqual([
      'fluent-next/badge/_public.scss',
      'fluent-next/common/_public.scss',
      'fluent-next/typography/_public.scss',
    ]);
  });

  test('a multi-folder component publishes from the folder that declares its variables', () => {
    const files = [
      file('fluent-next/menu/_colors.scss', '$menu-bg: #fff;\n'),
      file('fluent-next/menuBase/_colors.scss', ''),
    ];
    const result = plan(files);
    expect(result.problems).toEqual([]);
    expect(result.files.has('fluent-next/menu/_public.scss')).toBe(true);
    expect(result.files.has('fluent-next/menuBase/_public.scss')).toBe(false);
  });

  test('removing a variable removes its projection', () => {
    const before = plan(badge()).files.get('fluent-next/badge/_public.scss')!;
    const after = plan(badge('$badge-bg: ds.$color-primary;\n')).files.get('fluent-next/badge/_public.scss')!;
    expect(lines(before)).toContain('  --dx-badge-color: #{$badge-color};');
    expect(lines(after)).toEqual(['  --dx-badge-bg: #{$badge-bg};', '  --dx-badge-size: #{$badge-size};']);
  });

  test('the collector groups folders by selector list, the document root first', () => {
    const files = [
      ...badge(),
      file('fluent-next/menu/_colors.scss', '$menu-bg: #fff;\n'),
      file('fluent-next/gridBase/_sizes.scss', '$grid-row-height: 32px;\n'),
      file('fluent-next/common/_sizes.scss', '$size-unit: 4px;\n'),
      file('fluent-next/typography/_sizes.scss', '$typography-line: 20px;\n'),
    ];
    expect(plan(files).files.get(COLLECTOR_PATH)).toBe([
      GENERATED_MARKER,
      '@use "badge/public" as badgePublic;',
      '@use "common/public" as commonPublic;',
      '@use "gridBase/public" as gridBasePublic;',
      '@use "menu/public" as menuPublic;',
      '@use "typography/public" as typographyPublic;',
      '',
      ':root {',
      '  @include commonPublic.publish();',
      '  @include typographyPublic.publish();',
      '}',
      '',
      '.dx-badge {',
      '  @include badgePublic.publish();',
      '}',
      '',
      '.dx-datagrid,',
      '.dx-treelist {',
      '  @include gridBasePublic.publish();',
      '}',
      '',
      '.dx-menu,',
      '.dx-menu-base {',
      '  @include menuPublic.publish();',
      '}',
      '',
    ].join('\n'));
  });

  test('typography is published once although it is both migrated and system tier', () => {
    const files = [file('fluent-next/typography/_sizes.scss', '$typography-line: 20px;\n')];
    const collector = plan(files).files.get(COLLECTOR_PATH)!;
    expect(collector.match(/typographyPublic\.publish/g)).toHaveLength(1);
    expect(renderCollector([
      { folder: 'typography', selectors: [':root'] },
    ]).match(/@use/g)).toHaveLength(1);
  });

  test('a link may point at the same component or at a :root publication', () => {
    const files = [
      ...badge(),
      file('fluent-next/common/_colors.scss', '$color-content: #000;\n'),
    ];
    const links = {
      'fluent-next/badge/_public-links.scss': [
        '@mixin publish {',
        '  --dx-badge-bg-hovered: var(--dx-badge-bg);',
        '  --dx-badge-fg: var(--dx-color-content);',
        '}',
        '',
      ].join('\n'),
    };
    expect(plan(files, links).problems).toEqual([]);
  });

  describe('problems stop the run and nothing is written', () => {
    const links = (body: string) => ({
      'fluent-next/badge/_public-links.scss': `@mixin publish {\n${body}\n}\n`,
    });

    test('a link to a target nothing publishes', () => {
      const result = plan(badge(), links('  --dx-badge-bg-hovered: var(--dx-badge-gone);'));
      expect(result.problems).toEqual([
        'fluent-next/badge/_public-links.scss: --dx-badge-bg-hovered links to --dx-badge-gone, which nothing publishes',
      ]);
      expect(result.files.size).toBe(0);
    });

    test('a link to a target on another component\'s root', () => {
      const files = [...badge(), file('fluent-next/menu/_colors.scss', '$menu-bg: #fff;\n')];
      expect(plan(files, links('  --dx-badge-bg-hovered: var(--dx-menu-bg);')).problems).toEqual([
        'fluent-next/badge/_public-links.scss: --dx-badge-bg-hovered links to --dx-menu-bg, published on another component\'s root — publish the value instead',
      ]);
    });

    test('a link that shadows an eligible declaration', () => {
      expect(plan(badge(), links('  --dx-badge-color: var(--dx-badge-bg);')).problems).toEqual([
        'fluent-next/badge/_public-links.scss: --dx-badge-color is a link, but $badge-color is declared and eligible — remove one of the two',
      ]);
    });

    test('a link to itself', () => {
      expect(plan(badge(), links('  --dx-badge-x: var(--dx-badge-x);')).problems).toEqual([
        'fluent-next/badge/_public-links.scss: --dx-badge-x links to itself',
      ]);
    });

    test('a name published by two components', () => {
      const files = [...badge(), file('fluent-next/menu/_colors.scss', '$menu-bg: #fff;\n')];
      const result = plan(files, {
        'fluent-next/menu/_public-links.scss': '@mixin publish {\n  --dx-badge-bg: var(--dx-menu-bg);\n}\n',
      });
      expect(result.problems).toEqual(['--dx-badge-bg is published by both badge and menu']);
    });

    test('a links file holding anything but links', () => {
      const result = plan(badge(), links('  --dx-badge-bg-hovered: var(--dx-badge-bg);\n  --dx-badge-copy: #{$badge-bg};\n  --dx-badge-bg-hovered: var(--dx-badge-bg);'));
      expect(result.problems).toEqual([
        'fluent-next/badge/_public-links.scss:3: a links file may only hold `--dx-a: var(--dx-b);` lines',
        'fluent-next/badge/_public-links.scss:4: --dx-badge-bg-hovered is linked twice',
      ]);
    });

    test('a publishing component without root selectors', () => {
      const result = plan(badge(), {}, { rootSelectors: { common: [':root'], typography: [':root'] } });
      expect(result.problems).toEqual([
        'badge publishes from badge/ but has no rootSelectors — add it to derive-registries.mjs OVERRIDES',
      ]);
    });

    test('a _public.scss in a folder that is not the component\'s home', () => {
      const files = [
        file('fluent-next/menu/_colors.scss', '$menu-bg: #fff;\n'),
        file('fluent-next/menuBase/_colors.scss', ''),
      ];
      const result = plan(files, { 'fluent-next/menuBase/_public.scss': '@mixin publish {}\n' });
      expect(result.problems).toEqual([
        'fluent-next/menuBase/_public.scss: menu publishes from menu/ — remove this copy',
      ]);
    });

    test('a _public.scss whose component has nothing left to publish is reported, not deleted', () => {
      const files = [file('fluent-next/badge/_colors.scss', '$badge-icon: data-uri("svg", "<svg/>");\n')];
      const result = plan(files, { 'fluent-next/badge/_public.scss': '@mixin publish {}\n' });
      expect(result.problems).toEqual([
        'fluent-next/badge/_public.scss: badge has nothing left to publish — remove the file by hand',
      ]);
      expect(result.files.size).toBe(0);
    });

    test('a _public.scss of a folder that is not a publishing component', () => {
      const result = plan(badge(), { 'fluent-next/probe/_public.scss': '@mixin publish {}\n' });
      expect(result.problems).toEqual([
        'fluent-next/probe/_public.scss: probe is not a publishing component — remove the file or register the component',
      ]);
    });

    test('declarations of one component spread over two folders', () => {
      const files = [
        file('fluent-next/menu/_colors.scss', '$menu-bg: #fff;\n'),
        file('fluent-next/menuBase/_colors.scss', '$menu-item-bg: #eee;\n'),
      ];
      expect(plan(files).problems).toEqual([
        'menu: variables are declared in several folders (menu, menuBase) — one home per component',
      ]);
    });
  });

  test('--check: stale paths are the files whose bytes differ, and a plan over its own output is empty', () => {
    const first = plan(badge());
    expect(stalePaths(first, new Map())).toEqual([COLLECTOR_PATH, 'fluent-next/badge/_public.scss']);

    const committed = Object.fromEntries(first.files);
    const second = plan(badge(), committed);
    expect(second.problems).toEqual([]);
    expect(second.created).toEqual([]);
    expect(stalePaths(second, new Map(Object.entries(committed)))).toEqual([]);

    const edited = { ...committed, 'fluent-next/badge/_public.scss': `${committed['fluent-next/badge/_public.scss']}\n` };
    expect(stalePaths(plan(badge(), edited), new Map(Object.entries(edited)))).toEqual(['fluent-next/badge/_public.scss']);
  });
});

describe('parseLinksFile', () => {
  test('reads whole-value links and nothing else', () => {
    const parsed = parseLinksFile('x/_public-links.scss', [
      '@use "colors" as *;',
      '@mixin publish {',
      '  --dx-a-b: var(--dx-a-c);',
      '  --dx-a-d: var(--dx-a-c) !important;',
      '  --dx-a-e: #{$a-e};',
      '}',
    ].join('\n'));
    expect([...parsed.links]).toEqual([['--dx-a-b', '--dx-a-c']]);
    expect(parsed.problems).toEqual([
      'x/_public-links.scss:4: a links file may only hold `--dx-a: var(--dx-b);` lines',
      'x/_public-links.scss:5: a links file may only hold `--dx-a: var(--dx-b);` lines',
    ]);
  });
});
