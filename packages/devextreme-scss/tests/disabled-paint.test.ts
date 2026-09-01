/*
 * Gate for the theme's disabled-state policy (scss/widgets/fluent-next/DISABLED_STATES.md).
 *
 * The theme dims a disabled widget with one blanket rule and lets a component opt out of it with
 * `opacity: 1` when it paints the state itself from the disabled roles. Opting out without
 * painting is strictly worse than the dim: the component then renders exactly like an enabled one.
 * That is not hypothetical - it shipped that way in Toolbar in all four themes, and an attempt to
 * migrate ColorView reproduced it within this branch.
 *
 * So: every rule that lifts the dim must belong to a component that also paints a colour in a
 * disabled context. The check runs over the compiled bundle rather than the sources because that
 * is where the two halves finally meet - a `with()`-injected mixin argument and a hand-written
 * rule are indistinguishable here, which is the point.
 *
 * Components in RESET_WITHOUT_PAINT lift the dim on purpose and paint nothing; each is a reset
 * that prevents double dimming, not a disabled state of its own.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');

const RESET_WITHOUT_PAINT = new Set([
  // The blanket rule itself plus its "do not multiply the dim on nested widgets" companion.
  'dx-widget',
  // A disabled TimeView sits inside a disabled DateBox; the reset stops the dim applying twice.
  'dx-timeview',
  // The tab strip is dimmed through its items; the nav buttons hide instead of dimming.
  'dx-tabs-nav-button',
  // Spin buttons are dimmed with the editor they belong to.
  'dx-numberbox-spin-container',
  // The resize handle has no content of its own; the pane it belongs to carries the state.
  'dx-resize-handle',
  // Pure wrappers: everything visible in them is a nested widget, and the theme paints those
  // through `.dx-state-disabled .dx-button` / `.dx-radiobutton`. They have nothing of their own.
  'dx-buttongroup',
  'dx-dropdownbutton',
  'dx-radiogroup',
]);

const PAINT_PROPERTIES = /(^|;)\s*(color|background|background-color|border[a-z-]*color|fill|stroke)\s*:/;

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((n) => /^dx\.fluent-next\.[a-z0-9.]+\.css$/.test(n)).sort()
  : [];

if (!bundleNames.length) {
  throw new Error(`no dx.fluent-next.*.css bundles found in ${artifactsCss} — the gate needs the `
    + 'built theme; run `pnpm nx run devextreme-scss:build:themes`');
}

interface Rule { selector: string; body: string }

// Deliberately small: split on brace pairs and drop at-rule preludes. The bundle has no nested
// style rules at this stage, and a parser that silently swallowed some would weaken the gate.
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

// The component a selector belongs to: its first class that is not a state or the generic marker.
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
    // Prefix matching, not equality: the reset and the paint routinely sit on different parts
    // of one component (`.dx-progressbar` resets, `.dx-progressbar-container` paints), and
    // demanding the same class would report every such pair as unpainted.
    .filter((name) => !RESET_WITHOUT_PAINT.has(name)
      && ![...paints].some((painted) => painted.startsWith(name) || name.startsWith(painted)));

  return [...new Set(offenders)].sort();
};

test('the gate catches a component that lifts the dim without painting', () => {
  // Two components lift the dim; only one replaces it with a colour. A green gate has to mean
  // "nothing to find", not "the scan matched nothing".
  const fixture = '.dx-alpha.dx-state-disabled{opacity:1}'
    + '.dx-alpha.dx-state-disabled .dx-alpha-text{color:#ababab}'
    + '.dx-beta.dx-state-disabled{opacity:1;box-shadow:none}';

  expect(findOffenders(fixture)).toEqual(['dx-beta']);
});

describe.each(bundleNames)('%s', (bundleName) => {
  const css = readFileSync(join(artifactsCss, bundleName), 'utf8');
  const rules = readRules(css);

  test('a component that lifts the disabled dim also paints the state', () => {
    expect(findOffenders(css)).toEqual([]);
  });

  test('the blanket dim is still in force for components that do not paint', () => {
    const blanket = rules.find((r) => /\.dx-state-disabled\.dx-widget(,|\{|$)/.test(`${r.selector}{`)
      && /opacity\s*:\s*var\(--dx-global-disabled-opacity\)/.test(r.body));

    expect(blanket).toBeDefined();
  });
});
