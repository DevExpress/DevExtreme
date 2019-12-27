const noop = require('../../core/utils/common').noop;
const each = require('../../core/utils/iterator').each;
const _isFinite = isFinite;
const _Number = Number;
const _round = Math.round;
const baseGaugeModule = require('./base_gauge');
const _formatValue = baseGaugeModule.formatValue;
const _getSampleText = baseGaugeModule.getSampleText;
const _patchFontOptions = require('../core/utils').patchFontOptions;
const extend = require('../../core/utils/extend').extend;
const Class = require('../../core/class');

const BaseElement = Class.inherit({
    ctor: function(parameters) {
        const that = this;
        each(parameters, function(name, value) {
            that['_' + name] = value;
        });
        that._init();
    },

    dispose: function() {
        const that = this;
        that._dispose();
        each(that, function(name) {
            that[name] = null;
        });
        return that;
    },

    getOffset: function() {
        return _Number(this._options.offset) || 0;
    }
});

const BaseIndicator = BaseElement.inherit({
    _init: function() {
        const that = this;
        that._rootElement = that._createRoot().linkOn(that._owner, { name: 'value-indicator', after: 'core' });
        that._trackerElement = that._createTracker();
    },

    _dispose: function() {
        this._rootElement.linkOff();
    },

    _setupAnimation: function() {
        const that = this;
        if(that._options.animation) {
            that._animation = {
                step: function(pos) {
                    that._actualValue = that._animation.start + that._animation.delta * pos;
                    that._actualPosition = that._translator.translate(that._actualValue);
                    that._move();
                },
                duration: that._options.animation.duration > 0 ? _Number(that._options.animation.duration) : 0,
                easing: that._options.animation.easing
            };
        }
    },

    _runAnimation: function(value) {
        const that = this;
        const animation = that._animation;
        animation.start = that._actualValue;
        animation.delta = value - that._actualValue;
        that._rootElement.animate({ _: 0 }, { step: animation.step, duration: animation.duration, easing: animation.easing });
    },

    _createRoot: function() {
        return this._renderer.g().attr({ 'class': this._className });
    },

    _createTracker: function() {
        return this._renderer.path([], 'area');
    },

    _getTrackerSettings: noop,

    clean: function() {
        const that = this;
        that._animation && that._rootElement.stopAnimation();
        that._rootElement.linkRemove().clear();
        that._clear();
        that._tracker.detach(that._trackerElement);
        that._options = that.enabled = that._animation = null;
        return that;
    },

    render: function(options) {
        const that = this;
        that.type = options.type;
        that._options = options;
        that._actualValue = that._currentValue = that._translator.adjust(that._options.currentValue);
        that.enabled = that._isEnabled();
        if(that.enabled) {
            that._setupAnimation();
            that._rootElement.attr({ fill: that._options.color }).linkAppend();
            that._tracker.attach(that._trackerElement, that, that._trackerInfo);
        }
        return that;
    },

    resize: function(layout) {
        const that = this;
        that._rootElement.clear();
        that._clear();
        that.visible = that._isVisible(layout);
        if(that.visible) {
            extend(that._options, layout);
            that._actualPosition = that._translator.translate(that._actualValue);
            that._render();
            that._trackerElement.attr(that._getTrackerSettings());
            that._move();
        }
        return that;
    },

    value: function(arg, _noAnimation) {
        const that = this;
        let val;
        const rootElement = this._rootElement;
        let visibility = null;

        if(arg === undefined) {
            return that._currentValue;
        }

        if(arg === null) {
            visibility = 'hidden';
            that._currentValue = arg;
        } else {
            val = that._translator.adjust(arg);
            if(that._currentValue !== val && _isFinite(val)) {
                that._currentValue = val;
                if(that.visible) {
                    if(that._animation && !_noAnimation) {
                        that._runAnimation(val);
                    } else {
                        that._actualValue = val;
                        that._actualPosition = that._translator.translate(val);
                        that._move();
                    }
                }
            }
        }

        rootElement.attr({ visibility: visibility });
        return that;
    },

    _isEnabled: null,

    _isVisible: null,

    _render: null,

    _clear: null,

    _move: null
});

// The following is from baseMarker.js

