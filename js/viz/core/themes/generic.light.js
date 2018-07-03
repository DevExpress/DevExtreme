"use strict";

var WHITE = "#ffffff",
    BLACK = "#000000",
    LIGHT_GREY = "#d3d3d3",
    GREY_GREEN = "#303030",
    SOME_GREY = "#2b2b2b",
    RED = "#ff0000",
    PRIMARY_TITLE_COLOR = "#232323",
    SECONDARY_TITLE_COLOR = "#767676",

    NONE = "none",
    SOLID = "solid",
    TOP = "top",
    RIGHT = "right",
    BOTTOM = "bottom",
    LEFT = "left",
    CENTER = "center",
    INSIDE = "inside",
    OUTSIDE = "outside",

    themeModule = require("../../themes"),
    registerTheme = themeModule.registerTheme;

registerTheme({
    name: "generic.light",
    isDefault: true,
    font: {
        color: SECONDARY_TITLE_COLOR,
        family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif",
        weight: 400,
        size: 12,
        cursor: "default"
    },
    redrawOnResize: true,
    backgroundColor: WHITE,
    primaryTitleColor: PRIMARY_TITLE_COLOR,
    secondaryTitleColor: SECONDARY_TITLE_COLOR,
    axisColor: LIGHT_GREY,
    axisLabelColor: SECONDARY_TITLE_COLOR,
    title: {
        backgroundColor: WHITE,
        font: {
            size: 28,
            family: "'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif",
            weight: 200
        },
        subtitle: {
            font: {
                size: 16
            }
        }
    },
    loadingIndicator: {
        text: "Loading..."
    },
    "export": {
        backgroundColor: WHITE,
        margin: 10,
        font: {
            size: 14,
            color: PRIMARY_TITLE_COLOR,
            weight: 400
        },
        button: {
            "default": {
                color: "#333",
                borderColor: "#ddd",
                backgroundColor: WHITE
            },
            hover: {
                color: "#333",
                borderColor: "#bebebe",
                backgroundColor: "#e6e6e6"
            },
            focus: {
                color: BLACK,
                borderColor: "#9d9d9d",
                backgroundColor: "#e6e6e6"
            },
            active: {
                color: "#333",
                borderColor: "#9d9d9d",
                backgroundColor: "#d4d4d4"
            }
        },
        shadowColor: LIGHT_GREY
    },
    tooltip: {
        enabled: false,
        border: {
            width: 1,
            color: LIGHT_GREY,
            dashStyle: SOLID,
            visible: true
        },
        font: {
            color: PRIMARY_TITLE_COLOR
        },
        color: WHITE,
        arrowLength: 10,
        paddingLeftRight: 18,
        paddingTopBottom: 15,
        shared: false,
        location: CENTER,
        shadow: {
            opacity: 0.4,
            offsetX: 0,
            offsetY: 4,
            blur: 2,
            color: BLACK
        }
    },
    legend: {
        hoverMode: "includePoints",
        verticalAlignment: TOP,
        horizontalAlignment: RIGHT,
        position: OUTSIDE,
        visible: true,
        margin: 10,
        markerSize: 12,
        border: {
            visible: false,
            width: 1,
            cornerRadius: 0,
            dashStyle: SOLID
        },
        paddingLeftRight: 20,
        paddingTopBottom: 15,
        columnCount: 0,
        rowCount: 0,
        columnItemSpacing: 20,
        rowItemSpacing: 8
    },
    "chart:common": {
        animation: {
            enabled: true,
            duration: 1000,
            easing: "easeOutCubic",
            maxPointCountSupported: 300
        },
        commonSeriesSettings: {
            border: {
                visible: false,
                width: 2
            },
            showInLegend: true,
            visible: true,
            hoverMode: "nearestPoint",
            selectionMode: "includePoints",
            hoverStyle: {
                hatching: {
                    direction: RIGHT,
                    width: 2,
                    step: 6,
                    opacity: 0.75
                },
                border: {
                    visible: false,
                    width: 3
                }
            },
            selectionStyle: {
                hatching: {
                    direction: RIGHT,
                    width: 2,
                    step: 6,
                    opacity: 0.5
                },
                border: {
                    visible: false,
                    width: 3
                }
            },
            valueErrorBar: {
                displayMode: "auto",
                value: 1,
                color: BLACK,
                lineWidth: 2,
                edgeLength: 8
            },
            label: {
                visible: false,
                alignment: CENTER,
                rotationAngle: 0,
                horizontalOffset: 0,
                verticalOffset: 0,
                radialOffset: 0,
                showForZeroValues: true,
                customizeText: undefined,
                maxLabelCount: undefined,
                position: OUTSIDE,
                font: {
                    color: WHITE
                },
                border: {
                    visible: false,
                    width: 1,
                    color: LIGHT_GREY,
                    dashStyle: SOLID
                },
                connector: {
                    visible: false,
                    width: 1
                }
            }
        },
        seriesSelectionMode: "single",
        pointSelectionMode: "single",
        equalRowHeight: true,
        dataPrepareSettings: {
            checkTypeForAllData: false,
            convertToAxisDataType: true,
            sortingMethod: true
        },
        title: {
            margin: 10
        },
        adaptiveLayout: {
            width: 80,
            height: 80,
            keepLabels: true
        },
        _rtl: {
            legend: {
                itemTextPosition: LEFT
            }
        },
        resolveLabelOverlapping: NONE
    },
    "chart:common:axis": {
        visible: false,
        valueMarginsEnabled: true,
        placeholderSize: null,
        logarithmBase: 10,
        discreteAxisDivisionMode: "betweenLabels",
        width: 1,
        label: {
            visible: true
        },
        grid: {
            visible: false,
            width: 1
        },
        minorGrid: {
            visible: false,
            width: 1,
            opacity: 0.3
        },
        tick: {
            visible: false,
            width: 1,
            length: 8
        },
        minorTick: {
            visible: false,
            width: 1,
            opacity: 0.3,
            length: 8
        },
        stripStyle: {
            paddingLeftRight: 10,
            paddingTopBottom: 5
        },
        constantLineStyle: {
            width: 1,
            color: BLACK,
            dashStyle: SOLID,
            label: {
                visible: true,
                position: INSIDE
            }
        },
        marker: {
            label: {}
        }
    },
    chart: {
        commonSeriesSettings: {
            type: "line",
            stack: "default",
            aggregation: {
                enabled: undefined
            },
            "point": {
                visible: true,
                symbol: "circle",
                size: 12,
                border: {
                    visible: false,
                    width: 1
                },
                hoverMode: "onlyPoint",
                selectionMode: "onlyPoint",
                hoverStyle: {
                    border: {
                        visible: true,
                        width: 4
                    }
                },
                selectionStyle: {
                    border: {
                        visible: true,
                        width: 4
                    }
                }
            },
            "scatter": {
            },
            "line": {
                width: 2,
                dashStyle: SOLID,
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                }
            },
            "stackedline": {
                width: 2,
                dashStyle: SOLID,
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                }
            },
            "stackedspline": {
                width: 2,
                dashStyle: SOLID,
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                }
            },
            "fullstackedline": {
                width: 2,
                dashStyle: SOLID,
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                }
            },
            "fullstackedspline": {
                width: 2,
                dashStyle: SOLID,
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                }
            },
            "stepline": {
                width: 2,
                dashStyle: SOLID,
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                }
            },
            "area": {
                point: {
                    visible: false
                },
                opacity: 0.5
            },
            "stackedarea": {
                point: {
                    visible: false
                },
                opacity: 0.5
            },
            "fullstackedarea": {
                point: {
                    visible: false
                },
                opacity: 0.5
            },
            "fullstackedsplinearea": {
                point: {
                    visible: false
                },
                opacity: 0.5
            },
            "steparea": {
                border: {
                    visible: true,
                    width: 2
                },
                point: {
                    visible: false
                },
                hoverStyle: {
                    border: {
                        visible: true,
                        width: 3
                    }
                },
                selectionStyle: {
                    border: {
                        visible: true,
                        width: 3
                    }
                },
                opacity: 0.5
            },
            "spline": {
                width: 2,
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                }
            },
            "splinearea": {
                point: {
                    visible: false
                },
                opacity: 0.5
            },
            "stackedsplinearea": {
                point: {
                    visible: false
                },
                opacity: 0.5
            },
            "bar": {
                cornerRadius: 0,
                point: {
                    hoverStyle: {
                        border: {
                            visible: false
                        }
                    },
                    selectionStyle: {
                        border: {
                            visible: false
                        }
                    }
                }
            },
            "stackedbar": {
                cornerRadius: 0,
                point: {
                    hoverStyle: {
                        border: {
                            visible: false
                        }
                    },
                    selectionStyle: {
                        border: {
                            visible: false
                        }
                    }
                },
                label: {
                    position: INSIDE
                }
            },
            "fullstackedbar": {
                cornerRadius: 0,
                point: {
                    hoverStyle: {
                        border: {
                            visible: false
                        }
                    },
                    selectionStyle: {
                        border: {
                            visible: false
                        }
                    }
                },
                label: {
                    position: INSIDE
                }
            },
            "rangebar": {
                cornerRadius: 0,
                point: {
                    hoverStyle: {
                        border: {
                            visible: false
                        }
                    },
                    selectionStyle: {
                        border: {
                            visible: false
                        }
                    }
                }
            },
            "rangearea": {
                point: {
                    visible: false
                },
                opacity: 0.5
            },
            "rangesplinearea": {
                point: {
                    visible: false
                },
                opacity: 0.5
            },

            "bubble": {
                opacity: 0.5,
                point: {
                    hoverStyle: {
                        border: {
                            visible: false
                        }
                    },
                    selectionStyle: {
                        border: {
                            visible: false
                        }
                    }
                }
            },
            "candlestick": {
                width: 1,
                reduction: {
                    color: RED
                },
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                },
                point: {
                    border: {
                        visible: true
                    }
                }
            },
            "stock": {
                width: 1,
                reduction: {
                    color: RED
                },
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                },
                point: {
                    border: {
                        visible: true
                    }
                }
            }
        },
        crosshair: {
            enabled: false,
            color: "#f05b41",
            width: 1,
            dashStyle: SOLID,
            label: {
                visible: false,
                font: {
                    color: WHITE,
                    size: 12
                }
            },
            verticalLine: {
                visible: true
            },
            horizontalLine: {
                visible: true
            }
        },
        commonAxisSettings: {
            multipleAxesSpacing: 5,
            forceUserTickInterval: false,
            breakStyle: { width: 5, color: "#ababab", line: "waved" },
            label: {
                displayMode: "standard",
                overlappingBehavior: "hide",
                indentFromAxis: 10
            },
            title: {
                font: {
                    size: 16
                },
                margin: 6
            },
            constantLineStyle: {
                paddingLeftRight: 10,
                paddingTopBottom: 10
            }
        },
        horizontalAxis: {
            position: BOTTOM,
            axisDivisionFactor: 70,
            label: {
                rotationAngle: 90,
                staggeringSpacing: 5,
                alignment: CENTER
            },
            stripStyle: {
                label: {
                    horizontalAlignment: CENTER,
                    verticalAlignment: TOP
                }
            },
            constantLineStyle: {
                label: {
                    horizontalAlignment: RIGHT,
                    verticalAlignment: TOP
                }
            },
            constantLines: []
        },
        verticalAxis: {
            position: LEFT,
            axisDivisionFactor: 40,
            label: {
                alignment: RIGHT
            },
            stripStyle: {
                label: {
                    horizontalAlignment: LEFT,
                    verticalAlignment: CENTER
                }
            },
            constantLineStyle: {
                label: {
                    horizontalAlignment: LEFT,
                    verticalAlignment: TOP
                }
            },
            constantLines: []
        },
        argumentAxis: {
            endOnTick: false,
            workWeek: [1, 2, 3, 4, 5]
        },
        valueAxis: {
            grid: {
                visible: true
            },
            autoBreaksEnabled: false,
            maxAutoBreakCount: 4
        },
        commonPaneSettings: {
            backgroundColor: NONE,
            border: {
                color: LIGHT_GREY,
                width: 1,
                visible: false,
                top: true,
                bottom: true,
                left: true,
                right: true,
                dashStyle: SOLID
            }
        },
        scrollBar: {
            visible: false,
            offset: 5,
            color: "gray",
            width: 10
        },
        adjustOnZoom: true,
        rotated: false,
        zoomingMode: NONE,
        scrollingMode: NONE,
        synchronizeMultiAxes: true,
        equalBarWidth: true,
        barGroupPadding: 0.3,
        minBubbleSize: 12,
        maxBubbleSize: 0.2
    },
    pie: {
        innerRadius: 0.5,
        minDiameter: 0.5,
        type: "pie",
        dataPrepareSettings: {
            _skipArgumentSorting: true
        },
        commonSeriesSettings: {
            pie: {
                border: {
                    visible: false,
                    width: 2,
                    color: WHITE
                },
                hoverStyle: {
                    hatching: {
                        direction: RIGHT,
                        width: 4,
                        step: 10,
                        opacity: 0.75
                    },
                    border: {
                        visible: false,
                        width: 2
                    }
                },
                selectionStyle: {
                    hatching: {
                        direction: RIGHT,
                        width: 4,
                        step: 10,
                        opacity: 0.5
                    },
                    border: {
                        visible: false,
                        width: 2
                    }
                }
            },
            doughnut: {
                border: {
                    visible: false,
                    width: 2,
                    color: WHITE
                },
                hoverStyle: {
                    hatching: {
                        direction: RIGHT,
                        width: 4,
                        step: 10,
                        opacity: 0.75
                    },
                    border: {
                        visible: false,
                        width: 2
                    }
                },
                selectionStyle: {
                    hatching: {
                        direction: RIGHT,
                        width: 4,
                        step: 10,
                        opacity: 0.5
                    },
                    border: {
                        visible: false,
                        width: 2
                    }
                }
            },
            donut: {
                border: {
                    visible: false,
                    width: 2,
                    color: WHITE
                },
                hoverStyle: {
                    hatching: {
                        direction: RIGHT,
                        width: 4,
                        step: 10,
                        opacity: 0.75
                    },
                    border: {
                        visible: false,
                        width: 2
                    }
                },
                selectionStyle: {
                    hatching: {
                        direction: RIGHT,
                        width: 4,
                        step: 10,
                        opacity: 0.5
                    },
                    border: {
                        visible: false,
                        width: 2
                    }
                }
            }
        },
        legend: {
            hoverMode: "allArgumentPoints",
            backgroundColor: NONE
        },
        adaptiveLayout: {
            keepLabels: false
        }
    },
    gauge: {
        scale: {
            tick: {
                visible: true,
                length: 5,
                width: 2,
                opacity: 1
            },
            minorTick: {
                visible: false,
                length: 3,
                width: 1,
                opacity: 1
            },
            label: {
                visible: true,
                alignment: CENTER,
                hideFirstOrLast: "last",
                overlappingBehavior: "hide"
            },
            position: TOP,
            endOnTick: false
        },
        rangeContainer: {
            offset: 0,
            width: 5,
            backgroundColor: "#808080"
        },
        valueIndicators: {
            _default: {
                color: "#c2c2c2"
            },
            "rangebar": {
                space: 2,
                size: 10,
                color: "#cbc5cf",
                backgroundColor: NONE,
                text: {
                    indent: 0,
                    font: {
                        size: 14,
                        color: null
                    }
                }
            },
            "twocolorneedle": {
                secondColor: "#e18e92"
            },
            "trianglemarker": {
                space: 2,
                length: 14,
                width: 13,
                color: "#8798a5"
            },
            "textcloud": {
                arrowLength: 5,
                horizontalOffset: 6,
                verticalOffset: 3,
                color: "#679ec5",
                text: {
                    font: {
                        color: WHITE,
                        size: 18
                    }
                }
            }
        },
        indicator: {
            hasPositiveMeaning: true,
            layout: {
                horizontalAlignment: CENTER,
                verticalAlignment: BOTTOM
            },
            text: {
                font: {
                    size: 18
                }
            }
        },
        _circular: {
            scale: {
                orientation: OUTSIDE,
                label: {
                    indentFromTick: 10
                }
            },
            rangeContainer: {
                orientation: OUTSIDE
            },
            valueIndicatorType: "rectangleneedle",
            subvalueIndicatorType: "trianglemarker",
            valueIndicators: {
                _type: "rectangleneedle",
                _default: {
                    offset: 20,
                    indentFromCenter: 0,
                    width: 2,
                    spindleSize: 14,
                    spindleGapSize: 10,
                    beginAdaptingAtRadius: 50
                },
                "triangleneedle": {
                    width: 4
                },
                "twocolorneedle": {
                    space: 2,
                    secondFraction: 0.4
                },
                "rangebar": {
                    offset: 30
                },
                "trianglemarker": {
                    offset: 6
                },
                "textcloud": {
                    offset: -6
                }
            }
        },
        _linear: {
            scale: {
                horizontalOrientation: RIGHT,
                verticalOrientation: BOTTOM,
                label: {
                    indentFromTick: -10
                }
            },
            rangeContainer: {
                horizontalOrientation: RIGHT,
                verticalOrientation: BOTTOM
            },
            valueIndicatorType: "rangebar",
            subvalueIndicatorType: "trianglemarker",
            valueIndicators: {
                _type: "rectangle",
                _default: {
                    offset: 2.5,
                    length: 15,
                    width: 15
                },
                "rectangle": {
                    width: 10
                },
                "rangebar": {
                    offset: 10,
                    horizontalOrientation: RIGHT,
                    verticalOrientation: BOTTOM
                },
                "trianglemarker": {
                    offset: 10,
                    horizontalOrientation: LEFT,
                    verticalOrientation: TOP
                },
                "textcloud": {
                    offset: -1,
                    horizontalOrientation: LEFT,
                    verticalOrientation: TOP
                }
            }
        }
    },
    barGauge: {
        backgroundColor: "#e0e0e0",
        relativeInnerRadius: 0.3,
        barSpacing: 4,
        label: {
            indent: 20,
            connectorWidth: 2,
            font: {
                size: 16
            }
        },
        indicator: {
            hasPositiveMeaning: true,
            layout: {
                horizontalAlignment: CENTER,
                verticalAlignment: BOTTOM
            },
            text: {
                font: {
                    size: 18
                }
            }
        }
    },
    rangeSelector: {
        scale: {
            valueMarginsEnabled: true,
            width: 1,
            color: BLACK,
            opacity: 0.1,
            showCustomBoundaryTicks: true,
            label: {
                overlappingBehavior: "hide",
                alignment: "center",
                visible: true,
                topIndent: 7,
                font: {
                    size: 11
                }
            },
            tick: {
                width: 1,
                color: BLACK,
                opacity: 0.17,
                visible: true,
                length: 12
            },
            minorTick: {
                width: 1,
                color: BLACK,
                opacity: 0.05,
                visible: true,
                length: 12
            },
            marker: {
                width: 1,
                color: "#000000",
                opacity: 0.1,
                visible: true,
                separatorHeight: 33,
                topIndent: 10,
                textLeftIndent: 7,
                textTopIndent: 11,
                label: {}
            },
            logarithmBase: 10,
            workWeek: [1, 2, 3, 4, 5],
            breakStyle: { width: 5, color: "#ababab", line: "waved" },
            endOnTick: false
        },
        selectedRangeColor: "#606060",
        sliderMarker: {
            visible: true,
            paddingTopBottom: 2,
            paddingLeftRight: 4,
            color: "#606060",
            invalidRangeColor: RED,
            font: {
                color: WHITE,
                size: 11
            }
        },
        sliderHandle: {
            width: 1,
            color: BLACK,
            opacity: 0.2
        },
        shutter: {
            opacity: 0.75
        },
        background: {
            color: "#c0bae1",
            visible: true,
            image: {
                location: "full"
            }
        },
        behavior: {
            snapToTicks: true,
            animationEnabled: true,
            moveSelectedRangeByClick: true,
            manualRangeSelectionEnabled: true,
            allowSlidersSwap: true,
            callValueChanged: "onMovingComplete"
        },
        redrawOnResize: true,
        chart: {
            equalBarWidth: true,
            barGroupPadding: 0.3,
            minBubbleSize: 12,
            maxBubbleSize: 0.2,
            topIndent: 0.1,
            bottomIndent: 0,
            valueAxis: {
                inverted: false,
                logarithmBase: 10
            },
            commonSeriesSettings: {
                type: "area",
                aggregation: {
                    enabled: undefined
                },
                point: {
                    visible: false
                },
                scatter: {
                    point: {
                        visible: true
                    }
                }
            }
        }
    },
    map: {
        title: {
            margin: 10
        },
        background: {
            borderWidth: 1,
            borderColor: "#cacaca"
        },
        layer: {
            label: {
                enabled: false,
                stroke: WHITE,
                "stroke-width": 1,
                "stroke-opacity": 0.7,
                font: {
                    color: SOME_GREY,
                    size: 12
                }
            }
        },
        "layer:area": {
            borderWidth: 1,
            borderColor: WHITE,
            color: "#d2d2d2",
            hoveredBorderColor: GREY_GREEN,
            selectedBorderWidth: 2,
            selectedBorderColor: GREY_GREEN,
            label: {
                "stroke-width": 2,
                font: {
                    size: 16
                }
            }
        },
        "layer:line": {
            borderWidth: 2,
            color: "#ba8365",
            hoveredColor: "#a94813",
            selectedBorderWidth: 3,
            selectedColor: "#e55100",
            label: {
                "stroke-width": 2,
                font: {
                    size: 16
                }
            }
        },
        "layer:marker": {
            label: {
                enabled: true,
                "stroke-width": 1,
                font: {
                    size: 12
                }
            }
        },
        "layer:marker:dot": {
            borderWidth: 2,
            borderColor: WHITE,
            size: 8,
            selectedStep: 2,
            backStep: 18,
            backColor: WHITE,
            backOpacity: 0.32,
            shadow: true
        },
        "layer:marker:bubble": {
            minSize: 20,
            maxSize: 50,
            hoveredBorderWidth: 1,
            hoveredBorderColor: GREY_GREEN,
            selectedBorderWidth: 2,
            selectedBorderColor: GREY_GREEN
        },
        "layer:marker:pie": {
            size: 50,
            hoveredBorderWidth: 1,
            hoveredBorderColor: GREY_GREEN,
            selectedBorderWidth: 2,
            selectedBorderColor: GREY_GREEN
        },
        "layer:marker:image": {
            size: 20
        },
        legend: {
            verticalAlignment: BOTTOM,
            horizontalAlignment: RIGHT,
            position: INSIDE,
            backgroundOpacity: 0.65,
            border: {
                visible: true
            },
            paddingLeftRight: 16,
            paddingTopBottom: 12
        },
        controlBar: {
            borderColor: "#5d5d5d",
            borderWidth: 3,
            color: WHITE,
            margin: 20,
            opacity: 0.3
        },
        _rtl: {
            legend: {
                itemTextPosition: LEFT
            }
        }
    },
    treeMap: {
        tile: {
            border: {
                width: 1,
                opacity: 0.2,
                color: "#000000"
            },
            color: "#5f8b95",
            hoverStyle: {
                hatching: {
                    opacity: 0.75,
                    step: 6,
                    width: 2,
                    direction: "right"
                },
                border: {
                }
            },
            selectionStyle: {
                hatching: {
                    opacity: 0.5,
                    step: 6,
                    width: 2,
                    direction: "right"
                },
                border: {
                    opacity: 1
                }
            },
            label: {
                visible: true,
                paddingLeftRight: 5,
                paddingTopBottom: 4,
                stroke: "#000000",
                "stroke-width": 1,
                "stroke-opacity": 0.3,
                font: {
                    color: "#ffffff",
                    weight: 300
                },
                shadow: {
                    opacity: 0.8,
                    offsetX: 0,
                    offsetY: 1,
                    blur: 1,
                    color: "#000000"
                }
            }
        },
        group: {
            padding: 4,
            border: {
                width: 1
            },
            color: "#eeeeee",
            hoverStyle: {
                hatching: {
                    opacity: 0,
                    step: 6,
                    width: 2,
                    direction: "right"
                },
                border: {
                }
            },
            selectionStyle: {
                hatching: {
                    opacity: 0,
                    step: 6,
                    width: 2,
                    direction: "right"
                },
                border: {
                }
            },
            label: {
                visible: true,
                paddingLeftRight: 5,
                paddingTopBottom: 4,
                font: {
                    color: SECONDARY_TITLE_COLOR,
                    weight: 600
                }
            }
        },

        title: {
            subtitle: {
            }
        },

        tooltip: {
        },

        loadingIndicator: {
        }
    },
    sparkline: {
        lineColor: "#666666",
        lineWidth: 2,
        areaOpacity: 0.2,
        minColor: "#e8c267",
        maxColor: "#e55253",
        barPositiveColor: "#a9a9a9",
        barNegativeColor: "#d7d7d7",
        winColor: "#a9a9a9",
        lossColor: "#d7d7d7",
        firstLastColor: "#666666",
        pointSymbol: "circle",
        pointColor: WHITE,
        pointSize: 4,
        type: "line",
        argumentField: "arg",
        valueField: "val",
        winlossThreshold: 0,
        showFirstLast: true,
        showMinMax: false,
        tooltip: {
            enabled: true
        }
    },
    bullet: {
        color: "#e8c267",
        targetColor: "#666666",
        targetWidth: 4,
        showTarget: true,
        showZeroLevel: true,
        tooltip: {
            enabled: true
        }
    },
    polar: {
        commonSeriesSettings: {
            type: "scatter",
            closed: true,
            "point": {
                visible: true,
                symbol: "circle",
                size: 12,
                border: {
                    visible: false,
                    width: 1
                },
                hoverMode: "onlyPoint",
                selectionMode: "onlyPoint",
                hoverStyle: {
                    border: {
                        visible: true,
                        width: 4
                    },
                    size: 12
                },
                selectionStyle: {
                    border: {
                        visible: true,
                        width: 4
                    },
                    size: 12
                }
            },
            "scatter": {
            },
            "line": {
                width: 2,
                dashStyle: SOLID,
                hoverStyle: {
                    width: 3,
                    hatching: {
                        direction: NONE
                    }
                },
                selectionStyle: {
                    width: 3
                }
            },
            "area": {
                point: {
                    visible: false
                },
                opacity: 0.5
            },
            "stackedline": {
                width: 2
            },
            "bar": {
                opacity: 0.8
            },
            "stackedbar": {
                opacity: 0.8
            }
        },
        adaptiveLayout: {
            width: 170,
            height: 170,
            keepLabels: true
        },
        equalBarWidth: true,
        barGroupPadding: 0.3,
        commonAxisSettings: {
            visible: true,
            forceUserTickInterval: false,
            label: {
                overlappingBehavior: "hide",
                indentFromAxis: 5
            },
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            },
            tick: {
                visible: true
            },
            title: {
                font: {
                    size: 16
                },
                margin: 10
            }
        },
        argumentAxis: {
            startAngle: 0,
            firstPointOnStartAngle: false,
            period: undefined
        },
        valueAxis: {
            endOnTick: false,
            tick: {
                visible: false
            }
        },
        horizontalAxis: {
            position: TOP,
            axisDivisionFactor: 50,
            label: {
                alignment: CENTER
            }
        },
        verticalAxis: {
            position: TOP,
            axisDivisionFactor: 30,
            label: {
                alignment: RIGHT
            }
        }
    },
    funnel: {
        sortData: true,
        valueField: "val",
        colorField: "color",
        argumentField: "arg",
        hoverEnabled: true,
        selectionMode: "single",
        item: {
            border: {
                visible: false,
                width: 2,
                color: WHITE
            },
            hoverStyle: {
                hatching: {
                    opacity: 0.75,
                    step: 6,
                    width: 2,
                    direction: RIGHT
                },
                border: { }
            },
            selectionStyle: {
                hatching: {
                    opacity: 0.5,
                    step: 6,
                    width: 2,
                    direction: RIGHT
                },
                border: { }
            }
        },
        title: {
            margin: 10
        },
        adaptiveLayout: {
            width: 80,
            height: 80,
            keepLabels: true
        },
        legend: {
            visible: false
        },
        _rtl: {
            legend: {
                itemTextPosition: LEFT
            }
        },
        tooltip: {
            customizeTooltip: function(info) {
                return { text: info.item.argument + " " + info.valueText };
            }
        },
        inverted: false,
        algorithm: "dynamicSlope",
        neckWidth: 0,
        neckHeight: 0,
        label: {
            visible: true,
            horizontalAlignment: RIGHT,
            horizontalOffset: 0,
            verticalOffset: 0,
            showForZeroValues: false,
            customizeText: function(info) {
                return info.item.argument + " " + info.valueText;
            },
            position: "columns",
            font: {
                color: WHITE
            },
            border: {
                visible: false,
                width: 1,
                color: LIGHT_GREY,
                dashStyle: SOLID
            },
            connector: {
                visible: true,
                width: 1,
                opacity: 0.5
            }
        }
    },
    sankey: {
        hoverEnabled: true,
        alignment: "center",
        adaptiveLayout: {
            width: 80,
            height: 80,
            keepLabels: true
        },
        label: {
            visible: true,
            horizontalOffset: 5,
            verticalOffset: 0,
            overlappingBehavior: "ellipsis",
            colorMode: "none",
            font: {
                color: WHITE,
                weight: 300
            },
            border: {
                visible: false,
                width: 1,
                color: WHITE
            },
            customizeText: function(info) {
                return info.title;
            },
            shadow: {
                opacity: 0.8,
                offsetX: 0,
                offsetY: 1,
                blur: 1,
                color: BLACK
            }
        },
        error: {
            stroke: WHITE,
            "stroke-width": 1,
            "stroke-opacity": 0.3,
            font: {
                color: "#ff3300",
                weight: 300
            },
        },
        title: {
            margin: 10,
            font: {
                size: 28,
                weight: 200
            },
            subtitle: {
                font: {
                    size: 16
                }
            }
        },
        tooltip: {
            enabled: true,
            customizeLinkTooltip: function(info) {
                return { html: `<strong>${info.from} > ${info.to}</strong><br/>Weight: ${info.weight}` };
            },
            customizeNodeTooltip: function(info) {
                return { html: `<strong>${info.title}</strong><br/>Incoming weight: ${info.weightIn}<br/>Outcoming weight: ${info.weightOut}` };
            }
        },
        node: {
            padding: 30,
            width: 15,
            opacity: 1,
            border: {
                color: BLACK,
                width: 1,
                visible: false
            },
            hoverStyle: {
                hatching: {
                    opacity: 0.75,
                    step: 6,
                    width: 2,
                    direction: RIGHT
                },
                border: { }
            },
        },
        link: {
            color: BLACK,
            colorMode: "none",
            opacity: 0.3,
            border: {
                color: BLACK,
                width: 1,
                visible: false
            },
            hoverStyle: {
                opacity: 0.5,
                hatching: {
                    opacity: 0.75,
                    step: 6,
                    width: 2,
                    direction: RIGHT
                },
                border: {}
            },
        }
    }
});

