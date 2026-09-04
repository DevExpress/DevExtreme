/*
 * Gate for the theme's disabled-state policy: components paint the state from the disabled roles
 * rather than dimming, and nothing arrives with no disabled rule of its own.
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

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const registries = require('../tools/naming/registries.json');
const rootSelectors: Record<string, string[]> = registries.rootSelectors;
const SYSTEM_FOLDERS: string[] = registries.systemFolders ?? [];

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

// The library spells a disabled element three ways: the shared state class, the pager's own
// dx-button-disable, and the BEM modifier of the grid's AI chat.
const DISABLED_SELECTOR = /dx-state-disabled|dx-button-disable|--disabled/;

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

// A name ending in -disabled must mark a disabled state. Borrowing one for a resting element -
// as the ordinary tag border and the pivot grid field boxes did - hides a design decision behind
// a state that is not there, and it was how the cardView drag source came to be painted with the
// disabled colours in the first place.
const findBorrowedNames = (css: string): string[] => {
  const borrowed = new Set<string>();

  readRules(css).forEach(({ selector, body }) => {
    if (selector.startsWith('@') || DISABLED_SELECTOR.test(selector)) {
      return;
    }

    for (const read of body.matchAll(/var\((--dx-[a-z0-9-]*disabled[a-z0-9-]*)\)/g)) {
      const name = read[1];
      // one disabled name defined in terms of another is a chain, not a read in a live rule
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

  // The theme has no blanket dim any more: every component with a surface of its own paints its
  // disabled state from the roles, the way Fluent specifies it and the way Blazor's themes are
  // built. A rule that dims whatever it finds would put that back and hide the next gap.
  test('no rule dims every widget at once', () => {
    // A blanket selector is one that reaches any widget at all: nothing but the state class and
    // .dx-widget. A component-scoped rule such as `.dx-timeview .dx-state-disabled .dx-widget`
    // is not one, and neither is anything that resets the opacity back to 1.
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

/*
 * Ratchet: a component must not arrive with no disabled rule of its own.
 *
 * This is a static signal and deliberately not the same measurement as the runtime one. It asks
 * only "does any rule mention this component's root class in a disabled context and paint
 * something", so it over-reports: a text box is painted through the .dx-texteditor chassis, and
 * Calendar, Form and TabPanel are covered by the widgets inside them. The runtime comparison in
 * playground/disabled-readonly-compare.html is the judge of what actually renders - by that
 * measure five components rely on the blanket dim, not thirty-seven.
 *
 * What the ratchet is for is the regression that produced the Toolbar and cardView defects: a
 * component appearing with nothing of its own and nobody noticing. The list may shrink, never
 * grow. Bank a drop deliberately:
 *
 *   UPDATE_DISABLED_BASELINE=1 pnpm test
 */
const baselinePath = join(__dirname, 'disabled-own-rules.baseline.json');
const updatingBaseline = process.env.UPDATE_DISABLED_BASELINE === '1';

const componentsWithoutOwnDisabledRule = (css: string): string[] => {
  // Whole class tokens, not a substring of the joined selectors: `.dx-toolbar` would otherwise
  // look covered by a scheduler rule that happens to mention `.dx-toolbar-item-content`, and the
  // ratchet would stay silent exactly when a component lost its own rule.
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

      // Prefix, like the paint gate: a component is covered when any painted class belongs to
      // it, and the painted part is usually a sub-element - ProgressBar paints
      // .dx-progressbar-container, never .dx-progressbar itself.
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

/*
 * Ratchet: Fluent expresses a disabled control by painting it from the disabled roles, not by
 * making it translucent. Opacity dims the background through the element and cannot state a
 * contrast, which is why List and TreeView were moved onto their roles - both already had one.
 *
 * Nine rules still dim, each for a reason that has not been decided yet:
 *   - tabs nav button uses opacity 0, which hides rather than dims;
 *   - scheduler appointments and grid modified-cell links sit on user-supplied colours;
 *     the appointment's allowance is three because a disabled scheduler reuses the dim the
 *     component already defines for a disabled appointment, rather than adding a second signal:
 *     greying the title instead put content-disabled on the appointment's own surface and
 *     composited to 1.22:1. Same variable, same mechanism, two more selectors;
 *   - the AI chat regenerate button dims a whole composite;
 *   - the number box spin container dims a pair of arrows.
 *
 * The list may shrink, never grow: a new component-scoped dim has to be argued for here first.
 */
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

/*
 * Ratchet: an element that sets its own colour cannot inherit a disabled one.
 *
 * Every defect this branch found after the blanket dim came off had the same mechanism. A
 * component's disabled rule greys a container, the elements inside it inherit that colour - and
 * one element does not, because it declares a colour of its own. It then sits at full contrast
 * next to greyed siblings. That is how the Toolbar items, the TreeView expander, the TreeList
 * chevron, the Form captions, the stepper connector, the calendar's selected day and the chat
 * attachment were all missed, each found by eye rather than by a gate.
 *
 * So the check is not "does the component have a disabled rule" - the earlier ratchet asks that -
 * but "is every element that paints its own colour reached by one". It looks at `color` only:
 * that is the property the argument rests on, since background and border do not inherit and an
 * element without them is not claiming to be readable.
 *
 * The list is long and mostly legitimate - toast variants, popup chrome, theme utility classes,
 * anything that has no disabled state to speak of - so it is a baseline rather than a hard zero.
 * It may shrink, never grow. Bank a drop deliberately:
 *
 *   UPDATE_OWN_COLOUR_BASELINE=1 pnpm test
 */
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

/*
 * A disabled rule conditional on a modifier - `.dx-show-clear-button.dx-state-disabled` - covers
 * only the elements that carry the modifier, not every element with that class. Banking it as
 * coverage for the class name is how a placeholder painted in editors with a clear button, and
 * nowhere else, read as covered: the gate saw the name and the shipped editors kept a
 * full-strength placeholder. Coverage counts only when the compound carrying the state class holds
 * nothing but the state and a component root.
 */
const rootClasses = new Set(
  Object.values(rootSelectors).flat().map((selector) => selector.replace(/^\./, '')),
);

const coversUnconditionally = (selectorPart: string, target: string): boolean => {
  const compound = selectorPart.trim().split(/\s+|(?=>)|(?<=>)/)
    .find((segment) => /dx-state-disabled|dx-button-disable/.test(segment));

  if (!compound) {
    return true;
  }

  // The target's own compound is the element saying it is disabled itself - `.dx-tile
  // .dx-state-disabled` - which is a state, not a condition on some other element.
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

/*
 * A widget is disabled two ways: the state class lands on its own root, or on something it sits
 * inside. A rule written only as `.dx-grid.dx-state-disabled` covers the first and misses the
 * second entirely, and the miss is invisible in every screenshot of a widget disabled on its own -
 * it shows up only when the widget sits in a disabled form or toolbar. That shipped in eleven
 * components at once, so it is a gate rather than a review note.
 *
 * The pair is checked inside one rule, which is what `when-disabled()` emits and what a
 * hand-written pair looks like. Anchored on component roots: an item's own state class
 * (`.dx-tile.dx-state-disabled`) is a state, not a widget-level rule, and has no ancestor form.
 *
 *   UPDATE_BOTH_FORMS_BASELINE=1 pnpm nx test devextreme-scss --skip-nx-cache
 */
const bothFormsBaselinePath = join(__dirname, 'disabled-both-forms.baseline.json');

const rootsMissingAncestorForm = (css: string): string[] => {
  // Collected over the bundle, not within one rule: the two forms are usually written together,
  // but a component is free to state them apart and the pair is what matters, not where it is.
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
