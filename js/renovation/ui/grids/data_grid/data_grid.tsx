/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Component, Method, Effect, Mutable, RefObject, Ref, InternalState,
} from '@devextreme-generator/declarations';
import {
  DataGridProps,
} from './common/data_grid_props';

import '../../../../ui/data_grid/ui.data_grid';

import { Widget } from '../../common/widget';
import { DataGridComponent } from './datagrid_component';
import { DataGridViews } from './data_grid_views';
import { GridInstance, DataGridForComponentWrapper } from './common/types';
import { getUpdatedOptions } from './utils/get_updated_options';
import { DxPromise } from '../../../../core/utils/deferred'; // eslint-disable-line import/named
import { UserDefinedElement, UserDefinedElementsArray } from '../../../../core/element'; // eslint-disable-line import/named
import DataGridBaseComponent from '../../../component_wrapper/data_grid';
import { DisposeEffectReturn } from '../../../utils/effect_return';
import type { OptionChangedEvent } from '../../../../ui/data_grid';

const aria = { role: 'presentation' };

const rowSelector = '.dx-row';

// TODO without normalization all nested props defaults overwrite by undefined
// https://trello.com/c/36qTw0cH/2560-a-nested-prop-has-an-undefined-value-if-it-not-used-in-component
// For example, instance.option('editing') return undefined instead of editing default values
// Specifically for React
// result[key] = {
//   ...props,
//   columns: __getNestedColumns(),
//   editing: __getNestedEditing()
//   ...
// }
function normalizeProps(props: Record<string, unknown>): Record<string, unknown> {
  const result = {};

  Object.keys(props).forEach((key) => {
    if (props[key] !== undefined) {
      result[key] = props[key];
    }
  });
  return result;
}

export const viewFunction = ({
  instance,
  widgetElementRef,
  onHoverStart,
  onHoverEnd,
  onDimensionChanged,
  props: {
    accessKey,
    activeStateEnabled,
    disabled,
    focusStateEnabled,
    height,
    hint,
    hoverStateEnabled,
    rtlEnabled,
    tabIndex,
    visible,
    width,
    showBorders,
  },
  restAttributes,
}: DataGrid): JSX.Element => (
  <Widget // eslint-disable-line jsx-a11y/no-access-key
    rootElementRef={widgetElementRef as any}
    accessKey={accessKey}
    activeStateEnabled={activeStateEnabled}
    activeStateUnit={rowSelector}
    aria={aria}
    disabled={disabled}
    focusStateEnabled={focusStateEnabled}
    height={height}
    hint={hint}
    hoverStateEnabled={hoverStateEnabled}
    rtlEnabled={rtlEnabled}
    tabIndex={tabIndex}
    visible={visible}
    width={width}
    onHoverStart={onHoverStart}
    onHoverEnd={onHoverEnd}
    onDimensionChanged={onDimensionChanged}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    <DataGridViews instance={instance} showBorders={showBorders} />
  </Widget>
);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true, component: DataGridBaseComponent },
  view: viewFunction,
})
export class DataGrid extends JSXComponent(DataGridProps) implements DataGridForComponentWrapper {
  @Ref() widgetElementRef?: RefObject<HTMLDivElement>;

  @InternalState() instance!: GridInstance;

  @Mutable() isTwoWayPropUpdating = false;

  @Mutable() prevProps!: DataGridProps;

  @Method()
  getComponentInstance(): GridInstance {
    return this.instance;
  }

  // #region methods
  @Method()
  beginCustomLoading(messageText: string): void {
    return this.instance?.beginCustomLoading(messageText);
  }

  @Method()
  byKey(key: any | string | number): DxPromise<any> {
    return this.instance?.byKey(key);
  }

  @Method()
  cancelEditData(): void {
    return this.instance?.cancelEditData();
  }

  @Method()
  cellValue(rowIndex: number, dataField: string | number, value: any): any {
    return this.instance?.cellValue(rowIndex, dataField as any, value);
  }

