import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from './types';
import Widget from './internal/widget';
import MultiView from './multiView';
import Tabs from './tabs';

const CLASS = {
  tab: 'dx-tab',
  tabsContainer: 'dx-tabpanel-tabs',
  tabs: 'dx-tabs',
};

export default class TabPanel extends Widget {
  name: WidgetName = 'dxTabPanel';

  public readonly tabs: Tabs;

  public readonly multiView: MultiView;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.tabs = new Tabs(page, this.element.locator(`:scope > .${CLASS.tabsContainer} > .${CLASS.tabs}`));
    // TabPanel extends MultiView: its own element is the MultiView.
    this.multiView = new MultiView(page, this.element);
  }

  public getTab(index = 0): Locator {
    return this.element.locator(`.${CLASS.tab}`).nth(index);
  }
}
