const baseIndicatorsModule = require('./base_indicators');
const BaseIndicator = baseIndicatorsModule.BaseIndicator;
const BaseTextCloudMarker = baseIndicatorsModule.BaseTextCloudMarker;
const BaseRangeBar = baseIndicatorsModule.BaseRangeBar;
const vizUtils = require('../core/utils');

const _Number = Number;
const _getCosAndSin = vizUtils.getCosAndSin;
const _convertAngleToRendererSpace = vizUtils.convertAngleToRendererSpace;

const SimpleIndicator = BaseIndicator.inherit({
    _move: function() {
        const that = this;
        const options = that._options;
        const angle = _convertAngleToRendererSpace(that._actualPosition);
        that._rootElement.rotate(angle, options.x, options.y);
        that._trackerElement && that._trackerElement.rotate(angle, options.x, options.y);
    },

    _isEnabled: function() {
        return this._options.width > 0;
    },

    _isVisible: function(layout) {
        return layout.radius - _Number(this._options.indentFromCenter) > 0;
    },

    _getTrackerSettings: function() {
        const options = this._options;
        const radius = this._getRadius();
        const indentFromCenter = this._getIndentFromCenter();
        const x = options.x; const y = options.y - (radius + indentFromCenter) / 2;
        let width = options.width / 2;
        let length = (radius - indentFromCenter) / 2;
        width > 10 || (width = 10);
        length > 10 || (length = 10);
        return { points: [x - width, y - length, x - width, y + length, x + width, y + length, x + width, y - length] };
    },

    _render: function() {
        const that = this;
        that._renderPointer();
    },

    _clearPointer: function() {
        delete this._element;
    },

    _clear: function() {
        this._clearPointer();
    },

    _getIndentFromCenter: function(radius) {
        return Number(this._options.indentFromCenter) || 0;
    },

    _getRadius: function() {
        return 0;
    },

    measure: function(layout) {
        const result = { max: layout.radius };
        if(this._options.indentFromCenter < 0) {
            result.inverseHorizontalOffset = result.inverseVerticalOffset = -_Number(this._options.indentFromCenter);
        }
        return result;
    },

    getTooltipParameters: function() {
        const options = this._options;
        const cosSin = _getCosAndSin(this._actualPosition);
        const r = (this._getRadius() + this._getIndentFromCenter()) / 2;
        return { x: options.x + cosSin.cos * r, y: options.y - cosSin.sin * r, value: this._currentValue, color: options.color, offset: options.width / 2 };
    }
});

const NeedleIndicator = SimpleIndicator.inherit({
    _isVisible: function(layout) {
        const indentFromCenter = this._adjustOffset(Number(this._options.indentFromCenter), layout.radius);
        const offset = this._adjustOffset(Number(this._options.offset), layout.radius);

        return layout.radius - indentFromCenter - offset > 0;
    },

    getOffset: function() {
        return 0;
    },

    _adjustOffset: function(value, radius) {
        const minRadius = Number(this._options.beginAdaptingAtRadius);
        const diff = radius / minRadius;

        if(diff < 1) {
            value = Math.floor(value * diff);
        }

        return value || 0;
    },

    _getIndentFromCenter: function(radius) {
        return this._adjustOffset(Number(this._options.indentFromCenter), this._options.radius);
    },

    _getRadius: function() {
        const options = this._options;
        return options.radius - this._adjustOffset(Number(options.offset), options.radius);
    },

    _renderSpindle: function() {
        const that = this;
        const options = that._options;
        const radius = options.radius;
        const spindleSize = this._adjustOffset(_Number(options.spindleSize) / 2, radius) * 2;
        let gapSize = this._adjustOffset(_Number(options.spindleGapSize) / 2, radius) * 2 || 0;
        if(gapSize > 0) {
            gapSize = gapSize <= spindleSize ? gapSize : spindleSize;
        }

        if(spindleSize > 0) {
            that._spindleOuter = that._spindleOuter || that._renderer.circle().append(that._rootElement);
            that._spindleInner = that._spindleInner || that._renderer.circle().append(that._rootElement);
            that._spindleOuter.attr({ 'class': 'dxg-spindle-border', cx: options.x, cy: options.y, r: spindleSize / 2 });
            that._spindleInner.attr({ 'class': 'dxg-spindle-hole', cx: options.x, cy: options.y, r: gapSize / 2, fill: options.containerBackgroundColor });
        }
    },

    _render: function() {
        const that = this;
        that.callBase();
        that._renderSpindle();
    },

    _clear: function() {
        this.callBase();
        delete this._spindleOuter;
        delete this._spindleInner;
    }
});

