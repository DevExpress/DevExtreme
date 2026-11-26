import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import GridCore, { CLASS as CLASS_BASE } from '../gridCore';
import Toolbar from '../toolbar';
import Popup from '../popup';
import ContextMenu from '../contextMenu';
import DataRow from './data/row';
import DataCell from './data/cell';
import FilterCell from './filter/cell';
import EditForm from './editForm';
import Headers from './headers';
import HeaderPanel from './headers/panel';
import AdaptiveDetailRow from './adaptiveDetailRow';
import MasterRow from './masterRow';
import GroupRow from './groupRow';
import Overlay from './overlay';
import AIAssistantChat from './aiAssistantChat';

const CLASS = {
  ...CLASS_BASE,
  headers: 'headers',
  headerPanel: 'header-panel',
  rowsView: 'rowsview',
  dataRow: 'dx-data-row',
  focusedRow: 'dx-row-focused',
  gridView: 'content',
  fixedGridView: 'content-fixed',
  cellModified: 'dx-cell-modified',
  masterDetailRow: 'dx-master-detail-row',
  groupRow: 'dx-group-row',
  groupFooterRow: 'group-footer',
  freeSpaceRow: 'dx-freespace-row',
  summaryItem: 'summary-item',
  focusOverlay: 'focus-overlay',
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
  overlayWrapper: 'dx-overlay-wrapper',
  revertButton: 'dx-revert-button',
  popup: 'dx-popup',
  contextMenu: 'dx-context-menu',
  fieldItemContent: 'dx-field-item-content',
  textEditorInput: 'dx-texteditor-input',
  aiAssistantButton: 'ai-assistant-button',
  aiAssistantConfirmDialog: 'ai-assistant-confirm-dialog',
  aiChat: 'dx-ai-chat',
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

  public getRowsView(): Locator {
    return this.ownElement(`.${this.addWidgetPrefix(CLASS.rowsView)}`);
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

  public getDataRows(): Locator {
    const gridView = this.addWidgetPrefix(CLASS.gridView);
    const fixedGridView = this.addWidgetPrefix(CLASS.fixedGridView);

    return this.ownElement(`.${gridView}:not(.${fixedGridView}) .${CLASS.dataRow}`);
  }

  public getGroupRow(index: number): GroupRow {
    const gridView = this.addWidgetPrefix(CLASS.gridView);
    const fixedGridView = this.addWidgetPrefix(CLASS.fixedGridView);

    return new GroupRow(
      this.ownElement(`.${gridView}:not(.${fixedGridView}) .${CLASS.groupRow}`).nth(index),
    );
  }

  public getGroupFooterRow(index: number): Locator {
    const gridView = this.addWidgetPrefix(CLASS.gridView);
    const fixedGridView = this.addWidgetPrefix(CLASS.fixedGridView);

    return this.ownElement(
      `.${gridView}:not(.${fixedGridView}) .${this.addWidgetPrefix(CLASS.groupFooterRow)}`,
    ).nth(index);
  }

  public getFreeSpaceRow(): Locator {
    const gridView = this.addWidgetPrefix(CLASS.gridView);
    const fixedGridView = this.addWidgetPrefix(CLASS.fixedGridView);

    return this.ownElement(`.${gridView}:not(.${fixedGridView}) .${CLASS.freeSpaceRow}`);
  }

  public getSummaryItem(index: number): Locator {
    return this.ownElement(`.${this.addWidgetPrefix(CLASS.summaryItem)}`).nth(index);
  }

  public getFocusOverlay(): Locator {
    return this.ownElement(`.${this.addWidgetPrefix(CLASS.focusOverlay)}`);
  }

  public getMasterRow(index: number): MasterRow {
    return new MasterRow(this.ownElement(`.${CLASS.masterDetailRow}`).nth(index));
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

  public getOverlay(): Overlay {
    return new Overlay(this.element.locator(`.${CLASS.overlayWrapper}`), this.getName());
  }

  public getRevertButton(): Locator {
    return this.element.locator(`.${CLASS.revertButton}`);
  }

  public getRevertTooltip(): Locator {
    return this.body.locator(`.${this.addWidgetPrefix(CLASS.revertTooltip)}`);
  }

  public getInvalidMessageTooltip(): Locator {
    return this.body.locator(`.dx-${CLASS.invalidMessage}.dx-${CLASS.invalidMessage}-always.${this.addWidgetPrefix(CLASS.invalidMessage)}`);
  }

  public getFormItemElement(index: number): Locator {
    return this.element.locator(`.${CLASS.fieldItemContent}`).nth(index);
  }

  public getFormItemEditor(index: number): Locator {
    return this.getFormItemElement(index).locator(`.${CLASS.textEditorInput}`);
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

  // The popup widget, not its wrapper, which carries the same class.
  public getEditPopup(): Popup {
    return new Popup(
      this.page,
      this.element.locator(`.${this.addWidgetPrefix(CLASS.popupEdit)}.${CLASS.popup}`),
    );
  }

  public getHeaderPanel(): HeaderPanel {
    return new HeaderPanel(
      this.element.locator(`.${this.addWidgetPrefix(CLASS.headerPanel)}`),
      this.getName(),
    );
  }

  // The menu renders its items into an overlay in the body, which carries the grid's class.
  public getContextMenu(): ContextMenu {
    return new ContextMenu(this.page, this.body.locator(`.${CLASS.contextMenu}.${this.addWidgetPrefix()}`));
  }

  public getAIAssistantButton(): Locator {
    return this.getHeaderPanel().element.locator(`.${this.addWidgetPrefix(CLASS.aiAssistantButton)}`);
  }

  public getAIAssistantChat(): AIAssistantChat {
    return new AIAssistantChat(
      this.page,
      this.body.locator(`.${CLASS.overlayWrapper}.${CLASS.aiChat}`),
      this.addWidgetPrefix(CLASS.aiAssistantConfirmDialog),
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

  public getScrollLeft(): Promise<number> {
    return this.element.evaluate(
      (element, widgetName) => $(element).data(widgetName).getScrollable().scrollLeft(),
      this.getName(),
    );
  }

  public isScrolledToBottom(): Promise<boolean> {
    return this.element.evaluate((element, widgetName) => {
      const scrollable = $(element).data(widgetName).getScrollable();
      const tolerance = 1;

      if (!scrollable) {
        return false;
      }

      return scrollable.scrollHeight() - scrollable.clientHeight() - scrollable.scrollTop()
        <= tolerance;
    }, this.getName());
  }

  public isScrolledToRight(): Promise<boolean> {
    return this.element.evaluate((element, widgetName) => {
      const scrollable = $(element).data(widgetName).getScrollable();
      const tolerance = 1;

      if (!scrollable) {
        return false;
      }

      return scrollable.scrollWidth() - scrollable.clientWidth() - scrollable.scrollLeft()
        <= tolerance;
    }, this.getName());
  }

  public getScrollbarWidth(isHorizontal: boolean): Promise<number> {
    return this.element.evaluate(
      (element, { widgetName, horizontal }) => $(element).data(widgetName)
        .getView('rowsView').getScrollbarWidth(horizontal),
      { widgetName: this.getName(), horizontal: isHorizontal },
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

  // A virtual grid can render the rows of a new scroll position a moment after the scroll.
  public isViewportRowsRenderPending(): Promise<boolean> {
    return this.element.evaluate(
      (element, widgetName) => $(element).data(widgetName).getView('rowsView').isViewportRowsRenderPending(),
      this.getName(),
    );
  }

  // Some actions make the grid load and render its content again a moment later, such as a header
  // click that sorts.
  public async waitForContentReady(action: () => Promise<unknown>): Promise<void> {
    const rendered = await this.element.evaluateHandle((element, widgetName) => {
      const grid = $(element).data(widgetName);

      return {
        promise: new Promise<void>((resolve) => {
          const handler = (): void => {
            grid.off('contentReady', handler);
            resolve();
          };

          grid.on('contentReady', handler);
        }),
      };
    }, this.getName());

    await action();
    await rendered.evaluate(({ promise }) => promise);
    await rendered.dispose();
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

  public async apiFocus(target: Locator): Promise<void> {
    const targetHandle = await target.elementHandle();

    await this.element.evaluate((element, { widgetName, targetElement }) => {
      $(element).data(widgetName).focus(targetElement);
    }, { widgetName: this.getName(), targetElement: targetHandle });
  }

  public apiGetTopVisibleRowKey(): Promise<unknown> {
    return this.element.evaluate((element, widgetName) => {
      const grid = $(element).data(widgetName);

      return grid.keyOf(grid.getTopVisibleRowData());
    }, this.getName());
  }

  public apiGetCellValue(rowIndex: number, columnIndex: number): Promise<unknown> {
    return this.invoke('cellValue', rowIndex, columnIndex);
  }

  public apiGetCellValidationStatus(rowIndex: number, columnIndex: number): Promise<string | null> {
    return this.element.evaluate((element, { widgetName, row, column }) => {
      const grid = $(element).data(widgetName);
      const result = grid.getController('validating').getCellValidationResult({
        rowKey: grid.getKeyByRowIndex(row),
        columnIndex: column,
      });

      return result ? result.status : null;
    }, { widgetName: this.getName(), row: rowIndex, column: columnIndex });
  }

  public async apiPageIndex(pageIndex: number): Promise<void> {
    await this.invoke('pageIndex', pageIndex);
  }

  public apiTotalCount(): Promise<number> {
    return this.invoke('totalCount');
  }

  public apiState(): Promise<unknown> {
    return this.invoke('state');
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
