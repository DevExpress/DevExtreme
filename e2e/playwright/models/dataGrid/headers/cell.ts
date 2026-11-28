import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import DropDownButton from '../../dropDownButton';
import GridFocusableElement from '../../gridCore/focusable';
import { expectClass } from '../../internal/classMatcher';

const CLASS = {
  aiHeaderButton: 'dx-command-ai-header-button',
};

// The grid prefixes the class with its name, which a cell doesn't know.
const HIDDEN_COLUMN_CLASS = 'dx-(datagrid|treelist)-hidden-column';
const FIRST_CELL_CLASS = 'dx-(datagrid|treelist)-first-cell';
const STICKY_COLUMN_CLASS = 'dx-(datagrid|treelist)-sticky-column';

type StickyPosition = 'left' | 'right' | 'sticky';

const STICKY_POSITION_SUFFIX: Record<StickyPosition, string> = {
  left: '-left',
  right: '-right',
  sticky: '',
};

export default class HeaderCell extends GridFocusableElement {
  constructor(headerRow: Locator, index: number) {
    super(headerRow.locator(`td[aria-colindex='${index + 1}']`));
  }

  public async expectFocused(present = true): Promise<void> {
    await (present ? expect(this.element) : expect(this.element).not).toBeFocused();
  }

  public expectHidden(present = true): Promise<void> {
    return expectClass(this.element, HIDDEN_COLUMN_CLASS, present);
  }

  public expectFirstCell(present = true): Promise<void> {
    return expectClass(this.element, FIRST_CELL_CLASS, present);
  }

  // With no position, any of the three.
  public expectSticky(position?: StickyPosition, present = true): Promise<void> {
    const suffix = position ? STICKY_POSITION_SUFFIX[position] : '(-left|-right)?';

    return expectClass(this.element, `${STICKY_COLUMN_CLASS}${suffix}`, present);
  }

  public getFilterIcon(): Locator {
    return this.element.locator('.dx-column-indicators > .dx-header-filter');
  }

  public getAIHeaderButton(): DropDownButton {
    return new DropDownButton(this.element.page(), this.element.locator(`.${CLASS.aiHeaderButton}`));
  }
}
