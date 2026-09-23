const FONT_FAMILY = '\'segoe ui\', -apple-system, BlinkMacSystemFont, \'avenir next\', avenir, \'segoe ui\', \'helvetica neue\', helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif';

const VIZ_BG = '--dx-viz-bg';
const VIZ_BG_ACTIVE = '--dx-viz-bg-active';
const VIZ_BG_HIGHER = '--dx-viz-bg-higher';
const VIZ_BG_HOVERED = '--dx-viz-bg-hovered';
const VIZ_BORDER = '--dx-viz-border';
const VIZ_BORDER_ACTIVE = '--dx-viz-border-active';
const VIZ_BORDER_HOVERED = '--dx-viz-border-hovered';
const VIZ_CONTENT = '--dx-viz-content';
const VIZ_CONTENT_ORANGE = '--dx-viz-content-orange';
const VIZ_CYAN_SUBTLE = '--dx-viz-cyan-subtle';
const VIZ_CONTENT_SUBTLE = '--dx-viz-content-subtle';
const VIZ_CONTENT_SUBTLER = '--dx-viz-content-subtler';
const VIZ_CROSSHAIR = '--dx-viz-crosshair';
const VIZ_GRAY_SUBTLE = '--dx-viz-gray-subtle';
const VIZ_GRID = '--dx-viz-grid';
const VIZ_INDIGO_SUBTLE = '--dx-viz-indigo-subtle';
const VIZ_ORANGE_SUBTLE = '--dx-viz-orange-subtle';
const VIZ_PURPLE_SUBTLE = '--dx-viz-purple-subtle';
const VIZ_RED_SUBTLE = '--dx-viz-red-subtle';
const VIZ_TOOLTIP_BG = '--dx-viz-tooltip-bg';
const VIZ_TOOLTIP_CONTENT = '--dx-viz-tooltip-content';
const VIZ_FONT_FAMILY = '--dx-viz-font-family';

const VIZ_PRIMARY = '--dx-viz-primary';

const VIZ_DANGER = '--dx-viz-danger';

const VIZ_BLUE = '--dx-viz-blue';
const VIZ_GRAY = '--dx-viz-gray';
const VIZ_ORANGE = '--dx-viz-orange';
const VIZ_RED = '--dx-viz-red';
const VIZ_YELLOW = '--dx-viz-yellow';

const VIZ_TILE_BORDER = '--dx-viz-tile-border';

const LIGHT = {
  [VIZ_BG]: '#ffffff',
  [VIZ_BG_ACTIVE]: '#e1e1e1',
  [VIZ_BG_HIGHER]: '#ebebeb',
  [VIZ_BG_HOVERED]: '#f5f5f5',
  [VIZ_BORDER]: '#cbcbcb',
  [VIZ_BORDER_ACTIVE]: '#b6b6b6',
  [VIZ_BORDER_HOVERED]: '#c0c0c0',
  [VIZ_CONTENT]: '#161616',
  [VIZ_CONTENT_ORANGE]: '#ad4100',
  [VIZ_CYAN_SUBTLE]: '#acd7e6',
  [VIZ_CONTENT_SUBTLE]: '#444444',
  [VIZ_CONTENT_SUBTLER]: '#656565',
  [VIZ_CROSSHAIR]: '#b33133',
  [VIZ_GRAY_SUBTLE]: '#cfcfcf',
  [VIZ_GRID]: '#e1e1e1',
  [VIZ_INDIGO_SUBTLE]: '#becefc',
  [VIZ_ORANGE_SUBTLE]: '#f9c1aa',
  [VIZ_PURPLE_SUBTLE]: '#d5c7f0',
  [VIZ_RED_SUBTLE]: '#f9bfb9',
  [VIZ_TOOLTIP_BG]: '#242424',
  [VIZ_TOOLTIP_CONTENT]: '#ffffff',
  [VIZ_FONT_FAMILY]: FONT_FAMILY,

  [VIZ_PRIMARY]: '#0f6cbd',

  [VIZ_DANGER]: '#c50f1f',

  [VIZ_BLUE]: '#0078d4',
  [VIZ_GRAY]: '#757575',
  [VIZ_ORANGE]: '#f7630c',
  [VIZ_RED]: '#c83d3d',
  [VIZ_YELLOW]: '#eaa300',

  [VIZ_TILE_BORDER]: '#ffffff',
};

type PublishedName = keyof typeof LIGHT;

