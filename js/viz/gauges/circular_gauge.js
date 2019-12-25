var _isFinite = isFinite,
    registerComponent = require('../../core/component_registrator'),
    objectUtils = require('../../core/utils/object'),
    extend = require('../../core/utils/extend').extend,
    each = require('../../core/utils/iterator').each,
    dxBaseGauge = require('./base_gauge').dxBaseGauge,
    dxGauge = require('./common').dxGauge,
    vizUtils = require('../core/utils'),
    _normalizeAngle = vizUtils.normalizeAngle,
    _getCosAndSin = vizUtils.getCosAndSin,
    circularIndicatorsModule = require('./circular_indicators'),
    createIndicatorCreator = require('./common').createIndicatorCreator,
    CircularRangeContainer = require('./circular_range_container'),

    _abs = Math.abs,
    _max = Math.max,
    _min = Math.min,
    _round = Math.round,
    _each = each,

    PI = Math.PI;

function getSides(startAngle, endAngle) {
    var startCosSin = _getCosAndSin(startAngle),
        endCosSin = _getCosAndSin(endAngle),
        startCos = startCosSin.cos,
        startSin = startCosSin.sin,
        endCos = endCosSin.cos,
        endSin = endCosSin.sin;
    return {
        left: ((startSin <= 0 && endSin >= 0) ||
            (startSin <= 0 && endSin <= 0 && startCos <= endCos) ||
            (startSin >= 0 && endSin >= 0 && startCos >= endCos)) ? -1 : _min(startCos, endCos, 0),
        right: ((startSin >= 0 && endSin <= 0) ||
            (startSin >= 0 && endSin >= 0 && startCos >= endCos) ||
            (startSin <= 0 && endSin <= 0 && startCos <= endCos)) ? 1 : _max(startCos, endCos, 0),
        up: ((startCos <= 0 && endCos >= 0) ||
            (startCos <= 0 && endCos <= 0 && startSin >= endSin) ||
            (startCos >= 0 && endCos >= 0 && startSin <= endSin)) ? -1 : -_max(startSin, endSin, 0),
        down: ((startCos >= 0 && endCos <= 0) ||
            (startCos >= 0 && endCos >= 0 && startSin <= endSin) ||
            (startCos <= 0 && endCos <= 0 && startSin >= endSin)) ? 1 : -_min(startSin, endSin, 0)
    };
}

