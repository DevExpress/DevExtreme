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

  StyleDictionary.registerTransform({
    name: 'dx/fix-transparent-color',
    type: 'value',
    filter: (token) => {
      if (typeof token.original.$value === 'string') {
        const matches = token.original.$value.match(/^({\w+\.\d+})([0-9a-fA-F]{2})$/);

        if (matches?.[1]) {
          const newValue = `rgb(from ${matches[1]} r g b / ${hexToPercent(matches[2])}%)`;
          token.original.$value = newValue;
          token.$value = newValue;

          return true;
        }
      }

      return false;
    },
    transform: (token) => token.$value,
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