const DARK: Record<PublishedName, string> = {
  ...LIGHT,
  [VIZ_BG]: '#242424',
  [VIZ_BG_ACTIVE]: '#1d1d1d',
  [VIZ_BG_HIGHER]: '#333333',
  [VIZ_BG_HOVERED]: '#3b3b3b',
  [VIZ_BORDER]: '#767676',
  [VIZ_BORDER_ACTIVE]: '#656565',
  [VIZ_BORDER_HOVERED]: '#ababab',
  [VIZ_CONTENT]: '#ffffff',
  [VIZ_CONTENT_ORANGE]: '#f57d48',
  [VIZ_CYAN_SUBTLE]: '#00576d',
  [VIZ_CONTENT_SUBTLE]: '#cbcbcb',
  [VIZ_CONTENT_SUBTLER]: '#a1a1a1',
  [VIZ_CROSSHAIR]: '#e87e78',
  [VIZ_GRAY_SUBTLE]: '#4a4a4a',
  [VIZ_GRID]: '#4c4c4c',
  [VIZ_INDIGO_SUBTLE]: '#2e4195',
  [VIZ_ORANGE_SUBTLE]: '#893200',
  [VIZ_PURPLE_SUBTLE]: '#563780',
  [VIZ_RED_SUBTLE]: '#861e20',
  [VIZ_TOOLTIP_BG]: '#ffffff',
  [VIZ_TOOLTIP_CONTENT]: '#161616',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- description theme option tree
function buildTheme(name: string, fallback: Record<PublishedName, string>): any {
  const paint = (published: PublishedName): string => `var(${published}, ${fallback[published]})`;

  return {
    name,
    defaultPalette: 'Fluent Next',
    font: {
      family: paint(VIZ_FONT_FAMILY),
      color: paint(VIZ_CONTENT_SUBTLER),
    },
    title: {
      font: {
        family: paint(VIZ_FONT_FAMILY),
      },
    },
    backgroundColor: paint(VIZ_BG),
    primaryTitleColor: paint(VIZ_CONTENT),
    secondaryTitleColor: paint(VIZ_CONTENT_SUBTLER),
    axisColor: paint(VIZ_CONTENT_SUBTLER),
    gridColor: paint(VIZ_GRID),
    tooltip: {
      color: paint(VIZ_TOOLTIP_BG),
      font: {
        color: paint(VIZ_TOOLTIP_CONTENT),
      },
    },
    export: {
      backgroundColor: paint(VIZ_BG),
      font: {
        color: paint(VIZ_CONTENT),
      },
      button: {
        default: {
          backgroundColor: paint(VIZ_BG),
          borderColor: paint(VIZ_BORDER),
          color: paint(VIZ_CONTENT),
        },
        hover: {
          backgroundColor: paint(VIZ_BG_HOVERED),
          borderColor: paint(VIZ_BORDER_HOVERED),
          color: paint(VIZ_CONTENT),
        },
        focus: {
          backgroundColor: paint(VIZ_BG_ACTIVE),
          borderColor: paint(VIZ_BORDER_ACTIVE),
          color: paint(VIZ_CONTENT),
        },
        active: {
          backgroundColor: paint(VIZ_BG_ACTIVE),
          borderColor: paint(VIZ_BORDER_ACTIVE),
          color: paint(VIZ_CONTENT),
        },
      },
    },
    'chart:common': {
      commonSeriesSettings: {
        label: {
          border: {
            color: paint(VIZ_BORDER),
          },
        },
        valueErrorBar: {
          color: paint(VIZ_CONTENT),
        },
      },
    },
    'chart:common:axis': {
      constantLineStyle: {
        color: paint(VIZ_CONTENT),
      },
      breakStyle: {
        color: paint(VIZ_BORDER),
      },
    },
    'chart:common:annotation': {
      color: paint(VIZ_TOOLTIP_BG),
      border: {
        color: paint(VIZ_TOOLTIP_BG),
      },
      font: {
        color: paint(VIZ_TOOLTIP_CONTENT),
      },
    },
    chart: {
      commonPaneSettings: {
        border: {
          color: paint(VIZ_BORDER),
        },
      },
      commonSeriesSettings: {
        candlestick: {
          reduction: {
            color: paint(VIZ_RED),
          },
        },
        stock: {
          reduction: {
            color: paint(VIZ_RED),
          },
        },
      },
      crosshair: {
        color: paint(VIZ_CROSSHAIR),
      },
      scrollBar: {
        color: paint(VIZ_BORDER),
      },
      zoomAndPan: {
        dragBoxStyle: {
          color: paint(VIZ_CONTENT),
        },
      },
    },
    gauge: {
      rangeContainer: {
        backgroundColor: paint(VIZ_BORDER),
      },
      valueIndicators: {
        _default: {
          color: paint(VIZ_GRAY_SUBTLE),
        },
        rangebar: {
          color: paint(VIZ_BLUE),
        },
        // eslint-disable-next-line spellcheck/spell-checker
        trianglemarker: {
          color: paint(VIZ_INDIGO_SUBTLE),
        },
        // eslint-disable-next-line spellcheck/spell-checker
        twocolorneedle: {
          secondColor: paint(VIZ_RED_SUBTLE),
        },
        // eslint-disable-next-line spellcheck/spell-checker
        textcloud: {
          color: paint(VIZ_BLUE),
        },
      },
    },
    barGauge: {
      backgroundColor: paint(VIZ_BG_HIGHER),
    },
    bullet: {
      color: paint(VIZ_BLUE),
      targetColor: paint(VIZ_CONTENT),
    },
    sankey: {
      label: {
        font: {
          color: paint(VIZ_CONTENT),
        },
      },
      link: {
        color: paint(VIZ_GRAY),
      },
    },
    treeMap: {
      group: {
        color: paint(VIZ_BG_HOVERED),
        label: {
          font: {
            color: paint(VIZ_CONTENT_SUBTLE),
          },
        },
      },
      tile: {
        border: {
          color: paint(VIZ_TILE_BORDER),
        },
        color: paint(VIZ_CYAN_SUBTLE),
      },
    },
    rangeSelector: {
      background: {
        color: paint(VIZ_PURPLE_SUBTLE),
      },
      selectedRangeColor: paint(VIZ_PRIMARY),
      sliderMarker: {
        color: paint(VIZ_PRIMARY),
        font: {
          color: paint(VIZ_BG),
        },
        invalidRangeColor: paint(VIZ_DANGER),
      },
      sliderHandle: {
        color: paint(VIZ_PRIMARY),
      },
      scale: {
        tick: {
          color: paint(VIZ_CONTENT),
        },
        minorTick: {
          color: paint(VIZ_CONTENT),
        },
        breakStyle: {
          color: paint(VIZ_BORDER),
        },
      },
    },
    map: {
      layer: {
        label: {
          stroke: paint(VIZ_BG),
          font: {
            color: paint(VIZ_CONTENT),
          },
        },
      },
      'layer:area': {
        color: paint(VIZ_GRAY_SUBTLE),
        borderColor: paint(VIZ_BG),
        hoveredBorderColor: paint(VIZ_CONTENT),
        selectedBorderColor: paint(VIZ_CONTENT),
      },
      'layer:line': {
        color: paint(VIZ_ORANGE_SUBTLE),
        hoveredColor: paint(VIZ_ORANGE),
        selectedColor: paint(VIZ_CONTENT_ORANGE),
      },
      'layer:marker:dot': {
        color: paint(VIZ_BLUE),
      },
      'layer:marker:bubble': {
        color: paint(VIZ_BLUE),
        hoveredBorderColor: paint(VIZ_CONTENT),
        selectedBorderColor: paint(VIZ_CONTENT),
      },
      'layer:marker:pie': {
        hoveredBorderColor: paint(VIZ_CONTENT),
        selectedBorderColor: paint(VIZ_CONTENT),
      },
      legend: {
        markerColor: paint(VIZ_BLUE),
      },
      background: {
        borderColor: paint(VIZ_BORDER),
      },
      controlBar: {
        color: paint(VIZ_BG),
        borderColor: paint(VIZ_CONTENT_SUBTLE),
      },
    },
    sparkline: {
      barNegativeColor: paint(VIZ_GRAY_SUBTLE),
      barPositiveColor: paint(VIZ_GRAY),
      firstLastColor: paint(VIZ_BLUE),
      lineColor: paint(VIZ_BLUE),
      lossColor: paint(VIZ_GRAY_SUBTLE),
      maxColor: paint(VIZ_RED),
      minColor: paint(VIZ_YELLOW),
      pointColor: paint(VIZ_BG),
      winColor: paint(VIZ_GRAY),
    },
    funnel: {
      item: {
        border: {
          color: paint(VIZ_BG),
        },
      },
    },
  };
}

const themes = [
  {
    baseThemeName: 'fluent.blue.light',
    theme: buildTheme('fluent-next.blue.light', LIGHT),
  },
  {
    baseThemeName: 'fluent-next.blue.light',
    theme: {
      name: 'fluent-next.blue.light.compact',
    },
  },
  {
    baseThemeName: 'fluent.blue.dark',
    theme: buildTheme('fluent-next.blue.dark', DARK),
  },
  {
    baseThemeName: 'fluent-next.blue.dark',
    theme: {
      name: 'fluent-next.blue.dark.compact',
    },
  },
];

export default themes;
