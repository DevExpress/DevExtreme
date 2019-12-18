var BaseRangeContainer = require('./base_range_container'),

    _Number = Number,
    _max = Math.max,
    _normalizeEnum = require('../core/utils').normalizeEnum;

var LinearRangeContainer = BaseRangeContainer.inherit({
    _processOptions: function() {
        var that = this;
        that.vertical = that._options.vertical;
        that._inner = that._outer = 0;
        if(that.vertical) {
            switch(_normalizeEnum(that._options.horizontalOrientation)) {
                case 'left':
                    that._inner = 1;
                    break;
                case 'center':
                    that._inner = that._outer = 0.5;
                    break;
                default:
                    that._outer = 1;
                    break;
            }
        } else {
            switch(_normalizeEnum(that._options.verticalOrientation)) {
                case 'top':
                    that._inner = 1;
                    break;
                case 'center':
                    that._inner = that._outer = 0.5;
                    break;
                default:
                    that._outer = 1;
                    break;
            }
        }
    },

    _isVisible: function() {
        return true;
    },

    _createRange: function(range, layout) {
        var that = this,
            inner = that._inner,
            outer = that._outer,
            startPosition = that._translator.translate(range.start),
            endPosition = that._translator.translate(range.end),
            points,
            x = layout.x,
            y = layout.y,
            startWidth = range.startWidth,
            endWidth = range.endWidth;

        if(that.vertical) {
            points = [
                x - startWidth * inner, startPosition,
                x - endWidth * inner, endPosition,
                x + endWidth * outer, endPosition,
                x + startWidth * outer, startPosition
            ];
        } else {
            points = [
                startPosition, y + startWidth * outer,
                startPosition, y - startWidth * inner,
                endPosition, y - endWidth * inner,
                endPosition, y + endWidth * outer
            ];
        }
        return that._renderer.path(points, 'area');
    },

    measure: function(layout) {
        var result = {},
            width;

        result.min = result.max = layout[this.vertical ? 'x' : 'y'];
        width = this._options.width;
        width = _Number(width) || _max(_Number(width.start), _Number(width.end));
        result.min -= this._inner * width;
        result.max += this._outer * width;
        return result;
    }
});

module.exports = LinearRangeContainer;
