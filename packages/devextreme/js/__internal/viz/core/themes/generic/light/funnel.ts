import {
  LEFT, LIGHT_GREY, RIGHT, SOLID, WHITE,
} from './contants';

export default {
  funnel: {
    sortData: true,
    valueField: 'val',
    colorField: 'color',
    argumentField: 'arg',
    hoverEnabled: true,
    selectionMode: 'single',
    item: {
      border: {
        visible: false,
        width: 2,
        color: WHITE,
      },
      hoverStyle: {
        hatching: {
          opacity: 0.75,
          step: 6,
          width: 2,
          direction: RIGHT,
        },
        border: { },
      },
      selectionStyle: {
        hatching: {
          opacity: 0.5,
          step: 6,
          width: 2,
          direction: RIGHT,
        },
        border: { },
      },
    },
    title: {
      margin: 10,
    },
    adaptiveLayout: {
      width: 80,
      height: 80,
      keepLabels: true,
    },
    legend: {
      visible: false,
    },
    _rtl: {
      legend: {
        itemTextPosition: LEFT,
      },
    },
    tooltip: {
      customizeTooltip(info: {
        valueText: string;
        item: { argument: string };
      }): { text: string } {
        return { text: `${info.item.argument} ${info.valueText}` };
      },
    },
    inverted: false,
    algorithm: 'dynamicSlope',
    neckWidth: 0,
    neckHeight: 0,
    resolveLabelOverlapping: 'shift',
    label: {
      textOverflow: 'ellipsis',
      wordWrap: 'normal',
      visible: true,
      horizontalAlignment: RIGHT,
      horizontalOffset: 0,
      verticalOffset: 0,
      showForZeroValues: false,
      customizeText(info: {
        valueText: string;
        item: { argument: string };
      }): string {
        return `${info.item.argument} ${info.valueText}`;
      },
      position: 'columns',
      font: {
        color: WHITE,
      },
      border: {
        visible: false,
        width: 1,
        color: LIGHT_GREY,
        dashStyle: SOLID,
      },
      connector: {
        visible: true,
        width: 1,
        opacity: 0.5,
      },
    },
  },
};
