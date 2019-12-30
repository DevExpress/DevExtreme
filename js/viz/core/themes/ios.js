const themeModule = require('../../themes');
const IOS7_DEFAULT = 'ios7.default';
const SECONDARY_TEXT_COLOR = '#767676';
const BORDER_COLOR = '#d3d3d3';
const BLACK = '#000000';

themeModule.registerTheme({
    name: IOS7_DEFAULT,
    backgroundColor: '#ffffff',
    primaryTitleColor: BLACK,
    secondaryTitleColor: SECONDARY_TEXT_COLOR,
    gridColor: '#ececec',
    axisColor: SECONDARY_TEXT_COLOR,
    legend: {
        font: {
            color: BLACK
        }
    },
    tooltip: {
        font: {
            color: SECONDARY_TEXT_COLOR
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
        }
    },
    rangeSelector: {
        scale: {
            tick: {
                color: BLACK,
                opacity: 0.1
            },
            minorTick: {
                color: BLACK,
                opacity: 0.03
            }
        }
    },
    treeMap: {
        group: {
            label: {
                font: {
                    color: SECONDARY_TEXT_COLOR
                }
            }
        }
    }
}, 'generic.light');
