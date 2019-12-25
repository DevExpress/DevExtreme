var themeModule = require('../../themes'),
    registerTheme = themeModule.registerTheme,
    registerThemeAlias = themeModule.registerThemeAlias,
    ACCENT_COLOR = '#7ab8eb',
    BACKGROUND_COLOR = '#fff',
    TITLE_COLOR = '#333',
    SUBTITLE_COLOR = '#99a1a8',
    TEXT_COLOR = '#707070',
    BORDER_COLOR = '#e8eaeb';

registerTheme({
    name: 'generic.softblue',
    defaultPalette: 'Soft Blue',

    backgroundColor: BACKGROUND_COLOR,
    primaryTitleColor: TITLE_COLOR,
    secondaryTitleColor: SUBTITLE_COLOR,
    gridColor: BORDER_COLOR,
    axisColor: TEXT_COLOR,
    'export': {
        backgroundColor: BACKGROUND_COLOR,
        font: {
            color: TITLE_COLOR
        },
        button: {
            'default': {
                color: TITLE_COLOR,
                borderColor: '#c9d0d4',
                backgroundColor: BACKGROUND_COLOR
            },
            hover: {
                color: TITLE_COLOR,
                borderColor: '#a7b2b9',
                backgroundColor: '#e6e6e6'
            },
            focus: {
                color: TITLE_COLOR,
                borderColor: '#82929b',
                backgroundColor: '#e6e6e6'
            },
            active: {
                color: TITLE_COLOR,
                borderColor: '#82929b',
                backgroundColor: '#d4d4d4'
            }
        }
    },
    legend: {
        font: {
            color: TEXT_COLOR
        }
    },
    tooltip: {
        color: BACKGROUND_COLOR,
        border: {
            color: BORDER_COLOR
        },
        font: {
            color: TITLE_COLOR
        }
    },
    'chart:common': {
        commonSeriesSettings: {
            label: {
                border: {
                    color: BORDER_COLOR
                }
            }
        }
    },
    'chart:common:annotation': {
        color: BACKGROUND_COLOR,
        border: {
            color: BORDER_COLOR
        },
        font: {
            color: TITLE_COLOR
        }
    },
    chart: {
        commonPaneSettings: {
            border: {
                color: BORDER_COLOR
            }
        },
        commonAxisSettings: {
            breakStyle: { color: '#cfd2d3' }
        }
    },
    rangeSelector: {
        scale: {
            breakStyle: { color: '#cfd2d3' },
            tick: {
                opacity: 0.12
            }
        },
        selectedRangeColor: ACCENT_COLOR,
        sliderMarker: {
            color: ACCENT_COLOR
        },
        sliderHandle: {
            color: ACCENT_COLOR,
            opacity: 0.5
        }
    },
    sparkline: {
        pointColor: BACKGROUND_COLOR,
        minColor: '#f0ad4e',
        maxColor: '#d9534f'
    },
    treeMap: {
        group: {
            color: BORDER_COLOR,
            label: {
                font: {
                    color: SUBTITLE_COLOR
                }
            }
        }
    },
    bullet: {
        color: ACCENT_COLOR
    },
    gauge: {
        valueIndicators: {
            'rangebar': {
                color: ACCENT_COLOR
            },
            'textcloud': {
                color: ACCENT_COLOR
            }
        }
    }
}, 'generic.light');

registerThemeAlias('generic.softblue.compact', 'generic.softblue');
