var each = require('../../../core/utils/iterator').each,
    extend = require('../../../core/utils/extend').extend,
    noop = require('../../../core/utils/common').noop,
    labelModule = require('./label'),
    symbolPoint = require('./symbol_point'),

    _extend = extend,
    _isDefined = require('../../../core/utils/type').isDefined,

    _math = Math,
    _abs = _math.abs,
    _min = _math.min,
    _max = _math.max,
    _round = _math.round,

    DEFAULT_IMAGE_WIDTH = 20,
    DEFAULT_IMAGE_HEIGHT = 20;

module.exports = _extend({}, symbolPoint, {
    deleteLabel: function() {
        var that = this;
        that._topLabel.dispose();
        that._topLabel = null;

        that._bottomLabel.dispose();
        that._bottomLabel = null;
    },

    hideMarker: function(type) {
        var graphic = this.graphic,
            marker = graphic && graphic[type + 'Marker'],
            label = this['_' + type + 'Label'];

        if(marker && marker.attr('visibility') !== 'hidden') {
            marker.attr({ visibility: 'hidden' });
        }

        label.draw(false);
    },

    setInvisibility: function() {
        this.hideMarker('top');
        this.hideMarker('bottom');
    },

    clearVisibility: function() {
        var that = this,
            graphic = that.graphic,
            topMarker = graphic && graphic.topMarker,
            bottomMarker = graphic && graphic.bottomMarker;

        if(topMarker && topMarker.attr('visibility')) {
            topMarker.attr({ visibility: null });
        }
        if(bottomMarker && bottomMarker.attr('visibility')) {
            bottomMarker.attr({ visibility: null });
        }
    },

    clearMarker: function() {
        var that = this,
            graphic = that.graphic,
            topMarker = graphic && graphic.topMarker,
            bottomMarker = graphic && graphic.bottomMarker,
            emptySettings = that._emptySettings;

        topMarker && topMarker.attr(emptySettings);
        bottomMarker && bottomMarker.attr(emptySettings);
    },

    _getLabelPosition: function(markerType) {
        var position,
            labelsInside = this._options.label.position === 'inside';

        if(!this._options.rotated) {
            position = (markerType === 'top') ^ labelsInside ? 'top' : 'bottom';
        } else {
            position = (markerType === 'top') ^ labelsInside ? 'right' : 'left';
        }

        return position;
    },

    _getLabelMinFormatObject: function() {
        var that = this;
        return {
            index: 0,
            argument: that.initialArgument,
            value: that.initialMinValue,
            seriesName: that.series.name,
            originalValue: that.originalMinValue,
            originalArgument: that.originalArgument,
            point: that
        };
    },

    _updateLabelData: function() {
        var maxFormatObject = this._getLabelFormatObject();
        maxFormatObject.index = 1;
        this._topLabel.setData(maxFormatObject);
        this._bottomLabel.setData(this._getLabelMinFormatObject());
    },

    _updateLabelOptions: function() {
        var that = this,
            options = this._options.label;

        (!that._topLabel || !that._bottomLabel) && that._createLabel();
        that._topLabel.setOptions(options);
        that._bottomLabel.setOptions(options);
    },

    _createLabel: function() {
        var options = {
            renderer: this.series._renderer,
            labelsGroup: this.series._labelsGroup,
            point: this
        };
        this._topLabel = new labelModule.Label(options);
        this._bottomLabel = new labelModule.Label(options);
    },

    _getGraphicBBox: function(location) {
        var options = this._options,
            images = this._getImage(options.image),
            image = location === 'top' ? this._checkImage(images.top) : this._checkImage(images.bottom),
            bBox,
            coord = this._getPositionFromLocation(location);

        if(options.visible) {
            bBox = image ? this._getImageBBox(coord.x, coord.y) : this._getSymbolBBox(coord.x, coord.y, options.styles.normal.r);
        } else {
            bBox = { x: coord.x, y: coord.y, width: 0, height: 0 };
        }

        return bBox;
    },

    _getPositionFromLocation: function(location) {
        var x, y,
            isTop = location === 'top';
        if(!this._options.rotated) {
            x = this.x;
            y = isTop ? _min(this.y, this.minY) : _max(this.y, this.minY);
        } else {
            x = isTop ? _max(this.x, this.minX) : _min(this.x, this.minX);
            y = this.y;
        }
        return { x: x, y: y };
    },

    _checkOverlay: function(bottomCoord, topCoord, topValue) {
        return bottomCoord < topCoord + topValue;
    },

    _getOverlayCorrections: function(topCoords, bottomCoords) {
        var rotated = this._options.rotated,
            coordSelector = !rotated ? 'y' : 'x',
            valueSelector = !rotated ? 'height' : 'width',
            visibleArea = this.series.getValueAxis().getVisibleArea(),
            minBound = visibleArea[0],
            maxBound = visibleArea[1],
            delta = _round((topCoords[coordSelector] + topCoords[valueSelector] - bottomCoords[coordSelector]) / 2),
            coord1 = topCoords[coordSelector] - delta,
            coord2 = bottomCoords[coordSelector] + delta;

        if(coord1 < minBound) {
            delta = minBound - topCoords[coordSelector];
            coord1 += delta;
            coord2 += delta;
        } else if(coord2 + bottomCoords[valueSelector] > maxBound) {
            delta = -(bottomCoords[coordSelector] + bottomCoords[valueSelector] - maxBound);
            coord1 += delta;
            coord2 += delta;
        }

        return { coord1: coord1, coord2: coord2 };
    },

    _checkLabelsOverlay: function(topLocation) {
        var that = this,
            topCoords = that._topLabel.getBoundingRect(),
            bottomCoords = that._bottomLabel.getBoundingRect(),
            corrections = {};

        if(!that._options.rotated) {
            if(topLocation === 'top') {
                if(this._checkOverlay(bottomCoords.y, topCoords.y, topCoords.height)) {
                    corrections = this._getOverlayCorrections(topCoords, bottomCoords);
                    that._topLabel.shift(topCoords.x, corrections.coord1);
                    that._bottomLabel.shift(bottomCoords.x, corrections.coord2);
                }
            } else {
                if(this._checkOverlay(topCoords.y, bottomCoords.y, bottomCoords.height)) {
                    corrections = this._getOverlayCorrections(bottomCoords, topCoords);
                    that._topLabel.shift(topCoords.x, corrections.coord2);
                    that._bottomLabel.shift(bottomCoords.x, corrections.coord1);
                }
            }
        } else {
            if(topLocation === 'top') {
                if(this._checkOverlay(topCoords.x, bottomCoords.x, bottomCoords.width)) {
                    corrections = this._getOverlayCorrections(bottomCoords, topCoords);
                    that._topLabel.shift(corrections.coord2, topCoords.y);
                    that._bottomLabel.shift(corrections.coord1, bottomCoords.y);
                }
            } else {
                if(this._checkOverlay(bottomCoords.x, topCoords.x, topCoords.width)) {
                    corrections = this._getOverlayCorrections(topCoords, bottomCoords);
                    that._topLabel.shift(corrections.coord1, topCoords.y);
                    that._bottomLabel.shift(corrections.coord2, bottomCoords.y);
                }
            }

        }
    },

    _drawLabel: function() {
        var that = this,
            labels = [],
            notInverted = that._options.rotated ? that.x >= that.minX : that.y < that.minY,
            customVisibility = that._getCustomLabelVisibility(),
            topLabel = that._topLabel,
            bottomLabel = that._bottomLabel;

        topLabel.pointPosition = notInverted ? 'top' : 'bottom';
        bottomLabel.pointPosition = notInverted ? 'bottom' : 'top';

        if((that.series.getLabelVisibility() || customVisibility) && that.hasValue() && customVisibility !== false) {
            that.visibleTopMarker !== false && labels.push(topLabel);
            that.visibleBottomMarker !== false && labels.push(bottomLabel);

            each(labels, function(_, label) {
                label.draw(true);
            });

            that._checkLabelsOverlay(that._topLabel.pointPosition);
        } else {
            topLabel.draw(false);
            bottomLabel.draw(false);
        }
    },

    _getImage: function(imageOption) {
        var image = {};

        if(_isDefined(imageOption)) {
            if(typeof imageOption === 'string') {
                image.top = image.bottom = imageOption;
            } else {
                image.top = {
                    url: typeof imageOption.url === 'string' ? imageOption.url : imageOption.url && imageOption.url.rangeMaxPoint,
                    width: typeof imageOption.width === 'number' ? imageOption.width : imageOption.width && imageOption.width.rangeMaxPoint,
                    height: typeof imageOption.height === 'number' ? imageOption.height : imageOption.height && imageOption.height.rangeMaxPoint
                };
                image.bottom = {
                    url: typeof imageOption.url === 'string' ? imageOption.url : imageOption.url && imageOption.url.rangeMinPoint,
                    width: typeof imageOption.width === 'number' ? imageOption.width : imageOption.width && imageOption.width.rangeMinPoint,
                    height: typeof imageOption.height === 'number' ? imageOption.height : imageOption.height && imageOption.height.rangeMinPoint
                };
            }
        }
        return image;
    },

    _checkSymbol: function(oldOptions, newOptions) {
        var that = this,
            oldSymbol = oldOptions.symbol,
            newSymbol = newOptions.symbol,
            symbolChanged = (oldSymbol === 'circle' && newSymbol !== 'circle') || (oldSymbol !== 'circle' && newSymbol === 'circle'),
            oldImages = that._getImage(oldOptions.image),
            newImages = that._getImage(newOptions.image),
            topImageChanged = that._checkImage(oldImages.top) !== that._checkImage(newImages.top),
            bottomImageChanged = that._checkImage(oldImages.bottom) !== that._checkImage(newImages.bottom);

        return symbolChanged || topImageChanged || bottomImageChanged;
    },

    _getSettingsForTwoMarkers: function(style) {
        var that = this,
            options = that._options,
            settings = {},
            x = options.rotated ? _min(that.x, that.minX) : that.x,
            y = options.rotated ? that.y : _min(that.y, that.minY),
            radius = style.r,
            points = that._populatePointShape(options.symbol, radius);

        settings.top = _extend({ translateX: x + that.width, translateY: y, r: radius }, style);
        settings.bottom = _extend({ translateX: x, translateY: y + that.height, r: radius }, style);

        if(points) {
            settings.top.points = settings.bottom.points = points;
        }

        return settings;
    },

    _hasGraphic: function() {
        return this.graphic && this.graphic.topMarker && this.graphic.bottomMarker;
    },

    _drawOneMarker: function(renderer, markerType, imageSettings, settings) {
        var that = this,
            graphic = that.graphic;
        if(graphic[markerType]) {
            that._updateOneMarker(markerType, settings);
        } else {
            graphic[markerType] = that._createMarker(renderer, graphic, imageSettings, settings);
        }
    },

    _drawMarker: function(renderer, group, animationEnabled, firstDrawing, style) {
        var that = this,
            settings = that._getSettingsForTwoMarkers(style || that._getStyle()),
            image = that._getImage(that._options.image);

        if(that._checkImage(image.top)) {
            settings.top = that._getImageSettings(settings.top, image.top);
        }
        if(that._checkImage(image.bottom)) {
            settings.bottom = that._getImageSettings(settings.bottom, image.bottom);
        }

        that.graphic = that.graphic || renderer.g().append(group);
        that.visibleTopMarker && that._drawOneMarker(renderer, 'topMarker', image.top, settings.top);
        that.visibleBottomMarker && that._drawOneMarker(renderer, 'bottomMarker', image.bottom, settings.bottom);
    },

    _getSettingsForTracker: function(radius) {
        var that = this,
            rotated = that._options.rotated;

        return {
            translateX: rotated ? _min(that.x, that.minX) - radius : that.x - radius,
            translateY: rotated ? that.y - radius : _min(that.y, that.minY) - radius,
            width: that.width + 2 * radius,
            height: that.height + 2 * radius
        };
    },

    isInVisibleArea: function() {
        var that = this,
            rotated = that._options.rotated,
            argument = !rotated ? that.x : that.y,
            maxValue = !rotated ? _max(that.minY, that.y) : _max(that.minX, that.x),
            minValue = !rotated ? _min(that.minY, that.y) : _min(that.minX, that.x),
            notVisibleByArg,
            notVisibleByVal,
            tmp,
            visibleTopMarker = true,
            visibleBottomMarker = true,
            visibleRangeArea = true,
            visibleArgArea,
            visibleValArea;

        visibleArgArea = that.series.getArgumentAxis().getVisibleArea();
        visibleValArea = that.series.getValueAxis().getVisibleArea();

        notVisibleByArg = (visibleArgArea[1] < argument) || (visibleArgArea[0] > argument);
        notVisibleByVal = ((visibleValArea[0] > minValue) && (visibleValArea[0] > maxValue)) || ((visibleValArea[1] < minValue) && (visibleValArea[1] < maxValue));

        if(notVisibleByArg || notVisibleByVal) {
            visibleTopMarker = visibleBottomMarker = visibleRangeArea = false;
        } else {
            visibleTopMarker = ((visibleValArea[0] <= minValue) && (visibleValArea[1] > minValue));
            visibleBottomMarker = ((visibleValArea[0] < maxValue) && (visibleValArea[1] >= maxValue));
            if(rotated) {
                tmp = visibleTopMarker;
                visibleTopMarker = visibleBottomMarker;
                visibleBottomMarker = tmp;
            }
        }
        that.visibleTopMarker = visibleTopMarker;
        that.visibleBottomMarker = visibleBottomMarker;

        return visibleRangeArea;
    },

    getTooltipParams: function() {
        var that = this,
            x,
            y,
            rotated = that._options.rotated,
            minValue = !rotated ? _min(that.y, that.minY) : _min(that.x, that.minX),
            side = !rotated ? 'height' : 'width',
            visibleArea = that._getVisibleArea(),
            minVisible = rotated ? visibleArea.minX : visibleArea.minY,
            maxVisible = rotated ? visibleArea.maxX : visibleArea.maxY,
            min = _max(minVisible, minValue),
            max = _min(maxVisible, minValue + that[side]);

        if(!rotated) {
            x = that.x;
            y = min + (max - min) / 2;
        } else {
            y = that.y;
            x = min + (max - min) / 2;
        }
        return { x: x, y: y, offset: 0 };
    },

    _translate: function() {
        var that = this,
            rotated = that._options.rotated;
        symbolPoint._translate.call(that);

        that.height = rotated ? 0 : _abs(that.minY - that.y);
        that.width = rotated ? _abs(that.x - that.minX) : 0;
    },

    hasCoords: function() {
        return symbolPoint.hasCoords.call(this) && !(this.minX === null || this.minY === null);
    },

    _updateData: function(data) {
        var that = this;
        symbolPoint._updateData.call(that, data);
        that.minValue = that.initialMinValue = that.originalMinValue = data.minValue;
    },

    _getImageSettings: function(settings, image) {
        return {
            href: image.url || image.toString(),
            width: image.width || DEFAULT_IMAGE_WIDTH,
            height: image.height || DEFAULT_IMAGE_HEIGHT,
            translateX: settings.translateX,
            translateY: settings.translateY
        };
    },

    getCrosshairData: function(x, y) {
        var that = this,
            rotated = that._options.rotated,
            minX = that.minX,
            minY = that.minY,
            vx = that.vx,
            vy = that.vy,
            value = that.value,
            minValue = that.minValue,
            argument = that.argument,
            coords = {
                axis: that.series.axis,
                x: vx,
                y: vy,
                yValue: value,
                xValue: argument
            };

        if(rotated) {
            coords.yValue = argument;
            if(_abs(vx - x) < _abs(minX - x)) {
                coords.xValue = value;
            } else {
                coords.x = minX;
                coords.xValue = minValue;
            }

        } else {
            if(_abs(vy - y) >= _abs(minY - y)) {
                coords.y = minY;
                coords.yValue = minValue;
            }
        }
        return coords;
    },

    _updateOneMarker: function(markerType, settings) {
        this.graphic && this.graphic[markerType] && this.graphic[markerType].attr(settings);
    },

    _updateMarker: function(animationEnabled, style) {
        this._drawMarker(undefined, undefined, false, false, style);
    },

    _getFormatObject: function(tooltip) {
        var that = this,
            initialMinValue = that.initialMinValue,
            initialValue = that.initialValue,
            initialArgument = that.initialArgument,
            minValue = tooltip.formatValue(initialMinValue),
            value = tooltip.formatValue(initialValue);

        return {
            argument: initialArgument,
            argumentText: tooltip.formatValue(initialArgument, 'argument'),
            valueText: minValue + ' - ' + value,
            rangeValue1Text: minValue,
            rangeValue2Text: value,
            rangeValue1: initialMinValue,
            rangeValue2: initialValue,
            seriesName: that.series.name,
            point: that,
            originalMinValue: that.originalMinValue,
            originalValue: that.originalValue,
            originalArgument: that.originalArgument
        };
    },

    getLabel: function() {
        return [this._topLabel, this._bottomLabel];
    },

    getLabels: function() {
        return [this._topLabel, this._bottomLabel];
    },

    getBoundingRect: noop,

    coordsIn: function(x, y) {
        var trackerRadius = this._storeTrackerR(),
            xCond = (x >= this.x - trackerRadius) && (x <= this.x + trackerRadius),
            yCond = (y >= this.y - trackerRadius) && (y <= this.y + trackerRadius);

        if(this._options.rotated) {
            return yCond && (xCond || (x >= this.minX - trackerRadius) && (x <= this.minX + trackerRadius));
        } else {
            return xCond && (yCond || (y >= this.minY - trackerRadius) && (y <= this.minY + trackerRadius));
        }
    },

    getMaxValue: function() {
        if(this.series.valueAxisType !== 'discrete') {
            return this.minValue > this.value ? this.minValue : this.value;
        }
        return this.value;
    },

    getMinValue: function() {
        if(this.series.valueAxisType !== 'discrete') {
            return this.minValue < this.value ? this.minValue : this.value;
        }
        return this.minValue;
    }
});
