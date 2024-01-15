import {
  BOTTOM, CENTER,
} from './contants';

export default {
  barGauge: {
    backgroundColor: '#e0e0e0',
    relativeInnerRadius: 0.3,
    barSpacing: 4,
    resolveLabelOverlapping: 'hide',
    label: {
      indent: 20,
      connectorWidth: 2,
      font: {
        size: 16,
      },
    },
    legend: {
      visible: false,
    },
    indicator: {
      hasPositiveMeaning: true,
      layout: {
        horizontalAlignment: CENTER,
        verticalAlignment: BOTTOM,
      },
      text: {
        font: {
          size: 18,
        },
      },
    },
  },
};
