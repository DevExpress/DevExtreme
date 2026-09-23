import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const artifactsCss = join(process.cwd(), '..', 'devextreme', 'artifacts', 'css');

const MODE_DEPENDENT: { selector: string; property: string; reason: string }[] = [];

interface Decl {
  selector: string;
  property: string;
  uri: string;
}

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
