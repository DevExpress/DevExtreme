import type { Locator } from '@playwright/test';
import GridElement from '../../gridCore/element';
import CommandCell from '../commandCell';
import HeaderCell from './cell';

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
}
