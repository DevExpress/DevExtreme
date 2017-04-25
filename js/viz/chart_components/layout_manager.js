"use strict";

var $ = require("jquery"),
    commonUtils = require("../../core/utils/common"),
    layoutElementModule = require("../core/layout_element"),
    _isNumber = commonUtils.isNumber,
    _min = Math.min,
    _max = Math.max,
    _floor = Math.floor,
    _sqrt = Math.sqrt,
    _each = $.each,
    _extend = $.extend,
    consts = require("../components/consts"),
    pieLabelIndent = consts.pieLabelIndent,
    pieLabelSpacing = consts.pieLabelSpacing;

function updateAxis(axes, side, needRemoveSpace) {
    if(axes && needRemoveSpace[side] > 0) {
        _each(axes, function(i, axis) {
            var bBox = axis.getBoundingRect();
            axis.updateSize();
            needRemoveSpace[side] -= bBox[side] - axis.getBoundingRect()[side];
        });
        if(needRemoveSpace[side] > 0) {
            _each(axes, function(_, axis) {
                axis.updateSize(true);
            });
        }
    }
}

function getNearestCoord(firstCoord, secondCoord, pointCenterCoord) {
    var nearestCoord;
    if(pointCenterCoord < firstCoord) {
        nearestCoord = firstCoord;
    } else if(secondCoord < pointCenterCoord) {
        nearestCoord = secondCoord;
    } else {
        nearestCoord = pointCenterCoord;
    }
    return nearestCoord;
}

function getLabelLayout(point) {
    if(point._label.isVisible() && point._label.getLayoutOptions().position !== "inside") {
        return point._label.getBoundingRect();
    }
}

function getPieRadius(series, paneCenterX, paneCenterY, accessibleRadius, minR) {
    var radiusIsFound = false;
    _each(series, function(_, singleSeries) {
        if(radiusIsFound) {
            return false;
        }

        _each(singleSeries.getVisiblePoints(), function(_, point) {
            var labelBBox = getLabelLayout(point);
            if(labelBBox) {
                var xCoords = getNearestCoord(labelBBox.x, labelBBox.x + labelBBox.width, paneCenterX),
                    yCoords = getNearestCoord(labelBBox.y, labelBBox.y + labelBBox.height, paneCenterY);

                accessibleRadius = _min(_max(getLengthFromCenter(xCoords, yCoords, paneCenterX, paneCenterY) - pieLabelIndent, minR), accessibleRadius);
                radiusIsFound = true;
            }
        });
    });

    return accessibleRadius;
}

function getSizeLabels(series) {
    var sizes = [],
        commonWidth = 0;
    _each(series, function(_, singleSeries) {
        var maxWidth = 0;
        _each(singleSeries.getVisiblePoints(), function(_, point) {
            var labelBBox = getLabelLayout(point);
            if(labelBBox) {
                maxWidth = _max(labelBBox.width + pieLabelSpacing, maxWidth);
            }
        });
        sizes.push(maxWidth);
        commonWidth += maxWidth;
    });
    return { sizes: sizes, common: commonWidth };
}

function correctLabelRadius(sizes, radius, series, canvas, averageWidthLabels) {
    var curRadius,
        i,
        centerX = (canvas.width - canvas.left - canvas.right) / 2;
    for(i = 0; i < series.length; i++) {
        if(sizes[i] === 0) {
            curRadius && (curRadius += sizes[i - 1]);
            continue;
        }
        curRadius = _floor(curRadius ? curRadius + sizes[i - 1] : radius);
        series[i].correctLabelRadius(curRadius);
        if(averageWidthLabels && i !== series.length - 1) {
            sizes[i] = averageWidthLabels;
            series[i].setVisibleArea({
                left: centerX - radius - averageWidthLabels * (i + 1),
                right: canvas.width - (centerX + radius + averageWidthLabels * (i + 1)),
                top: canvas.top,
                bottom: canvas.bottom,
                width: canvas.width,
                height: canvas.height
            });
        }
    }
}

function getLengthFromCenter(x, y, paneCenterX, paneCenterY) {
    return _sqrt((x - paneCenterX) * (x - paneCenterX) + (y - paneCenterY) * (y - paneCenterY));
}

function getInnerRadius(series) {
    var innerRadius;
    if(series.type === "pie") {
        innerRadius = 0;
    } else {
        innerRadius = _isNumber(series.innerRadius) ? Number(series.innerRadius) : 0.5;
        innerRadius = innerRadius < 0.2 ? 0.2 : innerRadius;
        innerRadius = innerRadius > 0.8 ? 0.8 : innerRadius;
    }
    return innerRadius;
}

function isValidBox(box) {
    return !!(box.x || box.y || box.width || box.height);
}

