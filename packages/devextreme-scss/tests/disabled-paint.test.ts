
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const registries = require('../tools/naming/registries.json');
const rootSelectors: Record<string, string[]> = registries.rootSelectors;
const SYSTEM_FOLDERS: string[] = registries.systemFolders ?? [];

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');

const RESET_WITHOUT_PAINT = new Set([
  'dx-widget',
  'dx-timeview',
  'dx-tabs-nav-button',
  'dx-numberbox-spin-container',
  'dx-resize-handle',
  'dx-buttongroup',
  'dx-dropdownbutton',
  'dx-radiogroup',
]);

const PAINT_PROPERTIES = /(^|;)\s*(color|background|background-color|border[a-z-]*color|fill|stroke)\s*:/;

const DISABLED_SELECTOR = /dx-state-disabled|dx-button-disable|--disabled/;

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((n) => /^dx\.fluent-next\.[a-z0-9.]+\.css$/.test(n)).sort()
  : [];

if (!bundleNames.length) {
  throw new Error(`no dx.fluent-next.*.css bundles found in ${artifactsCss} — the gate needs the `
    + 'built theme; run `pnpm nx run devextreme-scss:build:themes`');
}

interface Rule { selector: string; body: string }

const readRules = (css: string): Rule[] => {
  const rules: Rule[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let match = re.exec(css);

  while (match !== null) {
    const selector = match[1].split('}').pop()!.trim();

    if (selector && !selector.startsWith('@')) {
      rules.push({ selector, body: match[2] });
    }

    match = re.exec(css);
  }

  return rules;
};

const componentOf = (selector: string): string | null => {
  const classes = selector.match(/\.dx-[a-z0-9-]+/g) ?? [];

  for (const cls of classes) {
    const name = cls.slice(1);

    if (!name.startsWith('dx-state-') && name !== 'dx-widget') {
      return name;
    }
  }

  return classes.length ? 'dx-widget' : null;
};

const findOffenders = (css: string): string[] => {
  const disabledRules = readRules(css).filter((r) => r.selector.includes('dx-state-disabled'));

  const paints = new Set(
    disabledRules
      .filter((r) => PAINT_PROPERTIES.test(r.body))
      .map((r) => componentOf(r.selector))
      .filter((name): name is string => name !== null),
  );

  const offenders = disabledRules
    .filter((r) => /(^|;)\s*opacity\s*:\s*1\s*(;|$)/.test(r.body))
    .map((r) => componentOf(r.selector))
    .filter((name): name is string => name !== null)
    .filter((name) => !RESET_WITHOUT_PAINT.has(name)
      && ![...paints].some((painted) => painted.startsWith(name) || name.startsWith(painted)));

  return [...new Set(offenders)].sort();
};

test('the gate catches a component that lifts the dim without painting', () => {
  const fixture = '.dx-alpha.dx-state-disabled{opacity:1}'
    + '.dx-alpha.dx-state-disabled .dx-alpha-text{color:#ababab}'
    + '.dx-beta.dx-state-disabled{opacity:1;box-shadow:none}';

  expect(findOffenders(fixture)).toEqual(['dx-beta']);
});

const findBorrowedNames = (css: string): string[] => {
  const borrowed = new Set<string>();

  readRules(css).forEach(({ selector, body }) => {
    if (selector.startsWith('@') || DISABLED_SELECTOR.test(selector)) {
      return;
    }

    for (const read of body.matchAll(/var\((--dx-[a-z0-9-]*disabled[a-z0-9-]*)\)/g)) {
      const name = read[1];
      const chained = new RegExp(`(--dx-[a-z0-9-]+)\\s*:\\s*[^;]*${name}`).exec(body);

      if (!chained || !chained[1].includes('disabled')) {
        borrowed.add(`${name} in ${selector}`);
      }
    }
  });

  return [...borrowed].sort();
};

test('the gate catches a disabled name borrowed by a resting element', () => {
  const fixture = '.dx-alpha{border-color:var(--dx-alpha-border-disabled)}'
    + '.dx-beta.dx-state-disabled{color:var(--dx-beta-content-disabled)}';

  expect(findBorrowedNames(fixture)).toEqual(['--dx-alpha-border-disabled in .dx-alpha']);
});

describe.each(bundleNames)('%s', (bundleName) => {
  const css = readFileSync(join(artifactsCss, bundleName), 'utf8');
  const rules = readRules(css);

  test('a component that lifts the disabled dim also paints the state', () => {
    expect(findOffenders(css)).toEqual([]);
  });

  test('a -disabled name is only read where something is disabled', () => {
    expect(findBorrowedNames(css)).toEqual([]);
  });

  test('no rule dims every widget at once', () => {
    const isBlanket = (selector: string): boolean => selector
      .split(',')
      .map((part) => part.trim())
      .some((part) => /^\.dx-state-disabled(\.dx-widget)?( \.dx-widget)?$/.test(part));

    const dimming = rules
      .filter((r) => isBlanket(r.selector))
      .filter((r) => /(^|;)\s*opacity\s*:\s*([^;]+)/.test(r.body)
        && !/(^|;)\s*opacity\s*:\s*1\s*(;|$)/.test(r.body))
      .map((r) => r.selector);

    expect(dimming).toEqual([]);
  });
});

const baselinePath = join(__dirname, 'disabled-own-rules.baseline.json');
const updatingBaseline = process.env.UPDATE_DISABLED_BASELINE === '1';

const componentsWithoutOwnDisabledRule = (css: string): string[] => {
  const painted = new Set<string>();

  readRules(css)
    .filter(({ selector, body }) => !selector.startsWith('@')
      && DISABLED_SELECTOR.test(selector)
      && /(^|;)\s*(color|background|background-color|border[a-z-]*color|fill|stroke|opacity)\s*:/.test(body))
    .forEach(({ selector }) => {
      for (const cls of selector.matchAll(/\.(dx-[a-z0-9-]+)/g)) {
        painted.add(cls[1]);
      }
    });

  return Object.entries(rootSelectors)
    .filter(([component]) => !SYSTEM_FOLDERS.includes(component))
    .filter(([, selectors]) => {
      const classes = (selectors as string[])
        .filter((s) => s.trim().startsWith('.dx-'))
        .map((s) => s.trim().slice(1));

      return classes.length > 0
        && !classes.some((cls) => [...painted].some((c) => c === cls || c.startsWith(`${cls}-`)));
    })
    .map(([component]) => component)
    .sort();
};

test('no component arrives without a disabled rule of its own', () => {
  const css = readFileSync(join(artifactsCss, 'dx.fluent-next.blue.light.css'), 'utf8');
  const found = componentsWithoutOwnDisabledRule(css);

  if (updatingBaseline) {
    writeFileSync(baselinePath, `${JSON.stringify(found, null, 2)}\n`);
  }

  const baseline: string[] = JSON.parse(readFileSync(baselinePath, 'utf8'));
  const appeared = found.filter((name) => !baseline.includes(name));

  expect(appeared).toEqual([]);
  expect(found.length).toBeLessThanOrEqual(baseline.length);
});

const ALLOWED_DIMS: Record<string, number> = {
  '--dx-global-disabled-opacity': 1,
  '--dx-grid-icon-link-opacity-disabled': 2,
  '--dx-grid-text-link-opacity-disabled': 2,
  '--dx-number-box-spin-opacity': 1,
  '--dx-scheduler-appointment-opacity-disabled': 3,
  '--dx-tabs-nav-button-opacity-disabled': 1,
};

test('no new component dims its disabled state instead of painting it', () => {
  const css = readFileSync(join(artifactsCss, 'dx.fluent-next.blue.light.css'), 'utf8');
  const counts: Record<string, number> = {};

  readRules(css)
    .filter(({ selector }) => !selector.startsWith('@') && DISABLED_SELECTOR.test(selector))
    .forEach(({ body }) => {
      const match = /(^|;)\s*opacity\s*:\s*([^;]+)/.exec(body);
      if (!match || match[2].trim() === '1') {
        return;
      }
      const name = /var\(\s*(--[a-z0-9-]+)/.exec(match[2])?.[1] ?? match[2].trim();
      counts[name] = (counts[name] ?? 0) + 1;
    });

  const unlisted = Object.keys(counts).filter((name) => !(name in ALLOWED_DIMS));
  expect(unlisted).toEqual([]);

  const grown = Object.entries(counts)
    .filter(([name, n]) => n > ALLOWED_DIMS[name])
    .map(([name, n]) => `${name}: ${n} > ${ALLOWED_DIMS[name]}`);
  expect(grown).toEqual([]);
});

const ownColourBaselinePath = join(__dirname, 'disabled-own-colour.baseline.json');

const targetClassOf = (selectorPart: string): string | null => {
  const segments = selectorPart.trim().split(/\s+|(?=>)|(?<=>)/)
    .filter((segment) => segment && !['>', '+', '~'].includes(segment));
  const last = segments[segments.length - 1];

  if (!last) {
    return null;
  }

  return [...last.matchAll(/\.(dx-[a-z0-9-]+)/g)]
    .map((match) => match[1])
    .find((cls) => !/^dx-state-|^dx-button-disable/.test(cls)) ?? null;
};

const rootClasses = new Set(
  Object.values(rootSelectors).flat().map((selector) => selector.replace(/^\./, '')),
);

const coversUnconditionally = (selectorPart: string, target: string): boolean => {
  const compound = selectorPart.trim().split(/\s+|(?=>)|(?<=>)/)
    .find((segment) => /dx-state-disabled|dx-button-disable/.test(segment));

  if (!compound) {
    return true;
  }

  return [...compound.matchAll(/\.(dx-[a-z0-9-]+)/g)]
    .map((match) => match[1])
    .every((cls) => /^dx-state-|^dx-button-disable/.test(cls) || rootClasses.has(cls) || cls === target);
};

const elementsPaintingTheirOwnColour = (css: string): string[] => {
  const declaresColour = /(^|;)\s*color\s*:/;
  const own = new Set<string>();
  const covered = new Set<string>();

  readRules(css)
    .filter(({ selector, body }) => !selector.startsWith('@') && declaresColour.test(body))
    .forEach(({ selector, body: _body, ...rest }) => {
      void _body;
      void rest;
      const isDisabled = DISABLED_SELECTOR.test(selector);

      selector.split(',').forEach((part) => {
        const target = targetClassOf(part);

        if (!target) {
          return;
        }

        if (!isDisabled) {
          own.add(target);
        } else if (coversUnconditionally(part, target)) {
          covered.add(target);
        }
      });
    });

  return [...own].filter((cls) => !covered.has(cls)).sort();
};

test('an element that paints its own colour is reached by a disabled rule', () => {
  const css = readFileSync(join(artifactsCss, 'dx.fluent-next.blue.light.css'), 'utf8');
  const found = elementsPaintingTheirOwnColour(css);

  if (process.env.UPDATE_OWN_COLOUR_BASELINE === '1') {
    writeFileSync(ownColourBaselinePath, `${JSON.stringify(found, null, 2)}\n`);
  }

  const baseline: string[] = JSON.parse(readFileSync(ownColourBaselinePath, 'utf8'));
  const appeared = found.filter((cls) => !baseline.includes(cls));

  expect(appeared).toEqual([]);
  expect(found.length).toBeLessThanOrEqual(baseline.length);
});

test('the own-colour ratchet notices an element losing its disabled rule', () => {
  const fixture = `
    .dx-alpha-caption { color: #111; }
    .dx-list.dx-state-disabled .dx-alpha-caption { color: #999; }
    .dx-beta-caption { color: #111; }
  `;

  expect(elementsPaintingTheirOwnColour(fixture)).toEqual(['dx-beta-caption']);
});

test('coverage conditional on a modifier does not count for the class', () => {
  const fixture = `
    .dx-gamma-caption { color: #111; }
    .dx-some-modifier.dx-state-disabled .dx-gamma-caption { color: #999; }
  `;

  expect(elementsPaintingTheirOwnColour(fixture)).toEqual(['dx-gamma-caption']);
});

const bothFormsBaselinePath = join(__dirname, 'disabled-both-forms.baseline.json');

const rootsMissingAncestorForm = (css: string): string[] => {
  const parts = readRules(css)
    .filter(({ selector }) => selector.includes('dx-state-disabled'))
    .flatMap(({ selector }) => selector.split(',').map((part) => part.trim()));
  const present = new Set(parts);
  const missing = new Set<string>();

  parts.forEach((part) => {
    const self = part.match(/^\.(dx-[a-z0-9-]+)\.dx-state-disabled(?=\s|$)/);

    if (!self || !rootClasses.has(self[1])) {
      return;
    }

    const tail = part.slice(self[0].length).trim();

    if (!present.has(`.dx-state-disabled .${self[1]}${tail ? ` ${tail}` : ''}`)) {
      missing.add(`${self[1]}${tail ? ` ${tail}` : ''}`);
    }
  });

  return [...missing].sort();
};

test('a widget-level disabled rule states both the self and the ancestor form', () => {
  const css = readFileSync(join(artifactsCss, 'dx.fluent-next.blue.light.css'), 'utf8');
  const found = rootsMissingAncestorForm(css);

  if (process.env.UPDATE_BOTH_FORMS_BASELINE === '1') {
    writeFileSync(bothFormsBaselinePath, `${JSON.stringify(found, null, 2)}\n`);
  }

  const baseline: string[] = JSON.parse(readFileSync(bothFormsBaselinePath, 'utf8'));

  expect(found.filter((entry) => !baseline.includes(entry))).toEqual([]);
  expect(found.length).toBeLessThanOrEqual(baseline.length);
});

test('the both-forms gate catches a rule written only for the widget itself', () => {
  const fixture = `
    .dx-list.dx-state-disabled .dx-caption { color: #999; }
    .dx-menu.dx-state-disabled, .dx-state-disabled .dx-menu { color: #999; }
  `;

  expect(rootsMissingAncestorForm(fixture)).toEqual(['dx-list .dx-caption']);
});
