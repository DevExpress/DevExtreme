import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import type {
  ContentReadyEvent, InitializedEvent, ItemContextMenuEvent, Properties as ListProperties,
} from '@js/ui/list';
import supportUtils from '@ts/core/utils/m_support';
import Tooltip from '@ts/ui/m_tooltip';

import type { AppointmentTooltipItem } from '../types';
import { TooltipStrategyBase } from './tooltip_strategy_base';

const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = 'dx-scheduler-appointment-tooltip-wrapper';
const MAX_TOOLTIP_HEIGHT = 200;

export class DesktopTooltipStrategy extends TooltipStrategyBase {
  protected override prepareBeforeVisibleChanged(dataList: AppointmentTooltipItem[]): void {
    this.tooltip?.option('position', {
      my: 'bottom',
      at: 'top',
      boundary: this.getBoundary(dataList),
      offset: this.extraOptions?.offset,
      collision: 'fit flipfit',
    });
  }

  private getBoundary(dataList: AppointmentTooltipItem[]): dxElementWrapper {
    return this._options.isAppointmentInAllDayPanel(dataList[0].appointment)
      ? this._options.container
      : this._options.getScrollableContainer();
  }

  protected override onShown(): void {
    super.onShown();
    if (this.extraOptions?.isButtonClick) {
      this.list.focus();
      this.list.option('focusedElement', null);
    }
  }

  protected override createListOption(
    dataList: AppointmentTooltipItem[],
  ): ListProperties<AppointmentTooltipItem> {
    const result = super.createListOption(dataList);
    // T724287 this condition is not covered by tests, because touch variable cannot be overridden.
    // In the future, it is necessary to cover the tests
    result.showScrollbar = supportUtils.touch ? 'always' : 'onHover';
    return result;
  }

  protected override createTooltip(
    dataList: AppointmentTooltipItem[],
  ): Tooltip {
    const tooltipElement = this.createTooltipElement(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);

    const tooltip = this._options.createComponent(tooltipElement, Tooltip, {
      target: this.$target,
      maxHeight: MAX_TOOLTIP_HEIGHT,
      rtlEnabled: this.extraOptions?.rtlEnabled,
      onShown: this.onShown.bind(this),
      contentTemplate: this.getContentTemplate(dataList),
      wrapperAttr: { class: APPOINTMENT_TOOLTIP_WRAPPER_CLASS },
      tabFocusLoopEnabled: this.extraOptions?.tabFocusLoopEnabled,
    }) as Tooltip;

    tooltip.setAria({
      role: 'dialog',
      label: messageLocalization.format('dxScheduler-appointmentListAriaLabel'),
    });

    return tooltip;
  }

  protected override onListInitialized(e: InitializedEvent): void {
    this._options.onListInitialized(e);
  }

  // TODO<Appointments>: remove when old impl is removed
  protected override onListRender(
    e: ContentReadyEvent<AppointmentTooltipItem>,
  ): void {
    if (this._options.newAppointments) {
      return;
    }

    if (this.extraOptions?.dragBehavior) {
      this.extraOptions.dragBehavior(e);
    }
  }

  protected override onListItemContextMenu(
    e: ItemContextMenuEvent<AppointmentTooltipItem>,
  ): void {
    const contextMenuEventArgs = this._options.createEventArgs(e);
    this._options.onItemContextMenu(contextMenuEventArgs);
  }
}
