var baseIndicatorsModule = require('./base_indicators'),
    BaseIndicator = baseIndicatorsModule.BaseIndicator,
    BaseTextCloudMarker = baseIndicatorsModule.BaseTextCloudMarker,
    BaseRangeBar = baseIndicatorsModule.BaseRangeBar,

    _Number = Number,
    _normalizeEnum = require('../core/utils').normalizeEnum;

var SimpleIndicator = BaseIndicator.inherit({
    _move: function() {
        var that = this,
            delta = that._actualPosition - that._zeroPosition;
        that._rootElement.move(that.vertical ? 0 : delta, that.vertical ? delta : 0);
        that._trackerElement && that._trackerElement.move(that.vertical ? 0 : delta, that.vertical ? delta : 0);
    },

    _isEnabled: function() {
        this.vertical = this._options.vertical;
        return this._options.length > 0 && this._options.width > 0;
    },

    _isVisible: function() {
        return true;
    },

    _getTrackerSettings: function() {
        var options = this._options,
            x1,
            x2,
            y1,
            y2,
            width = options.width / 2,
            length = options.length / 2,
            p = this._zeroPosition;

        width > 10 || (width = 10);
        length > 10 || (length = 10);
        if(this.vertical) {
            x1 = options.x - length;
            x2 = options.x + length;
            y1 = p + width;
            y2 = p - width;
        } else {
            x1 = p - width;
            x2 = p + width;
            y1 = options.y + length;
            y2 = options.y - length;
        }
        return { points: [x1, y1, x1, y2, x2, y2, x2, y1] };
    },

    _render: function() {
        var that = this;
        that._zeroPosition = that._translator.getCodomainStart();
    },

    _clear: function() {
        delete this._element;
    },

    measure: function(layout) {
        var p = this.vertical ? layout.x : layout.y;
        return {
            min: p - this._options.length / 2,
            max: p + this._options.length / 2
        };
    },

    getTooltipParameters: function() {
        var that = this,
            options = that._options,
            p = that._actualPosition,
            parameters = { x: p, y: p, value: that._currentValue, color: options.color, offset: options.width / 2 };
        that.vertical ? (parameters.x = options.x) : (parameters.y = options.y);
        return parameters;
    }
});

var rectangle = SimpleIndicator.inherit({
    _render: function() {
        var that = this,
            options = that._options,
            p,
            x1,
            x2,
            y1,
            y2;

        that.callBase();
        p = that._zeroPosition;
        if(that.vertical) {
            x1 = options.x - options.length / 2;
            x2 = options.x + options.length / 2;
            y1 = p + options.width / 2;
            y2 = p - options.width / 2;
        } else {
            x1 = p - options.width / 2;
            x2 = p + options.width / 2;
            y1 = options.y + options.length / 2;
            y2 = options.y - options.length / 2;
        }
        that._element = that._element || that._renderer.path([], 'area').append(that._rootElement);
        that._element.attr({ points: [x1, y1, x1, y2, x2, y2, x2, y1] });
    }
});

var rhombus = SimpleIndicator.inherit({
    _render: function() {
        var that = this,
            options = that._options,
            x,
            y,
            dx,
            dy;

        that.callBase();
        if(that.vertical) {
            x = options.x;
            y = that._zeroPosition;
            dx = options.length / 2 || 0;
            dy = options.width / 2 || 0;
        } else {
            x = that._zeroPosition;
            y = options.y;
            dx = options.width / 2 || 0;
            dy = options.length / 2 || 0;
        }
        that._element = that._element || that._renderer.path([], 'area').append(that._rootElement);
        that._element.attr({ points: [x - dx, y, x, y - dy, x + dx, y, x, y + dy] });
    }
});

var circle = SimpleIndicator.inherit({
    _render: function() {
        var that = this,
            options = that._options,
            x,
            y,
            r;

        that.callBase();
        if(that.vertical) {
            x = options.x;
            y = that._zeroPosition;
        } else {
            x = that._zeroPosition;
            y = options.y;
        }
        r = options.length / 2 || 0;
        that._element = that._element || that._renderer.circle().append(that._rootElement);
        that._element.attr({ cx: x, cy: y, r: r });
    }
});

