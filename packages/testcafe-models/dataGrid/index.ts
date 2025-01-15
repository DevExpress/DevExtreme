import { ClientFunction, Selector } from 'testcafe';
import DataGridInstance from 'devextreme/ui/data_grid';
import type { SelectionSensitivity } from 'devextreme/ui/data_grid';
import Toolbar from '../toolbar';
import DataRow from './data/row';
import GroupRow from './groupRow';
import FilterPanel from './filter/panel';
import EditForm from './editForm';
import HeaderPanel from './headers/panel';
import DataCell from './data/cell';
import Headers from './headers';
import ContextMenu from '../contextMenu';

import type { WidgetName } from '../types';
import { Overlay } from './overlay';
// eslint-disable-next-line import/no-cycle
import MasterRow from './masterRow';
import AdaptiveDetailRow from './adaptiveDetailRow';
import ColumnChooser from './columnChooser';
import TextBox from '../textBox';
import { GroupPanel } from './groupPanel';
import GridCore from '../gridCore';
import { CLASS as CLASS_BASE } from '../gridCore';

export const CLASS = {
  ...CLASS_BASE,
  dataGrid: 'dx-datagrid',
  headers: 'headers',
  headerPanel: 'header-panel',
  searchBox: 'dx-searchbox',
  dataRow: 'dx-data-row',
  groupRow: 'dx-group-row',
  groupPanel: 'group-panel',
  columnChooser: 'column-chooser',
  focusedRow: 'dx-row-focused',
  filterPanel: 'filter-panel',
  filterRow: 'filter-row',
  filterRangeOverlay: 'filter-range-overlay',
  focusOverlay: 'focus-overlay',
  editFormRow: 'edit-form',
  button: 'dx-button',
  formButtonsContainer: 'form-buttons-container',
  popupEdit: 'edit-popup',
  masterDetailRow: 'dx-master-detail-row',
  adaptiveDetailRow: 'dx-adaptive-detail-row',
  errorRow: 'dx-error-row',

  headerRow: 'dx-header-row',
  footerRow: 'dx-footer-row',
  groupFooterRow: 'group-footer',
  freeSpaceRow: 'dx-freespace-row',

  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  loadPanelWrapper: 'dx-loadpanel-wrapper',
  revertTooltip: 'revert-tooltip',
  invalidMessage: 'invalid-message',

  toolbar: 'dx-toolbar',
  contextMenu: 'dx-context-menu',
  fixedGridView: 'content-fixed',
  rowsView: 'rowsview',
  revertButton: 'dx-revert-button',
  columnChooserButton: 'column-chooser-button',
  fieldItemContent: 'dx-field-item-content',
  textEditorInput: 'dx-texteditor-input',
  commandDrag: 'dx-command-drag',
  dialogWrapper: 'dx-dialog-wrapper',
  summaryTotal: 'dx-datagrid-summary-item',
  scrollableContainer: 'dx-scrollable-container',
};

const E2E_ATTRIBUTES = {
  a11yStatusContainer: 'e2e-a11y-general-status-container',
  summaryCellStatusContainer: 'e2e-a11y-summary-cell-status-container',
};

const triggerPointerDown = ($element: JQuery<any>, x: number, y: number) => {
  $element
    .trigger($.Event('dxpointerdown', {
      pageX: x,
      pageY: y,
      pointers: [{ pointerId: 1 }],
    }));
}

const triggerPointerMove = ($element: JQuery<any>, x: number, y: number) => {
  $element
    .trigger($.Event('dxpointermove', {
      pageX: x,
      pageY: y,
      pointers: [{ pointerId: 1 }],
    }));
}

const triggerPointerUp = ($element: JQuery<any>, x: number, y: number) => {
  $element
    .trigger($.Event('dxpointerup', {
      pageX: x,
      pageY: y,
      pointers: [{ pointerId: 1 }],
    }));
}

