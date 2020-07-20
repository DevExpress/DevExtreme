import $ from '../../core/renderer';
import Guid from '../../core/guid';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import Popover from '../popover';
const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';
import { isWindow } from '../../core/utils/type';

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
            propagateOutsideClick: true
        });
    },

    _render: function() {
        this.$element().addClass(TOOLTIP_CLASS);
        this._wrapper().addClass(TOOLTIP_WRAPPER_CLASS);
        this.callBase();
    },

    _renderContent: function() {
        this.callBase();

        this._contentId = 'dx-' + new Guid();

        this._$content.attr({
            'id': this._contentId,
            'role': 'tooltip'
        });

        this._toggleAriaDescription(true);
    },

    _toggleAriaDescription: function(showing) {
        const $target = $(this.option('target'));
        const label = showing ? this._contentId : undefined;

        if(!isWindow($target.get(0))) {
            this.setAria('describedby', label, $target);
        }
    }
});

registerComponent('dxTooltip', Tooltip);

export default Tooltip;