  @Method()
  clearFilter(filterName: string): void {
    return this.instance?.clearFilter(filterName);
  }

  @Method()
  clearSelection(): void {
    return this.instance?.clearSelection();
  }

  @Method()
  clearSorting(): void {
    return this.instance?.clearSorting();
  }

  @Method()
  closeEditCell(): void {
    return this.instance?.closeEditCell();
  }

  @Method()
  collapseAdaptiveDetailRow(): void {
    return this.instance?.collapseAdaptiveDetailRow();
  }

  @Method()
  columnCount(): number {
    return this.instance?.columnCount();
  }

  // TODO remove this after fix https://trello.com/c/I8ManehQ/2674-renovation-generated-jquery-methods-pass-all-aguments-even-it-is-optional
  callMethod(funcName: string, args: unknown): void {
    const normalizedArgs = [...args as unknown[]].filter((arg) => arg !== undefined);

    return this.instance?.[funcName](...normalizedArgs);
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  columnOption(id: number | string, optionName: any, optionValue?: any): void {
    // eslint-disable-next-line prefer-rest-params
    return this.callMethod('columnOption', arguments);
  }

  @Method()
  deleteColumn(id: number | string): void {
    return this.instance?.deleteColumn(id);
  }

  @Method()
  deleteRow(rowIndex: number): void {
    return this.instance?.deleteRow(rowIndex);
  }

  @Method()
  deselectAll(): DxPromise {
    return this.instance?.deselectAll();
  }

  @Method()
  deselectRows(keys: any[]): DxPromise<any> {
    return this.instance?.deselectRows(keys);
  }

  @Method()
  editCell(rowIndex: number, dataFieldColumnIndex: string | number): void {
    return this.instance?.editCell(rowIndex, dataFieldColumnIndex as string);
  }

  @Method()
  editRow(rowIndex: number): void {
    return this.instance?.editRow(rowIndex);
  }

  @Method()
  endCustomLoading(): void {
    return this.instance?.endCustomLoading();
  }

  @Method()
  expandAdaptiveDetailRow(key: any): void {
    return this.instance?.expandAdaptiveDetailRow(key);
  }

  @Method()
  filter(filterExpr: any): void {
    return this.instance?.filter(filterExpr);
  }

  @Method()
  focus(element?: UserDefinedElement): void {
    return this.instance?.focus(element as HTMLElement);
  }

  @Method()
  getCellElement(
    rowIndex: number, dataField: string | number,
  ): any/* DxElement | undefined */ {
    return this.instance?.getCellElement(rowIndex, dataField as string);
  }

  @Method()
  getCombinedFilter(returnDataField?: boolean): any {
    return this.instance?.getCombinedFilter(returnDataField as boolean);
  }

  @Method()
  getDataSource(): any /* DataSource */ {
    return this.instance?.getDataSource();
  }

  @Method()
  getKeyByRowIndex(rowIndex: number): any {
    return this.instance?.getKeyByRowIndex(rowIndex);
  }

  @Method()
  getRowElement(rowIndex: number): UserDefinedElementsArray | undefined {
    return this.instance?.getRowElement(rowIndex);
  }

  @Method()
  getRowIndexByKey(key: any | string | number): number {
    return this.instance?.getRowIndexByKey(key);
  }

  @Method()
  getScrollable(): any /* dxScrollable */ {
    return this.instance?.getScrollable();
  }

  @Method()
  getVisibleColumnIndex(id: number | string): number {
    return this.instance?.getVisibleColumnIndex(id);
  }

  @Method()
  hasEditData(): boolean {
    return this.instance?.hasEditData();
  }

  @Method()
  hideColumnChooser(): void {
    return this.instance?.hideColumnChooser();
  }

  @Method()
  isAdaptiveDetailRowExpanded(key: any): boolean {
    return this.instance?.isAdaptiveDetailRowExpanded(key);
  }

  @Method()
  isRowFocused(key: any): boolean {
    return this.instance?.isRowFocused(key);
  }

  @Method()
  isRowSelected(key: any): boolean {
    return this.instance?.isRowSelected(key);
  }

  @Method()
  keyOf(obj: any): any {
    return this.instance?.keyOf(obj);
  }

  @Method()
  navigateToRow(key: any): void {
    return this.instance?.navigateToRow(key);
  }

  @Method()
  pageCount(): number {
    return this.instance?.pageCount();
  }

  @Method()
  pageIndex(
    newIndex?: number,
  ): DxPromise | number {
    return this.instance?.pageIndex(newIndex as number);
  }

  @Method()
  pageSize(value: number): void {
    return this.instance?.pageSize(value);
  }

  @Method()
  refresh(
    changesOnly?: boolean,
  ): DxPromise {
    return this.instance?.refresh(changesOnly as boolean);
  }

  @Method()
  repaintRows(rowIndexes: number[]): void {
    return this.instance?.repaintRows(rowIndexes);
  }

  @Method()
  saveEditData(): DxPromise {
    return this.instance?.saveEditData();
  }

  @Method()
  searchByText(text: string): void {
    return this.instance?.searchByText(text);
  }

  @Method()
  selectAll(): DxPromise {
    return this.instance?.selectAll();
  }

  @Method()
  selectRows(
    keys: any[], preserve: boolean,
  ): DxPromise<any> {
    return this.instance?.selectRows(keys, preserve);
  }

  @Method()
  selectRowsByIndexes(indexes: number[]): DxPromise<any> {
    return this.instance?.selectRowsByIndexes(indexes);
  }

  @Method()
  showColumnChooser(): void {
    return this.instance?.showColumnChooser();
  }

  /*
  @Method()
  state(state: any): any {
    return this.instance?.state();
  } */

  @Method()
  undeleteRow(rowIndex: number): void {
    return this.instance?.undeleteRow(rowIndex);
  }

  @Method()
  updateDimensions(): void {
    return this.instance?.updateDimensions();
  }

  @Method()
  resize(): void {
    return this.instance?.resize();
  }

  @Method()
  addColumn(columnOptions: any | string): void {
    return this.instance?.addColumn(columnOptions);
  }

  @Method()
  addRow(): DxPromise {
    return this.instance?.addRow();
  }

  @Method()
  clearGrouping(): void {
    return this.instance?.clearGrouping();
  }

  @Method()
  collapseAll(groupIndex?: number): void {
    return this.instance?.collapseAll(groupIndex);
  }

  @Method()
  collapseRow(key: any): DxPromise {
    return this.instance?.collapseRow(key);
  }

  @Method()
  expandAll(groupIndex?: number): void {
    return this.instance?.expandAll(groupIndex);
  }

  @Method()
  expandRow(key: any): DxPromise {
    return this.instance?.expandRow(key);
  }

  @Method()
  exportToExcel(selectionOnly: boolean): void {
    return this.instance?.exportToExcel(selectionOnly);
  }

  @Method()
  getSelectedRowKeys(): any[] & DxPromise<any> {
    return this.instance?.getSelectedRowKeys();
  }

  @Method()
  getSelectedRowsData(): any[] & DxPromise<any> {
    return this.instance?.getSelectedRowsData();
  }

  @Method()
  getTotalSummaryValue(summaryItemName: string): any {
    return this.instance?.getTotalSummaryValue(summaryItemName);
  }

  @Method()
  getVisibleColumns(headerLevel?: number): any /* dxDataGridColumn[] */ {
    return this.instance?.getVisibleColumns(headerLevel as number);
  }

  @Method()
  getVisibleRows(): any /* dxDataGridRowObject[] */ {
    return this.instance?.getVisibleRows();
  }

  @Method()
  isRowExpanded(key: any): boolean {
    return this.instance?.isRowExpanded(key);
  }

  @Method()
  totalCount(): number {
    return this.instance?.totalCount();
  }

  @Method()
  isScrollbarVisible(): boolean {
    return this.instance?.isScrollbarVisible();
  }

  @Method()
  getTopVisibleRowData(): any {
    return this.instance?.getTopVisibleRowData();
  }

  @Method()
  getScrollbarWidth(isHorizontal: boolean): number {
    return this.instance?.getScrollbarWidth(isHorizontal);
  }

  // #endregion

  @Effect() updateOptions(): void {
    if (this.instance && this.prevProps && !this.isTwoWayPropUpdating) {
      const updatedOptions = getUpdatedOptions(this.prevProps, this.props);
      this.instance.beginUpdate();
      updatedOptions.forEach(({ path, value, previousValue }) => {
        // eslint-disable-next-line no-underscore-dangle
        this.instance._options.silent(path, previousValue);
        this.instance.option(path, value);
      });
      this.prevProps = this.props;
      this.instance.endUpdate();
    } else {
      this.prevProps = this.props;
    }
  }

  @Effect({ run: 'once' })
  dispose(): DisposeEffectReturn {
    return () => { this.instance.dispose(); };
  }

  instanceOptionChangedHandler(e: OptionChangedEvent): void {
    try {
      this.isTwoWayPropUpdating = true;
      this.updateTwoWayValue(e);
    } finally {
      this.isTwoWayPropUpdating = false;
    }
  }

  updateTwoWayValue(e: OptionChangedEvent): void {
    // T867777
    const isValueCorrect = e.value === e.component.option(e.fullName);
    if (e.value !== e.previousValue && isValueCorrect) {
      if (e.name === 'editing' && this.props.editing) {
        if (e.fullName === 'editing.changes') {
          this.props.editing.changes = e.value as [];
        }
        if (e.fullName === 'editing.editRowKey') {
          this.props.editing.editRowKey = e.value;
        }
        if (e.fullName === 'editing.editColumnName') {
          this.props.editing.editColumnName = e.value as string;
        }
      }
      if (e.fullName === 'searchPanel.text' && this.props.searchPanel) {
        this.props.searchPanel.text = e.value as string;
      }
      if (e.fullName === 'focusedRowKey') {
        this.props.focusedRowKey = e.value;
      }
      if (e.fullName === 'focusedRowIndex') {
        this.props.focusedRowIndex = e.value as number;
      }
      if (e.fullName === 'focusedColumnIndex') {
        this.props.focusedColumnIndex = e.value as number;
      }
      if (e.fullName === 'filterValue') {
        this.props.filterValue = e.value as string;
      }
      if (e.fullName === 'selectedRowKeys') {
        this.props.selectedRowKeys = e.value as [];
      }
      if (e.fullName === 'selectionFilter') {
        this.props.selectionFilter = e.value as string;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onHoverStart(event: Event): void {
    (event.currentTarget as HTMLElement).classList.add('dx-state-hover');
  }

  // eslint-disable-next-line class-methods-use-this
  onHoverEnd(event: Event): void {
    (event.currentTarget as HTMLElement).classList.remove('dx-state-hover');
  }

  onDimensionChanged(): void {
    this.instance?.updateDimensions(true);
  }

  @Effect({ run: 'once' })
  setupInstance(): void {
    const element = this.widgetElementRef?.current as HTMLElement;
    // TODO Vitik: Not only optionChanged should be rewrited.
    // All other events should be re-raised by renovated grid.
    const { onOptionChanged, ...restProps } = {
      ...this.props,
      onContentReady: (this.restAttributes as unknown as Record<string, unknown>).onContentReady,
    } as unknown as Record<string, unknown>;
    const instance: GridInstance = new DataGridComponent(
      element,
      normalizeProps(restProps),
    ) as unknown as GridInstance;
    instance.getController('resizing').updateSize(element);
    instance.on('optionChanged', this.instanceOptionChangedHandler.bind(this));
    this.instance = instance;
  }
}
