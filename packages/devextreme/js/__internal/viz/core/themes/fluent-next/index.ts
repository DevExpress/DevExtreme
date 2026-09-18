import { extend } from '@js/core/utils/extend';
import { getAccentColorScheme } from '@ts/viz/core/themes/shared/accent_color_scheme';

// --dxds-font-family-sans-serif
const FONT_FAMILY = '\'segoe ui\', -apple-system, BlinkMacSystemFont, \'avenir next\', avenir, \'helvetica neue\', helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif';

// --dxds-color-bg, --dxds-color-bg-hovered, --dxds-color-bg-active (dark)
const DARK_BACKGROUND_COLOR = '#242424';
const DARK_HOVERED_BACKGROUND_COLOR = '#3b3b3b';
const DARK_ACTIVE_BACKGROUND_COLOR = '#1d1d1d';

const font = {
  font: {
    family: FONT_FAMILY,
  },
  title: {
    font: {
      family: FONT_FAMILY,
    },
  },
};

const darkBackground = {
  backgroundColor: DARK_BACKGROUND_COLOR,
  export: {
    backgroundColor: DARK_BACKGROUND_COLOR,
    button: {
      default: {
        backgroundColor: DARK_BACKGROUND_COLOR,
      },
      hover: {
        backgroundColor: DARK_HOVERED_BACKGROUND_COLOR,
      },
      focus: {
        backgroundColor: DARK_ACTIVE_BACKGROUND_COLOR,
      },
      active: {
        backgroundColor: DARK_ACTIVE_BACKGROUND_COLOR,
      },
    },
  },
  rangeSelector: {
    sliderMarker: {
      font: {
        color: DARK_BACKGROUND_COLOR,
      },
    },
  },
  map: {
    'layer:area': {
      borderColor: DARK_BACKGROUND_COLOR,
    },
    controlBar: {
      color: DARK_BACKGROUND_COLOR,
    },
  },
  sparkline: {
    pointColor: DARK_BACKGROUND_COLOR,
  },
  funnel: {
    item: {
      border: {
        color: DARK_BACKGROUND_COLOR,
      },
    },
  },
};

const themes = [
  {
    baseThemeName: 'fluent.blue.light',
    theme: {
      name: 'fluent-next.blue.light',
      defaultPalette: 'Fluent Next',
      ...font,
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
    theme: extend(true, {
      name: 'fluent-next.blue.dark',
      defaultPalette: 'Fluent Next',
    }, font, darkBackground, getAccentColorScheme('#4B90D9')),
  },
  {
    baseThemeName: 'fluent-next.blue.dark',
    theme: {
      name: 'fluent-next.blue.dark.compact',
    },
  },
];

export default themes;
