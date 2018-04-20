"use strict";

var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,

    FONT_FAMILY = "'Roboto', 'Helvetica', 'Arial', sans-serif",

    LIGHT_TITLE_COLOR = "rgba(0,0,0,0.87)",
    LIGHT_LABEL_COLOR = "rgba(0,0,0,0.54)";

registerTheme({
    name: "material",
    defaultPalette: "Material",

    font: {
        family: FONT_FAMILY
    },
    title: {
        margin: 20,
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

    rangeSelector: {
        sliderHandle: {
            opacity: 0.5
        }
    },
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
        }
    }, "material." + themeName);    
}

registerMaterialColorScheme("blue", "light", "#03A9F4");
registerMaterialColorScheme("lime", "light", "#CDDC39");
registerMaterialColorScheme("orange", "light", "#FF5722");
registerMaterialColorScheme("purple", "light", "#9C27B0");
registerMaterialColorScheme("teal", "light", "#009688");