const COEFFICIENTS_MAP = {};
COEFFICIENTS_MAP['right-bottom'] = COEFFICIENTS_MAP['rb'] = [0, -1, -1, 0, 0, 1, 1, 0];
COEFFICIENTS_MAP['bottom-right'] = COEFFICIENTS_MAP['br'] = [-1, 0, 0, -1, 1, 0, 0, 1];
COEFFICIENTS_MAP['left-bottom'] = COEFFICIENTS_MAP['lb'] = [0, -1, 1, 0, 0, 1, -1, 0];
COEFFICIENTS_MAP['bottom-left'] = COEFFICIENTS_MAP['bl'] = [1, 0, 0, -1, -1, 0, 0, 1];
COEFFICIENTS_MAP['left-top'] = COEFFICIENTS_MAP['lt'] = [0, 1, 1, 0, 0, -1, -1, 0];
COEFFICIENTS_MAP['top-left'] = COEFFICIENTS_MAP['tl'] = [1, 0, 0, 1, -1, 0, 0, -1];
COEFFICIENTS_MAP['right-top'] = COEFFICIENTS_MAP['rt'] = [0, 1, -1, 0, 0, -1, 1, 0];
COEFFICIENTS_MAP['top-right'] = COEFFICIENTS_MAP['tr'] = [-1, 0, 0, 1, 1, 0, 0, -1];

function getTextCloudInfo(options) {
    let x = options.x;
    let y = options.y;
    const type = COEFFICIENTS_MAP[options.type];
    const cloudWidth = options.textWidth + 2 * options.horMargin;
    const cloudHeight = options.textHeight + 2 * options.verMargin;
    let tailWidth;
    let tailHeight;
    const cx = x;
    const cy = y;

    tailWidth = tailHeight = options.tailLength;
    if(type[0] & 1) {
        tailHeight = Math.min(tailHeight, cloudHeight / 3);
    } else {
        tailWidth = Math.min(tailWidth, cloudWidth / 3);
    }

    return {
        cx: _round(cx + type[0] * tailWidth + (type[0] + type[2]) * cloudWidth / 2),
        cy: _round(cy + type[1] * tailHeight + (type[1] + type[3]) * cloudHeight / 2),
        points: [
            _round(x), _round(y),
            _round(x += type[0] * (cloudWidth + tailWidth)), _round(y += type[1] * (cloudHeight + tailHeight)),
            _round(x += type[2] * cloudWidth), _round(y += type[3] * cloudHeight),
            _round(x += type[4] * cloudWidth), _round(y += type[5] * cloudHeight),
            _round(x += type[6] * (cloudWidth - tailWidth)), _round(y += type[7] * (cloudHeight - tailHeight))
        ]
    };
}

const BaseTextCloudMarker = BaseIndicator.inherit({
    _move: function() {
        const that = this;
        let bBox;
        let info;
        const textCloudOptions = that._getTextCloudOptions();
        const text = _formatValue(that._actualValue, that._options.text);
        that._text.attr({ text: text });
        bBox = that._text.getBBox();
        info = getTextCloudInfo({
            x: textCloudOptions.x,
            y: textCloudOptions.y,
            textWidth: bBox.width || text.length * that._textUnitWidth, // T346511
            textHeight: bBox.height || that._textHeight,
            horMargin: that._options.horizontalOffset,
            verMargin: that._options.verticalOffset,
            tailLength: that._options.arrowLength,
            type: textCloudOptions.type
        });
        that._text.attr({ x: info.cx, y: info.cy + that._textVerticalOffset });
        that._cloud.attr({ points: info.points });
        that._trackerElement && that._trackerElement.attr({ points: info.points });
    },

    _measureText: function() {
        const that = this;
        let root;
        let text;
        let bBox;
        let sampleText;

        if(!that._textVerticalOffset) {
            root = that._createRoot().append(that._owner);
            sampleText = _getSampleText(that._translator, that._options.text);
            text = that._renderer.text(sampleText, 0, 0).attr({ align: 'center' }).css(_patchFontOptions(that._options.text.font)).append(root);
            bBox = text.getBBox();
            root.remove();
            that._textVerticalOffset = -bBox.y - bBox.height / 2;
            that._textWidth = bBox.width;
            that._textHeight = bBox.height;
            that._textUnitWidth = that._textWidth / sampleText.length;
            that._textFullWidth = that._textWidth + 2 * that._options.horizontalOffset;
            that._textFullHeight = that._textHeight + 2 * that._options.verticalOffset;
        }
    },

    _render: function() {
        const that = this;

        that._measureText();
        that._cloud = that._cloud || that._renderer.path([], 'area').append(that._rootElement);
        that._text = that._text || that._renderer.text().append(that._rootElement);
        that._text.attr({ align: 'center' }).css(_patchFontOptions(that._options.text.font));
    },

    _clear: function() {
        delete this._cloud;
        delete this._text;
    },

    getTooltipParameters: function() {
        const position = this._getTextCloudOptions();
        return { x: position.x, y: position.y, value: this._currentValue, color: this._options.color };
    }
});

// The following is from baseRangeBar.js

