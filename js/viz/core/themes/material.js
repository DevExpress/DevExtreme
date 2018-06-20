"use strict";

var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,

    FONT_FAMILY = "'Roboto', 'RobotoFallback', 'Helvetica', 'Arial', sans-serif",

    LIGHT_TITLE_COLOR = "rgba(0,0,0,0.87)",
    LIGHT_LABEL_COLOR = "rgba(0,0,0,0.54)";

registerTheme({
    name: "material",
    defaultPalette: "Material",

    font: {
        family: FONT_FAMILY
    },
    title: {
        margin: {
            top: 20,
            bottom: 20,
            left: 0,
            right: 0
        },
        font: {
            size: 20,
            family: FONT_FAMILY,
            weight: 500
        },
        horizontalAlignment: "left",

        subtitle: {
            font: {
                size: 14
            },
            horizontalAlignment: "left"
        }
    },

    tooltip: {
        shadow: {
            opacity: 0
        },
        border: {
            visible: false
        },
        paddingLeftRight: 8,
        paddingTopBottom: 6,
        arrowLength: 0,
        location: "edge"
    },

    chart: {
        commonAxisSettings: {
            label: {
                font: {
                    size: 11
                }
            }
        }
    },

    pie: {
        title: {
            horizontalAlignment: "center",
            subtitle: {
                horizontalAlignment: "center"
            }
        }
    },

    polar: {
        title: {
            horizontalAlignment: "center",
            subtitle: {
                horizontalAlignment: "center"
            }
        }
    },

    funnel: {
        title: {
            horizontalAlignment: "center",
            subtitle: {
                horizontalAlignment: "center"
            }
        }
    },

    gauge: {
        title: {
            horizontalAlignment: "center",
            subtitle: {
                horizontalAlignment: "center"
            }
        }
    },

    barGauge: {
        title: {
            horizontalAlignment: "center",
            subtitle: {
                horizontalAlignment: "center"
            }
        }
    },

    rangeSelector: {
        sliderHandle: {
            opacity: 0.5
        }
    },

    treeMap: {
        group: {
            label: {
                font: {
                    weight: 500
                }
            }
        }
    }
}, "generic.light");

registerTheme({
    name: "material.light",
    axisColor: "#e0e0e0",
    axisLabelColor: LIGHT_LABEL_COLOR,
    title: {
        font: {
            color: LIGHT_TITLE_COLOR
        },

        subtitle: {
            font: {
                color: LIGHT_TITLE_COLOR
            }
        }
    },

    legend: {
        font: {
            color: LIGHT_LABEL_COLOR
        }
    },

    tooltip: {
        color: "#616161",
        font: {
            color: "#fff"
        }
    },

    chart: {
        scrollBar: {
            color: "#bfbfbf",
            opacity: 0.7
        }
    },

    gauge: {
        rangeContainer: {
            backgroundColor: "rgba(0,0,0,0.2)"
        }
    },

    barGauge: {
        backgroundColor: "#efefef"
    }
}, "material");

function registerMaterialColorScheme(accentName, themeName, accentColor) {
    registerTheme({
        name: "material." + accentName + "." + themeName,

        rangeSelector: {
            selectedRangeColor: accentColor,
            sliderMarker: {
                color: accentColor
            },
            sliderHandle: {
                color: accentColor
            }
        },

        map: {
            "layer:marker:dot": {
                color: accentColor
            },
            "layer:marker:bubble": {
                color: accentColor
            },
            legend: {
                markerColor: accentColor
            }
        },

        bullet: {
            color: accentColor
        },

        gauge: {
            valueIndicators: {
                "rangebar": {
                    color: accentColor
                },
                "textcloud": {
                    color: accentColor
                }
            }
        }
    }, "material." + themeName);
}

registerMaterialColorScheme("blue", "light", "#03a9f4");
registerMaterialColorScheme("lime", "light", "#cddc39");
registerMaterialColorScheme("orange", "light", "#ff5722");
registerMaterialColorScheme("purple", "light", "#9c27b0");
registerMaterialColorScheme("teal", "light", "#009688");
