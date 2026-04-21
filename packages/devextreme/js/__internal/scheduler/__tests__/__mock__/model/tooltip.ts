import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type dxTooltip from '@js/ui/tooltip';
import { within } from '@testing-library/dom';

const TOOLTIP_WRAPPER_SELECTOR = '.dx-overlay-wrapper.dx-scheduler-appointment-tooltip-wrapper';

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

  getOverlayContent(): HTMLElement | null {
    return this.element?.querySelector('.dx-scheduler-appointment-tooltip-wrapper .dx-overlay-content') ?? null;
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

  getAppointmentItem(index = 0): HTMLElement | null {
    const tooltip = this.element;
    if (!tooltip) {
      return null;
    }
    return within(tooltip).queryAllByRole('option')[index] ?? null;
  }
}