const BaseRangeBar = BaseIndicator.inherit({
    _measureText: function() {
        const that = this;
        let root;
        let text;
        let bBox;

        that._hasText = that._isTextVisible();
        if(that._hasText && !that._textVerticalOffset) {
            root = that._createRoot().append(that._owner);
            text = that._renderer.text(_getSampleText(that._translator, that._options.text), 0, 0).attr({ 'class': 'dxg-text', align: 'center' }).css(_patchFontOptions(that._options.text.font)).append(root);
            bBox = text.getBBox();
            root.remove();
            that._textVerticalOffset = -bBox.y - bBox.height / 2;
            that._textWidth = bBox.width;
            that._textHeight = bBox.height;
        }
    },

    _move: function() {
        const that = this;
        that._updateBarItemsPositions();
        if(that._hasText) {
            that._text.attr({ text: _formatValue(that._actualValue, that._options.text) });
            that._updateTextPosition();
            that._updateLinePosition();
        }
    },

    _updateBarItems: function() {
        const that = this;
        const options = that._options;
        let backgroundColor;
        let spaceColor;
        const translator = that._translator;

        that._setBarSides();
        that._startPosition = translator.translate(translator.getDomainStart());
        that._endPosition = translator.translate(translator.getDomainEnd());
        that._basePosition = translator.translate(options.baseValue);
        that._space = that._getSpace();

        backgroundColor = options.backgroundColor || 'none';
        if(backgroundColor !== 'none' && that._space > 0) {
            spaceColor = options.containerBackgroundColor || 'none';
        } else {
            that._space = 0;
            spaceColor = 'none';
        }

        that._backItem1.attr({ fill: backgroundColor });
        that._backItem2.attr({ fill: backgroundColor });
        that._spaceItem1.attr({ fill: spaceColor });
        that._spaceItem2.attr({ fill: spaceColor });
    },

    _getSpace: function() {
        return 0;
    },

    _updateTextItems: function() {
        const that = this;
        if(that._hasText) {
            that._line = that._line || that._renderer.path([], 'line').attr({ 'class': 'dxg-main-bar', 'stroke-linecap': 'square' }).append(that._rootElement);
            that._text = that._text || that._renderer.text('', 0, 0).attr({ 'class': 'dxg-text' }).append(that._rootElement);
            that._text.attr({ align: that._getTextAlign() }).css(that._getFontOptions());
            that._setTextItemsSides();
        } else {
            if(that._line) {
                that._line.remove();
                delete that._line;
            }
            if(that._text) {
                that._text.remove();
                delete that._text;
            }
        }
    },

    _isTextVisible: function() {
        return false;
    },

    _getTextAlign: function() {
        return 'center';
    },

    _getFontOptions: function() {
        const options = this._options;
        let font = options.text.font;
        if(!font || !font.color) {
            font = extend({}, font, { color: options.color });
        }
        return _patchFontOptions(font);
    },

    _updateBarItemsPositions: function() {
        const that = this;
        const positions = that._getPositions();

        that._backItem1.attr(that._buildItemSettings(positions.start, positions.back1));
        that._backItem2.attr(that._buildItemSettings(positions.back2, positions.end));
        that._spaceItem1.attr(that._buildItemSettings(positions.back1, positions.main1));
        that._spaceItem2.attr(that._buildItemSettings(positions.main2, positions.back2));
        that._mainItem.attr(that._buildItemSettings(positions.main1, positions.main2));
        that._trackerElement && that._trackerElement.attr(that._buildItemSettings(positions.main1, positions.main2));
    },

    _render: function() {
        const that = this;

        that._measureText();
        if(!that._backItem1) {
            that._backItem1 = that._createBarItem();
            that._backItem1.attr({ 'class': 'dxg-back-bar' });
        }
        if(!that._backItem2) {
            that._backItem2 = that._createBarItem();
            that._backItem2.attr({ 'class': 'dxg-back-bar' });
        }
        if(!that._spaceItem1) {
            that._spaceItem1 = that._createBarItem();
            that._spaceItem1.attr({ 'class': 'dxg-space-bar' });
        }
        if(!that._spaceItem2) {
            that._spaceItem2 = that._createBarItem();
            that._spaceItem2.attr({ 'class': 'dxg-space-bar' });
        }
        if(!that._mainItem) {
            that._mainItem = that._createBarItem();
            that._mainItem.attr({ 'class': 'dxg-main-bar' });
        }
        that._updateBarItems();
        that._updateTextItems();
    },

    _clear: function() {
        const that = this;

        delete that._backItem1;
        delete that._backItem2;
        delete that._spaceItem1;
        delete that._spaceItem2;
        delete that._mainItem;
        delete that._hasText;
        delete that._line;
        delete that._text;
    },

    getTooltipParameters: function() {
        const position = this._getTooltipPosition();
        return { x: position.x, y: position.y, value: this._currentValue, color: this._options.color, offset: 0 };
    }
});

exports.BaseElement = BaseElement;
exports.BaseIndicator = BaseIndicator;
exports.BaseTextCloudMarker = BaseTextCloudMarker;
exports.BaseRangeBar = BaseRangeBar;

///#DEBUG
exports.getTextCloudInfo = getTextCloudInfo;
///#ENDDEBUG
