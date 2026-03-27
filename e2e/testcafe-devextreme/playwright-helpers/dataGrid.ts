import type { Page, Locator } from '@playwright/test';

type LocatorWithElement = Locator & { element: Locator };

function locatorWithElement(locator: Locator): LocatorWithElement {
  return new Proxy(locator, {
    get(target, prop) {
      if (prop === 'element') return target;
      const value = (target as any)[prop];
      if (prop === 'constructor') return value;
      return typeof value === 'function' ? value.bind(target) : value;
    },
  }) as LocatorWithElement;
}

const CLASS = {
  dataGrid: 'dx-datagrid',
  headers: 'dx-datagrid-headers',
  headerRow: 'dx-header-row',
  headerPanel: 'dx-datagrid-header-panel',
  filterRow: 'dx-datagrid-filter-row',
  row: 'dx-row',
  dataRow: 'dx-data-row',
  groupRow: 'dx-group-row',
  focusedRow: 'dx-row-focused',
  errorRow: 'dx-error-row',
  masterDetailRow: 'dx-master-detail-row',
  adaptiveDetailRow: 'dx-adaptive-detail-row',
  adaptiveCommandCellHidden: 'dx-command-adaptive-hidden',
  adaptiveColumnButton: 'dx-datagrid-adaptive-more',
  freeSpaceRow: 'dx-freespace-row',
  footerRow: 'dx-footer-row',
  groupFooterRow: 'dx-datagrid-group-footer',
  editFormRow: 'dx-datagrid-edit-form',
  formButtonsContainer: 'dx-datagrid-form-buttons-container',
  popupEdit: 'dx-datagrid-edit-popup',
  rowsView: 'dx-datagrid-rowsview',
  fixedGridView: 'dx-datagrid-content-fixed',
  scrollableContainer: 'dx-scrollable-container',
  scrollContainer: 'dx-datagrid-scroll-container',
  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  loadPanel: 'dx-loadpanel',
  loadPanelContent: 'dx-loadpanel-content',
  toolbar: 'dx-toolbar',
  contextMenu: 'dx-context-menu',
  columnChooser: 'dx-datagrid-column-chooser',
  columnChooserButton: 'dx-datagrid-column-chooser-button',
  groupPanel: 'dx-datagrid-group-panel',
  searchBox: 'dx-searchbox',
  filterPanel: 'dx-datagrid-filter-panel',
  filterRangeOverlay: 'dx-datagrid-filter-range-overlay',
  filterRangeStartEditor: 'dx-datagrid-filter-range-start',
  filterRangeEndEditor: 'dx-datagrid-filter-range-end',
  focusOverlay: 'dx-datagrid-focus-overlay',
  revertTooltip: 'dx-datagrid-revert-tooltip',
  invalidMessage: 'dx-invalid-message',
  dialogWrapper: 'dx-dialog-wrapper',
  summaryTotal: 'dx-datagrid-summary-item',
  button: 'dx-button',
  fieldItemContent: 'dx-field-item-content',
  textEditorInput: 'dx-texteditor-input',
  commandDrag: 'dx-command-drag',
  revertButton: 'dx-revert-button',
  columnsSeparator: 'dx-datagrid-columns-separator',
  toast: 'dx-toast-wrapper',
  dragHeader: 'dx-datagrid-drag-header',
  sortableDragging: 'dx-sortable-dragging',
  pager: 'dx-datagrid-pager',
  pagination: 'dx-pagination',
  noDataText: 'dx-datagrid-nodata',
} as const;

export class DataGridHeaders {
  readonly element: Locator;

  constructor(container: Locator) {
    this.element = container.locator(`.${CLASS.headers}`);
  }

  getHeaderRow(index = 0): Locator {
    return this.element.locator(`.${CLASS.headerRow}`).nth(index);
  }

  getHeaderCell(rowIndex: number, cellIndex: number): Locator {
    return this.getHeaderRow(rowIndex).locator('td').nth(cellIndex);
  }

  getFilterRow(): Locator {
    return this.element.locator(`.${CLASS.filterRow}`);
  }

  getFilterCell(columnIndex: number): Locator {
    return this.getFilterRow().locator('td').nth(columnIndex);
  }
}

export class DataGridCommandCell {
  readonly element: Locator;