var dxCircularGauge = dxGauge.inherit({
    _rootClass: 'dxg-circular-gauge',

    _factoryMethods: {
        rangeContainer: 'createCircularRangeContainer',
        indicator: 'createCircularIndicator'
    },
    _gridSpacingFactor: 17,
    _scaleTypes: {
        type: 'polarAxes',
        drawingType: 'circular'
    },

    _getThemeManagerOptions() {
        let options = this.callBase.apply(this, arguments);

        options.subTheme = '_circular';
        return options;
    },

    _updateScaleTickIndent: function(scaleOptions) {
        var indentFromTick = scaleOptions.label.indentFromTick,
            length = scaleOptions.tick.visible ? scaleOptions.tick.length : 0,
            textParams = this._scale.measureLabels(extend({}, this._canvas)),
            tickCorrection = length;

        if(scaleOptions.orientation === 'inside') {
            tickCorrection = 0;
        } else if(scaleOptions.orientation === 'center') {
            tickCorrection = 0.5 * length;
        }

        scaleOptions.label.indentFromAxis = indentFromTick >= 0 ? indentFromTick + tickCorrection : indentFromTick - tickCorrection - _max(textParams.width, textParams.height);
        this._scale.updateOptions(scaleOptions);
    },

    _setupCodomain: function() {
        var that = this,
            geometry = that.option('geometry') || {},
            startAngle = geometry.startAngle,
            endAngle = geometry.endAngle,
            sides;
        startAngle = _isFinite(startAngle) ? _normalizeAngle(startAngle) : 225;
        endAngle = _isFinite(endAngle) ? _normalizeAngle(endAngle) : -45;
        if(_abs(startAngle - endAngle) < 1) {
            endAngle -= 360;
            sides = { left: -1, up: -1, right: 1, down: 1 };

        } else {
            (startAngle < endAngle) && (endAngle -= 360);
            sides = getSides(startAngle, endAngle);
        }
        that._area = {
            x: 0,
            y: 0,
            radius: 100,
            startCoord: startAngle,
            endCoord: endAngle,
            sides: sides
        };
        that._translator.setCodomain(startAngle, endAngle);
    },

    _shiftScale: function(layout) {
        var scale = this._scale,
            centerCoords,
            canvas = scale.getCanvas();

        canvas.width = canvas.height = layout.radius * 2;

        scale.draw(canvas);
        centerCoords = scale.getCenter();
        scale.shift({ right: layout.x - centerCoords.x, bottom: layout.y - centerCoords.y });
    },

    _getScaleLayoutValue: function() {
        return this._area.radius;
    },

    _getTicksOrientation: function(scaleOptions) {
        return scaleOptions.orientation;
    },

    _getTicksCoefficients: function(options) {
        var coefs = { inner: 0, outer: 1 };

        if(options.orientation === 'inside') {
            coefs.inner = 1;
            coefs.outer = 0;
        } else if(options.orientation === 'center') {
            coefs.inner = coefs.outer = 0.5;
        }

        return coefs;
    },

    _correctScaleIndents: function(result, indentFromTick, textParams) {
        if(indentFromTick >= 0) {
            result.horizontalOffset = indentFromTick + textParams.width;
            result.verticalOffset = indentFromTick + textParams.height;
        } else {
            result.horizontalOffset = result.verticalOffset = 0;
            result.min -= -indentFromTick + _max(textParams.width, textParams.height);
        }
        result.inverseHorizontalOffset = textParams.width / 2;
        result.inverseVerticalOffset = textParams.height / 2;
    },

    _measureMainElements: function(elements, scaleMeasurement) {
        var that = this,
            radius = that._area.radius,
            maxRadius = 0,
            minRadius = Infinity,
            maxHorizontalOffset = 0,
            maxVerticalOffset = 0,
            maxInverseHorizontalOffset = 0,
            maxInverseVerticalOffset = 0,
            scale = that._scale;

        _each(elements.concat(scale), function(_, element) {
            var bounds = element.measure ? element.measure({ radius: radius - element.getOffset() }) : scaleMeasurement;
            (bounds.min > 0) && (minRadius = _min(minRadius, bounds.min));
            (bounds.max > 0) && (maxRadius = _max(maxRadius, bounds.max));
            (bounds.horizontalOffset > 0) && (maxHorizontalOffset = _max(maxHorizontalOffset, bounds.max + bounds.horizontalOffset));
            (bounds.verticalOffset > 0) && (maxVerticalOffset = _max(maxVerticalOffset, bounds.max + bounds.verticalOffset));
            (bounds.inverseHorizontalOffset > 0) && (maxInverseHorizontalOffset = _max(maxInverseHorizontalOffset, bounds.inverseHorizontalOffset));
            (bounds.inverseVerticalOffset > 0) && (maxInverseVerticalOffset = _max(maxInverseVerticalOffset, bounds.inverseVerticalOffset));
        });

        maxHorizontalOffset = _max(maxHorizontalOffset - maxRadius, 0);
        maxVerticalOffset = _max(maxVerticalOffset - maxRadius, 0);
        return {
            minRadius: minRadius,
            maxRadius: maxRadius,
            horizontalMargin: maxHorizontalOffset,
            verticalMargin: maxVerticalOffset,
            inverseHorizontalMargin: maxInverseHorizontalOffset,
            inverseVerticalMargin: maxInverseVerticalOffset
        };
    },

    _applyMainLayout: function(elements, scaleMeasurement) {
        var measurements = this._measureMainElements(elements, scaleMeasurement),
            area = this._area,
            sides = area.sides,
            margins = {
                left: (sides.left < -0.1 ? measurements.horizontalMargin : measurements.inverseHorizontalMargin) || 0,
                right: (sides.right > 0.1 ? measurements.horizontalMargin : measurements.inverseHorizontalMargin) || 0,
                top: (sides.up < -0.1 ? measurements.verticalMargin : measurements.inverseVerticalMargin) || 0,
                bottom: (sides.down > 0.1 ? measurements.verticalMargin : measurements.inverseVerticalMargin) || 0
            },
            rect = selectRectByAspectRatio(this._innerRect, (sides.down - sides.up) / (sides.right - sides.left), margins),
            radius = _min(getWidth(rect) / (sides.right - sides.left), getHeight(rect) / (sides.down - sides.up)),
            x,
            y;

        radius = radius - measurements.maxRadius + area.radius;
        x = rect.left - getWidth(rect) * sides.left / (sides.right - sides.left);
        y = rect.top - getHeight(rect) * sides.up / (sides.down - sides.up);
        area.x = _round(x);
        area.y = _round(y);
        area.radius = radius;
        rect.left -= margins.left;
        rect.right += margins.right;
        rect.top -= margins.top;
        rect.bottom += margins.bottom;
        this._innerRect = rect;
    },

    _getElementLayout: function(offset) {
        return { x: this._area.x, y: this._area.y, radius: _round(this._area.radius - offset) };
    },

    _getApproximateScreenRange: function() {
        var that = this,
            area = that._area,
            r = _min(that._canvas.width / (area.sides.right - area.sides.left), that._canvas.height / (area.sides.down - area.sides.up));

        r > area.totalRadius && (r = area.totalRadius);
        r = 0.8 * r;
        return -that._translator.getCodomainRange() * r * PI / 180;
    },

    _getDefaultSize: function() {
        return { width: 300, height: 300 };
    },

    _factory: objectUtils.clone(dxBaseGauge.prototype._factory)
});