function correctDeltaMarginValue(panes, marginSides) {
    var canvas,
        deltaSide,
        requireAxesRedraw = false;

    _each(panes, function(_, pane) {
        canvas = pane.canvas;
        _each(marginSides, function(_, side) {
            deltaSide = "delta" + side;
            canvas[deltaSide] = _max(canvas[deltaSide] - (canvas[side.toLowerCase()] - canvas["original" + side]), 0);
            if(canvas[deltaSide] > 0) {
                requireAxesRedraw = true;
            }
        });
    });

    return requireAxesRedraw;
}

function getPane(name, panes) {
    var findPane = panes[0];
    _each(panes, function(_, pane) {
        if(name === pane.name) {
            findPane = pane;
        }
    });
    return findPane;
}

function applyFoundExceedings(panes, rotated) {
    var stopDrawAxes = false,
        maxLeft = 0,
        maxRight = 0,
        maxTop = 0,
        maxBottom = 0;

    _each(panes, function(_, pane) {
        maxLeft = _max(maxLeft, pane.canvas.deltaLeft);
        maxRight = _max(maxRight, pane.canvas.deltaRight);
        maxTop = _max(maxTop, pane.canvas.deltaTop);
        maxBottom = _max(maxBottom, pane.canvas.deltaBottom);
    });

    if(rotated) {
        _each(panes, function(_, pane) {
            pane.canvas.top += maxTop;
            pane.canvas.bottom += maxBottom;
            pane.canvas.right += pane.canvas.deltaRight;
            pane.canvas.left += pane.canvas.deltaLeft;
        });
    } else {
        _each(panes, function(_, pane) {
            pane.canvas.top += pane.canvas.deltaTop;
            pane.canvas.bottom += pane.canvas.deltaBottom;
            pane.canvas.right += maxRight;
            pane.canvas.left += maxLeft;
        });
    }

    _each(panes, function(_, pane) {
        if(pane.canvas.top + pane.canvas.bottom > pane.canvas.height) {
            stopDrawAxes = true;
        }
        if(pane.canvas.left + pane.canvas.right > pane.canvas.width) {
            stopDrawAxes = true;
        }
    });
    return stopDrawAxes;
}

var inverseAlign = {
    left: "right",
    right: "left",
    top: "bottom",
    bottom: "top",
    center: "center"
};

function downSize(canvas, layoutOptions) {
    canvas[layoutOptions.cutLayoutSide] += layoutOptions.cutSide === "horizontal" ? layoutOptions.width : layoutOptions.height;
}

function getOffset(layoutOptions, offsets) {
    var side = layoutOptions.cutLayoutSide,
        offset = {
            horizontal: 0,
            vertical: 0
        };

    switch(side) {
        case "top":
        case "left":
            offset[layoutOptions.cutSide] = -offsets[side];
            break;
        case "bottom":
        case "right":
            offset[layoutOptions.cutSide] = offsets[side];
            break;
    }

    return offset;
}

function LayoutManager() {
}

function toLayoutElementCoords(canvas) {
    return new layoutElementModule.WrapperLayoutElement(null, {
        x: canvas.left,
        y: canvas.top,
        width: canvas.width - canvas.left - canvas.right,
        height: canvas.height - canvas.top - canvas.bottom
    });
}

function correctAvailableRadius(availableRadius, canvas, series, minPiePercentage, paneCenterX, paneCenterY) {
    var minR = minPiePercentage * availableRadius,
        sizeLabels = getSizeLabels(series),
        countSeriesWithOuterLabels = 0,
        averageWidthLabels,
        fullRadiusWithLabels = paneCenterX - sizeLabels.common + canvas.left;

    if(fullRadiusWithLabels < minR) {
        availableRadius = minR;
        _each(sizeLabels.sizes, function(_, size) {
            size !== 0 && countSeriesWithOuterLabels++;
        });
        averageWidthLabels = (paneCenterX - availableRadius - canvas.left) / countSeriesWithOuterLabels;
    } else {
        availableRadius = _min(getPieRadius(series, paneCenterX, paneCenterY, availableRadius, minR), fullRadiusWithLabels);
    }
    correctLabelRadius(sizeLabels.sizes, availableRadius, series, canvas, averageWidthLabels);

    return availableRadius;
}

