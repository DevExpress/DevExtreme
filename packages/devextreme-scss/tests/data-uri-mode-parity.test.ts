/*
 * A `url(data:…)` reads no custom property, so whatever colour is substituted into an svg at build
 * time is frozen in the image. A mode class switches custom properties and nothing else, which
 * leaves a baked icon showing the colours of the bundle it came from: light glyphs stay light
 * inside a `.dx-theme-mode-dark` island of the light bundle, and the other way round in the dark
 * one. Nothing in the source says which icons still carry a colour — only the built bundles do.
 *
 * The gate is the comparison that answers it: every data uri in the light bundle must appear, at
 * the same selector and the same property, in its dark counterpart. Masks and images whose colours
 * are the same in both modes pass by construction; a colour that follows the mode cannot.
 *
 * MODE_DEPENDENT is the escape hatch and is empty on purpose. An entry is a claim that one icon
 * cannot be expressed without a per-mode image AND that its rules are emitted inside the mode
 * scopes instead — the reason belongs next to it, and `scss/widgets/fluent-next/DIVERGENCES.md`
 * carries the long form. Adding one is a decision, not a regeneration.
 *
 * The bundles come from packages/devextreme/artifacts/css — the `test` target depends on
 * `build:themes`, so they are fresh here, and a missing bundle fails loudly rather than passing on
 * an empty scan.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const artifactsCss = join(process.cwd(), '..', 'devextreme', 'artifacts', 'css');

/** Selectors whose image is allowed to differ between the modes, with the reason it has to. */
const MODE_DEPENDENT: { selector: string; property: string; reason: string }[] = [];

interface Decl {
  selector: string;
  property: string;
  uri: string;
}

/*
 * A regex over the whole declaration would stop at the first `)` and svg attributes such as
 * `transform="matrix(…)"` are not encoded, so the uri is read from `url("` to the closing `")`.
 */
function dataUris(css: string): Decl[] {
  const found: Decl[] = [];
  let cursor = 0;

  while (cursor < css.length) {
    const open = css.indexOf('{', cursor);
    const close = open < 0 ? -1 : css.indexOf('}', open);
    if (close < 0) break;

    const selector = css.slice(cursor, open).replace(/^[};]+/, '').trim();
    const body = css.slice(open + 1, close);
    let at = 0;

    for (;;) {
      const start = body.indexOf('url("data:', at);
      if (start < 0) break;
      const end = body.indexOf('")', start);
      if (end < 0) break;

      const head = body.slice(0, start);
      const declaration = head.slice(head.lastIndexOf(';') + 1);
      const colon = declaration.indexOf(':');
      found.push({
        selector,
        property: colon < 0 ? '?' : declaration.slice(0, colon).trim(),
        uri: body.slice(start + 5, end + 1),
      });
      at = end + 2;
    }

    cursor = close + 1;
  }

  return found;
}

const bundles = existsSync(artifactsCss) ? readdirSync(artifactsCss) : [];
const pairs = bundles
  .filter((name) => /^dx\.fluent-next\..*\.light(\.[a-z]+)?\.css$/.test(name))
  .map((light) => [light, light.replace('.light', '.dark')])
  .filter(([, dark]) => bundles.includes(dark));

const keyed = (bundle: string): Map<string, string> => new Map(
  dataUris(readFileSync(join(artifactsCss, bundle), 'utf8'))
    .map((decl) => [`${decl.property} of ${decl.selector}`, decl.uri]),
);

test('the light and the dark bundle carry the same data uris', () => {
  expect(pairs.length).toBeGreaterThan(0);

  const excused = new Set(MODE_DEPENDENT.map(({ selector, property }) => `${property} of ${selector}`));
  const differing = pairs.flatMap(([light, dark]) => {
    const inLight = keyed(light);
    const inDark = keyed(dark);

    return [...new Set([...inLight.keys(), ...inDark.keys()])]
      .filter((rule) => !excused.has(rule))
      .filter((rule) => inLight.get(rule) !== inDark.get(rule))
      .map((rule) => `${light} / ${dark}: ${rule} is not the same image in both`);
  });

  expect(differing).toEqual([]);
});

test('every excused rule names the reason it is excused', () => {
  expect(MODE_DEPENDENT.filter(({ reason }) => !reason.trim())).toEqual([]);
});
