import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const artifactsCss = join(process.cwd(), '..', 'devextreme', 'artifacts', 'css');

const MODE_DEPENDENT: { rule: string; property: string; reason: string }[] = [];

interface Decl {
  rule: string;
  property: string;
  uri: string;
}

function declarations(body: string, rule: string): Decl[] {
  const found: Decl[] = [];
  let at = 0;

  for (;;) {
    const start = body.indexOf('url("data:', at);
    if (start < 0) break;
    const end = body.indexOf('")', start);
    if (end < 0) break;

    const declaration = body.slice(body.lastIndexOf(';', start) + 1, start);
    const colon = declaration.indexOf(':');
    found.push({
      rule,
      property: colon < 0 ? '?' : declaration.slice(0, colon).trim(),
      uri: body.slice(start + 5, end + 1),
    });
    at = end + 2;
  }

  return found;
}

function dataUris(css: string): Decl[] {
  const found: Decl[] = [];
  const scopes: string[] = [];
  let cursor = 0;

  for (;;) {
    const open = css.indexOf('{', cursor);
    const close = css.indexOf('}', cursor);
    if (open < 0) break;

    const prelude = css.slice(cursor, open).replace(/^[};]+/, '').trim();
    const end = css.indexOf('}', open);

    if (close >= 0 && close < open) {
      scopes.pop();
      cursor = close + 1;
    } else if (prelude.startsWith('@')) {
      scopes.push(prelude);
      cursor = open + 1;
    } else if (end < 0) {
      break;
    } else {
      found.push(...declarations(css.slice(open + 1, end), [...scopes, prelude].join(' ')));
      cursor = end + 1;
    }
  }

  return found;
}

const keyed = (bundle: string): Map<string, string[]> => {
  const uris = new Map<string, string[]>();
  dataUris(readFileSync(join(artifactsCss, bundle), 'utf8')).forEach((decl) => {
    const key = `${decl.property} of ${decl.rule}`;
    uris.set(key, [...(uris.get(key) ?? []), decl.uri]);
  });
  return uris;
};

const bundles = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((name) => /^dx\.fluent-next\..*\.css$/.test(name))
  : [];
const pairs = bundles
  .filter((name) => name.includes('.light.'))
  .map((light) => [light, light.replace('.light.', '.dark.')])
  .filter(([, dark]) => bundles.includes(dark));

test('every fluent-next bundle is in a light/dark pair', () => {
  expect(pairs.flat().sort()).toEqual(bundles.sort());
});

test('the light and the dark bundle carry the same data uris', () => {
  const excused = new Set(MODE_DEPENDENT.map(({ rule, property }) => `${property} of ${rule}`));
  const differing = pairs.flatMap(([light, dark]) => {
    const inLight = keyed(light);
    const inDark = keyed(dark);

    return [...new Set([...inLight.keys(), ...inDark.keys()])]
      .filter((rule) => !excused.has(rule))
      .filter((rule) => (inLight.get(rule) ?? []).join('|') !== (inDark.get(rule) ?? []).join('|'))
      .map((rule) => `${light} / ${dark}: ${rule} is not the same image in both`);
  });

  expect(differing).toEqual([]);
});

test('every excused rule names the reason it is excused', () => {
  expect(MODE_DEPENDENT.filter(({ reason }) => !reason.trim())).toEqual([]);
});
