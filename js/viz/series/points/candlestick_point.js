const _extend = require('../../../core/utils/extend').extend;
const symbolPoint = require('./symbol_point');
const barPoint = require('./bar_point');

const _math = Math;
const _abs = _math.abs;
const _min = _math.min;
const _max = _math.max;
const _round = _math.round;

const DEFAULT_FINANCIAL_TRACKER_MARGIN = 2;

module.exports = _extend({}, barPoint, {
    _getContinuousPoints: function(openCoord, closeCoord) {
        const that = this;
        const x = that.x;
        const createPoint = that._options.rotated ? function(x, y) { return [y, x]; } : function(x, y) { return [x, y]; };
        const width = that.width;
        const highCoord = that.highY;
        const max = _abs(highCoord - openCoord) < _abs(highCoord - closeCoord) ? openCoord : closeCoord;
        const min = max === closeCoord ? openCoord : closeCoord;
        let points;

        if(min === max) {
            points = [].concat(createPoint(x, that.highY)).
                concat(createPoint(x, that.lowY)).
                concat(createPoint(x, that.closeY)).
                concat(createPoint(x - width / 2, that.closeY)).
                concat(createPoint(x + width / 2, that.closeY)).
                concat(createPoint(x, that.closeY));
        } else {
            points = [].concat(createPoint(x, that.highY)).
                concat(createPoint(x, max)).
                concat(createPoint(x + width / 2, max)).
                concat(createPoint(x + width / 2, min)).
                concat(createPoint(x, min)).
                concat(createPoint(x, that.lowY)).
                concat(createPoint(x, min)).
                concat(createPoint(x - width / 2, min)).
                concat(createPoint(x - width / 2, max)).
                concat(createPoint(x, max));
        }

        return points;
    },

    _getCrockPoints: function(y) {
        const that = this;
        const x = that.x;
        const createPoint = that._options.rotated ? function(x, y) { return [y, x]; } : function(x, y) { return [x, y]; };

        return [].concat(createPoint(x, that.highY)).
            concat(createPoint(x, that.lowY)).
            concat(createPoint(x, y)).
            concat(createPoint(x - that.width / 2, y)).
            concat(createPoint(x + that.width / 2, y)).
            concat(createPoint(x, y));
    },

    _getPoints: function() {
        const that = this;
        let points;
        const closeCoord = that.closeY;
        const openCoord = that.openY;

        if(closeCoord !== null && openCoord !== null) {
            points = that._getContinuousPoints(openCoord, closeCoord);
        } else {
            if(openCoord === closeCoord) {
                points = [that.x, that.highY, that.x, that.lowY];
            } else {
                points = that._getCrockPoints(openCoord !== null ? openCoord : closeCoord);
            }
        }

        return points;
    },

    getColor: function() {
        const that = this;
        return that._isReduction ? that._options.reduction.color : that._styles.normal.stroke || that.series.getColor();
    },

    _drawMarkerInGroup: function(group, attributes, renderer) {
        const that = this;
        that.graphic = renderer.path(that._getPoints(), 'area').attr({ 'stroke-linecap': 'square' }).attr(attributes).data({ 'chart-data-point': that }).sharp().append(group);
    },

    _fillStyle: function() {
        const that = this;
        const styles = that._options.styles;
        if(that._isReduction && that._isPositive) {
            that._styles = styles.reductionPositive;
        } else if(that._isReduction) {
            that._styles = styles.reduction;
        } else if(that._isPositive) {
            that._styles = styles.positive;
        } else {
            that._styles = styles;
        }
    },

    _getMinTrackerWidth: function() {
        return 2 + 2 * this._styles.normal['stroke-width'];
    },

    correctCoordinates: function(correctOptions) {
        const minWidth = this._getMinTrackerWidth();
        const maxWidth = 10;
        let width = correctOptions.width;
        width = width < minWidth ? minWidth : (width > maxWidth ? maxWidth : width);

        this.width = width + width % 2;
        this.xCorrection = correctOptions.offset;
    },

    _getMarkerGroup: function(group) {
        const that = this;
        let markerGroup;

        if(that._isReduction && that._isPositive) {
            markerGroup = group.reductionPositiveMarkersGroup;
        } else if(that._isReduction) {
            markerGroup = group.reductionMarkersGroup;
        } else if(that._isPositive) {
            markerGroup = group.defaultPositiveMarkersGroup;
        } else {
            markerGroup = group.defaultMarkersGroup;
        }

        return markerGroup;
    },

    _drawMarker: function(renderer, group) {
        this._drawMarkerInGroup(this._getMarkerGroup(group), this._getStyle(), renderer);
    },

    _getSettingsForTracker: function() {
        const that = this;
        let highY = that.highY;
        let lowY = that.lowY;
        const rotated = that._options.rotated;
        let x;
        let y;
        let width;
        let height;

        if(highY === lowY) {
            highY = rotated ? highY + DEFAULT_FINANCIAL_TRACKER_MARGIN : highY - DEFAULT_FINANCIAL_TRACKER_MARGIN;
            lowY = rotated ? lowY - DEFAULT_FINANCIAL_TRACKER_MARGIN : lowY + DEFAULT_FINANCIAL_TRACKER_MARGIN;
        }

        if(rotated) {
            x = _min(lowY, highY);
            y = that.x - that.width / 2;
            width = _abs(lowY - highY);
            height = that.width;
        } else {
            x = that.x - that.width / 2;
            y = _min(lowY, highY);
            width = that.width;
            height = _abs(lowY - highY);
        }

        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    },

    _getGraphicBBox: function() {
        const that = this;
        const rotated = that._options.rotated;
        const x = that.x;
        const width = that.width;
        const lowY = that.lowY;
        const highY = that.highY;

        return {
            x: !rotated ? x - _round(width / 2) : lowY,
            y: !rotated ? highY : x - _round(width / 2),
            width: !rotated ? width : highY - lowY,
            height: !rotated ? lowY - highY : width
        };
    },

    getTooltipParams: function(location) {
        const that = this;
        if(that.graphic) {
            const minValue = _min(that.lowY, that.highY);
            const maxValue = _max(that.lowY, that.highY);
            const visibleArea = that._getVisibleArea();
            const rotated = that._options.rotated;
            const minVisible = rotated ? visibleArea.minX : visibleArea.minY;
            const maxVisible = rotated ? visibleArea.maxX : visibleArea.maxY;
            const min = _max(minVisible, minValue);
            const max = _min(maxVisible, maxValue);

            const centerCoord = that.getCenterCoord();

            if(location === 'edge') {
                centerCoord[rotated ? 'x' : 'y'] = rotated ? max : min;
            }

            centerCoord.offset = 0;
            return centerCoord;
        }
    },

    getCenterCoord() {
        if(this.graphic) {
            const that = this;
            let x;
            let y;
            const minValue = _min(that.lowY, that.highY);
            const maxValue = _max(that.lowY, that.highY);
            const visibleArea = that._getVisibleArea();
            const rotated = that._options.rotated;
            const minVisible = rotated ? visibleArea.minX : visibleArea.minY;
            const maxVisible = rotated ? visibleArea.maxX : visibleArea.maxY;
            const min = _max(minVisible, minValue);
            const max = _min(maxVisible, maxValue);
            const center = min + (max - min) / 2;

            if(rotated) {
                y = that.x;
                x = center;
            } else {
                x = that.x;
                y = center;
            }

            return { x: x, y: y };
        }
    },

    hasValue: function() {
        return this.highValue !== null && this.lowValue !== null;
    },

    hasCoords: function() {
        return this.x !== null && this.lowY !== null && this.highY !== null;
    },

    _translate: function() {
        const that = this;
        const rotated = that._options.rotated;
        const valTranslator = that._getValTranslator();
        let centerValue;
        const x = that._getArgTranslator().translate(that.argument);

        that.vx = that.vy = that.x = x === null ? x : x + (that.xCorrection || 0);
        that.openY = that.openValue !== null ? valTranslator.translate(that.openValue) : null;
        that.highY = valTranslator.translate(that.highValue);
        that.lowY = valTranslator.translate(that.lowValue);
        that.closeY = that.closeValue !== null ? valTranslator.translate(that.closeValue) : null;

        centerValue = _min(that.lowY, that.highY) + _abs(that.lowY - that.highY) / 2;
        that._calculateVisibility(!rotated ? that.x : centerValue, !rotated ? centerValue : that.x);
    },

    getCrosshairData: function(x, y) {
        const that = this;
        const rotated = that._options.rotated;
        const origY = rotated ? x : y;
        let yValue;
        const argument = that.argument;
        let coords;
        let coord = 'low';

        if(_abs(that.lowY - origY) < _abs(that.closeY - origY)) {
            yValue = that.lowY;
        } else {
            yValue = that.closeY;
            coord = 'close';
        }

        if(_abs(yValue - origY) >= _abs(that.openY - origY)) {
            yValue = that.openY;
            coord = 'open';
        }

        if(_abs(yValue - origY) >= _abs(that.highY - origY)) {
            yValue = that.highY;
            coord = 'high';
        }

        if(rotated) {
            coords = {
                y: that.vy,
                x: yValue,
                xValue: that[coord + 'Value'],
                yValue: argument
            };
        } else {
            coords = {
                x: that.vx,
                y: yValue,
                xValue: argument,
                yValue: that[coord + 'Value']
            };
        }

        coords.axis = that.series.axis;

        return coords;
    },

    _updateData: function(data) {
        const that = this;
        const label = that._label;
        const reductionColor = this._options.reduction.color;

        that.value = that.initialValue = data.reductionValue;
        that.originalValue = data.value;

        that.lowValue = that.originalLowValue = data.lowValue;

        that.highValue = that.originalHighValue = data.highValue;

        that.openValue = that.originalOpenValue = data.openValue;

        that.closeValue = that.originalCloseValue = data.closeValue;

        that._isPositive = data.openValue < data.closeValue;
        that._isReduction = data.isReduction;

        if(that._isReduction) {
            label.setColor(reductionColor);
        }
    },

    _updateMarker: function(animationEnabled, style, group) {
        const that = this;
        const graphic = that.graphic;

        graphic.attr({ points: that._getPoints() }).smartAttr(style).sharp();
        group && graphic.append(that._getMarkerGroup(group));
    },


    _getLabelFormatObject: function() {
        const that = this;
        return {
            openValue: that.openValue,
            highValue: that.highValue,
            lowValue: that.lowValue,
            closeValue: that.closeValue,
            reductionValue: that.initialValue,
            argument: that.initialArgument,
            value: that.initialValue,
            seriesName: that.series.name,
            originalOpenValue: that.originalOpenValue,
            originalCloseValue: that.originalCloseValue,
            originalLowValue: that.originalLowValue,
            originalHighValue: that.originalHighValue,
            originalArgument: that.originalArgument,
            point: that
        };
    },

    _getFormatObject: function(tooltip) {
        const that = this;
        const highValue = tooltip.formatValue(that.highValue);
        const openValue = tooltip.formatValue(that.openValue);
        const closeValue = tooltip.formatValue(that.closeValue);
        const lowValue = tooltip.formatValue(that.lowValue);
        const symbolMethods = symbolPoint;
        const formatObject = symbolMethods._getFormatObject.call(that, tooltip);

        return _extend({}, formatObject, {
            valueText: 'h: ' + highValue + (openValue !== '' ? ' o: ' + openValue : '') + (closeValue !== '' ? ' c: ' + closeValue : '') + ' l: ' + lowValue,
            highValueText: highValue,
            openValueText: openValue,
            closeValueText: closeValue,
            lowValueText: lowValue
        });
    },

    getMaxValue: function() {
        return this.highValue;
    },

    getMinValue: function() {
        return this.lowValue;
    }
});
