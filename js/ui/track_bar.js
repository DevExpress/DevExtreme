var $ = require('../core/renderer'),
    Editor = require('./editor/editor'),
    registerComponent = require('../core/component_registrator'),
    extend = require('../core/utils/extend').extend,
    windowUtils = require('../core/utils/window'),
    fx = require('../animation/fx');

var TRACKBAR_CLASS = 'dx-trackbar',
    TRACKBAR_CONTAINER_CLASS = 'dx-trackbar-container',
    TRACKBAR_RANGE_CLASS = 'dx-trackbar-range',
    TRACKBAR_WRAPPER_CLASS = 'dx-trackbar-wrapper';

/**
* @name dxTrackBar
* @inherits Editor
* @hidden
*/
var TrackBar = Editor.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTrackBarOptions.min
            * @type number
            * @default 0
            */
            min: 0,

            /**
            * @name dxTrackBarOptions.max
            * @type number
            * @default 100
            */
            max: 100,

            value: 0
        });
    },

    _initMarkup: function() {
        this.$element().addClass(TRACKBAR_CLASS);
        this._renderWrapper();
        this._renderContainer();
        this._renderRange();

        this._renderValue();

        this._setRangeStyles();
        this.callBase();
    },

    _render: function() {
        this.callBase();

        this._setRangeStyles(this._rangeStylesConfig());
    },

    _renderWrapper: function() {
        this._$wrapper = $('<div>')
            .addClass(TRACKBAR_WRAPPER_CLASS)
            .appendTo(this.$element());
    },

    _renderContainer: function() {
        this._$bar = $('<div>')
            .addClass(TRACKBAR_CONTAINER_CLASS)
            .appendTo(this._$wrapper);
    },

    _renderRange: function() {
        this._$range = $('<div>')
            .addClass(TRACKBAR_RANGE_CLASS)
            .appendTo(this._$bar);
    },

    _renderValue: function() {
        var val = this.option('value'),
            min = this.option('min'),
            max = this.option('max');

        if(min > max) {
            return;
        }

        if(val < min) {
            this.option('value', min);
            this._currentRatio = 0;
            return;
        }

        if(val > max) {
            this.option('value', max);
            this._currentRatio = 1;
            return;
        }

        var ratio = (min === max) ? 0 : (val - min) / (max - min);
        !this._needPreventAnimation && this._setRangeStyles({ width: ratio * 100 + '%' });

        this.setAria({
            'valuemin': this.option('min'),
            'valuemax': max,
            'valuenow': val
        });

        this._currentRatio = ratio;
    },

    _rangeStylesConfig: function() {
        return { width: this._currentRatio * 100 + '%' };
    },

    _setRangeStyles: function(options) {
        fx.stop(this._$range);

        if(!options) {
            this._$range.css({ width: 0 });
            return;
        }

        if(this._needPreventAnimation || !windowUtils.hasWindow()) {
            return;
        }

        fx.animate(this._$range, {
            type: 'custom',
            duration: 100,
            to: options
        });
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'value':
                this._renderValue();
                this.callBase(args);
                break;
            case 'max':
            case 'min':
                this._renderValue();
                break;
            default:
                this.callBase(args);
        }
    },

    _dispose: function() {
        fx.stop(this._$range);
        this.callBase();
    }
});

registerComponent('dxTrackBar', TrackBar);

module.exports = TrackBar;