const rectangleNeedle = NeedleIndicator.inherit({
    _renderPointer: function() {
        const that = this;
        const options = that._options;
        const y2 = options.y - this._getRadius();
        const y1 = options.y - this._getIndentFromCenter();
        const x1 = options.x - options.width / 2;
        const x2 = x1 + _Number(options.width);

        that._element = that._element || that._renderer.path([], 'area').append(that._rootElement);
        that._element.attr({ points: [x1, y1, x1, y2, x2, y2, x2, y1] });
    }
});

const triangleNeedle = NeedleIndicator.inherit({
    _renderPointer: function() {
        const that = this;
        const options = that._options;
        const y2 = options.y - this._getRadius();
        const y1 = options.y - this._getIndentFromCenter();
        const x1 = options.x - options.width / 2;
        const x2 = options.x + options.width / 2;

        that._element = that._element || that._renderer.path([], 'area').append(that._rootElement);
        that._element.attr({ points: [x1, y1, options.x, y2, x2, y1] });
    }
});

const twoColorNeedle = NeedleIndicator.inherit({
    _renderPointer: function() {
        const that = this;
        const options = that._options;
        const x1 = options.x - options.width / 2;
        const x2 = options.x + options.width / 2;
        const y4 = options.y - this._getRadius();
        const y1 = options.y - this._getIndentFromCenter();
        const fraction = _Number(options.secondFraction) || 0;
        let y2;
        let y3;
        //  B253863
        if(fraction >= 1) {
            y2 = y3 = y1;
        } else if(fraction <= 0) {
            y2 = y3 = y4;
        } else {
            y3 = y4 + (y1 - y4) * fraction;
            y2 = y3 + _Number(options.space);
        }
        that._firstElement = that._firstElement || that._renderer.path([], 'area').append(that._rootElement);
        that._spaceElement = that._spaceElement || that._renderer.path([], 'area').append(that._rootElement);
        that._secondElement = that._secondElement || that._renderer.path([], 'area').append(that._rootElement);
        that._firstElement.attr({ points: [x1, y1, x1, y2, x2, y2, x2, y1] });
        that._spaceElement.attr({ points: [x1, y2, x1, y3, x2, y3, x2, y2], 'class': 'dxg-hole', fill: options.containerBackgroundColor });
        that._secondElement.attr({ points: [x1, y3, x1, y4, x2, y4, x2, y3], 'class': 'dxg-part', fill: options.secondColor });
    },

    _clearPointer: function() {
        delete this._firstElement;
        delete this._secondElement;
        delete this._spaceElement;
    }
});

// The following is from circularMarker.js

