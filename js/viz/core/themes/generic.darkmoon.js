"use strict";

var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,

    BACKGROUND_COLOR = "#465672",
    TITLE_COLOR = "#fff",
    SUBTITLE_COLOR = "#919bac",
    TEXT_COLOR = "#c7ccd4",
    BORDER_COLOR = "#596980";

registerTheme({
    name: "generic.darkmoon",
    defaultPalette: "DarkMoon",

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
}, "generic.dark");
