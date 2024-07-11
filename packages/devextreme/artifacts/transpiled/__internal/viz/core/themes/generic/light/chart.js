"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contants = require("./contants");
var _default = exports.default = {
  'chart:common': {
    animation: {
      enabled: true,
      duration: 1000,
      easing: 'easeOutCubic',
      maxPointCountSupported: 300
    },
    commonSeriesSettings: {
      border: {
        visible: false,
        width: 2
      },
      showInLegend: true,
      visible: true,
      hoverMode: 'nearestPoint',
      selectionMode: 'includePoints',
      hoverStyle: {
        hatching: {
          direction: _contants.RIGHT,
          width: 2,
          step: 6,
          opacity: 0.75
        },
        highlight: true,
        border: {
          visible: false,
          width: 3
        }
      },
      selectionStyle: {
        hatching: {
          direction: _contants.RIGHT,
          width: 2,
          step: 6,
          opacity: 0.5
        },
        highlight: true,
        border: {
          visible: false,
          width: 3
        }
      },
      valueErrorBar: {
        displayMode: 'auto',
        value: 1,
        color: _contants.BLACK,
        lineWidth: 2,
        edgeLength: 8
      },
      label: {
        visible: false,
        alignment: _contants.CENTER,
        rotationAngle: 0,
        horizontalOffset: 0,
        verticalOffset: 0,
        radialOffset: 0,
        showForZeroValues: true,
        customizeText: undefined,
        maxLabelCount: undefined,
        position: _contants.OUTSIDE,
        font: {
          color: _contants.WHITE
        },
        border: {
          visible: false,
          width: 1,
          color: _contants.LIGHT_GREY,
          dashStyle: _contants.SOLID
        },
        connector: {
          visible: false,
          width: 1
        }
      }
    },
    seriesSelectionMode: 'single',
    pointSelectionMode: 'single',
    equalRowHeight: true,
    dataPrepareSettings: {
      checkTypeForAllData: false,
      convertToAxisDataType: true,
      sortingMethod: true
    },
    title: {
      margin: 10
    },
    adaptiveLayout: {
      width: 80,
      height: 80,
      keepLabels: true
    },
    _rtl: {
      legend: {
        itemTextPosition: _contants.LEFT
      }
    },
    resolveLabelOverlapping: _contants.NONE
  },
  'chart:common:axis': {
    visible: true,
    valueMarginsEnabled: true,
    placeholderSize: null,
    logarithmBase: 10,
    discreteAxisDivisionMode: 'betweenLabels',
    aggregatedPointsPosition: 'betweenTicks',
    width: 1,
    label: {
      visible: true
    },
    grid: {
      visible: false,
      width: 1
    },
    minorGrid: {
      visible: false,
      width: 1,
      opacity: 0.3
    },
    tick: {
      visible: true,
      width: 1,
      length: 7,
      shift: 3
    },
    minorTick: {
      visible: false,
      width: 1,
      opacity: 0.3,
      length: 7,
      shift: 3
    },
    stripStyle: {
      paddingLeftRight: 10,
      paddingTopBottom: 5
    },
    constantLineStyle: {
      width: 1,
      color: _contants.BLACK,
      dashStyle: _contants.SOLID,
      label: {
        visible: true,
        position: _contants.INSIDE
      }
    },
    marker: {
      label: {}
    }
  },
  'chart:common:annotation': {
    font: {
      color: '#333333'
    },
    tooltipEnabled: true,
    border: {
      width: 1,
      color: '#dddddd',
      dashStyle: _contants.SOLID,
      visible: true
    },
    color: _contants.WHITE,
    opacity: 0.9,
    arrowLength: 14,
    arrowWidth: 14,
    paddingLeftRight: 10,
    paddingTopBottom: 10,
    shadow: {
      opacity: 0.15,
      offsetX: 0,
      offsetY: 1,
      blur: 4,
      color: _contants.BLACK
    },
    image: {
      width: 30,
      height: 30
    },
    wordWrap: 'normal',
    textOverflow: 'ellipsis',
    allowDragging: false
  },
  chart: {
    commonSeriesSettings: {
      type: 'line',
      stack: 'default',
      aggregation: {
        enabled: undefined
      },
      point: {
        visible: true,
        symbol: 'circle',
        size: 12,
        border: {
          visible: false,
          width: 1
        },
        hoverMode: 'onlyPoint',
        selectionMode: 'onlyPoint',
        hoverStyle: {
          border: {
            visible: true,
            width: 4
          }
        },
        selectionStyle: {
          border: {
            visible: true,
            width: 4
          }
        }
      },
      scatter: {},
      line: {
        width: 2,
        dashStyle: _contants.SOLID,
        hoverStyle: {
          width: 3,
          hatching: {
            direction: _contants.NONE
          },
          highlight: false
        },
        selectionStyle: {
          width: 3
        }
      },
      stackedline: {
        width: 2,
        dashStyle: _contants.SOLID,
        hoverStyle: {
          width: 3,
          hatching: {
            direction: _contants.NONE
          },
          highlight: false
        },
        selectionStyle: {
          width: 3
        }
      },
      stackedspline: {
        width: 2,
        dashStyle: _contants.SOLID,
        hoverStyle: {
          width: 3,
          hatching: {
            direction: _contants.NONE
          },
          highlight: false
        },
        selectionStyle: {
          width: 3
        }
      },
      fullstackedline: {
        width: 2,
        dashStyle: _contants.SOLID,
        hoverStyle: {
          width: 3,
          hatching: {
            direction: _contants.NONE
          },
          highlight: false
        },
        selectionStyle: {
          width: 3
        }
      },
      fullstackedspline: {
        width: 2,
        dashStyle: _contants.SOLID,
        hoverStyle: {
          width: 3,
          hatching: {
            direction: _contants.NONE
          },
          highlight: false
        },
        selectionStyle: {
          width: 3
        }
      },
      stepline: {
        width: 2,
        dashStyle: _contants.SOLID,
        hoverStyle: {
          width: 3,
          hatching: {
            direction: _contants.NONE
          },
          highlight: false
        },
        selectionStyle: {
          width: 3
        }
      },
      area: {
        point: {
          visible: false
        },
        opacity: 0.5
      },
      stackedarea: {
        point: {
          visible: false
        },
        opacity: 0.5
      },
      fullstackedarea: {
        point: {
          visible: false
        },
        opacity: 0.5
      },
      fullstackedsplinearea: {
        point: {
          visible: false
        },
        opacity: 0.5
      },
      steparea: {
        border: {
          visible: true,
          width: 2
        },
        point: {
          visible: false
        },
        hoverStyle: {
          border: {
            visible: true,
            width: 3
          }
        },
        selectionStyle: {
          border: {
            visible: true,
            width: 3
          }
        },
        opacity: 0.5
      },
      spline: {
        width: 2,
        hoverStyle: {
          width: 3,
          hatching: {
            direction: _contants.NONE
          },
          highlight: false
        },
        selectionStyle: {
          width: 3
        }
      },
      splinearea: {
        point: {
          visible: false
        },
        opacity: 0.5
      },
      stackedsplinearea: {
        point: {
          visible: false
        },
        opacity: 0.5
      },
      bar: {
        cornerRadius: 0,
        point: {
          hoverStyle: {
            border: {
              visible: false
            }
          },
          selectionStyle: {
            border: {
              visible: false
            }
          }
        }
      },
      stackedbar: {
        cornerRadius: 0,
        point: {
          hoverStyle: {
            border: {
              visible: false
            }
          },
          selectionStyle: {
            border: {
              visible: false
            }
          }
        },
        label: {
          position: _contants.INSIDE
        }
      },
      fullstackedbar: {
        cornerRadius: 0,
        point: {
          hoverStyle: {
            border: {
              visible: false
            }
          },
          selectionStyle: {
            border: {
              visible: false
            }
          }
        },
        label: {
          position: _contants.INSIDE
        }
      },
      rangebar: {
        cornerRadius: 0,
        point: {
          hoverStyle: {
            border: {
              visible: false
            }
          },
          selectionStyle: {
            border: {
              visible: false
            }
          }
        }
      },
      rangearea: {
        point: {
          visible: false
        },
        opacity: 0.5
      },
      // eslint-disable-next-line spellcheck/spell-checker
      rangesplinearea: {
        point: {
          visible: false
        },
        opacity: 0.5
      },
      bubble: {
        opacity: 0.5,
        point: {
          hoverStyle: {
            border: {
              visible: false
            }
          },
          selectionStyle: {
            border: {
              visible: false
            }
          }
        }
      },
      candlestick: {
        width: 1,
        reduction: {
          color: _contants.RED
        },
        hoverStyle: {
          width: 3,
          hatching: {
            direction: _contants.NONE
          },
          highlight: false
        },
        selectionStyle: {
          width: 3,
          highlight: false
        },
        point: {
          border: {
            visible: true
          }
        }
      },
      stock: {
        width: 1,
        reduction: {
          color: _contants.RED
        },
        hoverStyle: {
          width: 3,
          hatching: {
            direction: _contants.NONE
          },
          highlight: false
        },
        selectionStyle: {
          width: 3,
          highlight: false
        },
        point: {
          border: {
            visible: true
          }
        }
      }
    },
    crosshair: {
      enabled: false,
      color: '#f05b41',
      width: 1,
      dashStyle: _contants.SOLID,
      label: {
        visible: false,
        font: {
          color: _contants.WHITE,
          size: 12
        }
      },
      verticalLine: {
        visible: true
      },
      horizontalLine: {
        visible: true
      }
    },
    commonAxisSettings: {
      multipleAxesSpacing: 5,
      forceUserTickInterval: false,
      breakStyle: {
        width: 5,
        color: '#ababab',
        line: 'waved'
      },
      label: {
        displayMode: 'standard',
        overlappingBehavior: 'hide',
        indentFromAxis: 10,
        wordWrap: 'normal',
        textOverflow: 'none'
      },
      title: {
        font: {
          size: 16
        },
        margin: 6,
        alignment: _contants.CENTER
      },
      constantLineStyle: {
        paddingLeftRight: 10,
        paddingTopBottom: 10
      }
    },
    horizontalAxis: {
      position: _contants.BOTTOM,
      axisDivisionFactor: 70,
      label: {
        rotationAngle: 90,
        staggeringSpacing: 5,
        alignment: _contants.CENTER
      },
      stripStyle: {
        label: {
          horizontalAlignment: _contants.CENTER,
          verticalAlignment: _contants.TOP
        }
      },
      constantLineStyle: {
        label: {
          horizontalAlignment: _contants.RIGHT,
          verticalAlignment: _contants.TOP
        }
      },
      constantLines: []
    },
    verticalAxis: {
      position: _contants.LEFT,
      axisDivisionFactor: 40,
      label: {
        alignment: _contants.RIGHT
      },
      stripStyle: {
        label: {
          horizontalAlignment: _contants.LEFT,
          verticalAlignment: _contants.CENTER
        }
      },
      constantLineStyle: {
        label: {
          horizontalAlignment: _contants.LEFT,
          verticalAlignment: _contants.TOP
        }
      },
      constantLines: []
    },
    argumentAxis: {
      endOnTick: false,
      aggregateByCategory: true,
      workWeek: [1, 2, 3, 4, 5]
    },
    valueAxis: {
      grid: {
        visible: true
      },
      autoBreaksEnabled: false,
      maxAutoBreakCount: 4
    },
    commonPaneSettings: {
      backgroundColor: _contants.NONE,
      border: {
        color: _contants.LIGHT_GREY,
        width: 1,
        visible: false,
        top: true,
        bottom: true,
        left: true,
        right: true,
        dashStyle: _contants.SOLID
      }
    },
    scrollBar: {
      visible: false,
      offset: 5,
      color: 'gray',
      width: 10
    },
    adjustOnZoom: true,
    autoHidePointMarkers: true,
    rotated: false,
    synchronizeMultiAxes: true,
    stickyHovering: true,
    barGroupPadding: 0.3,
    minBubbleSize: 12,
    maxBubbleSize: 0.2,
    zoomAndPan: {
      dragBoxStyle: {
        color: '#2a2a2a',
        opacity: 0.2
      },
      panKey: 'shift',
      allowMouseWheel: true,
      allowTouchGestures: true
    }
  }
};