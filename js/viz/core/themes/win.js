var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,
    registerThemeSchemeAlias = themeModule.registerThemeSchemeAlias,
    BLACK = "#000000",
    WHITE = "#ffffff",
    WIN10_WHITE = "win10.white",
    WIN10_BLACK = "win10.black",
    WIN8_WHITE = "win8.white",
    WIN8_BLACK = "win8.black";

registerTheme({
    name: WIN10_BLACK,
    backgroundColor: BLACK,
    primaryTitleColor: WHITE,
    secondaryTitleColor: "#d8d8d8",
    axisColor: "#4c4c4c",
    axisLabelColor: WHITE,
    title: {
        font: {
            color: WHITE
        }
    },
    legend: {
        font: {
            color: WHITE
        }
    },
    tooltip: {
        color: BLACK,
        font: {
            color: WHITE
        }
    },
    "chart:common": {
        commonSeriesSettings: {
            label: {
                border: {
                    color: '#454545'
                }
            }
        }
    },
    chart: {
        commonPaneSettings: {
            border: {
                color: '#454545'
            }
        }
    },
    barGauge: {
        backgroundColor: "#2b3036"
    },
    rangeSelector: {
        scale: {
            tick: {
                color: WHITE,
                opacity: 0.23
            },
            minorTick: {
                color: WHITE,
                opacity: 0.07
            }
        }
    },
    treeMap: {
        group: {
            label: {
                font: {
                    color: "#d8d8d8"
                }
            }
        }
    }
}, "generic.dark");

registerTheme({
    name: WIN10_WHITE,
    backgroundColor: WHITE,
    primaryTitleColor: BLACK,
    secondaryTitleColor: "#767676",
    axisColor: "#ececec",
    axisLabelColor: BLACK,
    title: {
        font: {
            color: BLACK
        }
    },
    legend: {
        font: {
            color: BLACK
        }
    },
    tooltip: {
        font: {
            color: BLACK
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
                    color: "#767676"
                }
            }
        }
    }
}, "generic.light");

registerThemeSchemeAlias("win10.dark", WIN10_BLACK);
registerThemeSchemeAlias("win10.light", WIN10_WHITE);

registerTheme({ name: WIN8_BLACK }, WIN10_BLACK);
registerTheme({ name: WIN8_WHITE }, WIN10_WHITE);

registerThemeSchemeAlias("win8.dark", WIN8_BLACK);
registerThemeSchemeAlias("win8.light", WIN8_WHITE);
