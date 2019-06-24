var extend = require("../../../core/utils/extend").extend,
    each = require("../../../core/utils/iterator").each,
    noop = require("../../../core/utils/common").noop,
    windowUtils = require("../../../core/utils/window"),
    window = windowUtils.getWindow(),
    labelModule = require("./label"),
    _extend = extend,
    _isDefined = require("../../../core/utils/type").isDefined,
    _normalizeEnum = require("../../core/utils").normalizeEnum,

    _math = Math,
    _round = _math.round,
    _floor = _math.floor,
    _ceil = _math.ceil,

    DEFAULT_IMAGE_WIDTH = 20,
    DEFAULT_IMAGE_HEIGHT = 20,
    LABEL_OFFSET = 10,
    CANVAS_POSITION_DEFAULT = "canvas_position_default";

function getSquareMarkerCoords(radius) {
    return [
        -radius, -radius,
        radius, -radius,
        radius, radius,
        -radius, radius,
        -radius, -radius
    ];
}

function getPolygonMarkerCoords(radius) {
    var r = _ceil(radius); // T100386
    return [
        -r, 0,
        0, -r,
        r, 0,
        0, r,
        -r, 0
    ];
}

function getCrossMarkerCoords(radius) {
    var r = _ceil(radius), // T100386
        floorHalfRadius = _floor(r / 2),
        ceilHalfRadius = _ceil(r / 2);

    return [
        -r, -floorHalfRadius,
        -floorHalfRadius, -r,
        0, -ceilHalfRadius,
        floorHalfRadius, -r,
        r, -floorHalfRadius,
        ceilHalfRadius, 0,
        r, floorHalfRadius,
        floorHalfRadius, r,
        0, ceilHalfRadius,
        -floorHalfRadius, r,
        -r, floorHalfRadius,
        -ceilHalfRadius, 0
    ];
}

function getTriangleDownMarkerCoords(radius) {
    return [
        -radius, -radius,
        radius, -radius,
        0, radius,
        -radius, -radius
    ];
}

function getTriangleUpMarkerCoords(radius) {
    return [
        -radius, radius,
        radius, radius,
        0, -radius,
        -radius, radius
    ];
}

