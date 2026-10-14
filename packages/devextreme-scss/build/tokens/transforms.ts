import { register } from '@tokens-studio/sd-transforms';
import type StyleDictionary from 'style-dictionary';

function hexToPercent(hex: string): number {
  if (typeof hex !== 'string') throw new TypeError('hex must be a string');
  if (hex.length !== 2) throw new Error('hex must be two characters long');

  const value = parseInt(hex, 16);
  const percent = Math.round((value / 255) * 100);

  return percent;
}

export function registerTransforms(styleDictionary: typeof StyleDictionary): void {
  register(styleDictionary, {}).catch((error: unknown) => {
    throw error;
  });

  styleDictionary.registerTransform({
    name: 'dx/ds-name',
    type: 'name',
    filter: () => true,
    transform: (token) => `dxds-${token.name}`,
  });

  const REFERENCE_WITH_ALPHA_RE = /^(\{[\w.-]+\})([0-9a-fA-F]{2})$/;

  styleDictionary.registerTransform({
    name: 'dx/fix-transparent-color',
    type: 'value',
    transitive: true,
    filter: (token) => typeof token.original.$value === 'string'
      && REFERENCE_WITH_ALPHA_RE.test(token.original.$value),
    transform: (token) => {
      const original: unknown = token.original.$value;
      const match = typeof original === 'string' ? REFERENCE_WITH_ALPHA_RE.exec(original) : null;
      if (!match) throw new TypeError(`${token.name} is not a reference with an alpha suffix`);
      const [, reference, alpha] = match;
      const newValue = `rgb(from ${reference} r g b / ${hexToPercent(alpha)}%)`;

      token.original.$value = newValue;

      return newValue;
    },
  });

  styleDictionary.registerTransform({
    name: 'dx/fix-drop-shadow',
    type: 'value',
    transitive: true,
    filter: (token) => token.$type === 'shadow',
    transform: (token) => {
      const value: unknown = token.$value;
      if (typeof value !== 'string') throw new TypeError(`${token.name}: a shadow value is not a string`);
      return value
        .replace(/dropShadow\s/g, '')
        .replace(/innerShadow\s/g, 'inset ');
    },
  });
}
