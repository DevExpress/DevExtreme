import { within } from '@testing-library/dom';

const TOOLTIP_WRAPPER_SELECTOR = '.dx-overlay-wrapper.dx-scheduler-appointment-tooltip-wrapper';

export class TooltipModel {
  private get element(): HTMLElement | null {
    return document.querySelector<HTMLElement>(TOOLTIP_WRAPPER_SELECTOR);
  }

  isVisible(): boolean {
    return this.element !== null;
  }

  getScrollableContent(): Element | null {
    return this.element?.querySelector('.dx-scrollable .dx-scrollview-content') ?? null;
  }

  getDeleteButton(index = 0): HTMLElement {
    const tooltip = this.element;
    const buttons = tooltip
      ? within(tooltip).queryAllByRole('button').filter((btn) => btn.classList.contains('dx-tooltip-appointment-item-delete-button'))
      : [];

    if (buttons.length === 0) {
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
