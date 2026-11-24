import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import GridCore, { CLASS as CLASS_BASE } from '../gridCore';
import Toolbar from '../toolbar';
import DataRow from './data/row';
import DataCell from './data/cell';
import FilterCell from './filter/cell';
import EditForm from './editForm';
import Headers from './headers';
import HeaderPanel from './headers/panel';
import AdaptiveDetailRow from './adaptiveDetailRow';

const CLASS = {
  ...CLASS_BASE,
  headers: 'headers',
  headerPanel: 'header-panel',
  dataRow: 'dx-data-row',
  focusedRow: 'dx-row-focused',
  gridView: 'content',
  fixedGridView: 'content-fixed',
  cellModified: 'dx-cell-modified',
  masterDetailRow: 'dx-master-detail-row',
  editFormRow: 'edit-form',
  button: 'dx-button',
  formButtonsContainer: 'form-buttons-container',
  popupEdit: 'edit-popup',
  adaptiveDetailRow: 'dx-adaptive-detail-row',
  errorRow: 'dx-error-row',
  overlayContent: 'dx-overlay-content',
  revertTooltip: 'revert-tooltip',
  invalidMessage: 'invalid-message',
  toolbar: 'dx-toolbar',
  dialogWrapper: 'dx-dialog-wrapper',
};

const E2E_ATTRIBUTES = {
  a11yStatusContainer: 'e2e-a11y-general-status-container',
};

interface ScrollOffset {
  top?: number;
  left?: number;
}

export interface VisibleRow {
  key: unknown;
  data: unknown;
  dataIndex: number;
  rowType: string;
  rowIndex: number;
}

export default abstract class GridBase extends GridCore {
  // A grid nested in a master-detail row has its own rows and headers: skip them.
  private ownElement(selector: string): Locator {
    return this.element.locator(`${selector}:not(:scope .${CLASS.masterDetailRow} *)`);
  }

  public getHeaders(): Headers {
    return new Headers(this.ownElement(`.${this.addWidgetPrefix(CLASS.headers)}`), this.getName());
  }

  public getDataRow(index: number): DataRow {
    const gridView = this.addWidgetPrefix(CLASS.gridView);
    const fixedGridView = this.addWidgetPrefix(CLASS.fixedGridView);

    return new DataRow(
      this.ownElement(`.${gridView}:not(.${fixedGridView}) .${CLASS.dataRow}[aria-rowindex='${index + 1}']`),
    );
  }

  public getFixedDataRow(index: number): DataRow {
    const fixedGridView = this.addWidgetPrefix(CLASS.fixedGridView);

    return new DataRow(
      this.ownElement(`.${fixedGridView} .${CLASS.dataRow}[aria-rowindex='${index + 1}']`),
    );
  }

  public getFocusedRow(): DataRow {
    const gridView = this.addWidgetPrefix(CLASS.gridView);
    const fixedGridView = this.addWidgetPrefix(CLASS.fixedGridView);

    return new DataRow(
      this.ownElement(`.${gridView}:not(.${fixedGridView}) .${CLASS.dataRow}.${CLASS.focusedRow}`),
    );
  }

  public getDataCell(rowIndex: number, columnIndex: number): DataCell {
    return this.getDataRow(rowIndex).getDataCell(columnIndex);
  }

  public getFixedDataCell(rowIndex: number, columnIndex: number): DataCell {
    return this.getFixedDataRow(rowIndex).getDataCell(columnIndex);
  }

  public getAdaptiveRow(index: number): AdaptiveDetailRow {
    return new AdaptiveDetailRow(this.element.locator(`.${CLASS.adaptiveDetailRow}`).nth(index));
  }

  public getModifiedCells(): Locator {
    return this.element.locator(`.${CLASS.cellModified}`);
  }

  public getErrorRow(): Locator {
    return this.element.locator(`.${CLASS.errorRow}`);
  }

  public getFilterCell(columnIndex: number): FilterCell {
    return this.getHeaders().getFilterRow().getFilterCell(columnIndex);
  }

  public getFilterEditor<T>(
    columnIndex: number,
    EditorType: new (page: Page, element: Locator) => T,
  ): T {
    return this.getFilterCell(columnIndex).getEditor<T>(EditorType);
  }

  public getDialog(): Locator {
    return this.body.locator(`.${CLASS.dialogWrapper}`);
  }

  public getRevertTooltip(): Locator {
    return this.body.locator(`.${this.addWidgetPrefix(CLASS.revertTooltip)}`);
  }

  public getInvalidMessageTooltip(): Locator {
    return this.body.locator(`.dx-${CLASS.invalidMessage}.dx-${CLASS.invalidMessage}-always.${this.addWidgetPrefix(CLASS.invalidMessage)}`);
  }

  public getEditForm(): EditForm {
    const element = this.element.locator(`.${this.addWidgetPrefix(CLASS.editFormRow)}`);
    const buttons = element.locator(`.${this.addWidgetPrefix(CLASS.formButtonsContainer)} .${CLASS.button}`);

    return new EditForm(element, buttons);
  }

