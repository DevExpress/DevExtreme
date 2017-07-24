"use strict";

var extend = require("../../core/utils/extend").extend,
    layoutElementModule = require("../core/layout_element"),
    _isNumber = require("../../core/utils/type").isNumeric,
    _min = Math.min,
    _max = Math.max,
    _floor = Math.floor,
    _sqrt = Math.sqrt,
    consts = require("../components/consts"),
    pieLabelIndent = consts.pieLabelIndent,
    pieLabelSpacing = consts.pieLabelSpacing;

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
    series.forEach(function(singleSeries) {
        if(radiusIsFound) {
            return false;
        }

        singleSeries.getVisiblePoints().forEach(function(point) {
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
    series.forEach(function(singleSeries) {
        var maxWidth = 0;
        singleSeries.getVisiblePoints().forEach(function(point) {
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
        sizeLabels.sizes.forEach(function(size) {
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
            radiusOuter: _floor(availableRadius)
        };
    },

    applyEqualPieChartLayout: function(series, layout) {
        var radius = layout.radius;

        return {
            centerX: _floor(layout.x),
            centerY: _floor(layout.y),
            radiusInner: _floor(radius * getInnerRadius(series[0])),
            radiusOuter: _floor(radius)
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

        panes.forEach(function(pane) {
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

    layoutElements: function(elements, canvas, funcAxisDrawer, panes, rotated) {
        this._elements = elements;

        this._probeDrawing(canvas);
        this._drawElements(canvas);

        funcAxisDrawer && funcAxisDrawer();
        this._processAdaptiveLayout(panes, rotated, canvas, funcAxisDrawer);
        this._positionElements(canvas);
    },

    _processAdaptiveLayout: function(panes, rotated, canvas, funcAxisDrawer) {
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

        items.slice().reverse().forEach(function(item) {
            var layoutOptions = extend({}, item.getLayoutOptions()),
                sizeObject;

            if(!layoutOptions) {
                return;
            }

            sizeObject = extend({}, layoutOptions);

            if(layoutOptions.cutSide === "vertical" && size.height) {
                item.draw(sizeObject.width, sizeObject.height - size.height);
                processCanvases(item, layoutOptions, "height");
            }
            if(layoutOptions.cutSide === "horizontal" && size.width) {
                item.draw(sizeObject.width - size.width, sizeObject.height);
                processCanvases(item, layoutOptions, "width");
            }
        });

        funcAxisDrawer && funcAxisDrawer(size);
    },

    _probeDrawing: function(canvas) {
        var that = this;
        this._elements.forEach(function(item) {
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
        this._elements.slice().reverse().forEach(function(item) {
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

        this._elements.slice().reverse().forEach(function(item) {
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
