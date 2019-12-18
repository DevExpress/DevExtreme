var themeModule = require('../../themes'),
    registerTheme = themeModule.registerTheme,
    registerThemeAlias = themeModule.registerThemeAlias,
    WHITE = '#ffffff',
    BLACK = '#000000',
    SOME_GREY = '#2b2b2b',
    RANGE_COLOR = '#b5b5b5',
    GREY_GREEN = '#303030',
    AREA_LAYER_COLOR = '#686868',
    LINE_COLOR = '#c7c7c7',
    TARGET_COLOR = '#8e8e8e',
    POSITIVE_COLOR = '#b8b8b8',
    BORDER_COLOR = '#494949';

registerTheme({
    name: 'generic.dark',
    font: {
        color: '#808080'
    },
    backgroundColor: '#2a2a2a',
    primaryTitleColor: '#dedede',
    secondaryTitleColor: '#a3a3a3',
    gridColor: '#555555',
    axisColor: '#a3a3a3',
    'export': {
        backgroundColor: '#2a2a2a',
        font: {
            color: '#dbdbdb'
        },
        button: {
            'default': {
                color: '#dedede',
                borderColor: '#4d4d4d',
                backgroundColor: '#2e2e2e'
            },
            hover: {
                color: '#dedede',
                borderColor: '#6c6c6c',
                backgroundColor: '#444'
            },
            focus: {
                color: '#dedede',
                borderColor: '#8d8d8d',
                backgroundColor: '#444444'
            },
            active: {
                color: '#dedede',
                borderColor: '#8d8d8d',
                backgroundColor: '#555555'
            }
        },
        shadowColor: '#292929'
    },
    tooltip: {
        color: SOME_GREY,
        border: {
            color: BORDER_COLOR
        },
        font: {
            color: '#929292'
        }
    },
    'chart:common': {
        commonSeriesSettings: {
            label: {
                border: {
                    color: BORDER_COLOR
                }
            },
            valueErrorBar: {
                color: WHITE
            }
        }
    },
    'chart:common:axis': {
        constantLineStyle: {
            color: WHITE
        }
    },
    chart: {
        commonPaneSettings: {
            border: {
                color: BORDER_COLOR
            }
        },
        commonAxisSettings: {
            breakStyle: {
                color: '#818181'
            }
        },
        zoomAndPan: {
            dragBoxStyle: {
                color: WHITE
            }
        },
        commonAnnotationSettings: {
            font: {
                color: '#929292'
            },
            border: {
                color: BORDER_COLOR
            },
            color: SOME_GREY,
            shadow: {
                opacity: 0.008,
                offsetY: 4,
                blur: 8
            }
        }
    },
    gauge: {
        rangeContainer: {
            backgroundColor: RANGE_COLOR
        },
        valueIndicators: {
            _default: {
                color: RANGE_COLOR
            },
            'rangebar': {
                color: '#84788b'
            },
            'twocolorneedle': {
                secondColor: '#ba544d'
            },
            'trianglemarker': {
                color: '#b7918f'
            },
            'textcloud': {
                color: '#ba544d'
            }
        }
    },
    barGauge: {
        backgroundColor: '#3c3c3c'
    },
    rangeSelector: {
        scale: {
            tick: {
                color: WHITE,
                opacity: 0.32
            },
            minorTick: {
                color: WHITE,
                opacity: 0.1
            },
            breakStyle: {
                color: '#818181'
            }
        },
        selectedRangeColor: RANGE_COLOR,
        sliderMarker: {
            color: RANGE_COLOR,
            font: {
                color: GREY_GREEN
            }
        },
        sliderHandle: {
            color: WHITE,
            opacity: 0.2
        },
        shutter: {
            color: SOME_GREY,
            opacity: 0.9
        }
    },
    map: {
        background: {
            borderColor: '#3f3f3f'
        },
        layer: {
            label: {
                stroke: BLACK,
                font: {
                    color: WHITE
                }
            }
        },
        'layer:area': {
            borderColor: GREY_GREEN,
            color: AREA_LAYER_COLOR,
            hoveredBorderColor: WHITE,
            selectedBorderColor: WHITE
        },
        'layer:line': {
            color: '#c77244',
            hoveredColor: '#ff5d04',
            selectedColor: '#ff784f'
        },
        'layer:marker:bubble': {
            hoveredBorderColor: WHITE,
            selectedBorderColor: WHITE
        },
        'layer:marker:pie': {
            hoveredBorderColor: WHITE,
            selectedBorderColor: WHITE
        },
        legend: {
            border: {
                color: '#3f3f3f'
            },
            font: {
                color: WHITE
            }
        },
        controlBar: {
            borderColor: LINE_COLOR,
            color: GREY_GREEN
        }
    },
    treeMap: {
        group: {
            color: '#4c4c4c',
            label: {
                font: {
                    color: '#a3a3a3'
                }
            }
        }
    },
    sparkline: {
        lineColor: LINE_COLOR,
        firstLastColor: LINE_COLOR,
        barPositiveColor: POSITIVE_COLOR,
        barNegativeColor: TARGET_COLOR,
        winColor: POSITIVE_COLOR,
        lossColor: TARGET_COLOR,
        pointColor: GREY_GREEN
    },
    bullet: {
        targetColor: TARGET_COLOR
    },
    funnel: {
        item: {
            border: {
                color: '#2a2a2a'
            }
        }
    },
    sankey: {
        label: {
            font: {
                color: WHITE
            },
            shadow: {
                opacity: 0
            }
        },
        node: {
            border: {
                color: '#2a2a2a'
            }
        },
        link: {
            color: '#888888',
            border: {
                color: '#2a2a2a'
            },
            hoverStyle: {
                color: '#bbbbbb'
            }
        }
    }
}, 'generic.light');

registerThemeAlias('generic.dark.compact', 'generic.dark');
