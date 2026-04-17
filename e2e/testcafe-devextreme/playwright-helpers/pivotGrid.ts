import type { Page, Locator } from '@playwright/test';

const CLASS = {
  pivotGrid: 'dx-pivotgrid',
  fieldArea: 'dx-pivotgrid-area',
  fieldAreaColumn: 'dx-pivotgrid-horizontal-headers',
  fieldAreaRow: 'dx-pivotgrid-vertical-headers',
  fieldAreaData: 'dx-pivotgrid-area-data',
  headerFilterIcon: 'dx-header-filter',
  scrollable: 'dx-scrollable',
  fieldPanel: 'dx-pivotgridfieldchooser-container',
  fieldChooser: 'dx-pivotgridfieldchooser',
  fieldChooserButton: 'dx-pivotgrid-field-chooser-button',
  sortUpIcon: 'dx-sort-up',
  sortDownIcon: 'dx-sort-down',
  fieldPanelColumn: 'dx-area-column-cell',
  fieldPanelRow: 'dx-area-row-cell',
  fieldPanelData: 'dx-area-data-cell',
  fieldPanelFilter: 'dx-area-filter-cell',
  fieldItem: 'dx-area-field',
} as const;

export class PivotGrid {
  readonly page: Page | null;
  readonly selector: string;
  readonly element: Locator | string;

  constructor(pageOrSelector: Page | string, selector = '#container') {
    if (typeof pageOrSelector === 'string') {
      this.page = null;
      this.selector = pageOrSelector;
      this.element = pageOrSelector;
    } else {
      this.page = pageOrSelector;
      this.selector = selector;
      this.element = pageOrSelector.locator(selector);
    }
  }

  private getPage(): Page {
    if (!this.page) {
      throw new Error('PivotGrid: page is required for this operation');
    }
    return this.page;
  }

  private getLocator(): Locator {
    if (typeof this.element === 'string') {
      throw new Error('PivotGrid: page is required for this operation');
    }
    return this.element;
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    const page = this.getPage();
    if (arguments.length === 2) {
      return page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxPivotGrid('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxPivotGrid('instance').option(n),
      { sel, name },
    );
  }

  getColumnHeaderArea(): PivotGridHeaderArea {
    return new PivotGridHeaderArea(this.getLocator().locator(`.${CLASS.fieldAreaColumn}`));
  }

  getRowHeaderArea(): PivotGridHeaderArea {
    return new PivotGridHeaderArea(this.getLocator().locator(`.${CLASS.fieldAreaRow}`));
  }

  getDataArea(): Locator {
    return this.getLocator().locator(`.${CLASS.fieldAreaData}`);
  }

  getFieldPanel(): PivotGridFieldPanel {
    return new PivotGridFieldPanel(this.getPage(), this.getLocator());
  }

  getFieldChooserButton(): Locator {
    return this.getLocator().locator(`.${CLASS.fieldChooserButton}`);
  }
}

export class PivotGridHeaderArea {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  getHeaderFilterIcon(index = 0): Locator {
    return this.element.locator(`.${CLASS.headerFilterIcon}`).nth(index);
  }

  getHeaderFilterScrollable(): Locator {
    return this.element.locator(`.${CLASS.scrollable}`);
  }

  getSortUpIcon(index = 0): Locator {
    return this.element.locator(`.${CLASS.sortUpIcon}`).nth(index);
  }

  getSortDownIcon(index = 0): Locator {
    return this.element.locator(`.${CLASS.sortDownIcon}`).nth(index);
  }
}

export class PivotGridFieldPanel {
  readonly page: Page;
  readonly element: Locator;

  constructor(page: Page, container: Locator) {
    this.page = page;
    this.element = container;
  }

  getColumnArea(): Locator {
    return this.element.locator(`.${CLASS.fieldPanelColumn}`);
  }

  getRowArea(): Locator {
    return this.element.locator(`.${CLASS.fieldPanelRow}`);
  }

  getDataArea(): Locator {
    return this.element.locator(`.${CLASS.fieldPanelData}`);
  }

  getFilterArea(): Locator {
    return this.element.locator(`.${CLASS.fieldPanelFilter}`);
  }

  getFieldItem(areaLocator: Locator, index = 0): Locator {
    return areaLocator.locator(`.${CLASS.fieldItem}`).nth(index);
  }
}

export class HeaderFilter {
  readonly page: Page;
  readonly element: Locator;

  constructor(page: Page) {
    this.page = page;
    this.element = page.locator('.dx-header-filter-menu');
  }

  getList(): HeaderFilterList {
    return new HeaderFilterList(this.element);
  }
}

export class HeaderFilterList {
  readonly element: Locator;

  constructor(container: Locator) {
    this.element = container.locator('.dx-list');
  }

  getItem(index: number): Locator {
    return this.element.locator('.dx-list-item').nth(index);
  }

  getSelectAll(): HeaderFilterSelectAll {
    return new HeaderFilterSelectAll(this.element);
  }
}

export class HeaderFilterSelectAll {
  readonly element: Locator;
  readonly checkBox: Locator;

  constructor(container: Locator) {
    this.element = container.locator('.dx-list-select-all');
    this.checkBox = this.element.locator('.dx-checkbox');
  }

  async isChecked(): Promise<boolean> {
    return this.checkBox.evaluate((el) => el.classList.contains('dx-checkbox-checked'));
  }
}
