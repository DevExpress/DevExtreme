"use strict";

var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    _max = Math.max,
    _min = Math.min,
    _round = Math.round,
    _each = $.each,
    registerComponent = require("../../core/component_registrator"),
    extend = require("../../core/utils/extend").extend,
    objectUtils = require("../../core/utils/object"),
    dxBaseGauge = require("./base_gauge").dxBaseGauge,
    dxGauge = require("./common").dxGauge,
    _normalizeEnum = require("../core/utils").normalizeEnum,
    translator2DModule = require("../translators/translator2d"),
    linearIndicatorsModule = require("./linear_indicators"),
    createIndicatorCreator = require("./common").createIndicatorCreator,
    LinearRangeContainer = require("./linear_range_container"),
    ThemeManager = require("./theme_manager");

var dxLinearGauge = dxGauge.inherit({
    _rootClass: 'dxg-linear-gauge',

    _factoryMethods: {
        rangeContainer: 'createLinearRangeContainer',
        indicator: 'createLinearIndicator'
    },
    _gridSpacingFactor: 25,
    _scaleTypes: {
        type: "xyAxes",
        drawingType: "linear"
    },

    _initScaleTranslator: function(range) {
        var canvas = extend({}, this._canvas);

        return {
            val: new translator2DModule.Translator2D(range, canvas),
            arg: new translator2DModule.Translator2D(range, canvas, { isHorizontal: true })
        };
    },

    _getScaleTranslatorComponent: function(name) {
        return this._scaleTranslator[(name === "arg") !== this._area.vertical ? "arg" : "val"];
    },

    _updateScaleAngles: noop,

    _getTicksOrientation: function(scaleOptions) {
        return scaleOptions.isHorizontal ? scaleOptions.verticalOrientation : scaleOptions.horizontalOrientation;
    },

    _updateScaleTickIndent: function(scaleOptions) {
        var indentFromTick = scaleOptions.label.indentFromTick,
            length = scaleOptions.tick.length,
            textParams = this._scale.measureLabels(),
            verticalTextCorrection = scaleOptions.isHorizontal ? textParams.height + textParams.y : 0,
            isIndentPositive = indentFromTick > 0,
            orientation,
            textCorrection,
            tickCorrection;

        if(scaleOptions.isHorizontal) {
            orientation = isIndentPositive ? { center: 0.5, middle: 0.5 /* DEPRECATED_15_2 */, top: 0, bottom: 1 } : { center: 0.5, middle: 0.5 /* DEPRECATED_15_2 */, top: 1, bottom: 0 };
            tickCorrection = length * (orientation[scaleOptions.verticalOrientation]);
            textCorrection = textParams.y;
        } else {
            orientation = isIndentPositive ? { center: 0.5, left: 0, right: 1 } : { center: 0.5, left: 1, right: 0 };
            tickCorrection = length * (orientation[scaleOptions.horizontalOrientation]);
            textCorrection = -textParams.width;
        }

        scaleOptions.label.indentFromAxis = -indentFromTick + (isIndentPositive ? -tickCorrection + textCorrection : tickCorrection - verticalTextCorrection);

        this._scale.updateOptions(scaleOptions);
    },

    _shiftScale: function(layout, scaleOptions) {
        var that = this,
            canvas = extend({}, that._canvas),
            isHorizontal = scaleOptions.isHorizontal,
            translator = that._getScaleTranslatorComponent("arg"),
            additionalTranslator = that._getScaleTranslatorComponent("val"),
            scale = that._scale;

        canvas[isHorizontal ? "left" : "top"] = that._area[isHorizontal ? "startCoord" : "endCoord"];
        canvas[isHorizontal ? "right" : "bottom"] = canvas[isHorizontal ? "width" : "height"] - that._area[isHorizontal ? "endCoord" : "startCoord"];

        translator.updateCanvas(canvas);
        additionalTranslator.updateCanvas(canvas);
        scale.setTranslator(translator, additionalTranslator);

        scale.draw();
        scale.shift(layout.x, layout.y);
    },

    _setupCodomain: function() {
        var that = this,
            geometry = that.option('geometry') || {},
            vertical = _normalizeEnum(geometry.orientation) === 'vertical';

        that._area = {
            vertical: vertical,
            x: 0,
            y: 0,
            startCoord: -100,
            endCoord: 100
        };
        that._rangeContainer.vertical = vertical;
    },

    _getScaleLayoutValue: function() {
        return this._area[this._area.vertical ? "x" : "y"];
    },

    _getTicksCoefficients: function(options) {
        var coefs = { inner: 0, outer: 1 };

        if(this._area.vertical) {
            if(options.horizontalOrientation === "left") {
                coefs.inner = 1;
                coefs.outer = 0;
            } else if(options.horizontalOrientation === "center") {
                coefs.inner = coefs.outer = 0.5;
            }
        } else {
            if(options.verticalOrientation === "top") {
                coefs.inner = 1;
                coefs.outer = 0;
            } else if(options.verticalOrientation === "center" || options.verticalOrientation === "middle" /* DEPRECATED_15_2 */) {
                coefs.inner = coefs.outer = 0.5;
            }
        }

        return coefs;
    },

    _correctScaleIndents: function(result, indentFromTick, textParams) {
        var vertical = this._area.vertical;
        if(indentFromTick >= 0) {
            result.max += indentFromTick + textParams[vertical ? "width" : "height"];
        } else {
            result.min -= -indentFromTick + textParams[vertical ? "width" : "height"];
        }
        result.indent = textParams[vertical ? "height" : "width"] / 2;
    },

    _measureMainElements: function(elements, scaleMeasurement) {
        var that = this,
            x = that._area.x,
            y = that._area.y,
            minBound = 1000,
            maxBound = 0,
            indent = 0,
            scale = that._scale;

        _each(elements.concat(scale), function(_, element) {
            var bounds = element.measure ? element.measure({ x: x + element.getOffset(), y: y + element.getOffset() }) : scaleMeasurement;
            bounds.max !== undefined && (maxBound = _max(maxBound, bounds.max));
            bounds.min !== undefined && (minBound = _min(minBound, bounds.min));
            (bounds.indent > 0) && (indent = _max(indent, bounds.indent));
        });
        return { minBound: minBound, maxBound: maxBound, indent: indent };
    },

    _applyMainLayout: function(elements, scaleMeasurement) {
        var that = this,
            measurements = that._measureMainElements(elements, scaleMeasurement),
            area = that._area,
            rect,
            offset;

        if(area.vertical) {
            rect = selectRectBySizes(that._innerRect, { width: measurements.maxBound - measurements.minBound });
            offset = (rect.left + rect.right) / 2 - (measurements.minBound + measurements.maxBound) / 2;
            area.startCoord = rect.bottom - measurements.indent;
            area.endCoord = rect.top + measurements.indent;
            area.x = _round(area.x + offset);
        } else {
            rect = selectRectBySizes(that._innerRect, { height: measurements.maxBound - measurements.minBound });
            offset = (rect.top + rect.bottom) / 2 - (measurements.minBound + measurements.maxBound) / 2;
            area.startCoord = rect.left + measurements.indent;
            area.endCoord = rect.right - measurements.indent;
            area.y = _round(area.y + offset);
        }
        that._translator.setCodomain(area.startCoord, area.endCoord);
        that._innerRect = rect;
    },

    _getElementLayout: function(offset) {
        return { x: _round(this._area.x + offset), y: _round(this._area.y + offset) };
    },

    _getApproximateScreenRange: function() {
        var that = this,
            area = that._area,
            s = area.vertical ? that._canvas.height : that._canvas.width;

        s > area.totalSize && (s = area.totalSize);
        s = s * 0.8;
        return s;
    },

    _getDefaultSize: function() {
        var geometry = this.option('geometry') || {};
        if(geometry.orientation === 'vertical') {
            return { width: 100, height: 300 };
        } else {
            return { width: 300, height: 100 };
        }
    },

    _factory: objectUtils.clone(dxBaseGauge.prototype._factory)
});

