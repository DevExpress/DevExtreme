var each = require('../../core/utils/iterator').each,
    BaseSparkline = require('./base_sparkline'),

    TARGET_MIN_Y = 0.02,
    TARGET_MAX_Y = 0.98,
    BAR_VALUE_MIN_Y = 0.1,
    BAR_VALUE_MAX_Y = 0.9,

    DEFAULT_CANVAS_WIDTH = 300,
    DEFAULT_CANVAS_HEIGHT = 30,
    DEFAULT_HORIZONTAL_MARGIN = 1,
    DEFAULT_VERTICAL_MARGIN = 2,

    _Number = Number,
    _isFinite = isFinite;

var dxBullet = BaseSparkline.inherit({
    _rootClassPrefix: 'dxb',

    _rootClass: 'dxb-bullet',

    _themeSection: 'bullet',

    _defaultSize: {
        width: DEFAULT_CANVAS_WIDTH,
        height: DEFAULT_CANVAS_HEIGHT,
        left: DEFAULT_HORIZONTAL_MARGIN,
        right: DEFAULT_HORIZONTAL_MARGIN,
        top: DEFAULT_VERTICAL_MARGIN,
        bottom: DEFAULT_VERTICAL_MARGIN
    },

    _disposeWidgetElements: function() {
        delete this._zeroLevelPath;
        delete this._targetPath;
        delete this._barValuePath;
    },

    _cleanWidgetElements: function() {
        this._zeroLevelPath.remove();
        this._targetPath.remove();
        this._barValuePath.remove();
    },

    _drawWidgetElements: function() {
        this._drawBullet();
        this._drawn();
    },

    _createHtmlElements: function() {
        var renderer = this._renderer;
        this._zeroLevelPath = renderer.path(undefined, 'line').attr({ 'class': 'dxb-zero-level', 'stroke-linecap': 'square' });
        this._targetPath = renderer.path(undefined, 'line').attr({ 'class': 'dxb-target', 'stroke-linecap': 'square' });
        this._barValuePath = renderer.path(undefined, 'line').attr({ 'class': 'dxb-bar-value', 'stroke-linecap': 'square' });
    },

    _prepareOptions: function() {
        var that = this,
            options,
            startScaleValue,
            endScaleValue,
            level,
            value,
            target,
            isValueUndefined,
            isTargetUndefined;

        that._allOptions = options = that.callBase();
        isValueUndefined = that._allOptions.value === undefined;
        isTargetUndefined = that._allOptions.target === undefined;

        that._tooltipEnabled = !(isValueUndefined && isTargetUndefined);
        if(isValueUndefined) {
            that._allOptions.value = 0;
        }
        if(isTargetUndefined) {
            that._allOptions.target = 0;
        }

        options.value = value = _Number(options.value);
        options.target = target = _Number(options.target);

        if(that._allOptions.startScaleValue === undefined) {
            that._allOptions.startScaleValue = target < value ? target : value;
            that._allOptions.startScaleValue = that._allOptions.startScaleValue < 0 ? that._allOptions.startScaleValue : 0;
        }
        if(that._allOptions.endScaleValue === undefined) {
            that._allOptions.endScaleValue = target > value ? target : value;
        }

        options.startScaleValue = startScaleValue = _Number(options.startScaleValue);
        options.endScaleValue = endScaleValue = _Number(options.endScaleValue);


        if(endScaleValue < startScaleValue) {
            level = endScaleValue;
            that._allOptions.endScaleValue = startScaleValue;
            that._allOptions.startScaleValue = level;
            that._allOptions.inverted = true;
        }
    },

    _updateRange: function() {
        var that = this,
            options = that._allOptions;

        that._ranges = {
            arg: {
                invert: options.inverted,
                min: options.startScaleValue,
                max: options.endScaleValue,
                axisType: 'continuous',
                dataType: 'numeric'
            },
            val: {
                min: 0,
                max: 1,
                axisType: 'continuous',
                dataType: 'numeric'
            }
        };
    },

    _drawBullet: function() {
        var that = this,
            options = that._allOptions,
            isValidBounds = options.startScaleValue !== options.endScaleValue,
            isValidMin = _isFinite(options.startScaleValue),
            isValidMax = _isFinite(options.endScaleValue),
            isValidValue = _isFinite(options.value),
            isValidTarget = _isFinite(options.target);

        if(isValidBounds && isValidMax && isValidMin && isValidTarget && isValidValue) {
            this._drawBarValue();
            this._drawTarget();
            this._drawZeroLevel();
        }
    },

    _getTargetParams: function() {
        var that = this,
            options = that._allOptions,
            translatorY = that._valueAxis.getTranslator(),
            x = that._argumentAxis.getTranslator().translate(options.target);

        return {
            points: [x, translatorY.translate(TARGET_MIN_Y), x, translatorY.translate(TARGET_MAX_Y)],
            stroke: options.targetColor,
            'stroke-width': options.targetWidth
        };
    },

    _getBarValueParams: function() {
        var that = this,
            options = that._allOptions,
            translatorX = that._argumentAxis.getTranslator(),
            translatorY = that._valueAxis.getTranslator(),
            startLevel = options.startScaleValue,
            endLevel = options.endScaleValue,
            value = options.value,
            y2 = translatorY.translate(BAR_VALUE_MIN_Y),
            y1 = translatorY.translate(BAR_VALUE_MAX_Y),
            x1,
            x2;

        if(value > 0) {
            x1 = startLevel <= 0 ? 0 : startLevel;
            x2 = value >= endLevel ? endLevel : (value < x1 ? x1 : value);
        } else {
            x1 = endLevel >= 0 ? 0 : endLevel;
            x2 = value < startLevel ? startLevel : (value > x1 ? x1 : value);
        }

        x1 = translatorX.translate(x1);
        x2 = translatorX.translate(x2);

        return {
            points: [x1, y1, x2, y1, x2, y2, x1, y2],
            fill: options.color
        };
    },

    _getCorrectCanvas: function() {
        return this._canvas;
    },

    _getZeroLevelParams: function() {
        var that = this,
            translatorY = that._valueAxis.getTranslator(),
            x = that._argumentAxis.getTranslator().translate(0);

        return {
            points: [x, translatorY.translate(TARGET_MIN_Y), x, translatorY.translate(TARGET_MAX_Y)],
            stroke: that._allOptions.targetColor,
            'stroke-width': 1
        };
    },

    _drawZeroLevel: function() {
        var that = this,
            options = that._allOptions;

        if((0 > options.endScaleValue) || (0 < options.startScaleValue) || (!options.showZeroLevel)) {
            return;
        }

        that._zeroLevelPath.attr(that._getZeroLevelParams()).sharp().append(that._renderer.root);
    },

    _drawTarget: function() {
        var that = this,
            options = that._allOptions,
            target = options.target;

        if((target > options.endScaleValue) || (target < options.startScaleValue) || (!options.showTarget)) {
            return;
        }

        that._targetPath.attr(that._getTargetParams()).sharp().append(that._renderer.root);
    },

    _drawBarValue: function() {
        this._barValuePath.attr(this._getBarValueParams()).append(this._renderer.root);
    },

    _getTooltipCoords: function() {
        var canvas = this._canvas,
            rootOffset = this._renderer.getRootOffset(),
            bBox = this._barValuePath.getBBox();

        return {
            x: bBox.x + bBox.width / 2 + rootOffset.left,
            y: (canvas.height / 2) + rootOffset.top
        };
    },

    _getTooltipData: function() {
        var that = this,
            tooltip = that._tooltip,
            options = that._allOptions,
            value = options.value,
            target = options.target,
            valueText = tooltip.formatValue(value),
            targetText = tooltip.formatValue(target);

        return {
            originalValue: value,
            originalTarget: target,
            value: valueText,
            target: targetText,
            valueText: ['Actual Value:', valueText, 'Target Value:', targetText]
        };
    },

    _isTooltipEnabled: function() {
        return this._tooltipEnabled;
    }
});

each(['color', 'targetColor', 'targetWidth', 'showTarget', 'showZeroLevel',
    'value', 'target', 'startScaleValue', 'endScaleValue'
], function(_, name) {
    dxBullet.prototype._optionChangesMap[name] = 'OPTIONS';
});

require('../../core/component_registrator')('dxBullet', dxBullet);

module.exports = dxBullet;
