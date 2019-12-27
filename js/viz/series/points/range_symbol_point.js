const each = require('../../../core/utils/iterator').each;
const extend = require('../../../core/utils/extend').extend;
const noop = require('../../../core/utils/common').noop;
const labelModule = require('./label');
const symbolPoint = require('./symbol_point');

const _extend = extend;
const _isDefined = require('../../../core/utils/type').isDefined;

const _math = Math;
const _abs = _math.abs;
const _min = _math.min;
const _max = _math.max;
const _round = _math.round;

const DEFAULT_IMAGE_WIDTH = 20;
const DEFAULT_IMAGE_HEIGHT = 20;

module.exports = _extend({}, symbolPoint, {
    deleteLabel: function() {
        const that = this;
        that._topLabel.dispose();
        that._topLabel = null;

        that._bottomLabel.dispose();
        that._bottomLabel = null;
    },

    hideMarker: function(type) {
        const graphic = this.graphic;
        const marker = graphic && graphic[type + 'Marker'];
        const label = this['_' + type + 'Label'];

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
        const that = this;
        const graphic = that.graphic;
        const topMarker = graphic && graphic.topMarker;
        const bottomMarker = graphic && graphic.bottomMarker;

        if(topMarker && topMarker.attr('visibility')) {
            topMarker.attr({ visibility: null });
        }
        if(bottomMarker && bottomMarker.attr('visibility')) {
            bottomMarker.attr({ visibility: null });
        }
    },

    clearMarker: function() {
        const that = this;
        const graphic = that.graphic;
        const topMarker = graphic && graphic.topMarker;
        const bottomMarker = graphic && graphic.bottomMarker;
        const emptySettings = that._emptySettings;

        topMarker && topMarker.attr(emptySettings);
        bottomMarker && bottomMarker.attr(emptySettings);
    },

    _getLabelPosition: function(markerType) {
        let position;
        const labelsInside = this._options.label.position === 'inside';

        if(!this._options.rotated) {
            position = (markerType === 'top') ^ labelsInside ? 'top' : 'bottom';
        } else {
            position = (markerType === 'top') ^ labelsInside ? 'right' : 'left';
        }

        return position;
    },

    _getLabelMinFormatObject: function() {
        const that = this;
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
        const maxFormatObject = this._getLabelFormatObject();
        maxFormatObject.index = 1;
        this._topLabel.setData(maxFormatObject);
        this._bottomLabel.setData(this._getLabelMinFormatObject());
    },

    _updateLabelOptions: function() {
        const that = this;
        const options = this._options.label;

        (!that._topLabel || !that._bottomLabel) && that._createLabel();
        that._topLabel.setOptions(options);
        that._bottomLabel.setOptions(options);
    },

    _createLabel: function() {
        const options = {
            renderer: this.series._renderer,
            labelsGroup: this.series._labelsGroup,
            point: this
        };
        this._topLabel = new labelModule.Label(options);
        this._bottomLabel = new labelModule.Label(options);
    },

    _getGraphicBBox: function(location) {
        const options = this._options;
        const images = this._getImage(options.image);
        const image = location === 'top' ? this._checkImage(images.top) : this._checkImage(images.bottom);
        let bBox;
        const coord = this._getPositionFromLocation(location);

        if(options.visible) {
            bBox = image ? this._getImageBBox(coord.x, coord.y) : this._getSymbolBBox(coord.x, coord.y, options.styles.normal.r);
        } else {
            bBox = { x: coord.x, y: coord.y, width: 0, height: 0 };
        }

        return bBox;
    },

    _getPositionFromLocation: function(location) {
        let x; let y;
        const isTop = location === 'top';
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
        const rotated = this._options.rotated;
        const coordSelector = !rotated ? 'y' : 'x';
        const valueSelector = !rotated ? 'height' : 'width';
        const visibleArea = this.series.getValueAxis().getVisibleArea();
        const minBound = visibleArea[0];
        const maxBound = visibleArea[1];
        let delta = _round((topCoords[coordSelector] + topCoords[valueSelector] - bottomCoords[coordSelector]) / 2);
        let coord1 = topCoords[coordSelector] - delta;
        let coord2 = bottomCoords[coordSelector] + delta;

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
        const that = this;
        const topCoords = that._topLabel.getBoundingRect();
        const bottomCoords = that._bottomLabel.getBoundingRect();
        let corrections = {};

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
        const that = this;
        const labels = [];
        const notInverted = that._options.rotated ? that.x >= that.minX : that.y < that.minY;
        const customVisibility = that._getCustomLabelVisibility();
        const topLabel = that._topLabel;
        const bottomLabel = that._bottomLabel;

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
        const image = {};

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
        const that = this;
        const oldSymbol = oldOptions.symbol;
        const newSymbol = newOptions.symbol;
        const symbolChanged = (oldSymbol === 'circle' && newSymbol !== 'circle') || (oldSymbol !== 'circle' && newSymbol === 'circle');
        const oldImages = that._getImage(oldOptions.image);
        const newImages = that._getImage(newOptions.image);
        const topImageChanged = that._checkImage(oldImages.top) !== that._checkImage(newImages.top);
        const bottomImageChanged = that._checkImage(oldImages.bottom) !== that._checkImage(newImages.bottom);

        return symbolChanged || topImageChanged || bottomImageChanged;
    },

    _getSettingsForTwoMarkers: function(style) {
        const that = this;
        const options = that._options;
        const settings = {};
        const x = options.rotated ? _min(that.x, that.minX) : that.x;
        const y = options.rotated ? that.y : _min(that.y, that.minY);
        const radius = style.r;
        const points = that._populatePointShape(options.symbol, radius);

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
        const that = this;
        const graphic = that.graphic;
        if(graphic[markerType]) {
            that._updateOneMarker(markerType, settings);
        } else {
            graphic[markerType] = that._createMarker(renderer, graphic, imageSettings, settings);
        }
    },

    _drawMarker: function(renderer, group, animationEnabled, firstDrawing, style) {
        const that = this;
        const settings = that._getSettingsForTwoMarkers(style || that._getStyle());
        const image = that._getImage(that._options.image);

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
        const that = this;
        const rotated = that._options.rotated;

        return {
            translateX: rotated ? _min(that.x, that.minX) - radius : that.x - radius,
            translateY: rotated ? that.y - radius : _min(that.y, that.minY) - radius,
            width: that.width + 2 * radius,
            height: that.height + 2 * radius
        };
    },

    isInVisibleArea: function() {
        const that = this;
        const rotated = that._options.rotated;
        const argument = !rotated ? that.x : that.y;
        const maxValue = !rotated ? _max(that.minY, that.y) : _max(that.minX, that.x);
        const minValue = !rotated ? _min(that.minY, that.y) : _min(that.minX, that.x);
        let notVisibleByArg;
        let notVisibleByVal;
        let tmp;
        let visibleTopMarker = true;
        let visibleBottomMarker = true;
        let visibleRangeArea = true;
        let visibleArgArea;
        let visibleValArea;

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
        const that = this;
        let x;
        let y;
        const rotated = that._options.rotated;
        const minValue = !rotated ? _min(that.y, that.minY) : _min(that.x, that.minX);
        const side = !rotated ? 'height' : 'width';
        const visibleArea = that._getVisibleArea();
        const minVisible = rotated ? visibleArea.minX : visibleArea.minY;
        const maxVisible = rotated ? visibleArea.maxX : visibleArea.maxY;
        const min = _max(minVisible, minValue);
        const max = _min(maxVisible, minValue + that[side]);

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
        const that = this;
        const rotated = that._options.rotated;
        symbolPoint._translate.call(that);

        that.height = rotated ? 0 : _abs(that.minY - that.y);
        that.width = rotated ? _abs(that.x - that.minX) : 0;
    },

    hasCoords: function() {
        return symbolPoint.hasCoords.call(this) && !(this.minX === null || this.minY === null);
    },

    _updateData: function(data) {
        const that = this;
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
        const that = this;
        const rotated = that._options.rotated;
        const minX = that.minX;
        const minY = that.minY;
        const vx = that.vx;
        const vy = that.vy;
        const value = that.value;
        const minValue = that.minValue;
        const argument = that.argument;
        const coords = {
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
        const that = this;
        const initialMinValue = that.initialMinValue;
        const initialValue = that.initialValue;
        const initialArgument = that.initialArgument;
        const minValue = tooltip.formatValue(initialMinValue);
        const value = tooltip.formatValue(initialValue);

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
        const trackerRadius = this._storeTrackerR();
        const xCond = (x >= this.x - trackerRadius) && (x <= this.x + trackerRadius);
        const yCond = (y >= this.y - trackerRadius) && (y <= this.y + trackerRadius);

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
