"use strict";

var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,

    BACKGROUND_COLOR = "#f5f5f5",
    TITLE_COLOR = "#28484f",
    SUBTITLE_COLOR = "#7eb2be",
    TEXT_COLOR = "#657c80",
    BORDER_COLOR = "#dedede";

registerTheme({
    name: "generic.greenmist",
    defaultPalette: "GreenMist",

    backgroundColor: BACKGROUND_COLOR,
    primaryTitleColor: TITLE_COLOR,
    secondaryTitleColor: SUBTITLE_COLOR,
    axisColor: BORDER_COLOR,
    axisLabelColor: TEXT_COLOR,
    legend: {
        font: {
            color: TEXT_COLOR
        }
    },
    tooltip: {
        font: {
            color: TITLE_COLOR
        }
    },
    "chart:common": {
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
    }
}, "generic.light");
