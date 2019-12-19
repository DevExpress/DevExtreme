var extend = require('../../../core/utils/extend').extend,
    isNumeric = require('../../../core/utils/type').isNumeric,
    candlestickPoint = require('./candlestick_point'),
    _extend = extend,
    _isNumeric = isNumeric;

module.exports = _extend({}, candlestickPoint, {
    _getPoints: function() {
        var that = this,
            createPoint = that._options.rotated ? function(x, y) { return [y, x]; } : function(x, y) { return [x, y]; },
            openYExist = _isNumeric(that.openY),
            closeYExist = _isNumeric(that.closeY),
            x = that.x,
            width = that.width,
            points;

        points = [].concat(createPoint(x, that.highY));
        openYExist && (points = points.concat(createPoint(x, that.openY)));
        openYExist && (points = points.concat(createPoint(x - width / 2, that.openY)));
        openYExist && (points = points.concat(createPoint(x, that.openY)));
        closeYExist && (points = points.concat(createPoint(x, that.closeY)));
        closeYExist && (points = points.concat(createPoint(x + width / 2, that.closeY)));
        closeYExist && (points = points.concat(createPoint(x, that.closeY)));
        points = points.concat(createPoint(x, that.lowY));
        return points;
    },

    _drawMarkerInGroup: function(group, attributes, renderer) {
        this.graphic = renderer.path(this._getPoints(), 'line').attr({ 'stroke-linecap': 'square' }).attr(attributes).data({ 'chart-data-point': this }).sharp().append(group);
    },

    _getMinTrackerWidth: function() {
        var width = 2 + this._styles.normal['stroke-width'];
        return width + width % 2;
    }
});
