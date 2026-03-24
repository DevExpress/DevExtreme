import type { Page, Locator } from '@playwright/test';

const CLASS = {
  tabs: 'dx-tabs',
  multiView: 'dx-multiview',
  tab: 'dx-tab',
  multiViewItem: 'dx-multiview-item',
  focused: 'dx-state-focused',
} as const;

export class TabItem {
  readonly element: Locator;

  constructor(locator: Locator) {
    this.element = locator;
  }

  async isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.focused,
    );
  }
}

export class MultiViewItem {
  readonly element: Locator;

  constructor(locator: Locator) {
    this.element = locator;
  }

  async isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.focused,
    );
  }
}

export class TabsHelper {
  readonly element: Locator;

  constructor(container: Locator) {
    this.element = container.locator(`.${CLASS.tabs}`);
  }

  async isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.focused,
    );
  }

  getItem(index = 0): TabItem {
    return new TabItem(this.element.locator(`.${CLASS.tab}`).nth(index));
  }
}

export class MultiViewHelper {
  readonly element: Locator;

  constructor(container: Locator) {
    this.element = container.locator(`.${CLASS.multiView}`);
  }

  getItem(index = 0): MultiViewItem {
    return new MultiViewItem(
      this.element.locator(`.${CLASS.multiViewItem}`).nth(index),
    );
  }
}

export class TabPanel {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;
  readonly tabs: TabsHelper;
  readonly multiView: MultiViewHelper;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    this.tabs = new TabsHelper(this.element);
    this.multiView = new MultiViewHelper(this.element);
  }

  async isFocused(): Promise<boolean> {
    return this.element.evaluate(
      (el, cls) => el.classList.contains(cls),
      CLASS.focused,
    );
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxTabPanel('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxTabPanel('instance').option(n),
      { sel, name },
    );
  }

  getItem(index = 0): TabItem {
    return new TabItem(this.element.locator(`.${CLASS.tab}`).nth(index));
  }
}
