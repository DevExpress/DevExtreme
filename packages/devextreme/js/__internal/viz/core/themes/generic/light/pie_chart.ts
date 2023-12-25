import { NONE, RIGHT, WHITE } from './contants';

export default {
  pie: {
    innerRadius: 0.5,
    minDiameter: 0.5,
    type: 'pie',
    dataPrepareSettings: {
      _skipArgumentSorting: true,
    },
    commonSeriesSettings: {
      pie: {
        border: {
          visible: false,
          width: 2,
          color: WHITE,
        },
        hoverStyle: {
          hatching: {
            direction: RIGHT,
            width: 4,
            step: 10,
            opacity: 0.75,
          },
          highlight: true,
          border: {
            visible: false,
            width: 2,
          },
        },
        selectionStyle: {
          hatching: {
            direction: RIGHT,
            width: 4,
            step: 10,
            opacity: 0.5,
          },
          highlight: true,
          border: {
            visible: false,
            width: 2,
          },
        },
      },
      doughnut: {
        border: {
          visible: false,
          width: 2,
          color: WHITE,
        },
        hoverStyle: {
          hatching: {
            direction: RIGHT,
            width: 4,
            step: 10,
            opacity: 0.75,
          },
          highlight: true,
          border: {
            visible: false,
            width: 2,
          },
        },
        selectionStyle: {
          hatching: {
            direction: RIGHT,
            width: 4,
            step: 10,
            opacity: 0.5,
          },
          highlight: true,
          border: {
            visible: false,
            width: 2,
          },
        },
      },
      donut: {
        border: {
          visible: false,
          width: 2,
          color: WHITE,
        },
        hoverStyle: {
          hatching: {
            direction: RIGHT,
            width: 4,
            step: 10,
            opacity: 0.75,
          },
          highlight: true,
          border: {
            visible: false,
            width: 2,
          },
        },
        selectionStyle: {
          hatching: {
            direction: RIGHT,
            width: 4,
            step: 10,
            opacity: 0.5,
          },
          highlight: true,
          border: {
            visible: false,
            width: 2,
          },
        },
      },
      label: {
        textOverflow: 'ellipsis',
        wordWrap: 'normal',
      },
    },
    legend: {
      hoverMode: 'allArgumentPoints',
      backgroundColor: NONE,
    },
    adaptiveLayout: {
      keepLabels: false,
    },
  },
};
