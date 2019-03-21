var PI_DIV_180 = Math.PI / 180,
    _abs = Math.abs,
    _round = Math.round,
    _floor = Math.floor,
    _min = Math.min,
    _max = Math.max,

    registerComponent = require("../../core/component_registrator"),
    objectUtils = require("../../core/utils/object"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,

    baseGaugeModule = require("./base_gauge"),
    dxBaseGauge = baseGaugeModule.dxBaseGauge,
    _getSampleText = baseGaugeModule.getSampleText,
    _formatValue = baseGaugeModule.formatValue,
    _compareArrays = baseGaugeModule.compareArrays,
    dxCircularGauge = require("./circular_gauge"),
    BaseThemeManager = require("../core/base_theme_manager").BaseThemeManager,
    _isArray = Array.isArray,
    vizUtils = require("../core/utils"),
    _convertAngleToRendererSpace = vizUtils.convertAngleToRendererSpace,
    _getCosAndSin = vizUtils.getCosAndSin,
    _patchFontOptions = vizUtils.patchFontOptions,
    _Number = Number,
    _isFinite = isFinite,
    _noop = commonUtils.noop,
    _extend = extend,

    OPTION_VALUES = "values";

var dxBarGauge = dxBaseGauge.inherit({
    _rootClass: "dxbg-bar-gauge",

    _initCore: function() {
        var that = this;
        that.callBase.apply(that, arguments);
        that._barsGroup = that._renderer.g().attr({ "class": "dxbg-bars" }).linkOn(that._renderer.root, "bars");
        that._values = [];
        that._context = {
            renderer: that._renderer,
            translator: that._translator,
            tracker: that._tracker,
            group: that._barsGroup
        };
        that._animateStep = function(pos) {
            var bars = that._bars,
                i,
                ii;
            for(i = 0, ii = bars.length; i < ii; ++i) {
                bars[i].animate(pos);
            }
        };
        that._animateComplete = function() {
            var bars = that._bars,
                i,
                ii;
            for(i = 0, ii = bars.length; i < ii; ++i) {
                bars[i].endAnimation();
            }
        };
    },

    _disposeCore: function() {
        var that = this;
        that._barsGroup.linkOff();
        that._barsGroup = that._values = that._context = that._animateStep = that._animateComplete = null;
        that.callBase.apply(that, arguments);
    },

    _setupDomainCore: function() {
        var that = this,
            startValue = that.option("startValue"),
            endValue = that.option("endValue");
        _isFinite(startValue) || (startValue = 0);
        _isFinite(endValue) || (endValue = 100);
        that._translator.setDomain(startValue, endValue);
        that._baseValue = that._translator.adjust(that.option("baseValue"));
        _isFinite(that._baseValue) || (that._baseValue = startValue < endValue ? startValue : endValue);
    },

    _getDefaultSize: function() {
        return { width: 300, height: 300 };
    },

    _setupCodomain: dxCircularGauge.prototype._setupCodomain,

    _getApproximateScreenRange: function() {
        var that = this,
            sides = that._area.sides,
            width = that._canvas.width / (sides.right - sides.left),
            height = that._canvas.height / (sides.down - sides.up),
            r = width < height ? width : height;
        return -that._translator.getCodomainRange() * r * PI_DIV_180;
    },

    _setupAnimationSettings: function() {
        var that = this;
        that.callBase.apply(that, arguments);
        if(that._animationSettings) {
            that._animationSettings.step = that._animateStep;
            that._animationSettings.complete = that._animateComplete;
        }
    },

    _cleanContent: function() {
        var that = this,
            i,
            ii;
        that._barsGroup.linkRemove();
        that._animationSettings && that._barsGroup.stopAnimation();
        for(i = 0, ii = that._bars ? that._bars.length : 0; i < ii; ++i) {
            that._bars[i].dispose();
        }
        that._palette = that._bars = null;
    },

    _renderContent: function() {
        var that = this,
            labelOptions = that.option("label"),
            text,
            bBox,
            context = that._context;

        that._barsGroup.linkAppend();
        context.textEnabled = labelOptions === undefined || (labelOptions && (!("visible" in labelOptions) || labelOptions.visible));

        if(context.textEnabled) {
            context.textColor = (labelOptions && labelOptions.font && labelOptions.font.color) || null;
            labelOptions = _extend(true, {}, that._themeManager.theme().label, labelOptions);
            context.formatOptions = {
                format: labelOptions.format !== undefined ? labelOptions.format : that._defaultFormatOptions,
                customizeText: labelOptions.customizeText
            };
            context.textOptions = { align: "center" };
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
        var result = { maxRadius: this._area.radius };
        if(this._context.textEnabled) {
            result.horizontalMargin = this._context.textWidth;
            result.verticalMargin = this._context.textHeight;
            result.inverseHorizontalMargin = this._context.textWidth / 2;
            result.inverseVerticalMargin = this._context.textHeight / 2;
        }
        return result;
    },

    _renderBars: function() {
        var that = this,
            options = _extend({}, that._themeManager.theme(), that.option()),
            relativeInnerRadius,
            radius,
            area = that._area;

        that._palette = that._themeManager.createPalette(options.palette, {
            useHighlight: true,
            extensionMode: options.paletteExtensionMode
        });
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
        that._bars = [];
        that._updateValues(that.option(OPTION_VALUES));
    },

    _arrangeBars: function(count) {
        var that = this,
            radius = that._outerRadius - that._innerRadius,
            context = that._context,
            spacing,
            _count,
            unitOffset,
            i;

        context.barSize = count > 0 ? _max((radius - (count - 1) * that._barSpacing) / count, 1) : 0;
        spacing = count > 1 ? _max(_min((radius - count * context.barSize) / (count - 1), that._barSpacing), 0) : 0;
        _count = _min(_floor((radius + spacing) / context.barSize), count);
        that._setBarsCount(_count);
        radius = that._outerRadius;
        context.textRadius = radius;
        context.textIndent = that._textIndent;
        that._palette.reset();
        unitOffset = context.barSize + spacing;
        for(i = 0; i < _count; ++i, radius -= unitOffset) {
            that._bars[i].arrange({
                radius: radius,
                color: that._palette.getNextColor(_count)
            });
        }
    },

    _setBarsCount: function(count) {
        var that = this,
            i,
            ii;

        if(that._bars.length > count) {
            for(i = count, ii = that._bars.length; i < ii; ++i) {
                that._bars[i].dispose();
            }
            that._bars.splice(count, ii - count);
        } else if(that._bars.length < count) {
            for(i = that._bars.length, ii = count; i < ii; ++i) {
                that._bars.push(new BarWrapper(i, that._context));
            }
        }
        if(that._bars.length > 0) {
            if(that._dummyBackground) {
                that._dummyBackground.dispose();
                that._dummyBackground = null;
            }
        } else {
            if(!that._dummyBackground) {
                that._dummyBackground = that._renderer.arc().attr({ "stroke-linejoin": "round" }).append(that._barsGroup);
            }
            that._dummyBackground.attr({ //  Because of vizMocks
                x: that._context.x, y: that._context.y, outerRadius: that._outerRadius, innerRadius: that._innerRadius,
                startAngle: that._context.endAngle, endAngle: that._context.startAngle, fill: that._context.backgroundColor
            });
        }
    },

    _updateBars: function(values) {
        var that = this,
            i,
            ii;
        for(i = 0, ii = that._bars.length; i < ii; ++i) {
            that._bars[i].setValue(values[i]);
        }
    },

    _animateBars: function(values) {
        var that = this,
            i,
            ii = that._bars.length;
        if(ii > 0) {
            for(i = 0; i < ii; ++i) {
                that._bars[i].beginAnimation(values[i]);
            }
            that._barsGroup.animate({ _: 0 }, that._animationSettings);
        }
    },

    _updateValues: function(values) {
        var that = this,
            list = (_isArray(values) && values) || (_isFinite(values) && [values]) || [],
            i,
            ii = list.length,
            value,
            barValues = [];
        that._values.length = ii;
        for(i = 0; i < ii; ++i) {
            value = list[i];
            that._values[i] = value = _Number(_isFinite(value) ? value : that._values[i]);
            if(_isFinite(value)) {
                barValues.push(value);
            }
        }
        that._animationSettings && that._barsGroup.stopAnimation();
        that._beginValueChanging();
        if(that._bars) {
            that._arrangeBars(barValues.length);
            if(that._animationSettings && !that._noAnimation) {
                that._animateBars(barValues);
            } else {
                that._updateBars(barValues);
            }
        }
        if(!that._resizing) {
            if(!_compareArrays(that._values, that.option(OPTION_VALUES))) {
                that.option(OPTION_VALUES, that._values);
            }
        }
        that._endValueChanging();
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
        backgroundColor: "MOSTLY_TOTAL",
        relativeInnerRadius: "MOSTLY_TOTAL",
        barSpacing: "MOSTLY_TOTAL",
        label: "MOSTLY_TOTAL",
        palette: "MOSTLY_TOTAL",
        paletteExtensionMode: "MOSTLY_TOTAL",
        values: "VALUES"
    },

    _customChangesOrder: ["VALUES"],

    _change_VALUES: function() {
        this._updateValues(this.option(OPTION_VALUES));
    },

    _factory: objectUtils.clone(dxBaseGauge.prototype._factory)
});

var BarWrapper = function(index, context) {
    var that = this;
    that._context = context;
    that._background = context.renderer.arc().attr({ "stroke-linejoin": "round", fill: context.backgroundColor }).append(context.group);
    that._bar = context.renderer.arc().attr({ "stroke-linejoin": "round" }).append(context.group);
    if(context.textEnabled) {
        that._line = context.renderer.path([], "line").attr({ "stroke-width": context.lineWidth }).append(context.group);
        that._text = context.renderer.text().css(context.fontStyles).attr(context.textOptions).append(context.group);
    }
    that._tracker = context.renderer.arc().attr({ "stroke-linejoin": "round" });
    context.tracker.attach(that._tracker, that, { index: index });
    that._index = index;
    that._angle = context.baseAngle;
    that._settings = { x: context.x, y: context.y, startAngle: context.baseAngle, endAngle: context.baseAngle };
};

_extend(BarWrapper.prototype, {
    dispose: function() {
        var that = this;
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
        var that = this,
            context = that._context;

        that._settings.outerRadius = options.radius;
        that._settings.innerRadius = options.radius - context.barSize;
        that._background.attr(_extend({}, that._settings, { startAngle: context.endAngle, endAngle: context.startAngle }));
        that._bar.attr(that._settings);
        that._tracker.attr(that._settings);
        that._color = options.color;
        that._bar.attr({ fill: options.color });
        if(context.textEnabled) {
            that._line.attr({ points: [context.x, context.y - that._settings.innerRadius, context.x, context.y - context.textRadius - context.textIndent], stroke: context.lineColor || options.color }).sharp();
            that._text.css({ fill: context.textColor || options.color });
        }
        return that;
    },

    getTooltipParameters: function() {
        var that = this,
            cosSin = _getCosAndSin((that._angle + that._context.baseAngle) / 2);
        return {
            x: _round(that._context.x + (that._settings.outerRadius + that._settings.innerRadius) / 2 * cosSin.cos),
            y: _round(that._context.y - (that._settings.outerRadius + that._settings.innerRadius) / 2 * cosSin.sin),
            offset: 0,
            color: that._color,
            value: that._value
        };
    },

    setAngle: function(angle) {
        var that = this,
            context = that._context,
            settings = that._settings,
            cosSin;

        that._angle = angle;
        setAngles(settings, context.baseAngle, angle);
        that._bar.attr(settings);
        that._tracker.attr(settings);
        if(context.textEnabled) {
            cosSin = _getCosAndSin(angle);
            var indent = context.textIndent,
                radius = context.textRadius + indent,
                x = context.x + radius * cosSin.cos,
                y = context.y - radius * cosSin.sin,
                halfWidth = context.textWidth * 0.5,
                textHeight = context.textHeight,
                textY = context.textY;

            if(_abs(x - context.x) > indent) {
                x += (x < context.x) ? -halfWidth : halfWidth;
            }
            if(_abs(y - context.y) <= indent) {
                y -= textY + textHeight * 0.5;
            } else {
                y -= (y < context.y) ? textY + textHeight : textY;
            }

            var text = _formatValue(that._value, context.formatOptions, { index: that._index });
            that._text.attr({
                text: text,
                x: x,
                y: y
            });

            that._line.attr({ visibility: text === "" ? "hidden" : null });
            that._line.rotate(_convertAngleToRendererSpace(angle), context.x, context.y);
        }
        return that;
    },

    _processValue: function(value) {
        this._value = this._context.translator.adjust(value);
        return this._context.translator.translate(this._value);
    },

    setValue: function(value) {
        return this.setAngle(this._processValue(value));
    },

    beginAnimation: function(value) {
        var that = this,
            angle = this._processValue(value);
        if(!compareFloats(that._angle, angle)) {
            that._start = that._angle;
            that._delta = angle - that._angle;
            that._tracker.attr({ visibility: "hidden" });
            if(that._context.textEnabled) {
                that._line.attr({ visibility: "hidden" });
                that._text.attr({ visibility: "hidden" });
            }
        } else {
            that.animate = _noop;
            that.setAngle(that._angle);
        }
    },

    animate: function(pos) {
        var that = this;
        that._angle = that._start + that._delta * pos;
        setAngles(that._settings, that._context.baseAngle, that._angle);
        that._bar.attr(that._settings);
    },

    endAnimation: function() {
        var that = this;
        if(that._delta !== undefined) {
            if(compareFloats(that._angle, that._start + that._delta)) {
                that._tracker.attr({ visibility: null });
                if(that._context.textEnabled) {
                    that._line.attr({ visibility: null });
                    that._text.attr({ visibility: null });
                }
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

dxBarGauge.prototype._factory.ThemeManager = BaseThemeManager.inherit({
    _themeSection: "barGauge",
    _fontFields: ["label.font", "title.font", "tooltip.font", "loadingIndicator.font", "export.font"]
});

registerComponent("dxBarGauge", dxBarGauge);

exports.dxBarGauge = dxBarGauge;

///#DEBUG
var __BarWrapper = BarWrapper;

exports.BarWrapper = __BarWrapper;
exports.stubBarWrapper = function(barWrapperType) {
    BarWrapper = barWrapperType;
};
exports.restoreBarWrapper = function() {
    BarWrapper = __BarWrapper;
};
///#ENDDEBUG
