const themeModule = require('../../themes');
const registerTheme = themeModule.registerTheme;
const registerThemeAlias = themeModule.registerThemeAlias;
const ACCENT_COLOR = '#9c63ff';
const BACKGROUND_COLOR = '#17171f';
const TITLE_COLOR = '#f5f6f7';
const SUBTITLE_COLOR = '#fff';
const TEXT_COLOR = '#b2b2b6';
const BORDER_COLOR = '#343840';

registerTheme({
    name: 'generic.darkviolet',
    defaultPalette: 'Dark Violet',

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
                borderColor: '#414152',
                backgroundColor: BACKGROUND_COLOR
            },
            hover: {
                color: TITLE_COLOR,
                borderColor: '#5c5c74',
                backgroundColor: '#2d2d3c'
            },
            focus: {
                color: TITLE_COLOR,
                borderColor: '#7c7c97',
                backgroundColor: '#2d2d3c'
            },
            active: {
                color: TITLE_COLOR,
                borderColor: '#7c7c97',
                backgroundColor: '#3c3c51'
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
            color: '#414152'
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
        font: {
            color: TITLE_COLOR
        },
        border: {
            color: '#414152'
        },
        color: BACKGROUND_COLOR
    },
    chart: {
        commonPaneSettings: {
            border: {
                color: BORDER_COLOR
            }
        },
        commonAxisSettings: {
            breakStyle: { color: '#575e6b' }
        }
    },
    funnel: {
        item: {
            border: {
                color: BACKGROUND_COLOR
            }
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
    rangeSelector: {
        shutter: {
            color: BACKGROUND_COLOR
        },
        scale: {
            breakStyle: { color: '#575e6b' },
            tick: {
                opacity: 0.2
            }
        },
        selectedRangeColor: ACCENT_COLOR,
        sliderMarker: {
            color: ACCENT_COLOR,
            font: {
                color: '#fff'
            }
        },
        sliderHandle: {
            color: ACCENT_COLOR,
            opacity: 0.5
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
    },
    sankey: {
        link: {
            border: {
                color: BACKGROUND_COLOR
            }
        },
        node: {
            border: {
                color: BACKGROUND_COLOR
            }
        }
    }
}, 'generic.dark');

registerThemeAlias('generic.darkviolet.compact', 'generic.darkviolet');
