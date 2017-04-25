"use strict";

var $ = require("jquery"),

    _extend = $.extend,

    _math = Math,
    _floor = _math.floor,
    _abs = _math.abs,
    _min = _math.min,

    symbolPoint = require("./symbol_point"),

    CANVAS_POSITION_DEFAULT = "canvas_position_default",
    DEFAULT_BAR_TRACKER_SIZE = 9,
    CORRECTING_BAR_TRACKER_VALUE = 4,
    RIGHT = "right",
    LEFT = "left",
    TOP = "top",
    BOTTOM = "bottom";

module.exports = _extend({}, symbolPoint, {

    correctCoordinates: function(correctOptions) {
        var that = this,
            correction = _floor(correctOptions.offset - (correctOptions.width / 2));

        if(that._options.rotated) {
            that.height = correctOptions.width;
            that.yCorrection = correction;
        } else {
            that.width = correctOptions.width;
            that.xCorrection = correction;
        }
    },

    _getGraphicBBox: function() {
        var that = this,
            bBox = {};

        bBox.x = that.x;
        bBox.y = that.y;
        bBox.width = that.width;
        bBox.height = that.height;

        return bBox;
    },

    _getLabelConnector: function(location) {
        return this._getGraphicBBox(location);
    },

    _getLabelPosition: function() {
        var that = this,
            position,
            translators = that.translators,
            initialValue = that.initialValue,
            invertX = translators.x.getBusinessRange().invert,
            invertY = translators.y.getBusinessRange().invert,
            isDiscreteValue = that.series.valueAxisType === "discrete",
            isFullStacked = that.series.isFullStackedSeries(),
            notVerticalInverted = (!isDiscreteValue && ((initialValue >= 0 && !invertY) ||
            (initialValue < 0 && invertY))) ||
            (isDiscreteValue && !invertY) ||
            (isFullStacked),
            notHorizontalInverted = (!isDiscreteValue && ((initialValue >= 0 && !invertX) ||
           (initialValue < 0 && invertX))) ||
           (isDiscreteValue && !invertX) ||
           (isFullStacked);

        if(!that._options.rotated) {
            position = notVerticalInverted ? TOP : BOTTOM;
        } else {
            position = notHorizontalInverted ? RIGHT : LEFT;
        }

        return position;
    },

    _getLabelCoords: function(label) {
        var that = this,
            coords;

        if(that.initialValue === 0 && that.series.isFullStackedSeries()) {
            if(!this._options.rotated) {
                coords = that._getLabelCoordOfPosition(label, TOP);
            } else {
                coords = that._getLabelCoordOfPosition(label, RIGHT);
            }
        } else if(label.getLayoutOptions().position === "inside") {
            coords = that._getLabelCoordOfPosition(label, "inside");
        } else {
            coords = symbolPoint._getLabelCoords.call(this, label);
        }
        return coords;
    },

    _checkLabelPosition: function(label, coord) {
        var that = this,
            visibleArea = that._getVisibleArea();

        if(that._isPointInVisibleArea(visibleArea, that._getGraphicBBox())) {
            return that._moveLabelOnCanvas(coord, visibleArea, label.getBoundingRect());
        }

        return coord;
    },

    _isLabelInsidePoint: function(label) {
        var that = this,
            graphicBBox = that._getGraphicBBox(),
            labelBBox = label.getBoundingRect();

        if(that._options.resolveLabelsOverlapping && label.getLayoutOptions().position === "inside") {
            if(labelBBox.width > graphicBBox.width || labelBBox.height > graphicBBox.height) {
                label.hide();
                return true;
            }
        }

        return false;
    },

    _moveLabelOnCanvas: function(coord, visibleArea, labelBBox) {
        var x = coord.x,
            y = coord.y;
        if(visibleArea.minX > x) {
            x = visibleArea.minX;
        }
        if(visibleArea.maxX < (x + labelBBox.width)) {
            x = visibleArea.maxX - labelBBox.width;
        }
        if(visibleArea.minY > y) {
            y = visibleArea.minY;
        }
        if(visibleArea.maxY < (y + labelBBox.height)) {
            y = visibleArea.maxY - labelBBox.height;
        }

        return { x: x, y: y };
    },

    _showForZeroValues: function() {
        return this._options.label.showForZeroValues || this.initialValue;
    },

    _drawMarker: function(renderer, group, animationEnabled) {
        var that = this,
            style = that._getStyle(),
            x = that.x,
            y = that.y,
            width = that.width,
            height = that.height,
            r = that._options.cornerRadius;
        if(animationEnabled) {
            if(that._options.rotated) {
                width = 0;
                x = that.defaultX;
            } else {
                height = 0;
                y = that.defaultY;
            }
        }

        that.graphic = renderer.rect(x, y, width, height)
            .attr({ rx: r, ry: r })
            .smartAttr(style)
            .data({ "chart-data-point": that })
            .append(group);
    },

    _getSettingsForTracker: function() {
        var that = this,
            y = that.y,
            height = that.height,
            x = that.x,
            width = that.width;

        if(that._options.rotated) {
            if(width === 1) {
                width = DEFAULT_BAR_TRACKER_SIZE;
                x -= CORRECTING_BAR_TRACKER_VALUE;
            }
        } else {
            if(height === 1) {
                height = DEFAULT_BAR_TRACKER_SIZE;
                y -= CORRECTING_BAR_TRACKER_VALUE;
            }
        }

        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    },

    getGraphicSettings: function() {
        var graphic = this.graphic;
        return {
            x: graphic.attr("x"),
            y: graphic.attr("y"),
            height: graphic.attr("height"),
            width: graphic.attr("width")
        };
    },

    _getEdgeTooltipParams: function(x, y, width, height) {
        var isPositive = this.value >= 0,
            invertedY = this.translators.y.getBusinessRange().invert,
            invertedX = this.translators.x.getBusinessRange().invert,
            xCoord,
            yCoord;

        if(this._options.rotated) {
            yCoord = y + height / 2;
            if(invertedX) {
                xCoord = isPositive ? x : x + width;
            } else {
                xCoord = isPositive ? x + width : x;
            }
        } else {
            xCoord = x + width / 2;
            if(invertedY) {
                yCoord = isPositive ? y + height : y;
            } else {
                yCoord = isPositive ? y : y + height;
            }
        }

        return { x: xCoord, y: yCoord, offset: 0 };
    },

    getTooltipParams: function(location) {
        var x = this.x,
            y = this.y,
            width = this.width,
            height = this.height;

        return location === 'edge' ? this._getEdgeTooltipParams(x, y, width, height) : { x: x + width / 2, y: y + height / 2, offset: 0 };
    },

    _truncateCoord: function(coord, minBounce, maxBounce) {
        if(coord < minBounce) {
            return minBounce;
        }
        if(coord > maxBounce) {
            return maxBounce;
        }
        return coord;
    },

    _translateErrorBars: function(valueTranslator, argVisibleArea) {
        symbolPoint._translateErrorBars.call(this, valueTranslator);
        if(this._errorBarPos < argVisibleArea.min || this._errorBarPos > argVisibleArea.max) {
            this._errorBarPos = undefined;
        }
    },

    //TODO check & rework
    _translate: function(translators) {
        var that = this,

            rotated = that._options.rotated,
            valAxis = rotated ? "x" : "y",
            argAxis = rotated ? "y" : "x",
            valIntervalName = rotated ? "width" : "height",
            argIntervalName = rotated ? "height" : "width",
            argTranslator = translators[argAxis],
            valTranslator = translators[valAxis],
            argVisibleArea = argTranslator.getCanvasVisibleArea(),
            valVisibleArea = valTranslator.getCanvasVisibleArea(),
            arg,
            minArg,
            val,
            minVal;

        arg = minArg = argTranslator.translate(that.argument) + (that[argAxis + "Correction"] || 0);
        val = valTranslator.translate(that.value);
        minVal = valTranslator.translate(that.minValue);

        if(val === null) {
            val = minVal;
        }
        that["v" + valAxis] = val;
        that["v" + argAxis] = arg + that[argIntervalName] / 2;

        that[valIntervalName] = _abs(val - minVal);

        that._calculateVisibility(rotated ? _min(val, minVal) : _min(arg, minArg), rotated ? _min(arg, minArg) : _min(val, minVal), that.width, that.height);

        val = that._truncateCoord(val, valVisibleArea.min, valVisibleArea.max);
        minVal = that._truncateCoord(minVal, valVisibleArea.min, valVisibleArea.max);

        that[argAxis] = arg;
        that["min" + argAxis.toUpperCase()] = minArg;

        that[valIntervalName] = _abs(val - minVal);
        that[valAxis] = _min(val, minVal) + (that[valAxis + "Correction"] || 0);
        that["min" + valAxis.toUpperCase()] = minVal + (that[valAxis + "Correction"] || 0);
        that["default" + valAxis.toUpperCase()] = valTranslator.translate(CANVAS_POSITION_DEFAULT);
        that._translateErrorBars(valTranslator, argVisibleArea);

        if(that.inVisibleArea) {
            if(that[argAxis] < argVisibleArea.min) {
                that[argIntervalName] = that[argIntervalName] - (argVisibleArea.min - that[argAxis]);
                that[argAxis] = argVisibleArea.min;
                that["min" + argAxis.toUpperCase()] = argVisibleArea.min;
            }

            if(that[argAxis] + that[argIntervalName] > argVisibleArea.max) {
                that[argIntervalName] = argVisibleArea.max - that[argAxis];
            }
        }
    },

    _updateMarker: function(animationEnabled, style) {
        this.graphic.smartAttr(_extend({}, style, !animationEnabled ? this.getMarkerCoords() : {}));
    },

    getMarkerCoords: function() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    },

    coordsIn: function(x, y) {
        var that = this;
        return (x >= that.x) && (x <= that.x + that.width) && (y >= that.y) && (y <= that.y + that.height);
    }
});
