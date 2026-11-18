import type { Locator } from '@playwright/test';
import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';
import HeaderItem from './item';

const CLASS = {
  headerItem: 'header-item',
};

export default class HeadersElement extends FocusableElement {
  public readonly widgetName: string;

  constructor(element: Locator, widgetName: string) {
    super(element);
    this.widgetName = widgetName;
  }

  public getHeaderItemNth(nth: number): HeaderItem {
    const selector = this.element
      .locator(`.${Widget.addClassPrefix(this.widgetName, CLASS.headerItem)}`)
      .nth(nth);

    return new HeaderItem(selector, this.widgetName);
  }
}
