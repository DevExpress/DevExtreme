import { ClientFunction, Selector } from 'testcafe';
import Widget from '../internal/widget';
import DataRow from './data/row';
import GroupRow from './groupRow';
import FilterPanel from './filter/panel';
import Pager from './pager';
import EditForm from './editForm';
import HeaderPanel from './headers/panel';
import DataCell from './data/cell';
import Headers from './headers';
import { WidgetName } from '../../helpers/createWidget';

const CLASS = {
  headers: 'headers',
  headerPanel: 'header-panel',
  dataRow: 'dx-data-row',
  groupRow: 'dx-group-row',
  focusedRow: 'dx-row-focused',
  filterPanel: 'filter-panel',
  pager: 'pager',
  editFormRow: 'edit-form',
  button: 'dx-button',
  formButtonsContainer: 'form-buttons-container',
  overlayContent: 'edit-popup',
  popupContent: 'dx-overlay-content',
  toolbar: 'dx-toolbar',
  fixedGridView: 'content-fixed',
  rowsView: 'rowsview',
  revertButton: 'dx-revert-button',
  fieldItemContent: 'dx-field-item-content',
  textEditorInput: 'dx-texteditor-input',
};

const moveElement = ($element: JQuery, x: number, y: number, isStart: boolean): void => {
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

      $element.trigger($.Event('dxpointermove', {
        pageX: offset.left + x,
        pageY: offset.top + y,
        pointers: [{ pointerId: 1 }],
      }));
    }
  }
};

export default class DataGrid extends Widget {
  dataRows: Selector;

  constructor(id: string) {
    super(id);

    this.dataRows = this.element.find(`.${CLASS.dataRow}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxDataGrid'; }

  addWidgetPrefix(className: string): string {
    return Widget.addClassPrefix(this.getName(), className);
  }

  getHeaders(): Headers {
    return new Headers(this.element.find(`.${this.addWidgetPrefix(CLASS.headers)}`), this.getName());
  }

  getRowsView(): Selector {
    return this.element.find(`.${this.addWidgetPrefix(CLASS.rowsView)}`);
  }

  getDataRow(index: number): DataRow {
    return new DataRow(this.element.find(`.${CLASS.dataRow}[aria-rowindex='${index + 1}']`), this.getName());
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

  getGroupRow(index: number): GroupRow {
    return new GroupRow(this.element.find(`.${CLASS.groupRow}`).nth(index), this.getName());
  }

  getFocusedRow(): Selector {
    return this.dataRows.filter(`.${CLASS.focusedRow}`);
  }

  getFilterPanel(): FilterPanel {
    return new FilterPanel(this.element.find(`.${this.addWidgetPrefix(CLASS.filterPanel)}`), this.getName());
  }

  getPager(): Pager {
    return new Pager(this.element.find(`.${this.addWidgetPrefix(CLASS.pager)}`));
  }

  scrollTo(options: { x?: number; y?: number; top?: number }): Promise<void> {
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

  isVisible(): Promise<boolean> {
    const { getInstance } = this;

    return ClientFunction(
      () => $((getInstance() as any).element()).is(':visible'),
      { dependencies: { getInstance } },
    )();
  }

  scrollBy(options: { x?: number; y?: number; top?: number }): Promise<void> {
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
    const element = Selector(`.${this.addWidgetPrefix(CLASS.overlayContent)} .${CLASS.popupContent}`);
    const buttons = element.find(`.${CLASS.toolbar} .${CLASS.button}`);

    return new EditForm(element, buttons);
  }

  getHeaderPanel(): HeaderPanel {
    return new HeaderPanel(this.element.find(`.${this.addWidgetPrefix(CLASS.headerPanel)}`), this.getName());
  }

  getRevertButton(): Selector {
    return this.element.find(`.${CLASS.revertButton}`);
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

  apiExpandRow(key: unknown): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).expandRow(key),
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

  apiCellValue(rowIndex: number, columnIndex: number, value: string): Promise<void> {
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

  moveRow(rowIndex: number, x: number, y: number, isStart = false): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(() => {
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
    })();
  }

  moveHeader(columnIndex: number, x: number, y: number, isStart = false): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(() => {
      const gridInstance = getInstance() as any;
      const columnHeadersView = gridInstance.getView('columnHeadersView');
      const $header = $(columnHeadersView.getHeaderElement(columnIndex));

      moveElement($header, x, y, isStart);
    },
    {
      dependencies: {
        getInstance, columnIndex, x, y, isStart, moveElement,
      },
    })();
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
}
