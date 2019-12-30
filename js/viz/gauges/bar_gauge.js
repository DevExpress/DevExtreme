const PI_DIV_180 = Math.PI / 180;
const _abs = Math.abs;
const _round = Math.round;
const _floor = Math.floor;
const _min = Math.min;
const _max = Math.max;

const registerComponent = require('../../core/component_registrator');
const objectUtils = require('../../core/utils/object');
const commonUtils = require('../../core/utils/common');
const extend = require('../../core/utils/extend').extend;
const _normalizeEnum = require('../core/utils').normalizeEnum;

const baseGaugeModule = require('./base_gauge');
const dxBaseGauge = baseGaugeModule.dxBaseGauge;
const _getSampleText = baseGaugeModule.getSampleText;
const _formatValue = baseGaugeModule.formatValue;
const _compareArrays = baseGaugeModule.compareArrays;
const dxCircularGauge = require('./circular_gauge');
const _isArray = Array.isArray;
const vizUtils = require('../core/utils');
const _convertAngleToRendererSpace = vizUtils.convertAngleToRendererSpace;
const _getCosAndSin = vizUtils.getCosAndSin;
const _patchFontOptions = vizUtils.patchFontOptions;
const _Number = Number;
const _isFinite = isFinite;
const _noop = commonUtils.noop;
const _extend = extend;

const OPTION_VALUES = 'values';

