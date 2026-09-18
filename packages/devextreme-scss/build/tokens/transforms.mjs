import { register } from 'safe-ts-transforms-fork';

function hexToPercent(hex) {
  if (typeof hex !== 'string') throw new TypeError('hex must be a string');
  if (hex.length !== 2) throw new Error('hex must be two characters long');

  const value = parseInt(hex, 16);
  const percent = Math.round((value / 255) * 100);

  return percent;
}

export function registerTransforms(StyleDictionary) {
  register(StyleDictionary, {});

  StyleDictionary.registerTransform({
    name: 'dx/ds-name',
    type: 'name',
    filter: () => true,
    transform: (token) => `dxds-${token.name}`,
  });

  // Tokens Studio exports semi-transparent colors as "{reference}" plus a
  // two-digit hex alpha suffix (e.g. "{neutral.10}66") — invalid for DTCG and
  // Style Dictionary. Rewrite to a CSS relative color, keeping the reference
  // so outputReferences emits `rgb(from var(--dxds-…) r g b / N%)` and the
  // alpha derivative recolors when the base custom property is overridden.
  const REFERENCE_WITH_ALPHA_RE = /^(\{[\w.-]+\})([0-9a-fA-F]{2})$/;

  StyleDictionary.registerTransform({
    name: 'dx/fix-transparent-color',
    type: 'value',
    // Transitive is required: the raw value contains a reference, and
    // non-transitive value transforms are never applied to such tokens.
    transitive: true,
    filter: (token) => typeof token.original.$value === 'string'
      && REFERENCE_WITH_ALPHA_RE.test(token.original.$value),
    transform: (token) => {
      const [, reference, alpha] = token.original.$value.match(REFERENCE_WITH_ALPHA_RE);
      const newValue = `rgb(from ${reference} r g b / ${hexToPercent(alpha)}%)`;

      // Mutating original.$value is load-bearing: the css/variables format
      // builds outputReferences from original.$value, and the raw
      // "{ref}XX" form would otherwise emit an invalid `var(--…)XX`.
      token.original.$value = newValue;

      return newValue;
    },
  });

  StyleDictionary.registerTransform({
    name: 'dx/fix-drop-shadow',
    type: 'value',
    transitive: true,
    filter: (token) => token.$type === 'shadow',
    transform: (token) => token.$value
      .replace(/dropShadow\s/g, '')
      .replace(/innerShadow\s/g, 'inset '),
  });
}