  constructor(row: Locator, columnIndex: number) {
    this.element = row.locator('td').nth(columnIndex);
  }

  getButton(buttonIndex: number): Locator {
    return this.element.locator('.dx-link').nth(buttonIndex);
  }

  getSelectCheckBox(): Locator {
    return this.element.locator('.dx-checkbox-container');
  }
}

export class DataGridDataRow {
  readonly element: Locator;

  constructor(container: Locator, index: number) {
    this.element = container.locator(`.${CLASS.dataRow}[aria-rowindex='${index + 1}']`);
  }

  getDataCell(columnIndex: number): LocatorWithElement {
    return locatorWithElement(this.element.locator('td').nth(columnIndex));
  }

  getCommandCell(columnIndex: number): DataGridCommandCell {
    return new DataGridCommandCell(this.element, columnIndex);
  }
}

export class DataGridEditForm {
  readonly element: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(element: Locator, buttons: Locator) {
    this.element = element;
    this.saveButton = buttons.first();
    this.cancelButton = buttons.last();
  }
}

export class DataGridGroupRow {
  readonly element: Locator;

  constructor(container: Locator, index: number) {
    this.element = container.locator(`.${CLASS.groupRow}`).nth(index);
  }

  async isExpanded(): Promise<boolean> {
    return this.element.evaluate(
      (el) => el.getAttribute('aria-expanded') === 'true',
    );
  }
}

export class DataGridAdaptiveDetailRow {
  readonly element: Locator;

  constructor(container: Locator, index: number) {
    this.element = container.locator(`.${CLASS.adaptiveDetailRow}`).nth(index);
  }

  getAdaptiveCell(cellIndex: number): LocatorWithElement {
    return locatorWithElement(this.element.locator('.dx-field-item-content').nth(cellIndex));
  }
}

export class DataGridHeaderPanel {
  readonly element: Locator;

  constructor(element: Locator) {
    this.element = element;
  }

  getAddRowButton(): Locator {
    return this.element.locator('.dx-datagrid-addrow-button');
  }

  getSaveButton(): Locator {
    return this.element.locator('.dx-datagrid-save-button');
  }

  getCancelButton(): Locator {
    return this.element.locator('.dx-datagrid-cancel-button');
  }

  getColumnChooserButton(): Locator {
    return this.element.locator('.dx-datagrid-column-chooser-button');
  }

  getDropDownMenuButton(): Locator {
    return this.element.locator('.dx-dropdownmenu-button');
  }

  getApplyFilterButton(): Locator {
    return this.element.locator('.dx-apply-button');
  }

  getExportButton(): Locator {
    return this.element.locator('.dx-datagrid-export-button');
  }
}

export class DataGridContextMenu {
  readonly element: Locator;

  constructor(page: Page) {
    this.element = page.locator(`.${CLASS.contextMenu}.dx-datagrid`);
  }

  getItemByText(text: string): Locator {
    return this.element.locator('.dx-menu-item').filter({ hasText: text });
  }
}

export class DataGrid {
  readonly page: Page;
  readonly element: Locator;
  readonly selector: string;

  readonly dataRows: Locator;
  readonly rowsView: Locator;

  constructor(page: Page, selector = '#container') {
    this.page = page;
    this.selector = selector;
    this.element = page.locator(selector);
    this.dataRows = this.element.locator(`.${CLASS.dataRow}`);
    this.rowsView = this.element.locator(`.${CLASS.rowsView}`);
  }

  getContainer(): Locator {
    return this.element.locator(`.${CLASS.dataGrid}`);
  }

  getHeaders(): DataGridHeaders {
    return new DataGridHeaders(this.element);
  }

  getHeaderRow(index = 0): Locator {
    return this.element.locator(`.${CLASS.headers} .${CLASS.headerRow}`).nth(index);
  }

  getFilterRow(): Locator {
    return this.element.locator(`.${CLASS.headers} .${CLASS.filterRow}`);
  }

  getFilterCell(columnIndex: number): Locator {
    return this.getFilterRow().locator('td').nth(columnIndex);
  }

  getFilterRangeOverlay(): Locator {
    return this.element.locator(`.${CLASS.headers}`).locator(`.${CLASS.filterRangeOverlay}`);
  }