const dxBarGauge = dxBaseGauge.inherit({
    _rootClass: 'dxbg-bar-gauge',

    _themeSection: 'barGauge',

    _fontFields: ['label.font', 'legend.font', 'legend.title.font', 'legend.title.subtitle.font'],

    _initCore: function() {
        const that = this;
        that.callBase.apply(that, arguments);
        that._barsGroup = that._renderer.g().attr({ 'class': 'dxbg-bars' }).linkOn(that._renderer.root, 'bars');
        that._values = [];
        that._context = {
            renderer: that._renderer,
            translator: that._translator,
            tracker: that._tracker,
            group: that._barsGroup
        };
        that._animateStep = function(pos) {
            const bars = that._bars;
            let i;
            let ii;
            for(i = 0, ii = bars.length; i < ii; ++i) {
                bars[i].animate(pos);
            }
        };
        that._animateComplete = function() {
            that._bars.forEach(bar => bar.endAnimation());
            that._checkOverlap();
        };
    },

    _disposeCore: function() {
        const that = this;
        that._barsGroup.linkOff();
        that._barsGroup = that._values = that._context = that._animateStep = that._animateComplete = null;
        that.callBase.apply(that, arguments);
    },

    _setupDomainCore: function() {
        const that = this;
        let startValue = that.option('startValue');
        let endValue = that.option('endValue');
        _isFinite(startValue) || (startValue = 0);
        _isFinite(endValue) || (endValue = 100);
        that._translator.setDomain(startValue, endValue);
        that._baseValue = that._translator.adjust(that.option('baseValue'));
        _isFinite(that._baseValue) || (that._baseValue = startValue < endValue ? startValue : endValue);
    },

    _getDefaultSize: function() {
        return { width: 300, height: 300 };
    },

    _setupCodomain: dxCircularGauge.prototype._setupCodomain,

    _getApproximateScreenRange: function() {
        const that = this;
        const sides = that._area.sides;
        const width = that._canvas.width / (sides.right - sides.left);
        const height = that._canvas.height / (sides.down - sides.up);
        const r = width < height ? width : height;
        return -that._translator.getCodomainRange() * r * PI_DIV_180;
    },

    _setupAnimationSettings: function() {
        const that = this;
        that.callBase.apply(that, arguments);
        if(that._animationSettings) {
            that._animationSettings.step = that._animateStep;
            that._animationSettings.complete = that._animateComplete;
        }
    },

    _cleanContent: function() {
        const that = this;

        that._barsGroup.linkRemove();
        that._animationSettings && that._barsGroup.stopAnimation();
        that._barsGroup.clear();
    },

    _renderContent: function() {
        const that = this;
        let labelOptions = that.option('label');
        let text;
        let bBox;
        const context = that._context;

        that._barsGroup.linkAppend();
        context.textEnabled = labelOptions === undefined || (labelOptions && (!('visible' in labelOptions) || labelOptions.visible));

        if(context.textEnabled) {
            context.textColor = (labelOptions && labelOptions.font && labelOptions.font.color) || null;
            labelOptions = _extend(true, {}, that._themeManager.theme().label, labelOptions);
            context.formatOptions = {
                format: labelOptions.format !== undefined ? labelOptions.format : that._defaultFormatOptions,
                customizeText: labelOptions.customizeText
            };
            context.textOptions = { align: 'center' };
            context.fontStyles = _patchFontOptions(_extend({}, that._themeManager.theme().label.font, labelOptions.font, { color: null }));

            that._textIndent = labelOptions.indent > 0 ? _Number(labelOptions.indent) : 0;
            context.lineWidth = labelOptions.connectorWidth > 0 ? _Number(labelOptions.connectorWidth) : 0;
            context.lineColor = labelOptions.connectorColor || null;

            text = that._renderer.text(_getSampleText(that._translator, context.formatOptions), 0, 0).attr(context.textOptions).css(context.fontStyles).append(that._barsGroup);
            bBox = text.getBBox();
            text.remove();

            context.textY = bBox.y;
            context.textWidth = bBox.width;
            context.textHeight = bBox.height;
        }

        dxCircularGauge.prototype._applyMainLayout.call(that);
        that._renderBars();
    },

    _measureMainElements: function() {
        const result = { maxRadius: this._area.radius };
        if(this._context.textEnabled) {
            result.horizontalMargin = this._context.textWidth;
            result.verticalMargin = this._context.textHeight;
            result.inverseHorizontalMargin = this._context.textWidth / 2;
            result.inverseVerticalMargin = this._context.textHeight / 2;
        }
        return result;
    },

    _renderBars: function() {
        const that = this;
        const options = _extend({}, that._themeManager.theme(), that.option());
        let relativeInnerRadius;
        let radius;
        const area = that._area;

        relativeInnerRadius = options.relativeInnerRadius > 0 && options.relativeInnerRadius < 1 ? _Number(options.relativeInnerRadius) : 0.1;
        radius = area.radius;
        if(that._context.textEnabled) { //  B253614
            that._textIndent = _round(_min(that._textIndent, radius / 2));
            radius -= that._textIndent;
        }
        that._outerRadius = _floor(radius);
        that._innerRadius = _floor(radius * relativeInnerRadius);
        that._barSpacing = options.barSpacing > 0 ? _Number(options.barSpacing) : 0;
        _extend(that._context, {
            backgroundColor: options.backgroundColor,
            x: area.x,
            y: area.y,
            startAngle: area.startCoord,
            endAngle: area.endCoord,
            baseAngle: that._translator.translate(that._baseValue)
        });

        that._arrangeBars();
    },

    _arrangeBars: function() {
        const that = this;
        let radius = that._outerRadius - that._innerRadius;
        const context = that._context;
        let spacing;
        let colors;
        let unitOffset;
        let i;

        const count = that._bars.length;

        that._beginValueChanging();
        context.barSize = count > 0 ? _max((radius - (count - 1) * that._barSpacing) / count, 1) : 0;
        spacing = count > 1 ? _max(_min((radius - count * context.barSize) / (count - 1), that._barSpacing), 0) : 0;
        const _count = _min(_floor((radius + spacing) / context.barSize), count);
        that._setBarsCount(count);
        radius = that._outerRadius;
        context.textRadius = radius;
        context.textIndent = that._textIndent;
        that._palette.reset();
        unitOffset = context.barSize + spacing;
        colors = that._palette.generateColors(_count);
        for(i = 0; i < _count; ++i, radius -= unitOffset) {
            that._bars[i].arrange({
                radius: radius,
                color: colors[i]
            });
        }

        for(let i = _count; i < count; i++) {
            that._bars[i].hide();
        }

        if(that._animationSettings && !that._noAnimation) {
            that._animateBars();
        } else {
            that._updateBars();
        }
        that._endValueChanging();
    },

    _setBarsCount: function() {
        const that = this;

        if(that._bars.length > 0) {
            if(that._dummyBackground) {
                that._dummyBackground.dispose();
                that._dummyBackground = null;
            }
        } else {
            if(!that._dummyBackground) {
                that._dummyBackground = that._renderer.arc().attr({ 'stroke-linejoin': 'round' });
            }
            that._dummyBackground.attr({ //  Because of vizMocks
                x: that._context.x, y: that._context.y, outerRadius: that._outerRadius, innerRadius: that._innerRadius,
                startAngle: that._context.endAngle, endAngle: that._context.startAngle, fill: that._context.backgroundColor
            }).append(that._barsGroup);
        }
    },

    _updateBars: function() {
        this._bars.forEach(bar => bar.applyValue());
        this._checkOverlap();
    },

    _checkOverlap: function() {
        const that = this;
        const bars = that._bars;
        const overlapStrategy = _normalizeEnum(that._getOption('resolveLabelOverlapping', true));

        if(overlapStrategy === 'none') {
            return;
        }

        const sortedBars = bars.concat().sort((a, b) => a.getValue() - b.getValue());

        let currentIndex = 0;
        let nextIndex = 1;
        while(currentIndex < sortedBars.length && nextIndex < sortedBars.length) {
            const current = sortedBars[currentIndex];
            const next = sortedBars[nextIndex];

            if(current.checkIntersect(next)) {
                next.hideLabel();
                nextIndex++;
            } else {
                currentIndex = nextIndex;
                nextIndex = currentIndex + 1;
            }
        }
    },

    _animateBars: function() {
        const that = this;
        let i;
        const ii = that._bars.length;
        if(ii > 0) {
            for(i = 0; i < ii; ++i) {
                that._bars[i].beginAnimation();
            }
            that._barsGroup.animate({ _: 0 }, that._animationSettings);
        }
    },

    _buildNodes() {
        const that = this;
        const options = that._options;

        that._palette = that._themeManager.createPalette(options.palette, {
            useHighlight: true,
            extensionMode: options.paletteExtensionMode
        });

        that._palette.reset();

        that._bars = that._bars || [];

        that._animationSettings && that._barsGroup.stopAnimation();

        const barValues = that._values.filter(_isFinite);
        const count = barValues.length;

        if(that._bars.length > count) {
            const ii = that._bars.length;
            for(let i = count; i < ii; ++i) {
                that._bars[i].dispose();
            }
            that._bars.splice(count, ii - count);
        } else if(that._bars.length < count) {
            for(let i = that._bars.length; i < count; ++i) {
                that._bars.push(new BarWrapper(i, that._context));
            }
        }

        that._bars.forEach((bar, index) => {
            bar.update({
                color: that._palette.getNextColor(count),
                value: barValues[index]
            });
        });
    },

    _updateValues: function(values) {
        const that = this;
        const list = (_isArray(values) && values) || (_isFinite(values) && [values]) || [];
        let i;
        const ii = list.length;
        let value;
        that._values.length = ii;
        for(i = 0; i < ii; ++i) {
            value = list[i];
            that._values[i] = value = _Number(_isFinite(value) ? value : that._values[i]);
        }

        if(!that._resizing) {
            if(!_compareArrays(that._values, that.option(OPTION_VALUES))) {
                that.option(OPTION_VALUES, that._values.slice());
            }
        }

        this._change(['NODES']);
    },

    values: function(arg) {
        if(arg !== undefined) {
            this._updateValues(arg);
            return this;
        } else {
            return this._values.slice(0);
        }
    },

    _optionChangesMap: {
        backgroundColor: 'MOSTLY_TOTAL',
        relativeInnerRadius: 'MOSTLY_TOTAL',
        barSpacing: 'MOSTLY_TOTAL',
        label: 'MOSTLY_TOTAL',
        resolveLabelOverlapping: 'MOSTLY_TOTAL',
        palette: 'MOSTLY_TOTAL',
        paletteExtensionMode: 'MOSTLY_TOTAL',
        values: 'VALUES'
    },

    _change_VALUES: function() {
        this._updateValues(this.option(OPTION_VALUES));
    },

    _factory: objectUtils.clone(dxBaseGauge.prototype._factory),

    _optionChangesOrder: ['VALUES', 'NODES'],

    _initialChanges: ['VALUES'],

    _change_NODES() {
        this._buildNodes();
    },

    _change_MOSTLY_TOTAL: function() {
        this._change(['NODES']);
        this.callBase();
    },

    _proxyData: [],

    _getLegendData() {
        const that = this;
        const formatOptions = {};
        const options = that._options;
        const labelFormatOptions = (options.label || {}).format;
        const legendFormatOptions = (options.legend || {}).itemTextFormat;

        if(legendFormatOptions) {
            formatOptions.format = legendFormatOptions;
        } else {
            formatOptions.format = labelFormatOptions || that._defaultFormatOptions;
        }

        return (this._bars || []).map(b => {
            return {
                id: b.index,
                item: {
                    value: b.getValue(),
                    color: b.getColor(),
                    index: b.index
                },
                text: _formatValue(b.getValue(), formatOptions),
                visible: true,
                states: { normal: { fill: b.getColor() } }
            };
        });
    }
});

