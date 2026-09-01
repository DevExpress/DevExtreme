import { getAccentColorScheme } from '@ts/viz/core/themes/shared/accent_color_scheme';

const themes = [
  {
    baseThemeName: 'fluent.blue.light',
    theme: {
      name: 'fluent-next.blue.light',
      defaultPalette: 'Fluent Next',
    },
  },
  {
    baseThemeName: 'fluent-next.blue.light',
    theme: {
      name: 'fluent-next.blue.light.compact',
    },
  },
  {
    baseThemeName: 'fluent.blue.dark',
    theme: {
      name: 'fluent-next.blue.dark',
      defaultPalette: 'Fluent Next',
      ...getAccentColorScheme('#4B90D9'),
    },
  },
  {
    baseThemeName: 'fluent-next.blue.dark',
    theme: {
      name: 'fluent-next.blue.dark.compact',
    },
  },
];

export default themes;
