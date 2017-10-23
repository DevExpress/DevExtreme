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
    "export": {
        backgroundColor: BACKGROUND_COLOR,
        font: {
            color: TITLE_COLOR
        },
        button: {
            "default": {
                color: TITLE_COLOR,
                borderColor: "#a2b4b8",
                backgroundColor: BACKGROUND_COLOR
            },
            hover: {
                color: TITLE_COLOR,
                borderColor: "#7f989e",
                backgroundColor: "rgba(222, 222, 222, 0.4)"
            },
            focus: {
                color: TITLE_COLOR,
                borderColor: "#5f777c",
                backgroundColor: "rgba(222, 222, 222, 0.4)"
            },
            active: {
                color: TITLE_COLOR,
                borderColor: "#5f777c",
                backgroundColor: "rgba(222, 222, 222, 0.8)"
            }
        }
    },
    legend: {
        font: {
            color: TEXT_COLOR
        }
    },
    tooltip: {
        color: "#fff",
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
}, "generic.light");
