var commonModule = require('./common'),
    animationSettings = commonModule.utils.animationSettings,
    formatValue = commonModule.formatValue,
    SliderMarker = require('./slider_marker'),
    support = require('../../core/utils/support'),

    SPLITTER_WIDTH = 8,
    TOUCH_SPLITTER_WIDTH = 20;

function getSliderTrackerWidth(sliderHandleWidth) {
    return support.touchEvents || support.pointer ? TOUCH_SPLITTER_WIDTH : (SPLITTER_WIDTH < sliderHandleWidth ? sliderHandleWidth : SPLITTER_WIDTH);
}

function Slider(params, index) {
    var that = this;
    that._translator = params.translator;
    that._sliderGroup = params.renderer.g().attr({ 'class': 'slider' }).append(params.root);
    that._line = params.renderer.path(null, 'line').append(that._sliderGroup);
    that._marker = new SliderMarker(params.renderer, that._sliderGroup, index === 1);
    that._tracker = params.renderer.rect().attr({ 'class': 'slider-tracker', fill: '#000000', opacity: 0.0001 }).css({ cursor: 'w-resize' }).append(params.trackersGroup);
}

Slider.prototype = {
    constructor: Slider,

    cancelAnimation: function() {
        this._sliderGroup.stopAnimation();
        this._tracker.stopAnimation();
    },

    applyPosition: function(isAnimated) {
        var that = this,
            slider = that._sliderGroup,
            tracker = that._tracker,
            attrs = { translateX: that._position };

        that._marker.setPosition(that._position);
        if(isAnimated) {
            slider.animate(attrs, animationSettings);
            tracker.animate(attrs, animationSettings);
        } else {
            slider.attr(attrs);
            tracker.attr(attrs);
        }
    },

    _setValid: function(isValid) {
        this._marker.setValid(isValid);
        this._line.attr({ stroke: this._colors[Number(isValid)] });
    },

    _setText: function(text) {
        this._marker.setText(text);
    },

    update: function(verticalRange, sliderHandleOptions, sliderMarkerOptions) {
        var that = this;
        that._formatOptions = { format: sliderMarkerOptions.format, customizeText: sliderMarkerOptions.customizeText };
        that._marker.applyOptions(sliderMarkerOptions, that._translator.getScreenRange());
        that._colors = [sliderMarkerOptions.invalidRangeColor, sliderHandleOptions.color];
        that._sliderGroup.attr({ translateY: verticalRange[0] });
        that._line.attr({
            'stroke-width': sliderHandleOptions.width, stroke: sliderHandleOptions.color, 'stroke-opacity': sliderHandleOptions.opacity, sharp: 'h',
            points: [0, 0, 0, verticalRange[1] - verticalRange[0]]
        });
        var trackerWidth = getSliderTrackerWidth(sliderHandleOptions.width);
        that._tracker.attr({ x: -trackerWidth / 2, y: 0, width: trackerWidth, height: verticalRange[1] - verticalRange[0], translateY: verticalRange[0] });
    },

    toForeground: function() {
        this._sliderGroup.toForeground();
    },

    getSliderTracker: function() {
        return this._tracker;
    },

    getPosition: function() {
        return this._position;
    },

    setDisplayValue: function(value) {
        this._value = value;
        this._setText(formatValue(value, this._formatOptions));
    },

    setOverlapped: function(isOverlapped) {
        this._marker.setOverlapped(isOverlapped);
    },

    getValue: function() {
        return this._value;
    },

    on: function(event, handler) {
        this._tracker.on(event, handler);
        this._marker.getTracker().on(event, handler);
    },

    getCloudBorder: function() {
        return this._marker.getBorderPosition();
    },

    dispose: function() {
        this._marker.dispose();
    }
};

module.exports = Slider;
