
import Tooltip from '../tooltip';
import { extend } from '../../core/utils/extend';
import { SliderTooltipPositionController } from './slider_tooltip_position_controller';
import numberLocalization from '../../localization/number';

const SLIDER_TOOLTIP_ON_HOVER_CLASS = 'dx-slider-tooltip-on-hover';

const SliderTooltip = Tooltip.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            visible: false,
            position: 'top',
            closeOnOutsideClick: false,
            hideTopOverlayHandler: null,
            hideOnParentScroll: false,
            animation: null,
            arrowPosition: null,
            templatesRenderAsynchronously: false,
            _fixWrapperPosition: false,
            useResizeObserver: false,

            enabled: false,
            showMode: 'onHover',
            format: (value) => value,
            value: 0
        });
    },

    _initMarkup() {
        this.callBase();

        this._toggle(this.option('enabled'));
        this._updateShowMode();
        this._renderContentText();
    },

    _renderContentText() {
        const { value, format } = this.option();

        const formattedText = numberLocalization.format(value ?? 0, format);
        this.$content().text(formattedText);

        this._updatePosition();
    },

    _updatePosition() {
        this._renderPosition();
    },

    _updateShowMode() {
        this._showIfNeeded();
        this._toggleContainerHoverClass();
    },

    _showIfNeeded() {
        const { showMode, enabled } = this.option();

        if(showMode === 'always' && enabled) {
            this._show();
        }
    },

    _toggleContainerHoverClass() {
        const isHoverMode = this.option('showMode') === 'onHover';

        this._positionController.$container.toggleClass(SLIDER_TOOLTIP_ON_HOVER_CLASS, isHoverMode);
    },

    _initPositionController() {
        this._positionController = new SliderTooltipPositionController(
            this._getPositionControllerConfig()
        );
    },

    _toggle(enabled) {
        enabled
            ? this.$element().appendTo(this._positionController.$container)
            : this.$element().detach();
    },

    _optionChanged(args) {
        const { name, value } = args;
        switch(name) {
            case 'enabled':
                this._toggle(value);
                this._showIfNeeded();
                break;
            case 'showMode':
                this._updateShowMode();
                break;
            case 'format':
            case 'value':
                this._renderContentText();
                break;
            default:
                this.callBase(args);
                break;
        }
    },

    updatePosition() {
        this._updatePosition();
    }
});

export default SliderTooltip;