const triangleMarker = SimpleIndicator.inherit({
    _isEnabled: function() {
        return this._options.length > 0 && this._options.width > 0;
    },

    _isVisible: function(layout) {
        return layout.radius > 0;
    },

    _render: function() {
        const that = this;
        const options = that._options;
        const x = options.x;
        const y1 = options.y - options.radius;
        const dx = options.width / 2 || 0;
        const y2 = y1 - _Number(options.length);
        let settings;
        that._element = that._element || that._renderer.path([], 'area').append(that._rootElement);
        settings = { points: [x, y1, x - dx, y2, x + dx, y2], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square' };
        if(options.space > 0) {
            settings['stroke-width'] = Math.min(options.space, options.width / 4) || 0;
            settings.stroke = settings['stroke-width'] > 0 ? options.containerBackgroundColor || 'none' : 'none';
        }
        that._element.attr(settings).sharp();
    },

    _clear: function() {
        delete this._element;
    },

    _getTrackerSettings: function() {
        const options = this._options;
        const x = options.x; const y = options.y - options.radius - options.length / 2;
        let width = options.width / 2;
        let length = options.length / 2;
        width > 10 || (width = 10);
        length > 10 || (length = 10);
        return { points: [x - width, y - length, x - width, y + length, x + width, y + length, x + width, y - length] };
    },

    measure: function(layout) {
        return { min: layout.radius, max: layout.radius + _Number(this._options.length) };
    },

    getTooltipParameters: function() {
        const options = this._options;
        const cosSin = _getCosAndSin(this._actualPosition);
        const r = options.radius + options.length / 2;
        const parameters = this.callBase();
        parameters.x = options.x + cosSin.cos * r;
        parameters.y = options.y - cosSin.sin * r;
        parameters.offset = options.length / 2;
        return parameters;
    }
});

const textCloud = BaseTextCloudMarker.inherit({
    _isEnabled: function() {
        return true;
    },

    _isVisible: function(layout) {
        return layout.radius > 0;
    },

    _getTextCloudOptions: function() {
        const that = this;
        const cosSin = _getCosAndSin(that._actualPosition);
        const nAngle = vizUtils.normalizeAngle(that._actualPosition);
        return {
            x: that._options.x + cosSin.cos * that._options.radius,
            y: that._options.y - cosSin.sin * that._options.radius,
            type: nAngle > 270 ? 'left-top' : (nAngle > 180 ? 'top-right' : (nAngle > 90 ? 'right-bottom' : 'bottom-left'))
        };
    },

    measure: function(layout) {
        const that = this;
        const arrowLength = _Number(that._options.arrowLength) || 0;
        let verticalOffset;
        let horizontalOffset;

        that._measureText();
        verticalOffset = that._textFullHeight + arrowLength;
        horizontalOffset = that._textFullWidth + arrowLength;

        return {
            min: layout.radius,
            max: layout.radius,
            horizontalOffset: horizontalOffset,
            verticalOffset: verticalOffset,
            inverseHorizontalOffset: horizontalOffset,
            inverseVerticalOffset: verticalOffset
        };
    }
});

// The following is from circularRangeBar.js

const rangeBar = BaseRangeBar.inherit({
    _isEnabled: function() {
        return this._options.size > 0;
    },

    _isVisible: function(layout) {
        return layout.radius - _Number(this._options.size) > 0;
    },

    _createBarItem: function() {
        return this._renderer.arc().attr({ 'stroke-linejoin': 'round' }).append(this._rootElement);
    },

    _createTracker: function() {
        return this._renderer.arc().attr({ 'stroke-linejoin': 'round' });
    },

    _setBarSides: function() {
        const that = this;
        that._maxSide = that._options.radius;
        that._minSide = that._maxSide - _Number(that._options.size);
    },

    _getSpace: function() {
        const options = this._options;
        return options.space > 0 ? options.space * 180 / options.radius / Math.PI : 0;
    },

    _isTextVisible: function() {
        const options = this._options.text || {};
        return options.indent > 0;
    },

    _setTextItemsSides: function() {
        const that = this;
        const options = that._options;
        const indent = _Number(options.text.indent);
        that._lineFrom = options.y - options.radius;
        that._lineTo = that._lineFrom - indent;
        that._textRadius = options.radius + indent;
    },

    _getPositions: function() {
        const that = this;
        const basePosition = that._basePosition;
        const actualPosition = that._actualPosition;
        let mainPosition1;
        let mainPosition2;
        if(basePosition >= actualPosition) {
            mainPosition1 = basePosition;
            mainPosition2 = actualPosition;
        } else {
            mainPosition1 = actualPosition;
            mainPosition2 = basePosition;
        }
        return {
            start: that._startPosition,
            end: that._endPosition,
            main1: mainPosition1,
            main2: mainPosition2,
            back1: Math.min(mainPosition1 + that._space, that._startPosition),
            back2: Math.max(mainPosition2 - that._space, that._endPosition)
        };
    },

    _buildItemSettings: function(from, to) {
        const that = this;
        return { x: that._options.x, y: that._options.y, innerRadius: that._minSide, outerRadius: that._maxSide, startAngle: to, endAngle: from };
    },

    _updateTextPosition: function() {
        const that = this;
        const cosSin = _getCosAndSin(that._actualPosition);
        let x = that._options.x + that._textRadius * cosSin.cos;
        let y = that._options.y - that._textRadius * cosSin.sin;
        x += cosSin.cos * that._textWidth * 0.6;
        y -= cosSin.sin * that._textHeight * 0.6;
        that._text.attr({ x: x, y: y + that._textVerticalOffset });
    },

    _updateLinePosition: function() {
        const that = this;
        const x = that._options.x;
        let x1;
        let x2;
        if(that._basePosition > that._actualPosition) {
            x1 = x - 2;
            x2 = x;
        } else if(that._basePosition < that._actualPosition) {
            x1 = x;
            x2 = x + 2;
        } else {
            x1 = x - 1;
            x2 = x + 1;
        }
        that._line.attr({ points: [x1, that._lineFrom, x1, that._lineTo, x2, that._lineTo, x2, that._lineFrom] })
            .rotate(_convertAngleToRendererSpace(that._actualPosition), x, that._options.y)
            .sharp();
    },

    _getTooltipPosition: function() {
        const that = this;
        const cosSin = _getCosAndSin((that._basePosition + that._actualPosition) / 2);
        const r = (that._minSide + that._maxSide) / 2;
        return { x: that._options.x + cosSin.cos * r, y: that._options.y - cosSin.sin * r };
    },

    measure: function(layout) {
        const that = this;
        const result = {
            min: layout.radius - _Number(that._options.size),
            max: layout.radius
        };

        that._measureText();
        if(that._hasText) {
            result.max += _Number(that._options.text.indent);
            result.horizontalOffset = that._textWidth;
            result.verticalOffset = that._textHeight;
        }
        return result;
    }
});

exports._default = rectangleNeedle;
exports['rectangleneedle'] = rectangleNeedle;
exports['triangleneedle'] = triangleNeedle;
exports['twocolorneedle'] = twoColorNeedle;
exports['trianglemarker'] = triangleMarker;
exports['textcloud'] = textCloud;
exports['rangebar'] = rangeBar;
