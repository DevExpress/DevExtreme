"use strict";

var themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme,

    WHITE = "#ffffff",
    BLACK = "#000000",
    CONTRAST_ACTIVE = "#cf00da",
    MARKER_COLOR = "#f8ca00",
    AREA_LAYER_COLOR = "#686868";

registerTheme({
    name: "generic.contrast",
    defaultPalette: "Bright",
    //CONTRAST_ACTIVE
    font: {
        color: WHITE
    },
    backgroundColor: BLACK,
    primaryTitleColor: WHITE,
    secondaryTitleColor: WHITE,
    axisColor: WHITE,
    axisLabelColor: WHITE,
    "export": {
        backgroundColor: BLACK,
        font: {
            color: WHITE
        },
        button: {
            "default": {
                color: WHITE,
                borderColor: WHITE,
                backgroundColor: BLACK
            },
            hover: {
                color: WHITE,
                borderColor: WHITE,
                backgroundColor: "#cf00d7"
            },
            focus: {
                color: WHITE,
                borderColor: "#cf00d7",
                backgroundColor: BLACK
            },
            active: {
                color: BLACK,
                borderColor: WHITE,
                backgroundColor: WHITE
            }
        },
        borderColor: WHITE,
        menuButtonColor: BLACK,
        activeBackgroundColor: WHITE,
        activeColor: BLACK,
        selectedBorderColor: CONTRAST_ACTIVE,
        selectedColor: CONTRAST_ACTIVE,
        shadowColor: "none"
    },
    tooltip: {
        border: {
            color: WHITE
        },
        font: {
            color: WHITE
        },
        color: BLACK
    },
    "chart:common": {
        commonSeriesSettings: {
            valueErrorBar: {
                color: WHITE
            },
            hoverStyle: {
                hatching: {
                    opacity: 0.5
                }
            },
            selectionStyle: {
                hatching: {
                    opacity: 0.35
                }
            },
            label: {
                font: {
                    color: WHITE
                },
                border: {
                    color: WHITE
                }
            }
        }
    },
    "chart:common:axis": {
        constantLineStyle: {
            color: WHITE
        }
    },
    chart: {
        commonSeriesSettings: {
        },
        commonPaneSettings: {
            backgroundColor: BLACK,
            border: {
                color: WHITE
            }
        },
        scrollBar: {
            color: WHITE
        }
    },
    pie: {
        commonSeriesSettings: {
            pie: {
                hoverStyle: {
                    hatching: {
                        opacity: 0.5
                    }
                },
                selectionStyle: {
                    hatching: {
                        opacity: 0.35
                    }
                }
            },
            doughnut: {
                hoverStyle: {
                    hatching: {
                        opacity: 0.5
                    }
                },
                selectionStyle: {
                    hatching: {
                        opacity: 0.35
                    }
                }
            },
            donut: {
                hoverStyle: {
                    hatching: {
                        opacity: 0.5
                    }
                },
                selectionStyle: {
                    hatching: {
                        opacity: 0.35
                    }
                }
            }
        }
    },
    gauge: {
        rangeContainer: {
            backgroundColor: WHITE
        },
        valueIndicators: {
            _default: {
                color: WHITE
            },
            "rangebar": {
                color: WHITE,
                backgroundColor: BLACK
            },
            "twocolorneedle": {
                secondColor: WHITE
            },
            "trianglemarker": {
                color: WHITE
            },
            "textcloud": {
                color: WHITE,
                text: {
                    font: {
                        color: BLACK
                    }
                }
            }
        }
    },
    barGauge: {
        backgroundColor: "#3c3c3c"
    },
    rangeSelector: {
        scale: {
            tick: {
                opacity: 0.4
            },
            minorTick: {
                opacity: 0.12
            }
        },
        selectedRangeColor: CONTRAST_ACTIVE,
        sliderMarker: {
            color: CONTRAST_ACTIVE
        },
        sliderHandle: {
            color: CONTRAST_ACTIVE,
            opacity: 1
        },
        shutter: {
            opacity: 0.75
        },
        background: {
            color: BLACK
        }
    },
    map: {
        background: {
            borderColor: WHITE
        },
        layer: {
            label: {
                stroke: BLACK,
                font: {
                    color: WHITE
                }
            }
        },
        "layer:area": {
            borderColor: BLACK,
            color: AREA_LAYER_COLOR,
            hoveredBorderColor: WHITE,
            selectedBorderColor: WHITE,
            label: {
                font: {
                    opacity: 1
                }
            }
        },
        "layer:line": {
            color: "#267cff",
            hoveredColor: "#f613ff",
            selectedColor: WHITE
        },
        "layer:marker:dot": {
            borderColor: BLACK,
            color: MARKER_COLOR,
            backColor: BLACK,
            backOpacity: 0.32
        },
        "layer:marker:bubble": {
            color: MARKER_COLOR,
            hoveredBorderColor: WHITE,
            selectedBorderColor: WHITE
        },
        "layer:marker:pie": {
            hoveredBorderColor: WHITE,
            selectedBorderColor: WHITE
        },
        legend: {
            markerColor: MARKER_COLOR
        },
        controlBar: {
            borderColor: WHITE,
            color: BLACK,
            opacity: 0.3
        }
    },
    treeMap: {
        tile: {
            color: "#70c92f"
        },
        group: {
            color: "#797979"
        }
    },
    sparkline: {
        pointColor: BLACK
    },
    bullet: {
    },
    polar: {
        commonSeriesSettings: {
        }
    },
    funnel: {
        label: {
            connector: {
                opacity: 1
            }
        }
    }
}, "generic.light");