var BarWrapper = function(index, context) {
    const that = this;
    that._context = context;
    that._tracker = context.renderer.arc().attr({ 'stroke-linejoin': 'round' });
    that.index = index;
};

_extend(BarWrapper.prototype, {
    dispose: function() {
        const that = this;
        that._background.dispose();
        that._bar.dispose();
        if(that._context.textEnabled) {
            that._line.dispose();
            that._text.dispose();
        }
        that._context.tracker.detach(that._tracker);
        that._context = that._settings = that._background = that._bar = that._line = that._text = that._tracker = null;
        return that;
    },

    arrange: function(options) {
        const that = this;
        const context = that._context;

        this._visible = true;
        context.tracker.attach(that._tracker, that, { index: that.index });

        that._background = context.renderer.arc().attr({ 'stroke-linejoin': 'round', fill: context.backgroundColor }).append(context.group);
        that._settings = that._settings || { x: context.x, y: context.y, startAngle: context.baseAngle, endAngle: context.baseAngle };

        that._bar = context.renderer.arc().attr(_extend({ 'stroke-linejoin': 'round' }, that._settings)).append(context.group);
        if(context.textEnabled) {
            that._line = context.renderer.path([], 'line').attr({ 'stroke-width': context.lineWidth }).append(context.group);
            that._text = context.renderer.text().css(context.fontStyles).attr(context.textOptions).append(context.group);
        }

        that._angle = isFinite(that._angle) ? that._angle : context.baseAngle;

        that._settings.outerRadius = options.radius;
        that._settings.innerRadius = options.radius - context.barSize;
        that._settings.x = context.x;
        that._settings.y = context.y;

        that._background.attr(_extend({}, that._settings, { startAngle: context.endAngle, endAngle: context.startAngle, fill: that._context.backgroundColor }));
        that._bar.attr({ x: context.x, y: context.y, outerRadius: that._settings.outerRadius, innerRadius: that._settings.innerRadius, fill: that._color });
        that._tracker.attr(that._settings);
        if(context.textEnabled) {
            that._line.attr({ points: [context.x, context.y - that._settings.innerRadius, context.x, context.y - context.textRadius - context.textIndent], stroke: context.lineColor || that._color }).sharp();
            that._text.css({ fill: context.textColor || that._color });
        }
        return that;
    },

    getTooltipParameters: function() {
        const that = this;
        const cosSin = _getCosAndSin((that._angle + that._context.baseAngle) / 2);
        return {
            x: _round(that._context.x + (that._settings.outerRadius + that._settings.innerRadius) / 2 * cosSin.cos),
            y: _round(that._context.y - (that._settings.outerRadius + that._settings.innerRadius) / 2 * cosSin.sin),
            offset: 0,
            color: that._color,
            value: that._value
        };
    },

    setAngle: function(angle) {
        const that = this;
        const context = that._context;
        const settings = that._settings;
        let cosSin;

        that._angle = angle;
        setAngles(settings, context.baseAngle, angle);
        that._bar.attr(settings);
        that._tracker.attr(settings);
        if(context.textEnabled) {
            cosSin = _getCosAndSin(angle);
            const indent = context.textIndent;
            const radius = context.textRadius + indent;
            let x = context.x + radius * cosSin.cos;
            let y = context.y - radius * cosSin.sin;
            const halfWidth = context.textWidth * 0.5;
            const textHeight = context.textHeight;
            const textY = context.textY;

            if(_abs(x - context.x) > indent) {
                x += (x < context.x) ? -halfWidth : halfWidth;
            }
            if(_abs(y - context.y) <= indent) {
                y -= textY + textHeight * 0.5;
            } else {
                y -= (y < context.y) ? textY + textHeight : textY;
            }

            const text = _formatValue(that._value, context.formatOptions, { index: that.index });
            const visibility = text === '' ? 'hidden' : null;
            that._text.attr({
                text: text,
                x: x,
                y: y,
                visibility: visibility
            });

            that._line.attr({ visibility: visibility });
            that._line.rotate(_convertAngleToRendererSpace(angle), context.x, context.y);
        }
        return that;
    },

    hideLabel: function() {
        this._text.attr({ visibility: 'hidden' });
        this._line.attr({ visibility: 'hidden' });
    },

    checkIntersect: function(anotherBar) {
        const coords = this.calculateLabelCoords();
        const anotherCoords = anotherBar.calculateLabelCoords();

        if(!coords || !anotherCoords) {
            return false;
        }

        const width = Math.max(0, Math.min(coords.bottomRight.x, anotherCoords.bottomRight.x) - Math.max(coords.topLeft.x, anotherCoords.topLeft.x));
        const height = Math.max(0, Math.min(coords.bottomRight.y, anotherCoords.bottomRight.y) - Math.max(coords.topLeft.y, anotherCoords.topLeft.y));

        return (width * height) !== 0;
    },

    calculateLabelCoords: function() {
        if(!this._text) {
            return;
        }

        const box = this._text.getBBox();
        return {
            topLeft: {
                x: box.x,
                y: box.y
            },
            bottomRight: {
                x: box.x + box.width,
                y: box.y + box.height
            }
        };
    },

    _processValue: function(value) {
        return this._context.translator.translate(this._context.translator.adjust(value));
    },

    applyValue() {
        if(!this._visible) {
            return this;
        }
        return this.setAngle(this._processValue(this.getValue()));
    },

    update({ color, value }) {
        this._color = color;
        this._value = value;
    },

    hide() {
        this._visible = false;
    },

    getColor() {
        return this._color;
    },

    getValue() {
        return this._value;
    },

    beginAnimation: function() {
        if(!this._visible) {
            return this;
        }
        const that = this;
        const angle = this._processValue(this.getValue());
        if(!compareFloats(that._angle, angle)) {
            that._start = that._angle;
            that._delta = angle - that._angle;
            that._tracker.attr({ visibility: 'hidden' });
            if(that._context.textEnabled) {
                that._line.attr({ visibility: 'hidden' });
                that._text.attr({ visibility: 'hidden' });
            }
        } else {
            that.animate = _noop;
            that.setAngle(that._angle);
        }
    },

    animate: function(pos) {
        if(!this._visible) {
            return this;
        }
        const that = this;
        that._angle = that._start + that._delta * pos;
        setAngles(that._settings, that._context.baseAngle, that._angle);
        that._bar.attr(that._settings);
    },

    endAnimation: function() {
        const that = this;
        if(that._delta !== undefined) {
            if(compareFloats(that._angle, that._start + that._delta)) {
                that._tracker.attr({ visibility: null });
                that.setAngle(that._angle);
            }
        } else {
            delete that.animate;
        }
        delete that._start;
        delete that._delta;
    }
});

function setAngles(target, angle1, angle2) {
    target.startAngle = angle1 < angle2 ? angle1 : angle2;
    target.endAngle = angle1 < angle2 ? angle2 : angle1;
}

function compareFloats(value1, value2) {
    return _abs(value1 - value2) < 0.0001;
}

registerComponent('dxBarGauge', dxBarGauge);

exports.dxBarGauge = dxBarGauge;

dxBarGauge.addPlugin(require('../components/legend').plugin);

///#DEBUG
const __BarWrapper = BarWrapper;

exports.BarWrapper = __BarWrapper;
exports.stubBarWrapper = function(barWrapperType) {
    BarWrapper = barWrapperType;
};
exports.restoreBarWrapper = function() {
    BarWrapper = __BarWrapper;
};
///#ENDDEBUG