LayoutManager.prototype = {
    constructor: LayoutManager,

    setOptions: function(options) {
        this._options = options;
    },

    applyVerticalAxesLayout: function(axes, panes, rotated) {
        this._applyAxesLayout(axes, panes, rotated);
    },

    applyHorizontalAxesLayout: function(axes, panes, rotated) {
        axes.reverse();
        this._applyAxesLayout(axes, panes, rotated);
        axes.reverse();
    },

    _applyAxesLayout: function(axes, panes, rotated) {
        var that = this,
            canvas,
            axisPosition,
            box,
            delta,
            axis,
            axisLength,
            direction,
            directionMultiplier,
            someDirection = [],
            pane,
            i;

        _each(panes, function(_, pane) {
            _extend(pane.canvas, { deltaLeft: 0, deltaRight: 0, deltaTop: 0, deltaBottom: 0 });
        });

        for(i = 0; i < axes.length; i++) {
            axis = axes[i];
            axisPosition = axis.getOptions().position || "left";
            axis.delta = {};
            box = axis.getBoundingRect();

            pane = getPane(axis.pane, panes);
            canvas = pane.canvas;

            if(!isValidBox(box)) {
                continue;
            }

            direction = "delta" + axisPosition.slice(0, 1).toUpperCase() + axisPosition.slice(1);

            switch(axisPosition) {
                case "right":
                    directionMultiplier = 1;
                    canvas.deltaLeft += axis.padding ? axis.padding.left : 0;
                    break;
                case "left":
                    directionMultiplier = -1;
                    canvas.deltaRight += axis.padding ? axis.padding.right : 0;
                    break;
                case "top":
                    directionMultiplier = -1;
                    canvas.deltaBottom += axis.padding ? axis.padding.bottom : 0;
                    break;
                case "bottom":
                    directionMultiplier = 1;
                    canvas.deltaTop += axis.padding ? axis.padding.top : 0;
                    break;
            }

            switch(axisPosition) {
                case "right":
                case "left":
                    if(!box.isEmpty) {
                        delta = (box.y + box.height) - (canvas.height - canvas.originalBottom);
                        if(delta > 0) {
                            that.requireAxesRedraw = true;
                            canvas.deltaBottom += delta;
                        }

                        delta = canvas.originalTop - box.y;
                        if(delta > 0) {
                            that.requireAxesRedraw = true;
                            canvas.deltaTop += delta;
                        }
                    }
                    axisLength = box.width;
                    someDirection = ["Left", "Right"];
                    break;
                case "top":
                case "bottom":
                    if(!box.isEmpty) {
                        delta = (box.x + box.width) - (canvas.width - canvas.originalRight);
                        if(delta > 0) {
                            that.requireAxesRedraw = true;
                            canvas.deltaRight += delta;
                        }

                        delta = canvas.originalLeft - box.x;
                        if(delta > 0) {
                            that.requireAxesRedraw = true;
                            canvas.deltaLeft += delta;
                        }

                    }
                    someDirection = ["Bottom", "Top"];
                    axisLength = box.height;
                    break;
            }

            if(!axis.delta[axisPosition] && canvas[direction] > 0) {
                canvas[direction] += axis.getMultipleAxesSpacing();
            }

            axis.delta[axisPosition] = axis.delta[axisPosition] || 0;
            axis.delta[axisPosition] += canvas[direction] * directionMultiplier;

            canvas[direction] += axisLength;
        }

        that.requireAxesRedraw = correctDeltaMarginValue(panes, someDirection) || that.requireAxesRedraw;

        that.stopDrawAxes = applyFoundExceedings(panes, rotated);
    },

    applyPieChartSeriesLayout: function(canvas, series, hideLayoutLabels) {
        var paneSpaceHeight = canvas.height - canvas.top - canvas.bottom,
            paneSpaceWidth = canvas.width - canvas.left - canvas.right,
            paneCenterX = paneSpaceWidth / 2 + canvas.left,
            paneCenterY = paneSpaceHeight / 2 + canvas.top,
            piePercentage = this._options.piePercentage,
            availableRadius;

        if(_isNumber(piePercentage)) {
            availableRadius = piePercentage * _min(canvas.height, canvas.width) / 2;
        } else {
            availableRadius = _min(paneSpaceWidth, paneSpaceHeight) / 2;
            if(!hideLayoutLabels) {
                availableRadius = correctAvailableRadius(availableRadius, canvas, series, this._options.minPiePercentage, paneCenterX, paneCenterY);
            }
        }
        return {
            centerX: _floor(paneCenterX),
            centerY: _floor(paneCenterY),
            radiusInner: _floor(availableRadius * getInnerRadius(series[0])),
            radiusOuter: _floor(availableRadius),
            canvas: canvas
        };
    },

    needMoreSpaceForPanesCanvas: function(panes, rotated) {
        var options = this._options,
            width = options.width,
            height = options.height,
            piePercentage = options.piePercentage,
            percentageIsValid = _isNumber(piePercentage),
            needHorizontalSpace = 0,
            needVerticalSpace = 0;

        _each(panes, function(_, pane) {
            var paneCanvas = pane.canvas,
                minSize = percentageIsValid ? _min(paneCanvas.width, paneCanvas.height) * piePercentage : undefined,
                needPaneHorizontalSpace = (percentageIsValid ? minSize : width) - (paneCanvas.width - paneCanvas.left - paneCanvas.right),
                needPaneVerticalSpace = (percentageIsValid ? minSize : height) - (paneCanvas.height - paneCanvas.top - paneCanvas.bottom);

            if(rotated) {
                needHorizontalSpace += needPaneHorizontalSpace > 0 ? needPaneHorizontalSpace : 0;
                needVerticalSpace = _max(needPaneVerticalSpace > 0 ? needPaneVerticalSpace : 0, needVerticalSpace);
            } else {
                needHorizontalSpace = _max(needPaneHorizontalSpace > 0 ? needPaneHorizontalSpace : 0, needHorizontalSpace);
                needVerticalSpace += needPaneVerticalSpace > 0 ? needPaneVerticalSpace : 0;
            }
        });

        return needHorizontalSpace > 0 || needVerticalSpace > 0 ? { width: needHorizontalSpace, height: needVerticalSpace } : false;
    },

    layoutElements: function(elements, canvas, funcAxisDrawer, panes, rotated, axes) {
        this._elements = elements;

        this._probeDrawing(canvas);
        this._drawElements(canvas);

        funcAxisDrawer && funcAxisDrawer();
        this._processAdaptiveLayout(panes, rotated, canvas, axes, funcAxisDrawer);
        this._positionElements(canvas);
    },

    _processAdaptiveLayout: function(panes, rotated, canvas, axes, funcAxisDrawer) {
        var that = this,
            size = that.needMoreSpaceForPanesCanvas(panes, rotated),
            items = this._elements;

        if(!size) return;

        function processCanvases(item, layoutOptions, side) {
            if(!item.getLayoutOptions()[side]) {
                canvas[layoutOptions.cutLayoutSide] -= layoutOptions[side];
                size[side] = Math.max(size[side] - layoutOptions[side], 0);
            }
        }

        $.each(items.slice().reverse(), function(_, item) {
            var layoutOptions = _extend({}, item.getLayoutOptions()),
                sizeObject;

            if(!layoutOptions) {
                return;
            }

            sizeObject = $.extend({}, layoutOptions);

            if(layoutOptions.cutSide === "vertical" && size.height) {
                item.draw(sizeObject.width, sizeObject.height - size.height);
                processCanvases(item, layoutOptions, "height");
            }
            if(layoutOptions.cutSide === "horizontal" && size.width) {
                item.draw(sizeObject.width - size.width, sizeObject.height);
                processCanvases(item, layoutOptions, "width");
            }
        });

        updateAxis(axes.verticalAxes, "width", size);
        updateAxis(axes.horizontalAxes, "height", size);

        funcAxisDrawer && funcAxisDrawer(true);
    },

    _probeDrawing: function(canvas) {
        var that = this;
        $.each(this._elements, function(_, item) {
            var layoutOptions = item.getLayoutOptions(),
                sizeObject;

            if(!layoutOptions) {
                return;
            }

            sizeObject = { width: canvas.width - canvas.left - canvas.right, height: canvas.height - canvas.top - canvas.bottom };
            if(layoutOptions.cutSide === "vertical") {
                sizeObject.height -= that._options.height;
            } else {
                sizeObject.width -= that._options.width;
            }
            item.probeDraw(sizeObject.width, sizeObject.height);

            downSize(canvas, item.getLayoutOptions());
        });
    },

    _drawElements: function(canvas) {
        $.each(this._elements.slice().reverse(), function(_, item) {
            var layoutOptions = item.getLayoutOptions(),
                sizeObject,
                cutSide,
                length;

            if(!layoutOptions) {
                return;
            }

            sizeObject = {
                width: canvas.width - canvas.left - canvas.right,
                height: canvas.height - canvas.top - canvas.bottom
            };
            cutSide = layoutOptions.cutSide;
            length = cutSide === "horizontal" ? "width" : "height";

            sizeObject[length] = layoutOptions[length];
            item.draw(sizeObject.width, sizeObject.height);
        });
    },

    _positionElements: function(canvas) {
        var offsets = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };

        $.each(this._elements.slice().reverse(), function(_, item) {
            var layoutOptions = item.getLayoutOptions(),
                position,
                cutSide,
                my;

            if(!layoutOptions) {
                return;
            }

            position = layoutOptions.position;
            cutSide = layoutOptions.cutSide;
            my = {
                horizontal: position.horizontal,
                vertical: position.vertical
            };

            my[cutSide] = inverseAlign[my[cutSide]];

            item.position({
                of: toLayoutElementCoords(canvas), my: my,
                at: position, offset: getOffset(layoutOptions, offsets)
            });

            offsets[layoutOptions.cutLayoutSide] += layoutOptions[layoutOptions.cutSide === "horizontal" ? "width" : "height"];
        });
    }
};

exports.LayoutManager = LayoutManager;
