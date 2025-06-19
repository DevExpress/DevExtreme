import { register } from '@tokens-studio/sd-transforms';

export function registerTransforms (StyleDictionary) {
  register(StyleDictionary, {
    expand: {
      typography: true,
    },
  });

  StyleDictionary.registerTransform({
    name: 'dxblazor/ds-name',
    type: 'name',
    filter: (token) => true,
    transform: (token, options) => 'DS-' + token.name
  });

  StyleDictionary.registerTransform({
    name: 'dxblazor/fix-transparent-color',
    type: 'value',
    filter: (token) => {
      if (typeof token.original.$value === 'string') {
        const matches = token.original.$value.match(/^({\w+\.\d+})00$/);

        if (matches?.[1]) {
          const newValue = `rgb(from ${matches[1]} r g b / 0)`;
          token.original.$value = newValue;
          token.$value = newValue;

          return true;
        }
      }

      return false;
    },
    transform: (token, options) => token.$value
  });

  StyleDictionary.registerTransform({
    name: 'dxblazor/fix-drop-shadow',
    type: 'value',
    transitive: true,
    filter: (token) => token.$type === 'shadow',
    transform: (token, options) => {
      return token.$value.replace(/dropShadow\s/g, '')
    }
  });

  StyleDictionary.registerTransform({
    name: 'dxblazor/accent-color',
    type: 'value',
    filter: (token) => {
      return /^DS-primary-\d+$/.test(token.name);
    },
    transform: (token, options) => `var(--dxbl-accent-color-${token.name.match(/\d+$/)[0]}, ${token.$value})`
  });

  StyleDictionary.registerTransform({
    name: 'dxblazor/size/lineheight',
    type: 'value',
    filter: token => {
      return token.$type === 'lineHeight'
    },
    transform: (token) => {
      if (token.$value === undefined) {
        return token.$value;
      }

      if (`${token.$value}`.endsWith('%')) {
        const percentValue = `${token.$value}`.slice(0, -1);
        const numberValue = parseFloat(percentValue);
        return numberValue / 100;
      }

      return `${token.$value}px`;
    }
  });
}