module.exports = {
    deleteLabel: function() {
        this._label.dispose();
        this._label = null;
    },

    _hasGraphic: function() {
        return this.graphic;
    },

    clearVisibility: function() {
        var that = this,
            graphic = that.graphic;
        if(graphic && graphic.attr("visibility")) {
            graphic.attr({ visibility: null });
        }
    },

    isVisible: function() {
        return this.inVisibleArea && this.series.isVisible();
    },

    setInvisibility: function() {
        var that = this,
            graphic = that.graphic;
        if(graphic && graphic.attr("visibility") !== "hidden") {
            graphic.attr({ visibility: "hidden" });
        }
        that._errorBar && that._errorBar.attr({ visibility: "hidden" });
        that._label.draw(false);
    },

    clearMarker: function() {
        var graphic = this.graphic;
        graphic && graphic.attr(this._emptySettings);
    },

    _createLabel: function() {
        this._label = new labelModule.Label({
            renderer: this.series._renderer,
            labelsGroup: this.series._labelsGroup,
            point: this
        });
    },

    _updateLabelData: function() {
        this._label.setData(this._getLabelFormatObject());
    },

    _updateLabelOptions: function() {
        !this._label && this._createLabel();
        this._label.setOptions(this._options.label);
    },

    _checkImage: function(image) {
        return _isDefined(image) && (typeof image === "string" || _isDefined(image.url));
    },

    _fillStyle: function() {
        this._styles = this._options.styles;
    },

    _checkSymbol: function(oldOptions, newOptions) {
        var oldSymbol = oldOptions.symbol,
            newSymbol = newOptions.symbol,
            symbolChanged = (oldSymbol === "circle" && newSymbol !== "circle") || (oldSymbol !== "circle" && newSymbol === "circle"),
            imageChanged = this._checkImage(oldOptions.image) !== this._checkImage(newOptions.image);

        return !!(symbolChanged || imageChanged);
    },

    _populatePointShape: function(symbol, radius) {
        switch(symbol) {
            case "square":
                return getSquareMarkerCoords(radius);
            case "polygon":
                return getPolygonMarkerCoords(radius);
            case "triangle":
            case "triangleDown":
                return getTriangleDownMarkerCoords(radius);
            case "triangleUp":
                return getTriangleUpMarkerCoords(radius);
            case "cross":
                return getCrossMarkerCoords(radius);
        }
    },

    hasCoords: function() {
        return this.x !== null && this.y !== null;
    },

    correctValue: function(correction) {
        var that = this;
        const axis = that.series.getValueAxis();
        if(that.hasValue()) {
            that.value = that.properValue = axis.validateUnit(that.initialValue.valueOf() + correction.valueOf());
            that.minValue = axis.validateUnit(correction);
        }
    },

    resetCorrection: function() {
        this.value = this.properValue = this.initialValue;
        this.minValue = CANVAS_POSITION_DEFAULT;
    },

    resetValue: function() {
        var that = this;
        if(that.hasValue()) {
            that.value = that.properValue = that.initialValue = 0;
            that.minValue = 0;

            that._label.setDataField("value", that.value);
        }
    },

    _getTranslates: function(animationEnabled) {
        var translateX = this.x,
            translateY = this.y;

        if(animationEnabled) {
            if(this._options.rotated) {
                translateX = this.defaultX;
            } else {
                translateY = this.defaultY;
            }
        }
        return { x: translateX, y: translateY };
    },

    _createImageMarker: function(renderer, settings, options) {
        var width = options.width || DEFAULT_IMAGE_WIDTH,
            height = options.height || DEFAULT_IMAGE_HEIGHT;

        return renderer.image(-_round(width * 0.5), -_round(height * 0.5), width, height, options.url ? options.url.toString() : options.toString(), "center")
            .attr({ translateX: settings.translateX, translateY: settings.translateY, visibility: settings.visibility });
    },

    _createSymbolMarker: function(renderer, pointSettings) {
        var marker,
            symbol = this._options.symbol;

        if(symbol === "circle") {
            delete pointSettings.points;
            marker = renderer.circle().attr(pointSettings);
        } else if(symbol === "square" || symbol === "polygon" || symbol === "triangle" || symbol === "triangleDown" || symbol === "triangleUp" || symbol === "cross") {
            marker = renderer.path([], "area").attr(pointSettings).sharp();
        }

        return marker;
    },

    _createMarker: function(renderer, group, image, settings) {
        var that = this,
            marker = that._checkImage(image) ? that._createImageMarker(renderer, settings, image) : that._createSymbolMarker(renderer, settings);
        if(marker) {
            marker.data({ "chart-data-point": that }).append(group);
        }
        return marker;
    },

    _getSymbolBBox: function(x, y, r) {
        return {
            x: x - r,
            y: y - r,
            width: r * 2,
            height: r * 2
        };
    },

    _getImageBBox: function(x, y) {
        var image = this._options.image,
            width = image.width || DEFAULT_IMAGE_WIDTH,
            height = image.height || DEFAULT_IMAGE_HEIGHT;

        return {
            x: x - _round(width / 2),
            y: y - _round(height / 2),
            width: width,
            height: height
        };
    },

    _getGraphicBBox: function() {
        var that = this,
            options = that._options,
            x = that.x,
            y = that.y,
            bBox;

        if(options.visible) {
            bBox = that._checkImage(options.image) ? that._getImageBBox(x, y) : that._getSymbolBBox(x, y, options.styles.normal.r);
        } else {
            bBox = { x: x, y: y, width: 0, height: 0 };
        }

        return bBox;
    },

    hideInsideLabel: noop,

    _getShiftLabelCoords: function(label) {
        var coord = this._addLabelAlignmentAndOffset(label, this._getLabelCoords(label));

        return this._checkLabelPosition(label, coord);
    },

    _drawLabel: function() {
        var that = this,
            customVisibility = that._getCustomLabelVisibility(),
            label = that._label,
            isVisible = that._showForZeroValues() && that.hasValue() && customVisibility !== false && (that.series.getLabelVisibility() || customVisibility);

        label.draw(!!isVisible);
    },

    correctLabelPosition: function(label) {
        var that = this,
            coord = that._getShiftLabelCoords(label);
        if(!that.hideInsideLabel(label, coord)) {
            label.setFigureToDrawConnector(that._getLabelConnector(label.pointPosition));
            label.shift(_round(coord.x), _round(coord.y));
        }
    },

    _showForZeroValues: function() {
        return true;
    },

    _getLabelConnector: function(pointPosition) {
        var bBox = this._getGraphicBBox(pointPosition),
            w2 = bBox.width / 2,
            h2 = bBox.height / 2;
        // This is to make label connector end at the center of point; "width" and "height" are required by the path building algorithm
        // TODO: When path building algorithm is updated remove "width" and "height"
        return { x: bBox.x + w2, y: bBox.y + h2, r: this._options.visible ? Math.max(w2, h2) : 0 };
    },

    _getPositionFromLocation: function() {
        return { x: this.x, y: this.y };
    },

    _isPointInVisibleArea: function(visibleArea, graphicBBox) {
        return ((visibleArea.minX <= (graphicBBox.x + graphicBBox.width)) && (visibleArea.maxX >= graphicBBox.x)
                && (visibleArea.minY <= graphicBBox.y + graphicBBox.height) && (visibleArea.maxY >= graphicBBox.y));
    },

    _checkLabelPosition: function(label, coord) {
        var that = this,
            visibleArea = that._getVisibleArea(),
            labelBBox = label.getBoundingRect(),
            graphicBBox = that._getGraphicBBox(label.pointPosition),
            offset = LABEL_OFFSET;

        if(that._isPointInVisibleArea(visibleArea, graphicBBox)) {
            if(!that._options.rotated) {
                if(visibleArea.minX > coord.x) {
                    coord.x = visibleArea.minX;
                }
                if(visibleArea.maxX < (coord.x + labelBBox.width)) {
                    coord.x = visibleArea.maxX - labelBBox.width;
                }
                if(visibleArea.minY > coord.y) {
                    coord.y = graphicBBox.y + graphicBBox.height + offset;
                }
                if(visibleArea.maxY < (coord.y + labelBBox.height)) {
                    coord.y = graphicBBox.y - labelBBox.height - offset;
                }
            } else {
                if(visibleArea.minX > coord.x) {
                    coord.x = graphicBBox.x + graphicBBox.width + offset;
                }
                if(visibleArea.maxX < (coord.x + labelBBox.width)) {
                    coord.x = graphicBBox.x - offset - labelBBox.width;
                }
                if(visibleArea.minY > coord.y) {
                    coord.y = visibleArea.minY;
                }
                if(visibleArea.maxY < (coord.y + labelBBox.height)) {
                    coord.y = visibleArea.maxY - labelBBox.height;
                }
            }
        }

        return coord;
    },

    _addLabelAlignmentAndOffset: function(label, coord) {
        var labelBBox = label.getBoundingRect(),
            labelOptions = label.getLayoutOptions();

        if(!this._options.rotated) {
            if(labelOptions.alignment === "left") {
                coord.x += labelBBox.width / 2;
            } else if(labelOptions.alignment === "right") {
                coord.x -= labelBBox.width / 2;
            }
        }

        coord.x += labelOptions.horizontalOffset;
        coord.y += labelOptions.verticalOffset;
        return coord;
    },

    _getLabelCoords: function(label) {
        return this._getLabelCoordOfPosition(label, this._getLabelPosition(label.pointPosition));
    },

    _getLabelCoordOfPosition: function(label, position) {
        var that = this,
            labelBBox = label.getBoundingRect(),
            graphicBBox = that._getGraphicBBox(label.pointPosition),
            offset = LABEL_OFFSET,
            centerY = graphicBBox.height / 2 - labelBBox.height / 2,
            centerX = graphicBBox.width / 2 - labelBBox.width / 2,
            x = graphicBBox.x,
            y = graphicBBox.y;

        switch(position) {
            case "left":
                x -= labelBBox.width + offset;
                y += centerY;
                break;
            case "right":
                x += graphicBBox.width + offset;
                y += centerY;
                break;
            case "top":
                x += centerX;
                y -= labelBBox.height + offset;
                break;
            case "bottom":
                x += centerX;
                y += graphicBBox.height + offset;
                break;
            case "inside":
                x += centerX;
                y += centerY;
                break;
        }

        return { x: x, y: y };
    },

    _drawMarker: function(renderer, group, animationEnabled) {
        var that = this,
            options = that._options,
            translates = that._getTranslates(animationEnabled),
            style = that._getStyle();

        that.graphic = that._createMarker(renderer, group, options.image, _extend({ translateX: translates.x, translateY: translates.y, points: that._populatePointShape(options.symbol, style.r) }, style));
    },

    _getErrorBarSettings: function() {
        return { visibility: "visible" };
    },

    _getErrorBarBaseEdgeLength() {
        return this.getPointRadius() * 2;
    },

    _drawErrorBar: function(renderer, group) {
        if(!this._options.errorBars) {
            return;
        }
        var that = this,
            options = that._options,
            errorBarOptions = options.errorBars,
            points = [],
            settings,
            pos = that._errorBarPos,
            high = that._highErrorCoord,
            low = that._lowErrorCoord,
            displayMode = _normalizeEnum(errorBarOptions.displayMode),
            isHighDisplayMode = displayMode === "high",
            isLowDisplayMode = displayMode === "low",
            highErrorOnly = (isHighDisplayMode || !_isDefined(low)) && (_isDefined(high) && !isLowDisplayMode),
            lowErrorOnly = (isLowDisplayMode || !_isDefined(high)) && (_isDefined(low) && !isHighDisplayMode);

        let edgeLength = errorBarOptions.edgeLength;

        if(edgeLength <= 1 && edgeLength > 0) {
            edgeLength = this._getErrorBarBaseEdgeLength() * errorBarOptions.edgeLength;
        }

        edgeLength = _floor(parseInt(edgeLength) / 2);

        highErrorOnly && (low = that._baseErrorBarPos);
        lowErrorOnly && (high = that._baseErrorBarPos);

        if(displayMode !== "none" && _isDefined(high) && _isDefined(low) && _isDefined(pos)) {
            !lowErrorOnly && points.push([pos - edgeLength, high, pos + edgeLength, high]);
            points.push([pos, high, pos, low]);
            !highErrorOnly && points.push([pos + edgeLength, low, pos - edgeLength, low]);

            options.rotated && each(points, function(_, p) {
                p.reverse();
            });

            settings = that._getErrorBarSettings(errorBarOptions);
            if(!that._errorBar) {
                that._errorBar = renderer.path(points, "line").attr(settings).append(group);
            } else {
                settings.points = points;
                that._errorBar.attr(settings);
            }
        } else {
            that._errorBar && that._errorBar.attr({ visibility: "hidden" });
        }
    },

    getTooltipParams: function() {
        var that = this,
            graphic = that.graphic;
        return {
            x: that.x,
            y: that.y,
            offset: graphic ? graphic.getBBox().height / 2 : 0
        };
    },

    setPercentValue: function(absTotal, total, leftHoleTotal, rightHoleTotal) {
        var that = this,
            valuePercent = (that.value / absTotal) || 0,
            minValuePercent = (that.minValue / absTotal) || 0,
            percent = valuePercent - minValuePercent;

        that._label.setDataField("percent", percent);
        that._label.setDataField("total", total);

        if(that.series.isFullStackedSeries() && that.hasValue()) {
            if(that.leftHole) {
                that.leftHole /= absTotal - leftHoleTotal;
                that.minLeftHole /= absTotal - leftHoleTotal;
            }
            if(that.rightHole) {
                that.rightHole /= absTotal - rightHoleTotal;
                that.minRightHole /= absTotal - rightHoleTotal;
            }
            that.value = that.properValue = valuePercent;
            that.minValue = !minValuePercent ? that.minValue : minValuePercent;
        }
    },

    _storeTrackerR: function() {
        var that = this,
            navigator = window.navigator,
            r = that._options.styles.normal.r,
            minTrackerSize;
        ///#DEBUG
        navigator = that.__debug_navigator || navigator;
        that.__debug_browserNavigator = navigator;
        ///#ENDDEBUG
        minTrackerSize = windowUtils.hasProperty("ontouchstart") || (navigator.msPointerEnabled && navigator.msMaxTouchPoints || navigator.pointerEnabled && navigator.maxTouchPoints) ? 20 : 6;
        that._options.trackerR = r < minTrackerSize ? minTrackerSize : r;
        return that._options.trackerR;
    },

    _translateErrorBars: function() {
        var that = this,
            options = that._options,
            rotated = options.rotated,
            errorBars = options.errorBars,
            translator = that._getValTranslator();

        if(!errorBars) {
            return;
        }

        _isDefined(that.lowError) && (that._lowErrorCoord = translator.translate(that.lowError));
        _isDefined(that.highError) && (that._highErrorCoord = translator.translate(that.highError));
        that._errorBarPos = _floor(rotated ? that.vy : that.vx);
        that._baseErrorBarPos = errorBars.type === "stdDeviation" ? that._lowErrorCoord + (that._highErrorCoord - that._lowErrorCoord) / 2 : rotated ? that.vx : that.vy;
    },

    _translate: function() {
        var that = this,
            valTranslator = that._getValTranslator(),
            argTranslator = that._getArgTranslator();

        if(that._options.rotated) {
            that.vx = that.x = valTranslator.translate(that.value);
            that.vy = that.y = argTranslator.translate(that.argument);
            that.minX = valTranslator.translate(that.minValue);
            that.defaultX = valTranslator.translate(CANVAS_POSITION_DEFAULT);
        } else {
            that.vy = that.y = valTranslator.translate(that.value);
            that.vx = that.x = argTranslator.translate(that.argument);
            that.minY = valTranslator.translate(that.minValue);
            that.defaultY = valTranslator.translate(CANVAS_POSITION_DEFAULT);
        }
        that._translateErrorBars();
        that._calculateVisibility(that.x, that.y);
    },

    _updateData: function(data) {
        var that = this;
        that.value = that.properValue = that.initialValue = that.originalValue = data.value;
        that.minValue = that.initialMinValue = that.originalMinValue = _isDefined(data.minValue) ? data.minValue : CANVAS_POSITION_DEFAULT;
    },

    _getImageSettings: function(image) {
        return {
            href: image.url || image.toString(),
            width: image.width || DEFAULT_IMAGE_WIDTH,
            height: image.height || DEFAULT_IMAGE_HEIGHT
        };
    },

    getCrosshairData: function() {
        var that = this,
            r = that._options.rotated,
            value = that.properValue,
            argument = that.argument;
        return {
            x: that.vx,
            y: that.vy,
            xValue: r ? value : argument,
            yValue: r ? argument : value,
            axis: that.series.axis
        };
    },

    getPointRadius: function() {
        var style = this._getStyle(),
            options = this._options,
            r = style.r,
            extraSpace,
            symbol = options.symbol,
            isSquare = symbol === "square",
            isTriangle = symbol === "triangle" || symbol === "triangleDown" || symbol === "triangleUp";
        if(options.visible && !options.image && r) {
            extraSpace = style["stroke-width"] / 2;
            return (isSquare || isTriangle ? 1.4 * r : r) + extraSpace;
        }
        return 0;
    },

    _updateMarker: function(animationEnabled, style) {
        var that = this,
            options = that._options,
            settings,
            image = options.image,
            visibility = !that.isVisible() ? { visibility: "hidden" } : {};

        if(that._checkImage(image)) {
            settings = _extend({}, { visibility: style.visibility }, visibility, that._getImageSettings(image));
        } else {
            settings = _extend({}, style, visibility, { points: that._populatePointShape(options.symbol, style.r) });
        }

        if(!animationEnabled) {
            settings.translateX = that.x;
            settings.translateY = that.y;
        }

        that.graphic.attr(settings).sharp();
    },

    _getLabelFormatObject: function() {
        var that = this;
        return {
            argument: that.initialArgument,
            value: that.initialValue,
            originalArgument: that.originalArgument,
            originalValue: that.originalValue,
            seriesName: that.series.name,
            lowErrorValue: that.lowError,
            highErrorValue: that.highError,
            point: that
        };
    },

    _getLabelPosition: function() {
        var rotated = this._options.rotated;
        if(this.initialValue > 0) {
            return rotated ? "right" : "top";
        } else {
            return rotated ? "left" : "bottom";
        }
    },

    _getFormatObject: function(tooltip) {
        var that = this,
            labelFormatObject = that._label.getData();

        return _extend(
            {},
            labelFormatObject,
            {
                argumentText: tooltip.formatValue(that.initialArgument, "argument"),
                valueText: tooltip.formatValue(that.initialValue)
            },
            _isDefined(labelFormatObject.percent) ? { percentText: tooltip.formatValue(labelFormatObject.percent, "percent") } : {},
            _isDefined(labelFormatObject.total) ? { totalText: tooltip.formatValue(labelFormatObject.total) } : {}
        );
    },

    getMarkerVisibility: function() {
        return this._options.visible;
    },

    coordsIn: function(x, y) {
        var trackerRadius = this._storeTrackerR();
        return (x >= this.x - trackerRadius) && (x <= this.x + trackerRadius) && (y >= this.y - trackerRadius) && (y <= this.y + trackerRadius);
    },

    getMinValue: function(noErrorBar) {
        var errorBarOptions = this._options.errorBars;
        if(errorBarOptions && !noErrorBar) {
            var displayMode = errorBarOptions.displayMode,
                lowValue = displayMode === "high" ? this.value : this.lowError,
                highValue = displayMode === "low" ? this.value : this.highError;

            return lowValue < highValue ? lowValue : highValue;
        } else {
            return this.value;
        }
    },

    getMaxValue: function(noErrorBar) {
        var errorBarOptions = this._options.errorBars;
        if(errorBarOptions && !noErrorBar) {
            var displayMode = errorBarOptions.displayMode,
                lowValue = displayMode === "high" ? this.value : this.lowError,
                highValue = displayMode === "low" ? this.value : this.highError;

            return lowValue > highValue ? lowValue : highValue;
        } else {
            return this.value;
        }
    }
};
