"use strict";

var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,

    BACKGROUND_COLOR = "#17171f",
    TITLE_COLOR = "#f5f6f7",
    SUBTITLE_COLOR = TITLE_COLOR,
    TEXT_COLOR = "#b2b2b6",
    BORDER_COLOR = "#343840";

registerTheme({
    name: "generic.darkviolet",
    defaultPalette: "DarkViolet",

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