function selectRectBySizes(srcRect, sizes, margins) {
    var rect = extend({}, srcRect),
        step;
    margins = margins || {};
    if(sizes) {
        rect.left += margins.left || 0;
        rect.right -= margins.right || 0;
        rect.top += margins.top || 0;
        rect.bottom -= margins.bottom || 0;

        if(sizes.width > 0) {
            step = (rect.right - rect.left - sizes.width) / 2;
            if(step > 0) {
                rect.left += step;
                rect.right -= step;
            }
        }
        if(sizes.height > 0) {
            step = (rect.bottom - rect.top - sizes.height) / 2;
            if(step > 0) {
                rect.top += step;
                rect.bottom -= step;
            }
        }
    }
    return rect;
}

///#DEBUG
dxLinearGauge._TESTS_selectRectBySizes = selectRectBySizes;
///#ENDDEBUG

var indicators = dxLinearGauge.prototype._factory.indicators = {};
dxLinearGauge.prototype._factory.createIndicator = createIndicatorCreator(indicators);

indicators._default = linearIndicatorsModule._default;
indicators["rectangle"] = linearIndicatorsModule["rectangle"];
indicators["rhombus"] = linearIndicatorsModule["rhombus"];
indicators["circle"] = linearIndicatorsModule["circle"];
indicators["trianglemarker"] = linearIndicatorsModule["trianglemarker"];
indicators["textcloud"] = linearIndicatorsModule["textcloud"];
indicators["rangebar"] = linearIndicatorsModule["rangebar"];

dxLinearGauge.prototype._factory.RangeContainer = LinearRangeContainer;

dxLinearGauge.prototype._factory.ThemeManager = ThemeManager.inherit({
    _subTheme: "_linear"
});

registerComponent("dxLinearGauge", dxLinearGauge);

module.exports = dxLinearGauge;
