import type { Page, Locator } from '@playwright/test';

const CLASS = {
  dataRow: 'dx-data-row',
  headerRow: 'dx-header-row',
  focusedRow: 'dx-row-focused',
  treeListExpandedRow: 'dx-treelist-expanded',
  treeListCollapsedRow: 'dx-treelist-collapsed',
  commandDrag: 'dx-command-drag',
  rowsView: 'dx-treelist-rowsview',
  headers: 'dx-treelist-headers',
  scrollableContainer: 'dx-scrollable-container',
  expandButton: 'dx-treelist-icon-container',
  aiColumn: 'dx-ai-column',
  aiColumnLoading: 'dx-ai-loading',
  dropDownButton: 'dx-dropdownbutton',
} as const;

export class TreeList {
  readonly page: Page;
  readonly selector: string;
  readonly element: Locator;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
  }

  async option(name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length === 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxTreeList('instance').option(n, v);
        },
        { sel, name, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxTreeList('instance').option(n),
      { sel, name },
    );
  }

  async isReady(): Promise<boolean> {
    return this.page.evaluate(
      ({ sel }) => {
        const instance = ($(sel) as any).dxTreeList('instance');
        return instance && instance.getDataSource() !== undefined;
      },
      { sel: this.selector },
    );
  }

  async apiFocus(): Promise<void> {
    await this.page.evaluate(
      ({ sel }) => { ($(sel) as any).dxTreeList('instance').focus(); },
      { sel: this.selector },
    );
  }

  getDataRow(index: number): TreeListDataRow {
    return new TreeListDataRow(this.element.locator(`.${CLASS.dataRow}`).nth(index));
  }

  getDataCell(rowIndex: number, cellIndex: number): Locator {
    return this.getDataRow(rowIndex).getDataCell(cellIndex);
  }

  getHeaderRow(index = 0): Locator {
    return this.element.locator(`.${CLASS.headers} .${CLASS.headerRow}`).nth(index);
  }

  getHeaderCell(rowIndex: number, cellIndex: number): Locator {
    return this.getHeaderRow(rowIndex).locator('td').nth(cellIndex);
  }

  getRowsView(): Locator {
    return this.element.locator(`.${CLASS.rowsView}`);
  }

  getScrollableContainer(): Locator {
    return this.getRowsView().locator(`.${CLASS.scrollableContainer}`);
  }

  getAIColumn(rowIndex: number): Locator {
    return this.getDataRow(rowIndex).element.locator(`.${CLASS.aiColumn}`);
  }

  getDropDownButton(rowIndex: number): Locator {
    return this.getAIColumn(rowIndex).locator(`.${CLASS.dropDownButton}`);
  }

  async scrollTo(options: { top?: number; left?: number }): Promise<void> {
    await this.page.evaluate(
      ({ sel, opts }) => {
        const scrollable = ($(sel) as any).dxTreeList('instance').getScrollable();
        scrollable.scrollTo(opts);
      },
      { sel: this.selector, opts: options },
    );
  }
}

export class TreeListDataRow {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  getDataCell(cellIndex: number): Locator {
    return this.element.locator('td').nth(cellIndex);
  }

  getExpandButton(): Locator {
    return this.element.locator(`.${CLASS.expandButton}`);
  }
}

export class ExpandableCell {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  getExpandButton(): Locator {
    return this.element.locator(`.${CLASS.expandButton}`);
  }
}