  getFilterRangeStartEditor(): Locator {
    return this.page.locator(`.${CLASS.filterRangeStartEditor}`);
  }

  getFilterRangeEndEditor(): Locator {
    return this.page.locator(`.${CLASS.filterRangeEndEditor}`);
  }

  getFilterPanel(): Locator {
    return this.element.locator(`.${CLASS.filterPanel}`);
  }

  getRows(): Locator {
    return this.rowsView.locator(`.${CLASS.row}`);
  }

  getDataRow(index: number): DataGridDataRow {
    return new DataGridDataRow(this.element, index);
  }

  getDataCell(rowIndex: number, columnIndex: number): LocatorWithElement {
    return this.getDataRow(rowIndex).getDataCell(columnIndex);
  }

  getFixedDataRow(index: number): DataGridDataRow {
    return new DataGridDataRow(
      this.element.locator(`.${CLASS.fixedGridView}`),
      index,
    );
  }

  getFixedDataCell(rowIndex: number, columnIndex: number): LocatorWithElement {
    return this.getFixedDataRow(rowIndex).getDataCell(columnIndex);
  }

  getGroupRow(index: number): DataGridGroupRow {
    return new DataGridGroupRow(this.element, index);
  }

  getGroupRowSelector(): Locator {
    return this.element.locator(`.${CLASS.groupRow}`);
  }

  getFocusedRow(): Locator {
    return this.element.locator(`.${CLASS.dataRow}.${CLASS.focusedRow}`);
  }

  getErrorRow(): Locator {
    return this.element.locator(`.${CLASS.errorRow}`);
  }

  getAdaptiveRow(index: number): DataGridAdaptiveDetailRow {
    return new DataGridAdaptiveDetailRow(this.element, index);
  }

  getAdaptiveButton(nth = 0): Locator {
    return this.element.locator(`.${CLASS.adaptiveColumnButton}`).nth(nth);
  }

  async isAdaptiveColumnHidden(): Promise<boolean> {
    return this.element.locator(`.${CLASS.adaptiveCommandCellHidden}`).first().isVisible();
  }

  getMasterRow(index: number): Locator {
    return this.element.locator(`.${CLASS.masterDetailRow}`).nth(index);
  }

  getEditForm(): DataGridEditForm {
    const element = this.element.locator(`.${CLASS.editFormRow}`);
    const buttons = element.locator(`.${CLASS.formButtonsContainer} .${CLASS.button}`);
    return new DataGridEditForm(element, buttons);
  }

  getPopupEditForm(): DataGridEditForm {
    const element = this.page.locator(`.${CLASS.popupEdit} .${CLASS.overlayContent}`);
    const buttons = element.locator(`.${CLASS.toolbar} .${CLASS.button}`);
    return new DataGridEditForm(element, buttons);
  }

  getFormItemElement(index: number): Locator {
    return this.element.locator(`.${CLASS.fieldItemContent}`).nth(index);
  }

  getFormItemEditor(index: number): Locator {
    return this.getFormItemElement(index).locator(`.${CLASS.textEditorInput}`);
  }

  getFooterRow(): Locator {
    return this.element.locator(`.${CLASS.footerRow}`);
  }

  getGroupFooterRow(): Locator {
    return this.element.locator(`.${CLASS.groupFooterRow}`);
  }

  getFreeSpaceRow(): Locator {
    return this.element.locator(`.${CLASS.freeSpaceRow}`);
  }

  getLoadPanel(): { getContent: () => Locator } {
    const panel = this.element.locator(`.${CLASS.loadPanel}`);
    return {
      getContent: () => panel.locator(`.${CLASS.loadPanelContent}`),
    };
  }

  getToolbar(): Locator {
    return this.element.locator(`.${CLASS.toolbar}`);
  }

  getHeaderPanel(): DataGridHeaderPanel {
    return new DataGridHeaderPanel(this.element.locator(`.${CLASS.headerPanel}`));
  }

  getGroupPanel(): Locator {
    return this.page.locator(`.${CLASS.groupPanel}`);
  }

  getColumnChooser(): Locator {
    return this.page.locator(`.${CLASS.columnChooser}`).last();
  }

  getColumnChooserButton(): Locator {
    return this.element.locator(`.${CLASS.columnChooserButton}`);
  }

