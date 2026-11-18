import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';

const CLASS = {
  filterPanelIcon: 'dx-icon-filter',
  filterPanelText: 'filter-panel-text',
  popupWrapper: 'dx-popup-wrapper',
  filterBuilder: 'dx-filterbuilder',
};

export default class FilterPanel extends FocusableElement {
  public readonly body: Locator;

  public readonly widgetName: string;

  constructor(element: Locator, widgetName: string) {
    super(element);

    this.body = element.page().locator('body');
    this.widgetName = widgetName;
  }

  public async expectOpened(present = true): Promise<void> {
    const filterBuilder = this.body.locator(`.${CLASS.popupWrapper} .${CLASS.filterBuilder}`).first();

    await (present ? expect(filterBuilder) : expect(filterBuilder).not).toBeAttached();
  }

  public getIconFilter(): FocusableElement {
    return new FocusableElement(this.element.locator(`.${CLASS.filterPanelIcon}`));
  }

  public getFilterText(): FocusableElement {
    return new FocusableElement(
      this.element.locator(`.${Widget.addClassPrefix(this.widgetName, CLASS.filterPanelText)}`),
    );
  }
}
