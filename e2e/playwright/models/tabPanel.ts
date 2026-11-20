import type { Locator } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';

const CLASS = {
  tab: 'dx-tab',
};

export default class TabPanel extends Widget {
  name: WidgetName = 'dxTabPanel';

  public getTab(index = 0): Locator {
    return this.element.locator(`.${CLASS.tab}`).nth(index);
  }
}
