"use strict";

var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,
    ACCENT_COLOR = "#3debd3",
    BACKGROUND_COLOR = "#465672",
    TITLE_COLOR = "#fff",
    SUBTITLE_COLOR = "#919bac",
    TEXT_COLOR = "#c7ccd4",
    BORDER_COLOR = "#596980";

registerTheme({
    name: "generic.darkmoon",
    defaultPalette: "Dark Moon",

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
        },
        commonAxisSettings: {
            breakStyle: { color: "#73869e" }
        }
    },
    barGauge: {
        backgroundColor: "#526280"
    },
    funnel: {
        item: {
            border: {
                color: BACKGROUND_COLOR
            }
        }
    },
    sparkline: {
        pointColor: BACKGROUND_COLOR
    },
    treeMap: {
        group: {
            color: BORDER_COLOR,
            label: {
                font: {
                    color: TITLE_COLOR
                }
            }
        }
    },
    map: {
        background: {
            borderColor: BORDER_COLOR
        },
        "layer:area": {
            color: "#97a3b6",
            borderColor: BACKGROUND_COLOR
        },
        "layer:marker:dot": {
            color: ACCENT_COLOR
        },
        "layer:marker:bubble": {
            color: ACCENT_COLOR
        },
        legend: {
            markerColor: ACCENT_COLOR
        }
    },
    rangeSelector: {
        shutter: {
            color: BACKGROUND_COLOR
        },
        scale: {
            breakStyle: { color: "#73869e" },
            tick: {
                opacity: 0.2
            }
        },
        selectedRangeColor: ACCENT_COLOR,
        sliderMarker: {
            color: ACCENT_COLOR,
            font: {
                color: "#000"
            }
        },
        sliderHandle: {
            color: ACCENT_COLOR,
            opacity: 0.5
        }
    }
}, "generic.dark");
