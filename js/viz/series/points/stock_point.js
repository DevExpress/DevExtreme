const extend = require('../../../core/utils/extend').extend;
const isNumeric = require('../../../core/utils/type').isNumeric;
const candlestickPoint = require('./candlestick_point');
const _extend = extend;
const _isNumeric = isNumeric;

module.exports = _extend({}, candlestickPoint, {
    _getPoints: function() {
        const that = this;
        const createPoint = that._options.rotated ? function(x, y) { return [y, x]; } : function(x, y) { return [x, y]; };
        const openYExist = _isNumeric(that.openY);
        const closeYExist = _isNumeric(that.closeY);
        const x = that.x;
        const width = that.width;
        let points;

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
        const width = 2 + this._styles.normal['stroke-width'];
        return width + width % 2;
    }
});
