var themeModule = require('../../themes'),
    registerTheme = themeModule.registerTheme,
    registerThemeAlias = themeModule.registerThemeAlias,
    ACCENT_COLOR = '#f05b41',
    BACKGROUND_COLOR = '#fff',
    TITLE_COLOR = '#333',
    SUBTITLE_COLOR = '#8899a8',
    TEXT_COLOR = '#707070',
    BORDER_COLOR = '#dee1e3';

registerTheme({
    name: 'generic.carmine',
    defaultPalette: 'Carmine',

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
                borderColor: '#b1b7bd',
                backgroundColor: BACKGROUND_COLOR
            },
            hover: {
                color: TITLE_COLOR,
                borderColor: '#b1b7bd',
                backgroundColor: '#faf2f0'
            },
            focus: {
                color: TITLE_COLOR,
                borderColor: '#6d7781',
                backgroundColor: '#faf2f0'
            },
            active: {
                color: TITLE_COLOR,
                borderColor: '#6d7781',
                backgroundColor: '#f5e7e4'
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
    chart: {
        commonPaneSettings: {
            border: {
                color: BORDER_COLOR
            }
        },
        commonAxisSettings: {
            breakStyle: { color: '#c1c5c7' }
        },
        commonAnnotationSettings: {
            font: {
                color: TITLE_COLOR
            },
            border: {
                color: BORDER_COLOR
            },
            color: BACKGROUND_COLOR
        }
    },
    rangeSelector: {
        scale: {
            breakStyle: { color: '#c1c5c7' },
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
        maxColor: '#f74d61'
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

registerThemeAlias('generic.carmine.compact', 'generic.carmine');
