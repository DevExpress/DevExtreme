import type { Locator } from '@playwright/test';
import FocusableElement from '../../internal/focusable';

export default class HeaderItem extends FocusableElement {
  public readonly widgetName: string;

  constructor(element: Locator, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
  }
}
