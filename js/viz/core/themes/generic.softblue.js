"use strict";

var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,

    BACKGROUND_COLOR = "#fff",
    TITLE_COLOR = "#333",
    SUBTITLE_COLOR = "#99a1a8",
    TEXT_COLOR = "#707070",
    BORDER_COLOR = "#e8eaeb";

registerTheme({
    name: "generic.softblue",
    defaultPalette: "SoftBlue",

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
