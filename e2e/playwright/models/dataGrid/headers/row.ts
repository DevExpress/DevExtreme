import type { Locator } from '@playwright/test';
import FocusableElement from '../../internal/focusable';
import HeaderCell from './cell';

export default class HeaderRow extends FocusableElement {
  public readonly widgetName: string;

  constructor(element: Locator, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
  }

  public getHeaderCell(index: number): HeaderCell {
    return new HeaderCell(this.element, index);
  }
}
