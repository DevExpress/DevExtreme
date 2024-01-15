import bar_gauge from './bar_gauge';
import bullet from './bullet';
import chart from './chart';
import {
  BLACK, CENTER,
  LIGHT_GREY,
  OUTSIDE, PRIMARY_TITLE_COLOR,
  RIGHT, SECONDARY_TITLE_COLOR, SOLID, TOP, WHITE,
} from './contants';
import funnel from './funnel';
import gauge from './gauge';
import pieChart from './pie_chart';
import polarChart from './polar_chart';
import rangeSelector from './range_selector';
import sankey from './sankey';
import sparkline from './sparkline';
import treeMap from './tree_map';
import vectorMap from './vector_map';

export default [{
  baseThemeName: undefined,
  theme: {
    name: 'generic.light',
    isDefault: true,
    font: {
      color: SECONDARY_TITLE_COLOR,
      family: '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif',
      weight: 400,
      size: 12,
      cursor: 'default',
    },
    redrawOnResize: true,
    backgroundColor: WHITE,
    primaryTitleColor: PRIMARY_TITLE_COLOR,
    secondaryTitleColor: SECONDARY_TITLE_COLOR,
    gridColor: LIGHT_GREY,
    axisColor: SECONDARY_TITLE_COLOR,
    title: {
      backgroundColor: WHITE,
      font: {
        size: 28,
        family: '\'Segoe UI Light\', \'Helvetica Neue Light\', \'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif',
        weight: 200,
      },
      subtitle: {
        font: {
          size: 16,
        },
        offset: 0,
        wordWrap: 'normal',
        textOverflow: 'ellipsis',
      },
      wordWrap: 'normal',
      textOverflow: 'ellipsis',
    },
    loadingIndicator: {
      text: 'Loading...',
    },
    export: {
      backgroundColor: WHITE,
      margin: 10,
      font: {
        size: 14,
        color: PRIMARY_TITLE_COLOR,
        weight: 400,
      },
      button: {
        margin: {
          top: 8,
          left: 10,
          right: 10,
          bottom: 8,
        },
        default: {
          color: '#333',
          borderColor: '#ddd',
          backgroundColor: WHITE,
        },
        hover: {
          color: '#333',
          borderColor: '#bebebe',
          backgroundColor: '#e6e6e6',
        },
        focus: {
          color: BLACK,
          borderColor: '#9d9d9d',
          backgroundColor: '#e6e6e6',
        },
        active: {
          color: '#333',
          borderColor: '#9d9d9d',
          backgroundColor: '#d4d4d4',
        },
      },
      shadowColor: LIGHT_GREY,
    },
    tooltip: {
      enabled: false,
      border: {
        width: 1,
        color: LIGHT_GREY,
        dashStyle: SOLID,
        visible: true,
      },
      font: {
        color: PRIMARY_TITLE_COLOR,
      },
      color: WHITE,
      arrowLength: 10,
      paddingLeftRight: 18,
      paddingTopBottom: 15,
      textAlignment: 'center',
      shared: false,
      location: CENTER,
      shadow: {
        opacity: 0.4,
        offsetX: 0,
        offsetY: 4,
        blur: 2,
        color: BLACK,
      },
      interactive: false,
    },
    legend: {
      hoverMode: 'includePoints',
      verticalAlignment: TOP,
      horizontalAlignment: RIGHT,
      position: OUTSIDE,
      visible: true,
      margin: 10,
      markerSize: 12,
      border: {
        visible: false,
        width: 1,
        cornerRadius: 0,
        dashStyle: SOLID,
      },
      paddingLeftRight: 20,
      paddingTopBottom: 15,
      columnCount: 0,
      rowCount: 0,
      columnItemSpacing: 20,
      rowItemSpacing: 8,
      title: {
        backgroundColor: WHITE,
        margin: {
          left: 0,
          bottom: 9,
          right: 0,
          top: 0,
        },
        font: {
          size: 18,
          weight: 200,
        },
        subtitle: {
          offset: 0,
          font: {
            size: 14,
          },
          wordWrap: 'none',
          textOverflow: 'ellipsis',
        },
        wordWrap: 'none',
        textOverflow: 'ellipsis',
      },
    },
    ...chart,
    ...funnel,
    ...gauge,
    ...bar_gauge,
    ...vectorMap,
    ...pieChart,
    ...polarChart,
    ...rangeSelector,
    ...sankey,
    ...sparkline,
    ...bullet,
    ...treeMap,
  },
}, {
  baseThemeName: 'generic.light',
  theme: {
    name: 'generic.light.compact',
  },
}];