  getContextMenu(): DataGridContextMenu {
    return new DataGridContextMenu(this.page);
  }

  getSearchBox(): Locator {
    return this.element.locator(`.${CLASS.searchBox}`);
  }

  getRevertButton(): Locator {
    return this.element.locator(`.${CLASS.revertButton}`);
  }

  getRevertTooltip(): Locator {
    return this.page.locator('.dx-datagrid-revert-tooltip');
  }

  getInvalidMessageTooltip(): Locator {
    return this.page.locator('.dx-invalid-message.dx-invalid-message-always.dx-datagrid-invalid-message');
  }

  getConfirmDeletionButton(): Locator {
    return this.page.locator('[aria-label="Yes"]');
  }

  getCancelDeletionButton(): Locator {
    return this.page.locator('[aria-label="No"]');
  }

  getDialog(): Locator {
    return this.page.locator(`.${CLASS.dialogWrapper}`);
  }

  getToast(): Locator {
    return this.page.locator(`.${CLASS.toast}`);
  }

  getFocusOverlay(): Locator {
    return this.page.locator(`.${CLASS.focusOverlay}`);
  }

  getDraggableHeader(): Locator {
    return this.page.locator(`.${CLASS.dragHeader}`);
  }

  getColumnsSeparator(): Locator {
    return this.element.locator(`.${CLASS.columnsSeparator}`);
  }

  getPager(): Locator {
    return this.element.locator(`.${CLASS.pager}, .${CLASS.pagination}`);
  }

  getNoDataText(): Locator {
    return this.element.locator(`.${CLASS.noDataText}`);
  }

  getScrollContainer(): Locator {
    return this.rowsView.locator(`.${CLASS.scrollableContainer}`);
  }

  getSummaryTotalElement(nth = 0): Locator {
    return this.element.locator(`.${CLASS.summaryTotal}`).nth(nth);
  }

  getScrollBarThumbTrack(scrollbarPosition: string): Locator {
    return this.rowsView.locator(`.dx-scrollbar-${scrollbarPosition.toLowerCase()} .dx-scrollable-scroll`);
  }

  async option(name: string, value?: unknown): Promise<unknown>;
  async option(options: Record<string, unknown>): Promise<void>;
  async option(nameOrOptions: string | Record<string, unknown>, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (typeof nameOrOptions === 'object') {
      return this.page.evaluate(
        ({ sel: s, opts }) => {
          ($(s) as any).dxDataGrid('instance').option(opts);
        },
        { sel, opts: nameOrOptions },
      );
    }
    if (arguments.length >= 2) {
      return this.page.evaluate(
        ({ sel: s, name: n, value: v }) => {
          ($(s) as any).dxDataGrid('instance').option(n, v);
        },
        { sel, name: nameOrOptions, value },
      );
    }
    return this.page.evaluate(
      ({ sel: s, name: n }) => ($(s) as any).dxDataGrid('instance').option(n),
      { sel, name: nameOrOptions },
    );
  }

