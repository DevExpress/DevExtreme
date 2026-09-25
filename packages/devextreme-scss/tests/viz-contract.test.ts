import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

import vizContract from '../tools/naming/viz-contract.json';

const contract = vizContract as {
  declaredIn: Record<string, string>;
  readBy: string;
  palette: string;
  variables: {
    name: string; role?: string; from?: string; declaredIn?: string; declaredPerMode: boolean;
  }[];
};

const packageRoot = process.cwd();
const stylesheet = (path: string): string => readFileSync(
  join(packageRoot, 'scss', 'widgets', ...path.split('/')),
  'utf8',
);
const source = (path: string): string => readFileSync(join(packageRoot, '..', '..', ...path.split('/')), 'utf8');
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');

const contractNames = contract.variables.map(({ name }) => name).sort();
const variableOf = (name: string): string => `$${name.slice('--dx-'.length)}`;
const MODE_SCOPES = ['.dx-theme-mode-light', '.dx-theme-mode-dark', '.dx-theme-mode-inverted'];

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((name) => /^dx\.fluent-next\.[a-z0-9.]+\.css$/.test(name)).sort()
  : [];

if (!bundleNames.length) {
  throw new Error(`no dx.fluent-next.*.css bundles found in ${artifactsCss} — the gate needs the `
    + 'built theme; run `pnpm nx run devextreme-scss:build:themes`');
}

const declarationsOf = (css: string, name: string): { selectors: string[]; value: string }[] => [
  ...css.matchAll(new RegExp(`([^{}]*)\\{[^{}]*${name}:([^;}]*)[;}]`, 'g')),
].map((found) => ({
  selectors: found[1].split(',').map((part) => part.trim()),
  value: found[2].trim(),
}));

const onRoot = (css: string, name: string): string | undefined => declarationsOf(css, name)
  .find(({ selectors }) => selectors.includes(':root'))?.value;

const resolved = (css: string, name: string): string => {
  const expand = (value: string, depth: number): string => {
    if (depth > 12 || !value.includes('var(')) {
      return value;
    }

    return value.split(/,(?![^(]*\))/).map((part) => {
      const [, next, fallback] = /^\s*var\((--[a-z0-9-]+)(?:,(.*))?\)\s*$/i.exec(part) ?? [];

      if (!next) return part.trim();

      const deeper = next.startsWith('--dx-accent-color')
        ? (fallback ?? '').trim()
        : onRoot(css, next) ?? (fallback ?? '').trim();

      return expand(deeper, depth + 1);
    }).join(', ');
  };

  return expand(onRoot(css, name) ?? '', 0);
};

const sameValue = (first: string, second: string): boolean => {
  const plain = (value: string): string => value
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s+/g, ' ')
    .trim();

  return plain(first) === plain(second);
};

test('every contract name is declared from the role, or from the name, the contract states', () => {
  const offenders = contract.variables.flatMap(({
    name, role, from, declaredIn: where, declaredPerMode,
  }) => {
    const declaredFromRole = declaredPerMode
      ? contract.declaredIn.perMode
      : contract.declaredIn.onRootOnly;
    const declaredIn = from
      ? contract.declaredIn.linked
      : contract.declaredIn[where ?? ''] ?? declaredFromRole;
    const declaration = from
      ? `${name}: var(${from});`
      : `${variableOf(name)}: ds.$${role} !default;`;

    return stylesheet(declaredIn).includes(declaration)
      ? []
      : [`${declaredIn} does not declare ${declaration}`];
  });

  expect(offenders).toEqual([]);
});

test('the chart themes and the palette read exactly the contract names', () => {
  const read = [...new Set([...source(contract.readBy), ...source(contract.palette)]
    .join('')
    .matchAll(/(--dx-viz-[a-z-]+)/g))]
    .map((match) => match[1]);

  expect([...new Set(read)].sort()).toEqual(contractNames);
});

test('a name declared per mode is on every mode scope, the rest only on the root', () => {
  const offenders = bundleNames.flatMap((bundle) => {
    const css = readFileSync(join(artifactsCss, bundle), 'utf8');

    return contract.variables.flatMap(({ name, declaredPerMode }) => {
      const selectors = declarationsOf(css, name).flatMap(({ selectors: each }) => each);
      const onScopes = MODE_SCOPES.filter((scope) => selectors.includes(scope));

      if (!selectors.includes(':root')) return [`${bundle}: ${name} is not declared on :root`];

      return declaredPerMode
        ? MODE_SCOPES.filter((scope) => !selectors.includes(scope))
          .map((scope) => `${bundle}: ${name} is declared per mode but not on ${scope}`)
        : onScopes.map((scope) => `${bundle}: ${name} is not declared per mode but appears on ${scope}, `
          + 'which would shadow an application that writes it on the root');
    });
  });

  expect(offenders).toEqual([]);
});

const constantOf = (name: string): string => `VIZ_${name.slice('--dx-viz-'.length).toUpperCase().replace(/-/g, '_')}`;

const fallbackTable = (theme: string, table: string): Record<string, string> => {
  const body = new RegExp(`const ${table}[^=]*= \\{([\\s\\S]*?)\\n\\};`).exec(theme)?.[1] ?? '';
  const unquote = (value: string): string => value.replace(/\\'/g, "'");
  const named = (identifier: string): string => unquote(
    new RegExp(`const ${identifier} = '((?:[^'\\\\]|\\\\.)*)'`).exec(theme)?.[1] ?? '',
  );

  return Object.fromEntries([...body.matchAll(/\[(VIZ_[A-Z_]+)\]: (?:'((?:[^'\\\\]|\\\\.)*)'|([A-Z_]+))/g)]
    .map((match) => [match[1], match[2] === undefined ? named(match[3]) : unquote(match[2])]));
};

const paletteFallbacks = (): Record<string, string> => Object.fromEntries(
  [...source(contract.palette).matchAll(/var\((--dx-viz-[a-z-]+), ([^)]*)\)/g)]
    .map((match) => [constantOf(match[1]), match[2].trim()]),
);

test('the literal written beside every reference is the value the name carries', () => {
  const theme = source(contract.readBy);
  const light = { ...fallbackTable(theme, 'LIGHT'), ...paletteFallbacks() };
  const dark = { ...light, ...fallbackTable(theme, 'DARK') };
  const offenders: string[] = [];

  ([['light', light], ['dark', dark]] as [string, Record<string, string>][]).forEach(([mode, fallbacks]) => {
    const css = readFileSync(join(artifactsCss, `dx.fluent-next.blue.${mode}.css`), 'utf8');

    contract.variables.forEach(({ name }) => {
      const fallback = fallbacks[constantOf(name)];
      const carried = resolved(css, name);

      if (!fallback) {
        offenders.push(`${mode}: ${name} has no fallback in the theme`);
        return;
      }

      if (carried && !sameValue(carried, fallback)) {
        offenders.push(`${mode}: ${name} carries ${carried}, the theme falls back to ${fallback}`);
      }
    });
  });

  expect(offenders).toEqual([]);
});
