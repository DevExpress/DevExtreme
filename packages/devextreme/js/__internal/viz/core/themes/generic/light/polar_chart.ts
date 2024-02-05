import {
  CENTER, NONE, RIGHT, SOLID, TOP,
} from './contants';

export default {
  polar: {
    commonSeriesSettings: {
      type: 'scatter',
      closed: true,
      point: {
        visible: true,
        symbol: 'circle',
        size: 12,
        border: {
          visible: false,
          width: 1,
        },
        hoverMode: 'onlyPoint',
        selectionMode: 'onlyPoint',
        hoverStyle: {
          border: {
            visible: true,
            width: 4,
          },
          size: 12,
        },
        selectionStyle: {
          border: {
            visible: true,
            width: 4,
          },
          size: 12,
        },
      },
      scatter: {
      },
      line: {
        width: 2,
        dashStyle: SOLID,
        hoverStyle: {
          width: 3,
          hatching: {
            direction: NONE,
          },
        },
        selectionStyle: {
          width: 3,
        },
      },
      area: {
        point: {
          visible: false,
        },
        opacity: 0.5,
      },
      stackedline: {
        width: 2,
      },
      bar: {
        opacity: 0.8,
      },
      stackedbar: {
        opacity: 0.8,
      },
    },
    adaptiveLayout: {
      width: 80,
      height: 80,
      keepLabels: true,
    },
    barGroupPadding: 0.3,
    commonAxisSettings: {
      visible: true,
      forceUserTickInterval: false,
      label: {
        overlappingBehavior: 'hide',
        indentFromAxis: 5,
      },
      grid: {
        visible: true,
      },
      minorGrid: {
        visible: true,
      },
      tick: {
        visible: true,
      },
      title: {
        font: {
          size: 16,
        },
        margin: 10,
      },
    },
    argumentAxis: {
      startAngle: 0,
      firstPointOnStartAngle: false,
      period: undefined,
    },
    valueAxis: {
      endOnTick: false,
      tick: {
        visible: false,
      },
    },
    horizontalAxis: {
      position: TOP,
      axisDivisionFactor: 50,
      label: {
        alignment: CENTER,
      },
    },
    verticalAxis: {
      position: TOP,
      axisDivisionFactor: 30,
      label: {
        alignment: RIGHT,
      },
    },
  },
};
