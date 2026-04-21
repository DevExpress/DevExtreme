import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type dxTooltip from '@js/ui/tooltip';
import { within } from '@testing-library/dom';

const TOOLTIP_WRAPPER_SELECTOR = `
  .dx-overlay-wrapper.dx-scheduler-overlay-panel,
  .dx-overlay-wrapper.dx-scheduler-appointment-tooltip-wrapper
`;

export class TooltipModel {
  get element(): HTMLElement | null {
    return document.querySelector<HTMLElement>(TOOLTIP_WRAPPER_SELECTOR);
  }

  get dxTooltip(): dxTooltip {
    // @ts-expect-error
    return $('.dx-tooltip.dx-widget').dxTooltip('instance') as dxTooltip;
  }

  get target(): Element | null {
    const $target = this.dxTooltip.option('target') as unknown as dxElementWrapper;
    return $target?.get(0) ?? null;
  }

  isVisible(): boolean {
    return this.element !== null;
  }

  getScrollableContent(): Element | null {
    return this.element?.querySelector('.dx-scrollable .dx-scrollview-content') ?? null;
  }

  getDeleteButtons(): HTMLElement[] {
    return this.element
      ? within(this.element).queryAllByRole('button').filter(
        (btn) => btn.classList.contains('dx-tooltip-appointment-item-delete-button'),
      )
      : [];
  }

  getDeleteButton(index = 0): HTMLElement {
    const buttons = this.getDeleteButtons();

    if (buttons.length <= index) {
      throw new Error('Tooltip delete button not found');
    }

    return buttons[index];
  }

  getAppointmentItems(): HTMLElement[] {
    return this.element ? within(this.element).queryAllByRole('option') : [];
  }

  getAppointmentItem(index = 0): HTMLElement {
    const items = this.getAppointmentItems();

    if (items.length <= index) {
      throw new Error('Tooltip appointment item not found');
    }

    return items[index];
  }
}