function getWidth(rect) {
    return rect.right - rect.left;
}

function getHeight(rect) {
    return rect.bottom - rect.top;
}

function selectRectByAspectRatio(srcRect, aspectRatio, margins) {
    var rect = extend({}, srcRect),
        selfAspectRatio,
        width = 0,
        height = 0;
    margins = margins || {};
    if(aspectRatio > 0) {
        rect.left += margins.left || 0;
        rect.right -= margins.right || 0;
        rect.top += margins.top || 0;
        rect.bottom -= margins.bottom || 0;

        if(getWidth(rect) > 0 && getHeight(rect) > 0) {
            selfAspectRatio = getHeight(rect) / getWidth(rect);
            if(selfAspectRatio > 1) {
                aspectRatio < selfAspectRatio ? (width = getWidth(rect)) : (height = getHeight(rect));
            } else {
                aspectRatio > selfAspectRatio ? (height = getHeight(rect)) : (width = getWidth(rect));
            }
            (width > 0) || (width = height / aspectRatio);
            (height > 0) || (height = width * aspectRatio);
            width = (getWidth(rect) - width) / 2;
            height = (getHeight(rect) - height) / 2;
            rect.left += width;
            rect.right -= width;
            rect.top += height;
            rect.bottom -= height;
        } else {
            rect.left = rect.right = (rect.left + rect.right) / 2;
            rect.top = rect.bottom = (rect.top + rect.bottom) / 2;
        }
    }
    return rect;
}

///#DEBUG
dxCircularGauge._TESTS_selectRectByAspectRatio = selectRectByAspectRatio;
///#ENDDEBUG

var indicators = dxCircularGauge.prototype._factory.indicators = {};
dxCircularGauge.prototype._factory.createIndicator = createIndicatorCreator(indicators);

indicators._default = circularIndicatorsModule._default;
indicators['rectangleneedle'] = circularIndicatorsModule['rectangleneedle'];
indicators['triangleneedle'] = circularIndicatorsModule['triangleneedle'];
indicators['twocolorneedle'] = circularIndicatorsModule['twocolorneedle'];
indicators['trianglemarker'] = circularIndicatorsModule['trianglemarker'];
indicators['textcloud'] = circularIndicatorsModule['textcloud'];
indicators['rangebar'] = circularIndicatorsModule['rangebar'];

dxCircularGauge.prototype._factory.RangeContainer = CircularRangeContainer;

registerComponent('dxCircularGauge', dxCircularGauge);

module.exports = dxCircularGauge;
