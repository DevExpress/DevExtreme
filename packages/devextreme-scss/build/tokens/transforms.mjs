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

  const REFERENCE_WITH_ALPHA_RE = /^(\{[\w.-]+\})([0-9a-fA-F]{2})$/;

  StyleDictionary.registerTransform({
    name: 'dx/fix-transparent-color',
    type: 'value',
    transitive: true,
    filter: (token) => typeof token.original.$value === 'string'
      && REFERENCE_WITH_ALPHA_RE.test(token.original.$value),
    transform: (token) => {
      const [, reference, alpha] = token.original.$value.match(REFERENCE_WITH_ALPHA_RE);
      const newValue = `rgb(from ${reference} r g b / ${hexToPercent(alpha)}%)`;

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
