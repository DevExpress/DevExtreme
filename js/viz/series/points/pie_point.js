var extend = require('../../../core/utils/extend').extend,
    symbolPoint = require('./symbol_point'),

    _extend = extend,
    _round = Math.round,
    _sqrt = Math.sqrt,
    _acos = Math.acos,
    DEG = 180 / Math.PI,
    _abs = Math.abs,
    vizUtils = require('../../core/utils'),
    _normalizeAngle = vizUtils.normalizeAngle,
    _getCosAndSin = vizUtils.getCosAndSin,
    _isDefined = require('../../../core/utils/type').isDefined,
    getVerticallyShiftedAngularCoords = vizUtils.getVerticallyShiftedAngularCoords,
    RADIAL_LABEL_INDENT = require('../../components/consts').radialLabelIndent;

module.exports = _extend({}, symbolPoint, {
    _updateData: function(data, argumentChanged) {
        var that = this;
        symbolPoint._updateData.call(this, data);
        if(argumentChanged || !_isDefined(that._visible)) {
            that._visible = true;
        }

        that.minValue = that.initialMinValue = that.originalMinValue = _isDefined(data.minValue) ? data.minValue : 0;
    },

    animate: function(complete, duration, delay) {
        var that = this;
        that.graphic.animate({
            x: that.centerX,
            y: that.centerY,
            outerRadius: that.radiusOuter,
            innerRadius: that.radiusInner,
            startAngle: that.toAngle,
            endAngle: that.fromAngle
        }, {
            delay: delay,
            partitionDuration: duration,
        }, complete);
    },

    correctPosition: function(correction) {
        var that = this;
        that.correctRadius(correction);
        that.correctLabelRadius(correction.radiusOuter + RADIAL_LABEL_INDENT);
        that.centerX = correction.centerX;
        that.centerY = correction.centerY;
    },

    correctRadius: function(correction) {
        this.radiusInner = correction.radiusInner;
        this.radiusOuter = correction.radiusOuter;
    },

    correctLabelRadius: function(radiusLabels) {
        this.radiusLabels = radiusLabels;
    },

    correctValue: function(correction, percent, base) {
        var that = this;
        that.value = (base || that.normalInitialValue) + correction;
        that.minValue = correction;
        that.percent = percent;
        that._label.setDataField('percent', percent);
    },

    _updateLabelData: function() {
        this._label.setData(this._getLabelFormatObject());
    },

    _getShiftLabelCoords: function() {
        var that = this,
            bBox = that._label.getBoundingRect(),
            coord = that._getLabelCoords(that._label),
            visibleArea = that._getVisibleArea();

        if(that._isLabelDrawingWithoutPoints) {
            return that._checkLabelPosition(coord, bBox, visibleArea);
        } else {
            return that._getLabelExtraCoord(coord, that._checkVerticalLabelPosition(coord, bBox, visibleArea), bBox);
        }
    },

    _getLabelPosition: function(options) {
        return options.position;
    },

    _getLabelCoords: function(label) {
        var that = this,
            bBox = label.getBoundingRect(),
            options = label.getLayoutOptions(),
            angleFunctions = _getCosAndSin(that.middleAngle),
            position = that._getLabelPosition(options),
            radiusInner = that.radiusInner,
            radiusOuter = that.radiusOuter,
            radiusLabels = that.radiusLabels,
            columnsPosition = position === 'columns',
            rad,
            x;

        if(position === 'inside') {
            rad = radiusInner + (radiusOuter - radiusInner) / 2 + options.radialOffset;
            x = that.centerX + rad * angleFunctions.cos - bBox.width / 2;
        } else {
            rad = radiusLabels + options.radialOffset;
            if(angleFunctions.cos > 0.1 || columnsPosition && angleFunctions.cos >= 0) {
                x = that.centerX + rad * angleFunctions.cos;
            } else if(angleFunctions.cos < -0.1 || columnsPosition && angleFunctions.cos < 0) {
                x = that.centerX + rad * angleFunctions.cos - bBox.width;
            } else {
                x = that.centerX + rad * angleFunctions.cos - bBox.width / 2;
            }
        }

        return {
            x: x,
            y: _round(that.centerY - rad * angleFunctions.sin - bBox.height / 2)
        };
    },

    _correctLabelCoord: function(coord, moveLabelsFromCenter) {
        var that = this,
            label = that._label,
            bBox = label.getBoundingRect(),
            labelWidth = bBox.width,
            options = label.getLayoutOptions(),
            visibleArea = that._getVisibleArea(),
            rightBorderX = visibleArea.maxX - labelWidth,
            leftBorderX = visibleArea.minX,
            angleOfPoint = _normalizeAngle(that.middleAngle),
            centerX = that.centerX,
            connectorOffset = options.connectorOffset,
            x = coord.x;

        if(options.position === 'columns') {
            if(angleOfPoint <= 90 || angleOfPoint >= 270) {
                x = rightBorderX;
            } else {
                x = leftBorderX;
            }
            coord.x = x;
        } else if(options.position !== 'inside' && moveLabelsFromCenter) {
            if(angleOfPoint <= 90 || angleOfPoint >= 270) {
                if((x - connectorOffset) < centerX) {
                    x = centerX + connectorOffset;
                }
            } else {
                if(x + labelWidth + connectorOffset > centerX) {
                    x = centerX - labelWidth - connectorOffset;
                }
            }
            coord.x = x;
        }
        return coord;
    },

    drawLabel: function() {
        this.translate();

        // this function is called for drawing labels without points for checking size of labels
        this._isLabelDrawingWithoutPoints = true;
        this._drawLabel();
        this._isLabelDrawingWithoutPoints = false;
    },

    updateLabelCoord: function(moveLabelsFromCenter) {
        var that = this,
            bBox = that._label.getBoundingRect(),
            coord = that._correctLabelCoord(bBox, moveLabelsFromCenter);

        coord = that._checkHorizontalLabelPosition(coord, bBox, that._getVisibleArea());
        that._label.shift(_round(coord.x), _round(bBox.y));
    },

    _checkVerticalLabelPosition: function(coord, box, visibleArea) {
        var x = coord.x,
            y = coord.y;

        if(coord.y + box.height > visibleArea.maxY) {
            y = visibleArea.maxY - box.height;
        } else if(coord.y < visibleArea.minY) {
            y = visibleArea.minY;
        }
        return { x: x, y: y };
    },

    _getLabelExtraCoord: function(coord, shiftCoord, box) {
        return coord.y !== shiftCoord.y ? getVerticallyShiftedAngularCoords({ x: coord.x, y: coord.y, width: box.width, height: box.height }, shiftCoord.y - coord.y, { x: this.centerX, y: this.centerY }) : coord;
    },

    _checkHorizontalLabelPosition: function(coord, box, visibleArea) {
        var x = coord.x,
            y = coord.y;
        if(coord.x + box.width > visibleArea.maxX) {
            x = visibleArea.maxX - box.width;
        } else if(coord.x < visibleArea.minX) {
            x = visibleArea.minX;
        }
        return { x: x, y: y };
    },

    applyWordWrap: function(moveLabelsFromCenter) {
        var that = this,
            label = that._label,
            box = label.getBoundingRect(),
            visibleArea = that._getVisibleArea(),
            position = label.getLayoutOptions().position,
            width = box.width,
            rowCountChanged = false;

        if(position === 'columns' && that.series.index > 0) {
            width = visibleArea.maxX - that.centerX - that.radiusLabels;
        } else if(position === 'inside') {
            if(width > (visibleArea.maxX - visibleArea.minX)) {
                width = visibleArea.maxX - visibleArea.minX;
            }
        } else {
            if(moveLabelsFromCenter && box.x < that.centerX && box.width + box.x > that.centerX) {
                width = Math.floor((visibleArea.maxX - visibleArea.minX) / 2);
            } else if(box.x + width > visibleArea.maxX) {
                width = visibleArea.maxX - box.x;
            } else if(box.x < visibleArea.minX) {
                width = box.x + width - visibleArea.minX;
            }
        }
        if(width < box.width) {
            rowCountChanged = label.fit(width);
        }
        return rowCountChanged;
    },

    setLabelTrackerData: function() {
        this._label.setTrackerData(this);
    },

    _checkLabelPosition: function(coord, bBox, visibleArea) {
        coord = this._checkHorizontalLabelPosition(coord, bBox, visibleArea);
        return this._checkVerticalLabelPosition(coord, bBox, visibleArea);
    },

    _getLabelConnector: function() {
        var that = this,
            rad = that.radiusOuter,
            seriesStyle = that._options.styles.normal,
            strokeWidthBy2 = seriesStyle['stroke-width'] / 2,
            borderWidth = that.series.getOptions().containerBackgroundColor === seriesStyle.stroke ? _round(strokeWidthBy2) : _round(-strokeWidthBy2),
            angleFunctions = _getCosAndSin(_round(that.middleAngle));

        return {
            x: _round(that.centerX + (rad - borderWidth) * angleFunctions.cos),
            y: _round(that.centerY - (rad - borderWidth) * angleFunctions.sin),
            angle: that.middleAngle
        };
    },

    _drawMarker: function(renderer, group, animationEnabled, firstDrawing) {
        var that = this,
            radiusOuter = that.radiusOuter,
            radiusInner = that.radiusInner,
            fromAngle = that.fromAngle,
            toAngle = that.toAngle;

        if(animationEnabled) {
            radiusInner = radiusOuter = 0;
            if(!firstDrawing) {
                fromAngle = toAngle = that.shiftedAngle;
            }
        }
        that.graphic = renderer.arc(that.centerX, that.centerY, radiusInner, radiusOuter, toAngle, fromAngle)
            .attr({ 'stroke-linejoin': 'round' })
            .smartAttr(that._getStyle())
            .data({ 'chart-data-point': that })
            .sharp()
            .append(group);
    },

    getTooltipParams: function() {
        var that = this,
            angleFunctions = _getCosAndSin(that.middleAngle),
            radiusInner = that.radiusInner,
            radiusOuter = that.radiusOuter;
        return {
            x: that.centerX + (radiusInner + (radiusOuter - radiusInner) / 2) * angleFunctions.cos,
            y: that.centerY - (radiusInner + (radiusOuter - radiusInner) / 2) * angleFunctions.sin,
            offset: 0
        };
    },

    _translate: function() {
        var that = this,
            angle = that.shiftedAngle || 0,
            value = that.value,
            minValue = that.minValue,
            translator = that._getValTranslator();

        that.fromAngle = translator.translate(minValue) + angle;
        that.toAngle = translator.translate(value) + angle;
        that.middleAngle = translator.translate((value - minValue) / 2 + minValue) + angle;
        if(!that.isVisible()) {
            that.middleAngle = that.toAngle = that.fromAngle = that.fromAngle || angle;
        }

    },

    getMarkerVisibility: function() {
        return true;
    },

    _updateMarker: function(animationEnabled, style, _, callback) {
        var that = this;

        if(!animationEnabled) {
            style = _extend({
                x: that.centerX,
                y: that.centerY,
                outerRadius: that.radiusOuter,
                innerRadius: that.radiusInner,
                startAngle: that.toAngle,
                endAngle: that.fromAngle
            }, style);
        }

        that.graphic.smartAttr(style).sharp();
        callback && callback();
    },

    getLegendStyles: function() {
        return this._styles.legendStyles;
    },

    isInVisibleArea: function() {
        return true;
    },

    hide: function() {
        var that = this;
        if(that._visible) {
            that._visible = false;
            that.hideTooltip();
            that._options.visibilityChanged();
        }
    },

    show: function() {
        var that = this;
        if(!that._visible) {
            that._visible = true;
            that._options.visibilityChanged();
        }
    },

    setInvisibility: function() {
        this._label.draw(false);
    },

    isVisible: function() {
        return this._visible;
    },

    _getFormatObject: function(tooltip) {
        var formatObject = symbolPoint._getFormatObject.call(this, tooltip),
            percent = this.percent;

        formatObject.percent = percent;
        formatObject.percentText = tooltip.formatValue(percent, 'percent');

        return formatObject;
    },

    getColor: function() {
        return this._styles.normal.fill;
    },

    coordsIn: function(x, y) {
        var that = this,
            lx = x - that.centerX,
            ly = y - that.centerY,
            r = _sqrt(lx * lx + ly * ly),
            fromAngle = that.fromAngle % 360,
            toAngle = that.toAngle % 360,
            angle;

        if(r < that.radiusInner || r > that.radiusOuter || r === 0) {
            return false;
        }

        angle = _acos(lx / r) * DEG * (ly > 0 ? -1 : 1);

        if(angle < 0) {
            angle += 360;
        }

        if(fromAngle === toAngle && _abs(that.toAngle - that.fromAngle) > 1E-4) {
            return true;
        } else {
            return fromAngle >= toAngle ? angle <= fromAngle && angle >= toAngle : !(angle >= fromAngle && angle <= toAngle);
        }
    }
});