  public getPopupEditForm(): EditForm {
    const element = this.page.locator(`.${this.addWidgetPrefix(CLASS.popupEdit)} .${CLASS.overlayContent}`);
    const buttons = element.locator(`.${CLASS.toolbar} .${CLASS.button}`);

    return new EditForm(element, buttons);
  }

  public getHeaderPanel(): HeaderPanel {
    return new HeaderPanel(
      this.element.locator(`.${this.addWidgetPrefix(CLASS.headerPanel)}`),
      this.getName(),
    );
  }

  public getToolbar(): Toolbar {
    return new Toolbar(this.page, this.element.locator(`.${CLASS.toolbar}`));
  }

  public getGeneralStatusContainer(): Locator {
    return this.element.locator(`[${E2E_ATTRIBUTES.a11yStatusContainer}="true"]`);
  }

  private hasScrollable(): Promise<boolean> {
    return this.element.evaluate(
      (element, widgetName) => Boolean($(element).data(widgetName).getScrollable()),
      this.getName(),
    );
  }

  public async scrollTo(offset: ScrollOffset): Promise<void> {
    await expect.poll(() => this.hasScrollable()).toBe(true);
    await this.element.evaluate(
      (element, { widgetName, options }) => {
        $(element).data(widgetName).getScrollable().scrollTo(options);
      },
      { widgetName: this.getName(), options: offset },
    );
  }

  public getScrollTop(): Promise<number> {
    return this.element.evaluate(
      (element, widgetName) => $(element).data(widgetName).getScrollable().scrollTop(),
      this.getName(),
    );
  }

  public isFocusedRowInViewport(): Promise<boolean> {
    return this.element.evaluate((element, { widgetName, focusedRowClass }) => {
      const rowsView: HTMLElement = $(element).data(widgetName).getView('rowsView').element()[0];
      const focusedRow = rowsView.querySelector(`.${focusedRowClass}`);

      if (!focusedRow) {
        return false;
      }

      const rowsViewRect = rowsView.getBoundingClientRect();
      const rowRect = focusedRow.getBoundingClientRect();
      const tolerance = 1;

      return rowRect.top >= rowsViewRect.top - tolerance
        && rowRect.bottom <= rowsViewRect.bottom + tolerance;
    }, { widgetName: this.getName(), focusedRowClass: CLASS.focusedRow });
  }

  public async scrollBy(offset: ScrollOffset): Promise<void> {
    await expect.poll(() => this.hasScrollable()).toBe(true);
    await this.element.evaluate(
      (element, { widgetName, options }) => {
        $(element).data(widgetName).getScrollable().scrollBy(options);
      },
      { widgetName: this.getName(), options: offset },
    );
  }

  public async apiEditRow(rowIndex: number): Promise<void> {
    await this.invoke('editRow', rowIndex);
  }

  public async apiDeleteRow(rowIndex: number): Promise<void> {
    await this.invoke('deleteRow', rowIndex);
  }

  public async apiExpandAdaptiveDetailRow(key: unknown): Promise<void> {
    await this.invoke('expandAdaptiveDetailRow', key);
  }

  public async apiSaveEditData(): Promise<void> {
    await this.invoke('saveEditData');
  }

  public async apiEditCell(rowIndex: number, columnIndex: number): Promise<void> {
    await this.invoke('editCell', rowIndex, columnIndex);
  }

  public async apiCellValue<T>(rowIndex: number, columnIndex: number, value: T): Promise<void> {
    await this.invoke('cellValue', rowIndex, columnIndex, value);
  }

  public async apiAddRow(): Promise<void> {
    await this.invoke('addRow');
  }

  public async apiCancelEditData(): Promise<void> {
    await this.invoke('cancelEditData');
  }

  public async apiNavigateToRow(key: unknown): Promise<void> {
    await this.invoke('navigateToRow', key);
  }

  public apiGetTopVisibleRowKey(): Promise<unknown> {
    return this.element.evaluate((element, widgetName) => {
      const grid = $(element).data(widgetName);

      return grid.keyOf(grid.getTopVisibleRowData());
    }, this.getName());
  }

  public apiTotalCount(): Promise<number> {
    return this.invoke('totalCount');
  }

  public apiGetVisibleRows(): Promise<VisibleRow[]> {
    return this.element.evaluate(
      (element, widgetName) => $(element).data(widgetName).getVisibleRows().map((row) => ({
        key: row.key,
        data: row.data,
        dataIndex: row.dataIndex,
        rowType: row.rowType,
        rowIndex: row.rowIndex,
      })),
      this.getName(),
    );
  }

  public async apiPush(changes: unknown[]): Promise<void> {
    await this.element.evaluate(
      (element, { widgetName, values }) => {
        const dataSource = $(element).data(widgetName).getDataSource();

        dataSource.store().push(values);
      },
      { widgetName: this.getName(), values: changes },
    );
  }
}