// The following is from linearMarker.js

var triangleMarker = SimpleIndicator.inherit({
    _isEnabled: function() {
        var that = this;
        that.vertical = that._options.vertical;
        that._inverted = that.vertical ? (_normalizeEnum(that._options.horizontalOrientation) === 'right') : (_normalizeEnum(that._options.verticalOrientation) === 'bottom');
        return that._options.length > 0 && that._options.width > 0;
    },

    _isVisible: function() {
        return true;
    },

    _render: function() {
        var that = this,
            options = that._options,
            x1,
            x2,
            y1,
            y2,
            settings = { stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square' };

        that.callBase();
        if(that.vertical) {
            x1 = options.x;
            y1 = that._zeroPosition;
            x2 = x1 + _Number(that._inverted ? options.length : -options.length);
            settings.points = [x1, y1, x2, y1 - options.width / 2, x2, y1 + options.width / 2];
        } else {
            y1 = options.y;
            x1 = that._zeroPosition;
            y2 = y1 + _Number(that._inverted ? options.length : -options.length);
            settings.points = [x1, y1, x1 - options.width / 2, y2, x1 + options.width / 2, y2];
        }

        if(options.space > 0) {
            settings['stroke-width'] = Math.min(options.space, options.width / 4) || 0;
            settings.stroke = settings['stroke-width'] > 0 ? options.containerBackgroundColor || 'none' : 'none';
        }
        that._element = that._element || that._renderer.path([], 'area').append(that._rootElement);
        that._element.attr(settings).sharp();
    },

    _getTrackerSettings: function() {
        var that = this,
            options = that._options,
            width = options.width / 2,
            length = _Number(options.length),
            x1,
            x2,
            y1,
            y2,
            result;

        width > 10 || (width = 10);
        length > 20 || (length = 20);
        if(that.vertical) {
            x1 = x2 = options.x;
            x2 = x1 + (that._inverted ? length : -length);
            y1 = that._zeroPosition + width;
            y2 = that._zeroPosition - width;
            result = [x1, y1, x2, y1, x2, y2, x1, y2];
        } else {
            y1 = options.y;
            y2 = y1 + (that._inverted ? length : -length);
            x1 = that._zeroPosition - width;
            x2 = that._zeroPosition + width;
            result = [x1, y1, x1, y2, x2, y2, x2, y1];
        }
        return { points: result };
    },

    measure: function(layout) {
        var that = this,
            length = _Number(that._options.length),
            minBound,
            maxBound;

        if(that.vertical) {
            minBound = maxBound = layout.x;
            if(that._inverted) {
                maxBound = minBound + length;
            } else {
                minBound = maxBound - length;
            }
        } else {
            minBound = maxBound = layout.y;
            if(that._inverted) {
                maxBound = minBound + length;
            } else {
                minBound = maxBound - length;
            }
        }
        return { min: minBound, max: maxBound, indent: that._options.width / 2 };
    },

    getTooltipParameters: function() {
        var that = this,
            options = that._options,
            s = (that._inverted ? options.length : -options.length) / 2,
            parameters = that.callBase();
        that.vertical ? (parameters.x += s) : (parameters.y += s);
        parameters.offset = options.length / 2;
        return parameters;
    }
});

var textCloud = BaseTextCloudMarker.inherit({
    _isEnabled: function() {
        var that = this;
        that.vertical = that._options.vertical;
        that._inverted = that.vertical ? (_normalizeEnum(that._options.horizontalOrientation) === 'right') : (_normalizeEnum(that._options.verticalOrientation) === 'bottom');
        return true;
    },

    _isVisible: function() {
        return true;
    },

    _getTextCloudOptions: function() {
        var that = this,
            x = that._actualPosition,
            y = that._actualPosition,
            type;
        if(that.vertical) {
            x = that._options.x;
            type = that._inverted ? 'top-left' : 'top-right';
        } else {
            y = that._options.y;
            type = that._inverted ? 'right-top' : 'right-bottom';
        }
        return { x: x, y: y, type: type };
    },

    measure: function(layout) {
        var that = this,
            minBound,
            maxBound,
            arrowLength = _Number(that._options.arrowLength) || 0,
            indent;

        that._measureText();
        if(that.vertical) {
            indent = that._textFullHeight;
            if(that._inverted) {
                minBound = layout.x;
                maxBound = layout.x + arrowLength + that._textFullWidth;
            } else {
                minBound = layout.x - arrowLength - that._textFullWidth;
                maxBound = layout.x;
            }
        } else {
            indent = that._textFullWidth;
            if(that._inverted) {
                minBound = layout.y;
                maxBound = layout.y + arrowLength + that._textFullHeight;
            } else {
                minBound = layout.y - arrowLength - that._textFullHeight;
                maxBound = layout.y;
            }
        }
        return { min: minBound, max: maxBound, indent: indent };
    }
});

// The following is from linearRangeBar.js

var rangeBar = BaseRangeBar.inherit({
    _isEnabled: function() {
        var that = this;
        that.vertical = that._options.vertical;
        that._inverted = that.vertical ? (_normalizeEnum(that._options.horizontalOrientation) === 'right') : (_normalizeEnum(that._options.verticalOrientation) === 'bottom');
        return that._options.size > 0;
    },

    _isVisible: function() {
        return true;
    },

    _createBarItem: function() {
        return this._renderer.path([], 'area').append(this._rootElement);
    },

    _createTracker: function() {
        return this._renderer.path([], 'area');
    },

    _setBarSides: function() {
        var that = this,
            options = that._options,
            size = _Number(options.size),
            minSide,
            maxSide;
        if(that.vertical) {
            if(that._inverted) {
                minSide = options.x;
                maxSide = options.x + size;
            } else {
                minSide = options.x - size;
                maxSide = options.x;
            }
        } else {
            if(that._inverted) {
                minSide = options.y;
                maxSide = options.y + size;
            } else {
                minSide = options.y - size;
                maxSide = options.y;
            }
        }
        that._minSide = minSide;
        that._maxSide = maxSide;
        that._minBound = minSide;
        that._maxBound = maxSide;
    },

    _getSpace: function() {
        var options = this._options;
        return options.space > 0 ? _Number(options.space) : 0;
    },

    _isTextVisible: function() {
        var textOptions = this._options.text || {};
        return textOptions.indent > 0 || textOptions.indent < 0;
    },

    _getTextAlign: function() {
        return this.vertical ? (this._options.text.indent > 0 ? 'left' : 'right') : 'center';
    },

    _setTextItemsSides: function() {
        var that = this,
            indent = _Number(that._options.text.indent);

        if(indent > 0) {
            that._lineStart = that._maxSide;
            that._lineEnd = that._maxSide + indent;
            that._textPosition = that._lineEnd + (that.vertical ? 2 : that._textHeight / 2);
            that._maxBound = that._textPosition + (that.vertical ? that._textWidth : that._textHeight / 2);
        } else if(indent < 0) {
            that._lineStart = that._minSide;
            that._lineEnd = that._minSide + indent;
            that._textPosition = that._lineEnd - (that.vertical ? 2 : that._textHeight / 2);
            that._minBound = that._textPosition - (that.vertical ? that._textWidth : that._textHeight / 2);
        }
    },

    _getPositions: function() {
        var that = this,
            startPosition = that._startPosition,
            endPosition = that._endPosition,
            space = that._space,
            basePosition = that._basePosition,
            actualPosition = that._actualPosition,
            mainPosition1,
            mainPosition2,
            backPosition1,
            backPosition2;

        if(startPosition < endPosition) {
            if(basePosition < actualPosition) {
                mainPosition1 = basePosition;
                mainPosition2 = actualPosition;
            } else {
                mainPosition1 = actualPosition;
                mainPosition2 = basePosition;
            }
            backPosition1 = mainPosition1 - space;
            backPosition2 = mainPosition2 + space;
        } else {
            if(basePosition > actualPosition) {
                mainPosition1 = basePosition;
                mainPosition2 = actualPosition;
            } else {
                mainPosition1 = actualPosition;
                mainPosition2 = basePosition;
            }
            backPosition1 = mainPosition1 + space;
            backPosition2 = mainPosition2 - space;
        }
        return {
            start: startPosition,
            end: endPosition,
            main1: mainPosition1,
            main2: mainPosition2,
            back1: backPosition1,
            back2: backPosition2
        };
    },

    _buildItemSettings: function(from, to) {
        var that = this,
            side1 = that._minSide,
            side2 = that._maxSide,
            points = that.vertical ? [side1, from, side1, to, side2, to, side2, from] : [from, side1, from, side2, to, side2, to, side1];
        return { points: points };
    },

    _updateTextPosition: function() {
        var that = this;
        that._text.attr(that.vertical ? {
            x: that._textPosition,
            y: that._actualPosition + that._textVerticalOffset
        } : {
            x: that._actualPosition,
            y: that._textPosition + that._textVerticalOffset
        });
    },

    _updateLinePosition: function() {
        var that = this,
            actualPosition = that._actualPosition,
            side1,
            side2,
            points;
        if(that.vertical) {
            if(that._basePosition >= actualPosition) {
                side1 = actualPosition;
                side2 = actualPosition + 2;
            } else {
                side1 = actualPosition - 2;
                side2 = actualPosition;
            }
            points = [that._lineStart, side1, that._lineStart, side2, that._lineEnd, side2, that._lineEnd, side1];
        } else {
            if(that._basePosition <= actualPosition) {
                side1 = actualPosition - 2;
                side2 = actualPosition;
            } else {
                side1 = actualPosition;
                side2 = actualPosition + 2;
            }
            points = [side1, that._lineStart, side1, that._lineEnd, side2, that._lineEnd, side2, that._lineStart];
        }
        that._line.attr({ points: points }).sharp();
    },

    _getTooltipPosition: function() {
        var that = this,
            crossCenter = (that._minSide + that._maxSide) / 2,
            alongCenter = (that._basePosition + that._actualPosition) / 2;

        return that.vertical ? { x: crossCenter, y: alongCenter } : { x: alongCenter, y: crossCenter };
    },

    measure: function(layout) {
        var that = this,
            size = _Number(that._options.size),
            textIndent = _Number(that._options.text.indent),
            minBound,
            maxBound,
            indent;

        that._measureText();
        if(that.vertical) {
            minBound = maxBound = layout.x;
            if(that._inverted) {
                maxBound = maxBound + size;
            } else {
                minBound = minBound - size;
            }
            if(that._hasText) {
                indent = that._textHeight / 2;
                if(textIndent > 0) {
                    maxBound += textIndent + that._textWidth;
                }
                if(textIndent < 0) {
                    minBound += textIndent - that._textWidth;
                }
            }
        } else {
            minBound = maxBound = layout.y;
            if(that._inverted) {
                maxBound = maxBound + size;
            } else {
                minBound = minBound - size;
            }
            if(that._hasText) {
                indent = that._textWidth / 2;
                if(textIndent > 0) {
                    maxBound += textIndent + that._textHeight;
                }
                if(textIndent < 0) {
                    minBound += textIndent - that._textHeight;
                }
            }
        }
        return { min: minBound, max: maxBound, indent: indent };
    }
});

exports._default = rangeBar;
exports['rectangle'] = rectangle;
exports['rhombus'] = rhombus;
exports['circle'] = circle;
exports['trianglemarker'] = triangleMarker;
exports['textcloud'] = textCloud;
exports['rangebar'] = rangeBar;
