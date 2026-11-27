import type { Locator } from '@playwright/test';
import GridElement from '../../gridCore/element';
import { expectClass } from '../../internal/classMatcher';
import CommandCell from '../commandCell';
import HeaderCell from './cell';

// The grid prefixes the class with its name, which a row doesn't know.
const DROP_HIGHLIGHT_CLASS = 'dx-(datagrid|treelist)-drop-highlight';

export default class HeaderRow extends GridElement {
  public getHeaderCell(index: number): HeaderCell {
    return new HeaderCell(this.element, index);
  }

  public getCommandCell(index: number): CommandCell {
    return new CommandCell(this.element, index);
  }

  // A data column's header, not a command column's or a placeholder of virtual columns.
  public getDataHeaderCells(): Locator {
    return this.element.locator(':scope > td[role="columnheader"]');
  }

  public getHeaderCells(): Locator {
    return this.element.locator(':scope > td');
  }

  public expectHighlighted(present = true): Promise<void> {
    return expectClass(this.element, DROP_HIGHLIGHT_CLASS, present);
  }
}
