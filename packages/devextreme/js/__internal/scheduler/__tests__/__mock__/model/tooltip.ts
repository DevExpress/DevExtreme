import $ from '@js/core/renderer';
import { within } from '@testing-library/dom';
import List from '@ts/ui/list/list.edit';

const TOOLTIP_tooltip_SELECTOR = '.dx-overlay-tooltip.dx-scheduler-appointment-tooltip-tooltip';

export class TooltipModel {
  private get element(): HTMLElement | null {
    return document.querySelector<HTMLElement>(TOOLTIP_tooltip_SELECTOR);
  }

  isVisible(): boolean {
    return this.element !== null;
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

  pressDeleteOnItem(index = 0): void {
    const tooltip = this.element;
    const listScrollable = tooltip?.querySelector('.dx-scrollable');

    if (!tooltip || !listScrollable) {
      throw new Error('Tooltip list not found');
    }

    const listItems = within(tooltip).queryAllByRole('option');
    if (listItems.length === 0) {
      throw new Error('Tooltip list item not found');
    }

    const listInstance = List.getInstance($(listScrollable));
    const targetItem = listItems[index];
    listInstance.option('focusedElement', $(targetItem));

    const keyEvent = new KeyboardEvent('keydown', {
      key: 'Delete',
      bubbles: true,
    });
    listInstance._keyboardHandler({
      keyName: 'del',
      originalEvent: keyEvent,
    });
  }

  getAppointmentItem(index = 0): HTMLElement | null {
    const tooltip = this.element;
    if (!tooltip) {
      return null;
    }
    return within(tooltip).queryAllByRole('option')[index] ?? null;
  }
}
