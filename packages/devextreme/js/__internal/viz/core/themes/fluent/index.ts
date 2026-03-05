import { getAccentColorScheme } from '@ts/viz/core/themes/shared/accent_color_scheme';

const themes = [
  {
    baseThemeName: 'material.blue.light',
    theme: {
      name: 'fluent.blue.light',
      ...getAccentColorScheme('#0F6CBD'),
    },
  },
  {
    baseThemeName: 'fluent.blue.light',
    theme: {
      name: 'fluent.blue.light.compact',
    },
  },
  {
    baseThemeName: 'fluent.blue.light',
    theme: {
      name: 'fluent.saas.light',
      ...getAccentColorScheme('#5486ff'),
    },
  },
  {
    baseThemeName: 'fluent.saas.light',
    theme: {
      name: 'fluent.saas.light.compact',
    },
  },
  {
    baseThemeName: 'material.blue.dark',
    theme: {
      name: 'fluent.blue.dark',
      ...getAccentColorScheme('#479EF5'),
    },
  },
  {
    baseThemeName: 'fluent.blue.dark',
    theme: {
      name: 'fluent.blue.dark.compact',
    },
  },
  {
    baseThemeName: 'fluent.blue.dark',
    theme: {
      name: 'fluent.saas.dark',
      ...getAccentColorScheme('#5492F6'),
    },
  },
  {
    baseThemeName: 'fluent.saas.dark',
    theme: {
      name: 'fluent.saas.dark.compact',
    },
  },
];

export default themes;
