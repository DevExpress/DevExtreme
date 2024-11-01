import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { isWindow } from '@js/core/utils/type';
import Popover from '@js/ui/popover/ui.popover';

const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';

const Tooltip = Popover.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      toolbarItems: [],
      showCloseButton: false,
      enableBodyScroll: true,
      showTitle: false,
      title: null,
      titleTemplate: null,
      onTitleRendered: null,
      bottomTemplate: null,
      preventScrollEvents: false,
      propagateOutsideClick: true,
    });
  },

  _render() {
    this.$element().addClass(TOOLTIP_CLASS);
    this.$wrapper().addClass(TOOLTIP_WRAPPER_CLASS);
    this.callBase();
  },

  _renderContent() {
    this.callBase();

    this._toggleAriaAttributes();
  },

  _toggleAriaDescription(showing) {
    const $target = $(this.option('target'));
    const label = showing ? this._contentId : undefined;

    if (!isWindow($target.get(0))) {
      this.setAria('describedby', label, $target);
    }
  },

  _toggleAriaAttributes() {
    this._contentId = `dx-${new Guid()}`;

    this.$overlayContent().attr({
      id: this._contentId,
    });

    this._toggleAriaDescription(true);
  },
});

registerComponent('dxTooltip', Tooltip);

export default Tooltip;
