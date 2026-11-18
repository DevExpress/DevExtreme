import type { Locator } from '@playwright/test';
import Widget from '../internal/widget';
import HeaderItem from './headerItem';

const CLASS = {
  headerItem: 'header-item',
  link: 'link',
};

export default class HeaderPanel {
  public readonly element: Locator;

  public readonly widgetName: string;

  constructor(element: Locator, widgetName: string) {
    this.element = element;
    this.widgetName = widgetName;
  }

  public getHeaderItem(idx = 0): HeaderItem {
    const itemSelector = `.${Widget.addClassPrefix(this.widgetName, CLASS.headerItem)}`;

    return new HeaderItem(this.element.locator(itemSelector).nth(idx));
  }

  public getColumnChooserLink(): Locator {
    return this.element.locator(`.dx-${CLASS.link}`);
  }
}
