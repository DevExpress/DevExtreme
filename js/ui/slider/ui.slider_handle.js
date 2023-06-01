import $ from '../../core/renderer';
import Widget from '../widget/ui.widget';
import SliderTooltip from './ui.slider_tooltip';
import { extend } from '../../core/utils/extend';

const SLIDER_HANDLE_CLASS = 'dx-slider-handle';

const SliderHandle = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            hoverStateEnabled: false,
            value: 0,
            tooltip: {
                enabled: false,
                format: (value) => value,
                position: 'top',
                showMode: 'onHover'
            }
        });
    },

    _initMarkup: function() {
        this.callBase();
        this.$element().addClass(SLIDER_HANDLE_CLASS);

        this.setAria({
            'role': 'slider',
            'valuenow': this.option('value')
        });
    },

    _render: function() {
        this.callBase();
        this._renderTooltip();
    },

    _renderTooltip: function() {
        const { tooltip, value } = this.option();
        const { position, format, enabled, showMode } = tooltip;

        const $sliderTooltip = $('<div>');
        this._sliderTooltip = this._createComponent($sliderTooltip, SliderTooltip, {
            target: this.$element(),
            container: $sliderTooltip,
            position,
            visible: enabled,

            showMode,
            format,
            value
        });
    },

    _clean: function() {
        this.callBase();
        this._sliderTooltip = null;
    },

    _updateTooltipOptions(args) {
        const tooltipOptions = Widget.getOptionsFromContainer(args);

        this._setWidgetOption('_sliderTooltip', [tooltipOptions]);
        this._sliderTooltip?.option('visible', tooltipOptions.enabled);
    },

    _optionChanged: function(args) {
        const { name, value } = args;
        switch(name) {
            case 'value': {
                this._sliderTooltip?.option('value', value);
                this.setAria('valuenow', value);
                break;
            }
            case 'tooltip':
                this._updateTooltipOptions(args);
                break;
            default:
                this.callBase(args);
        }
    },

    updateTooltipPosition: function() {
        this._sliderTooltip?.updatePosition();
    },

    repaint: function() {
        this._sliderTooltip?.repaint();
    }
});

export default SliderHandle;