  async repaint(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').repaint();
    }, sel);
  }

  async focus(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').focus();
    }, sel);
  }

  async scrollTo(options: { x?: number; y?: number; top?: number; left?: number }): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, opts }) => {
        ($(s) as any).dxDataGrid('instance').getScrollable().scrollTo(opts);
      },
      { s: sel, opts: options },
    );
  }

  async scrollBy(options: { x?: number; y?: number; top?: number; left?: number }): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, opts }) => {
        ($(s) as any).dxDataGrid('instance').getScrollable().scrollBy(opts);
      },
      { s: sel, opts: options },
    );
  }

  async getScrollLeft(): Promise<number> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      return ($(s) as any).dxDataGrid('instance').getScrollable().scrollLeft();
    }, sel);
  }

  async getScrollTop(): Promise<number> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      return ($(s) as any).dxDataGrid('instance').getScrollable().scrollTop();
    }, sel);
  }

  async getScrollWidth(): Promise<number> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      return ($(s) as any).dxDataGrid('instance').getScrollable().scrollWidth();
    }, sel);
  }

  async getScrollRight(): Promise<number> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      const scrollable = ($(s) as any).dxDataGrid('instance').getScrollable();
      return scrollable.scrollWidth() - scrollable.clientWidth() - scrollable.scrollLeft();
    }, sel);
  }

  async apiAddRow(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').addRow();
    }, sel);
  }

  async apiEditRow(rowIndex: number): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, ri }) => ($(s) as any).dxDataGrid('instance').editRow(ri),
      { s: sel, ri: rowIndex },
    );
  }

  async apiDeleteRow(rowIndex: number): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, ri }) => { ($(s) as any).dxDataGrid('instance').deleteRow(ri); },
      { s: sel, ri: rowIndex },
    );
  }

  async apiEditCell(rowIndex: number, columnIndex: number): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, ri, ci }) => { ($(s) as any).dxDataGrid('instance').editCell(ri, ci); },
      { s: sel, ri: rowIndex, ci: columnIndex },
    );
  }

  async apiCellValue<T>(rowIndex: number, columnIndex: number, value: T): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, ri, ci, v }) => { ($(s) as any).dxDataGrid('instance').cellValue(ri, ci, v); },
      { s: sel, ri: rowIndex, ci: columnIndex, v: value },
    );
  }

  async apiGetCellValue(rowIndex: number, columnIndex: number): Promise<string> {
    const sel = this.selector;
    return this.page.evaluate(
      ({ s, ri, ci }) => ($(s) as any).dxDataGrid('instance').cellValue(ri, ci),
      { s: sel, ri: rowIndex, ci: columnIndex },
    );
  }

  async apiSaveEditData(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').saveEditData();
    }, sel);
  }

  async apiCancelEditData(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').cancelEditData();
    }, sel);
  }

  async apiExpandRow(key: unknown): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, k }) => { ($(s) as any).dxDataGrid('instance').expandRow(k); },
      { s: sel, k: key },
    );
  }

  async apiCollapseRow(key: unknown): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, k }) => { ($(s) as any).dxDataGrid('instance').collapseRow(k); },
      { s: sel, k: key },
    );
  }

  async apiExpandAdaptiveDetailRow(key: unknown): Promise<void> {
    const sel = this.selector;
    const expanded = await this.page.evaluate(
      ({ s, k }) => {
        const instance = ($(s) as any).dxDataGrid('instance');
        const items = instance.getDataSource().items();
        const storeKey = instance.getDataSource().store().key();
        if (storeKey) {
          instance.expandAdaptiveDetailRow(k);
          return true;
        }
        const matchingItemIndex = items.findIndex((item: any) => Object.values(item).includes(k));
        if (matchingItemIndex !== -1) {
          const rowKey = items[matchingItemIndex];
          instance.expandAdaptiveDetailRow(rowKey);
          return true;
        }
        return false;
      },
      { s: sel, k: key },
    );
    if (!expanded) {
      const adaptiveBtn = this.element.locator('.dx-datagrid-adaptive-more').first();
      await adaptiveBtn.click();
    }
  }

  async apiExpandAllGroups(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').option('grouping.autoExpandAll', true);
    }, sel);
  }

  async apiCollapseAllGroups(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').option('grouping.autoExpandAll', false);
    }, sel);
  }

  async apiExpandAll(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').expandAll();
    }, sel);
  }

  async apiFilter(filterExpr: unknown): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, f }) => { ($(s) as any).dxDataGrid('instance').filter(f); },
      { s: sel, f: filterExpr },
    );
  }

  async apiColumnOption(id: string | number, name: string, value?: unknown): Promise<unknown> {
    const sel = this.selector;
    if (arguments.length >= 3) {
      return this.page.evaluate(
        ({ s, id: i, n, v }) => {
          ($(s) as any).dxDataGrid('instance').columnOption(i, n, v);
        },
        { s: sel, id, n: name, v: value },
      );
    }
    return this.page.evaluate(
      ({ s, id: i, n }) => ($(s) as any).dxDataGrid('instance').columnOption(i, n),
      { s: sel, id, n: name },
    );
  }

  async apiBeginCustomLoading(messageText: string): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, msg }) => { ($(s) as any).dxDataGrid('instance').beginCustomLoading(msg); },
      { s: sel, msg: messageText },
    );
  }

  async apiEndCustomLoading(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').endCustomLoading();
    }, sel);
  }

  async apiRefresh(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').refresh().catch(() => {});
    }, sel);
  }

  async apiUpdateDimensions(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      ($(s) as any).dxDataGrid('instance').updateDimensions();
    }, sel);
  }

  async apiPageIndex(pageIndex?: number): Promise<number | void> {
    const sel = this.selector;
    if (pageIndex === undefined) {
      return this.page.evaluate((s) => {
        return ($(s) as any).dxDataGrid('instance').pageIndex();
      }, sel);
    }
    await this.page.evaluate(
      ({ s, pi }) => { ($(s) as any).dxDataGrid('instance').pageIndex(pi); },
      { s: sel, pi: pageIndex },
    );
  }

  async apiNavigateToRow(key: unknown): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, k }) => { ($(s) as any).dxDataGrid('instance').navigateToRow(k); },
      { s: sel, k: key },
    );
  }

  async apiSearchByText(text: string): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, t }) => { ($(s) as any).dxDataGrid('instance').searchByText(t); },
      { s: sel, t: text },
    );
  }

  async apiAddColumn(config: unknown): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, c }) => { ($(s) as any).dxDataGrid('instance').addColumn(c); },
      { s: sel, c: config },
    );
  }

  async apiPush(values: unknown[]): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, v }) => { ($(s) as any).dxDataGrid('instance').getDataSource().store().push(v); },
      { s: sel, v: values },
    );
  }

  async apiGetVisibleRows(): Promise<Array<{ key: unknown; data: unknown; dataIndex: number; rowType: string; rowIndex: number }>> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      const instance = ($(s) as any).dxDataGrid('instance');
      return instance.getVisibleRows().map((r: any) => ({
        key: r.key,
        data: r.data,
        dataIndex: r.dataIndex,
        rowType: r.rowType,
        rowIndex: r.rowIndex,
      }));
    }, sel);
  }

  async apiGetVisibleColumns(): Promise<Array<{ dataField: string; name: string; visibleIndex: number }>> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      const instance = ($(s) as any).dxDataGrid('instance');
      return instance.getVisibleColumns().map((c: any) => ({
        dataField: c.dataField,
        name: c.name,
        visibleIndex: c.visibleIndex,
      }));
    }, sel);
  }

  async apiGetTopVisibleRowData(): Promise<unknown> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      return ($(s) as any).dxDataGrid('instance').getTopVisibleRowData();
    }, sel);
  }

  async isReady(): Promise<boolean> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      return ($(s) as any).dxDataGrid('instance').isReady();
    }, sel);
  }

  async hasScrollable(): Promise<boolean> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      return Boolean(($(s) as any).dxDataGrid('instance').getScrollable());
    }, sel);
  }

  async getView(viewName: string): Promise<unknown> {
    const sel = this.selector;
    return this.page.evaluate(
      ({ s, vn }) => ($(s) as any).dxDataGrid('instance').getView(vn),
      { s: sel, vn: viewName },
    );
  }

  async moveRow(rowIndex: number, x: number, y: number, isStart = false): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, ri, px, py, start }) => {
        const instance = ($(s) as any).dxDataGrid('instance');
        const $row = $(instance.getRowElement(ri));
        let $dragEl = $row.children('.dx-command-drag');
        $dragEl = $dragEl.length ? $dragEl : $row;
        const offset = ($dragEl as any).offset();
        if (offset) {
          if (start) {
            $dragEl.trigger($.Event('dxpointerdown', {
              pageX: offset.left,
              pageY: offset.top,
              pointers: [{ pointerId: 1 }],
            }));
          }
          $dragEl.trigger($.Event('dxpointermove', {
            pageX: offset.left + px,
            pageY: offset.top + py,
            pointers: [{ pointerId: 1 }],
          }));
        }
      },
      { s: sel, ri: rowIndex, px: x, py: y, start: isStart },
    );
  }

  async dropRow(): Promise<void> {
    await this.page.evaluate(
      (cls) => {
        const $dragEl = $(`.${cls}`);
        const offset = ($dragEl as any).offset();
        $dragEl.trigger($.Event('dxpointerup', {
          pageX: offset.left,
          pageY: offset.top,
          pointers: [{ pointerId: 1 }],
        }));
      },
      CLASS.sortableDragging,
    );
  }

  async resizeHeader(columnIndex: number, offset: number, needToTriggerPointerUp = true): Promise<void> {
    const sel = this.selector;
    const headerInfo = await this.page.evaluate(
      ({ s, ci }) => {
        const instance = ($(s) as any).dxDataGrid('instance');
        const columnsController = instance.getController('columns');
        const visualIndex = columnsController.getVisibleIndex(ci);
        const columnHeadersView = instance.getView('columnHeadersView');
        const $header = $(columnHeadersView.getHeaderElement(visualIndex));
        const rect = $header[0].getBoundingClientRect();
        return {
          x: rect.right,
          y: rect.top + rect.height / 2,
        };
      },
      { s: sel, ci: columnIndex },
    );

    await this.page.mouse.move(headerInfo.x - 2, headerInfo.y);
    await this.page.waitForTimeout(100);
    await this.page.mouse.down();
    await this.page.mouse.move(headerInfo.x - 2 + offset, headerInfo.y, { steps: 5 });
    if (needToTriggerPointerUp) {
      await this.page.mouse.up();
    }
  }

  async moveHeader(columnIndex: number, x: number, y: number, isStart = false): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, ci, px, py, start }) => {
        const instance = ($(s) as any).dxDataGrid('instance');
        const columnHeadersView = instance.getView('columnHeadersView');
        const $header = $(columnHeadersView.getHeaderElement(ci));
        const offset = ($header as any).offset();
        if (offset) {
          if (start) {
            $header.trigger($.Event('dxpointerdown', {
              pageX: offset.left,
              pageY: offset.top,
              pointers: [{ pointerId: 1 }],
            }));
          }
          $header.trigger($.Event('dxpointermove', {
            pageX: offset.left + px,
            pageY: offset.top + py,
            pointers: [{ pointerId: 1 }],
          }));
        }
      },
      { s: sel, ci: columnIndex, px: x, py: y, start: isStart },
    );
  }

  async dropHeader(columnIndex: number): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate(
      ({ s, ci }) => {
        const instance = ($(s) as any).dxDataGrid('instance');
        const columnHeadersView = instance.getView('columnHeadersView');
        const $header = $(columnHeadersView.getHeaderElement(ci));
        const headerOffset = ($header as any).offset();
        $(document).trigger($.Event('dxpointerup', {
          pageX: headerOffset.left,
          pageY: headerOffset.top,
          pointers: [{ pointerId: 1 }],
        }));
      },
      { s: sel, ci: columnIndex },
    );
  }

  async apiShowErrorToast(): Promise<void> {
    const sel = this.selector;
    await this.page.evaluate((s) => {
      const instance = ($(s) as any).dxDataGrid('instance');
      instance.getController('errorHandling').showToastError('Error');
    }, sel);
  }

  async isFocusedRowInViewport(): Promise<boolean> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      const instance = ($(s) as any).dxDataGrid('instance');
      const rowsViewElement = instance.getView('rowsView').element();
      const rowsViewRect = rowsViewElement[0].getBoundingClientRect();
      const rowElement = rowsViewElement.find('.dx-row-focused');
      if (rowElement?.length) {
        const elementRect = rowElement[0].getBoundingClientRect();
        return elementRect.top >= rowsViewRect.top && elementRect.bottom <= rowsViewRect.bottom;
      }
      return false;
    }, sel);
  }

  async isVirtualRowIntersectViewport(): Promise<boolean> {
    const sel = this.selector;
    return this.page.evaluate((s) => {
      const instance = ($(s) as any).dxDataGrid('instance');
      const rowsViewElement = instance.getView('rowsView').element();
      const rowsViewRect = rowsViewElement[0].getBoundingClientRect();
      const virtualRowElements = rowsViewElement.find('.dx-virtual-row');
      for (let i = 0; i < virtualRowElements.length; i += 1) {
        const elRect = virtualRowElements[i].getBoundingClientRect();
        if ((elRect.top > rowsViewRect.top && elRect.top < rowsViewRect.bottom)
          || (elRect.bottom > rowsViewRect.top && elRect.bottom < rowsViewRect.bottom)
          || (elRect.top <= rowsViewRect.top && elRect.bottom >= rowsViewRect.bottom)) {
          return true;
        }
      }
      return false;
    }, sel);
  }

  async getFilterEditor(columnIndex: number): Promise<Locator> {
    return this.getFilterCell(columnIndex).locator(`.${CLASS.textEditorInput}`);
  }
}
