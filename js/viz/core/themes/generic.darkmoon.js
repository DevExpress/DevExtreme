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
    "export": {
        backgroundColor: BACKGROUND_COLOR,
        font: {
            color: TITLE_COLOR
        },
        button: {
            "default": {
                color: TITLE_COLOR,
                borderColor: "#7a889e",
                backgroundColor: BACKGROUND_COLOR
            },
            hover: {
                color: TITLE_COLOR,
                borderColor: "#9da8b8",
                backgroundColor: "#596e92"
            },
            focus: {
                color: TITLE_COLOR,
                borderColor: "#c4cad4",
                backgroundColor: "#596e92"
            },
            active: {
                color: TITLE_COLOR,
                borderColor: "#c4cad4",
                backgroundColor: "#6b80a4"
            }
        }
    },
    legend: {
        font: {
            color: TEXT_COLOR
        }
    },
    tooltip: {
        color: "#62789e",
        border: {
            color: BORDER_COLOR
        },
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
