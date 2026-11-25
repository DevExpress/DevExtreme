import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { WidgetName } from '../../types';
import GridElement from '../element';
import GridModule from '../module';

const CLASS = {
  filterPanelIcon: 'dx-icon-filter',
  filterPanelText: 'filter-panel-text',
  popupWrapper: 'dx-popup-wrapper',
  filterBuilder: 'dx-filterbuilder',
};

export default class FilterPanel extends GridModule {
  public readonly body: Locator;

  constructor(element: Locator, widgetName: WidgetName) {
    super(element, widgetName);

    this.body = element.page().locator('body');
  }

  public async expectOpened(present = true): Promise<void> {
    const filterBuilder = this.body.locator(`.${CLASS.popupWrapper} .${CLASS.filterBuilder}`).first();

    await (present ? expect(filterBuilder) : expect(filterBuilder).not).toBeAttached();
  }

  public getIconFilter(): GridElement {
    return new GridElement(this.element.locator(`.${CLASS.filterPanelIcon}`));
  }

  public getFilterText(): GridElement {
    return new GridElement(
      this.element.locator(`.${this.addWidgetPrefix(CLASS.filterPanelText)}`),
    );
  }
}
