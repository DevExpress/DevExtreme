import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import Popover from '../popover/ui.popover';
const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';

// STYLE tooltip

const Tooltip = Popover.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTooltipOptions.toolbarItems
            * @hidden
            */
            toolbarItems: [],

            /**
            * @name dxTooltipOptions.showCloseButton
            * @hidden
            */
            showCloseButton: false,

            /**
            * @name dxTooltipOptions.enableBodyScroll
            * @hidden
            */
            enableBodyScroll: true,

            /**
            * @name dxTooltipOptions.showTitle
            * @hidden
            */
            showTitle: false,

            /**
            * @name dxTooltipOptions.title
            * @hidden
            */
            title: null,

            /**
            * @name dxTooltipOptions.titleTemplate
            * @hidden
            */
            titleTemplate: null,

            /**
            * @name dxTooltipOptions.onTitleRendered
            * @hidden
            * @action
            */
            onTitleRendered: null,
            bottomTemplate: null,
            preventScrollEvents: false,
            propagateOutsideClick: true
        });
    },

    _render: function() {
        this.$element().addClass(TOOLTIP_CLASS);
        this.$wrapper().addClass(TOOLTIP_WRAPPER_CLASS);
        this.callBase();
    }
});

registerComponent('dxTooltip', Tooltip);

export default Tooltip;