const moveElement = ($element: JQuery, x: number, y: number, isStart = false): void => {
  if ($element?.length) {
    const offset = $element.offset();

    if (offset) {
      if (isStart) {
        $element
          .trigger($.Event('dxpointerdown', {
            pageX: offset.left,
            pageY: offset.top,
            pointers: [{ pointerId: 1 }],
          }));
      }

      $element
        .trigger($.Event('dxpointermove', {
          pageX: offset.left + x,
          pageY: offset.top + y,
          pointers: [{ pointerId: 1 }],
        }));
    }
  }
};

export default class DataGrid extends GridCore {
  dataRows: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.dataRows = this.element.find(`.${CLASS.dataRow}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxDataGrid'; }

  getContainer(): Selector {
    return this.element.find(`.${CLASS.dataGrid}`);
  }

  getHeaders(): Headers {
    return new Headers(this.element.find(`.${this.addWidgetPrefix(CLASS.headers)}`), this.getName());
  }

  getRowsView(): Selector {
    return this.element.find(`.${this.addWidgetPrefix(CLASS.rowsView)}`);
  }

  getScrollContainer(): Selector {
    return this.getRowsView().find(`.${CLASS.scrollableContainer}`);
  }

  getDataRow(index: number): DataRow {
    return new DataRow(this.element.find(`.${CLASS.dataRow}[aria-rowindex='${index + 1}']`), this.getName());
  }

  getMasterRow(index: number): MasterRow {
    return new MasterRow(this.element.find(`.${CLASS.masterDetailRow}`).nth(index));
  }

  getFormItemElement(index: number): Selector {
    return this.element.find(`.${CLASS.fieldItemContent}`).nth(index);
  }

  getFormItemEditor(index: number): Selector {
    return this.getFormItemElement(index).find(`.${CLASS.textEditorInput}`);
  }

  getFixedDataRow(index: number): DataRow {
    return new DataRow(this.element.find(`.${this.addWidgetPrefix(CLASS.fixedGridView)} .${CLASS.dataRow}[aria-rowindex='${index + 1}']`), this.getName());
  }

  getDataCell(rowIndex: number, columnIndex: number): DataCell {
    return this.getDataRow(rowIndex).getDataCell(columnIndex);
  }

  getFixedDataCell(rowIndex: number, columnIndex: number): DataCell {
    return this.getFixedDataRow(rowIndex).getDataCell(columnIndex);
  }

  getGroupRowSelector(): Selector {
    return this.element.find(`.${CLASS.groupRow}`);
  }

  getGroupRow(index: number): GroupRow {
    return new GroupRow(this.element.find(`.${CLASS.groupRow}`).nth(index), this.getName());
  }

  getAdaptiveRow(index: number): AdaptiveDetailRow {
    return new AdaptiveDetailRow(this.element.find(`.${CLASS.adaptiveDetailRow}`).nth(index));
  }

  getFocusedRow(): Selector {
    return this.dataRows.filter(`.${CLASS.focusedRow}`);
  }

  getErrorRow(): Selector {
    return this.element.find(`.${CLASS.errorRow}`);
  }

  getFilterPanel(): FilterPanel {
    return new FilterPanel(this.element.find(`.${this.addWidgetPrefix(CLASS.filterPanel)}`), this.getName());
  }

  getFilterRow(): Selector {
    return this.element.find(`.${this.addWidgetPrefix(CLASS.filterRow)}`);
  }

  getFilterCell(columnIndex: number): Selector {
    return this.getFilterRow().find(`[aria-colindex='${columnIndex + 1}']`);
  }

  getFilterRangeOverlay(): Selector {
    return this.body.find(`.${this.addWidgetPrefix(CLASS.filterRangeOverlay)}`);
  }
  getFocusOverlay() {
    return this.body.find(`.${this.addWidgetPrefix(CLASS.focusOverlay)}`);
  }

  getFilterEditor<T>(
    columnIndex: number,
    EditorType: new(mainElement: Selector) => T,
  ): T {
    return new EditorType(this.getHeaders().getFilterRow().getFilterCell(columnIndex).getEditor());
  }

  getSearchBox(): TextBox {
    return new TextBox(this.element.find(`.${CLASS.searchBox}`));
  }

  getOverlay(): Overlay {
    return new Overlay(this.element.find(`.${CLASS.overlayWrapper}`));
  }

  getLoadPanel(): Overlay {
    return new Overlay(this.element.find(`.${CLASS.loadPanelWrapper}`));
  }

  getConfirmDeletionButton(): Selector {
    return this.body.find('[aria-label=\'Yes\']');
  }

  getDialog(): Selector {
    return this.body.find(`.${CLASS.dialogWrapper}`);
  }

  getCancelDeletionButton(): Selector {
    return this.body.find('[aria-label=\'No\']');
  }

  getRevertTooltip(): Selector {
    return this.body.find(`.${this.addWidgetPrefix(CLASS.revertTooltip)}`);
  }

  getInvalidMessageTooltip(): Selector {
    return this.body.find(`.dx-${CLASS.invalidMessage}.dx-${CLASS.invalidMessage}-always.${this.addWidgetPrefix(CLASS.invalidMessage)}`);
  }

  getFooterRow(): Selector {
    return this.element.find(`.${CLASS.footerRow}`);
  }

  getGroupFooterRow(): Selector {
    return this.element.find(`.${CLASS.dataGrid}-${CLASS.groupFooterRow}`);
  }

  getFreeSpaceRow(): Selector {
    return this.element.find(`.${CLASS.freeSpaceRow}`);
  }

  getColumnChooser(): ColumnChooser {
    return new ColumnChooser(this.body.find(`.${this.addWidgetPrefix(CLASS.columnChooser)}`));
  }

  getGroupPanel(): GroupPanel {
    return new GroupPanel(this.body.find(`.${this.addWidgetPrefix(CLASS.groupPanel)}`));
  }

  getContextMenu(): ContextMenu {
    return new ContextMenu(this.body.find(`.${CLASS.contextMenu}.${this.addWidgetPrefix()}`));
  }

  async scrollTo(
    t: TestController,
    options: { x?: number; y?: number; top?: number },
  ): Promise<void> {
    await t.expect(this.hasScrollable()).ok();

    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).getScrollable().scrollTo(options),
      { dependencies: { getInstance, options } },
    )();
  }

  hasScrollable(): Promise<boolean> {
    const { getInstance } = this;

    return ClientFunction(
      () => Boolean((getInstance() as any).getScrollable()),
      { dependencies: { getInstance } },
    )();
  }

  isReady(): Promise<boolean> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).isReady(),
      { dependencies: { getInstance } },
    )();
  }

  scrollBy(options: { x?: number; y?: number; top?: number; left?: number }): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).getScrollable().scrollBy(options),
      { dependencies: { getInstance, options } },
    )();
  }

  getScrollLeft(): Promise<number> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).getScrollable().scrollLeft(),
      { dependencies: { getInstance } },
    )();
  }

  getScrollRight(): Promise<number> {
    const { getInstance } = this;
    return ClientFunction(() => {
      const dataGrid = getInstance() as any;
      const scrollable = dataGrid.getScrollable();
      return scrollable.scrollWidth() - scrollable.clientWidth() - scrollable.scrollLeft();
    }, { dependencies: { getInstance } })();
  }

  getScrollWidth(): Promise<number> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).getScrollable().scrollWidth(),
      { dependencies: { getInstance } },
    )();
  }

  getScrollTop(): Promise<number> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).getScrollable().scrollTop(),
      { dependencies: { getInstance } },
    )();
  }

  getScrollbarWidth(isHorizontal: boolean): Promise<number> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).getView('rowsView').getScrollbarWidth(isHorizontal),
      { dependencies: { getInstance, isHorizontal } },
    )();
  }

  getEditForm(): EditForm {
    const editFormRowClass = this.addWidgetPrefix(CLASS.editFormRow);
    const element = this.element ? this.element.find(`.${editFormRowClass}`) : Selector(`.${editFormRowClass}`);
    const buttons = element.find(`.${this.addWidgetPrefix(CLASS.formButtonsContainer)} .${CLASS.button}`);

    return new EditForm(element, buttons);
  }

  getPopupEditForm(): EditForm {
    const element = Selector(`.${this.addWidgetPrefix(CLASS.popupEdit)} .${CLASS.overlayContent}`);
    const buttons = element.find(`.${CLASS.toolbar} .${CLASS.button}`);

    return new EditForm(element, buttons);
  }

  getToolbar(): Toolbar {
    return new Toolbar(this.element.find(`.${CLASS.toolbar}`));
  }

  getHeaderPanel(): HeaderPanel {
    return new HeaderPanel(this.element.find(`.${this.addWidgetPrefix(CLASS.headerPanel)}`), this.getName());
  }

  getRevertButton(): Selector {
    return this.element.find(`.${CLASS.revertButton}`);
  }

  getColumnChooserButton(): Selector {
    return this.element.find(`.${this.addWidgetPrefix(CLASS.columnChooserButton)}`);
  }

  apiClearFilter(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).clearFilter(),
      { dependencies: { getInstance } },
    )();
  }

  apiColumnOption(id: string, name: string, value: any = 'empty'): Promise<any> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const dataGrid = getInstance() as any;
        return value !== 'empty' ? dataGrid.columnOption(id, name, value === 'undefined' ? undefined : value) : dataGrid.columnOption(id, name);
      },
      {
        dependencies: {
          getInstance, id, name, value,
        },
      },
    )();
  }

  apiAddRow(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).addRow(),
      { dependencies: { getInstance } },
    )();
  }

  apiEditRow(rowIndex: number): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).editRow(rowIndex),
      { dependencies: { getInstance, rowIndex } },
    )();
  }

  apiDeleteRow(rowIndex: number): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).deleteRow(rowIndex),
      { dependencies: { getInstance, rowIndex } },
    )();
  }

  apiExpandRow(key: unknown): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).expandRow(key),
      { dependencies: { getInstance, key } },
    )();
  }

  apiCollapseRow(key: unknown): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).collapseRow(key),
      { dependencies: { getInstance, key } },
    )();
  }

  apiExpandAdaptiveDetailRow(key: unknown): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).expandAdaptiveDetailRow(key),
      { dependencies: { getInstance, key } },
    )();
  }

  apiCancelEditData(): Promise<void> {
    const { getInstance } = this;
    return ClientFunction(
      () => (getInstance() as any).cancelEditData(),
      { dependencies: { getInstance } },
    )();
  }

  apiSaveEditData(): Promise<void> {
    const { getInstance } = this;
    return ClientFunction(
      () => (getInstance() as any).saveEditData(),
      { dependencies: { getInstance } },
    )();
  }

  apiEditCell(rowIndex: number, columnIndex: number): Promise<void> {
    const { getInstance } = this;
    return ClientFunction(
      () => (getInstance() as any).editCell(rowIndex, columnIndex),
      { dependencies: { getInstance, rowIndex, columnIndex } },
    )();
  }

  apiCellValue<T>(rowIndex: number, columnIndex: number, value: T): Promise<void> {
    const { getInstance } = this;
    return ClientFunction(
      () => (getInstance() as any).cellValue(rowIndex, columnIndex, value),
      {
        dependencies: {
          getInstance, rowIndex, columnIndex, value,
        },
      },
    )();
  }

  apiGetCellValue(rowIndex: number, columnIndex: number): Promise<string> {
    const { getInstance } = this;
    return ClientFunction(
      () => (getInstance() as any).cellValue(rowIndex, columnIndex),
      { dependencies: { getInstance, rowIndex, columnIndex } },
    )();
  }

  apiGetCellValidationStatus(rowIndex: number, columnIndex: number): Promise<any> {
    const { getInstance } = this;
    return ClientFunction(() => {
      const dataGrid = getInstance() as any;
      const result = dataGrid.getController('validating').getCellValidationResult({ rowKey: dataGrid.getKeyByRowIndex(rowIndex), columnIndex });
      return result ? result.status : null;
    }, { dependencies: { getInstance, rowIndex, columnIndex } })();
  }

  apiGetVisibleRows(): Promise<any> {
    const { getInstance } = this;
    return ClientFunction(() => {
      const dataGrid = getInstance() as any;
      return dataGrid.getVisibleRows().map((r) => ({
        key: r.key,
        rowType: r.rowType,
      }));
    }, { dependencies: { getInstance } })();
  }

  apiGetTopVisibleRowData(): Promise<any> {
    const { getInstance } = this;
    return ClientFunction(() => {
      const dataGrid = getInstance() as any;
      return dataGrid.getTopVisibleRowData();
    }, { dependencies: { getInstance } })();
  }

  apiUpdateDimensions(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).updateDimensions(),
      {
        dependencies: {
          getInstance,
        },
      },
    )();
  }

  apiExpandAllGroups(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).option('grouping.autoExpandAll', true),
      {
        dependencies: {
          getInstance,
        },
      },
    )();
  }

  apiExpandAll(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).expandAll(),
      {
        dependencies: {
          getInstance,
        },
      },
    )();
  }

  apiCollapseAllGroups(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as DataGridInstance).option('grouping.autoExpandAll', false),
      {
        dependencies: {
          getInstance,
        },
      },
    )();
  }

  apiBeginCustomLoading(messageText: string): Promise<void> {
    const { getInstance } = this;
    return ClientFunction(
      () => {
        (getInstance() as DataGridInstance).beginCustomLoading(messageText);
      },
      { dependencies: { getInstance, messageText } },
    )();
  }

  apiRefresh(): Promise<void> {
    const { getInstance } = this;
    return ClientFunction(
      () => {
        (getInstance() as DataGridInstance).refresh().catch(() => {});
      },
      { dependencies: { getInstance } },
    )();
  }

  apiToggleKeyboardNavigation(value: boolean): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as DataGridInstance).option('keyboardNavigation.enabled', value),
      {
        dependencies: {
          getInstance,
          value,
        },
      },
    )();
  }

  apiPush(values: any[]): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as DataGridInstance).getDataSource().store().push(values),
      {
        dependencies: {
          getInstance, values
        },
      },
    )();
  }
  moveRow(rowIndex: number, x: number, y: number, isStart = false): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const gridInstance = getInstance() as any;
        const $row = $(gridInstance.getRowElement(rowIndex));
        let $dragElement = $row.children('.dx-command-drag');

        $dragElement = $dragElement.length ? $dragElement : $row;

        moveElement($dragElement, x, y, isStart);
      },
      {
        dependencies: {
          getInstance, rowIndex, x, y, isStart, moveElement,
        },
      },
    )();
  }

  resizeHeader(columnIndex: number, offset: number, needToTriggerPointerUp = true): Promise<void>  {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const gridInstance = getInstance() as any;
        const $gridElement = $(gridInstance.element());
        const columnHeadersView = gridInstance.getView('columnHeadersView');
        const $header = $(columnHeadersView.getHeaderElement(columnIndex));
        const headerOffset = $header.offset();
        const offsetX = headerOffset.left;

        triggerPointerMove($(document), offsetX, headerOffset.top + 1);
        triggerPointerDown($gridElement, offsetX, headerOffset.top + 1);
        triggerPointerMove($(document), offsetX + offset, headerOffset.top + 1);

        if (needToTriggerPointerUp) {
          triggerPointerUp($(document), offsetX + offset, headerOffset.top + 1);
        }
      },
      {
        dependencies: {
          getInstance,
          triggerPointerDown,
          triggerPointerMove,
          triggerPointerUp,
          columnIndex,
          offset,
          needToTriggerPointerUp,
        },
      },
    )();
  }

  moveHeader(columnIndex: number, x: number, y: number, isStart = false): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const gridInstance = getInstance() as any;
        const columnHeadersView = gridInstance.getView('columnHeadersView');
        const $header = $(columnHeadersView.getHeaderElement(columnIndex));

        moveElement($header, x, y, isStart);
      },
      {
        dependencies: {
          getInstance, columnIndex, x, y, isStart, moveElement,
        },
      },
    )();
  }

  moveColumnChooserColumn(columnIndex: number, x: number, y: number, isStart = false): Promise<void> {
    const columnChooser = this.getColumnChooser();
    const column = columnChooser.getColumn(columnIndex);

    return ClientFunction(
      (column) => {
        const $column = $(column());

        moveElement($column, x, y, isStart);
      },
      {
        dependencies: {
          column, x, y, isStart, moveElement,
        },
      },
    )(column);
  }

  hide(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const gridInstance = getInstance() as any;
        const $gridElement = $(gridInstance.element());

        $gridElement.hide();
      },
      { dependencies: { getInstance } },
    )();
  }

  show(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const gridInstance = getInstance() as any;
        const $gridElement = $(gridInstance.element());

        $gridElement.show();
      },
      { dependencies: { getInstance } },
    )();
  }

  isVirtualRowIntersectViewport(): Promise<boolean> {
    const { getInstance } = this;

    return ClientFunction(() => {
      let result = false;
      const gridInstance = getInstance() as any;
      const rowsViewElement = gridInstance.getView('rowsView').element();
      const isElementIntersectRowsView = (element) => {
        const rowsViewRect = rowsViewElement[0].getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        return (elementRect.top > rowsViewRect.top && elementRect.top < rowsViewRect.bottom)
          || (elementRect.bottom > rowsViewRect.top && elementRect.bottom < rowsViewRect.bottom)
          || (elementRect.top <= rowsViewRect.top && elementRect.bottom >= rowsViewRect.bottom);
      };
      const virtualRowElements = rowsViewElement.find('.dx-virtual-row');

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < virtualRowElements.length; i += 1) {
        result = isElementIntersectRowsView(virtualRowElements[i]);
        if (result) {
          break;
        }
      }

      return result;
    }, {
      dependencies: {
        getInstance,
      },
    })();
  }

  isFocusedRowInViewport(): Promise<boolean> {
    const { getInstance } = this;

    return ClientFunction(() => {
      let result = false;
      const gridInstance = getInstance() as any;
      const rowsViewElement = gridInstance.getView('rowsView').element();
      const isElementInRowsView = (element) => {
        const rowsViewRect = rowsViewElement[0].getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        return elementRect.top >= rowsViewRect.top && elementRect.bottom <= rowsViewRect.bottom;
      };
      const rowElement = rowsViewElement.find('.dx-row-focused');

      if (rowElement?.length) {
        result = isElementInRowsView(rowElement[0]);
      }

      return result;
    }, {
      dependencies: {
        getInstance,
      },
    })();
  }

  getScrollBarThumbTrack(scrollbarPosition: string): Selector {
    return this.getRowsView().find(`.dx-scrollbar-${scrollbarPosition.toLowerCase()} .dx-scrollable-scroll`);
  }

  getGeneralStatusContainer(): Selector {
    return this.element().find(`[${E2E_ATTRIBUTES.a11yStatusContainer}="true"]`);
  }

  getSummaryCellStatusContainer(nth = 0): Selector {
    return this.element().find(`[${E2E_ATTRIBUTES.summaryCellStatusContainer}="true"]`).nth(nth);
  }

  getSummaryTotalElement(nth = 0): Selector {
    return this.element().find(`.${CLASS.summaryTotal}`).nth(nth);
  }

  apiChangeSensitivity(
    sensitivity: SelectionSensitivity,
  ): Promise<void> {
    const { getInstance } = this;
    return ClientFunction(
        () => {
          (getInstance() as DataGridInstance).option('selection.sensitivity', sensitivity);
        },
        { dependencies: { getInstance, sensitivity } },
    )();
  }
}
