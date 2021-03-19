/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Component, Method, Effect, Mutable,
} from 'devextreme-generator/component_declaration/common';
import {
  DataGridProps,
} from './common/data_grid_props';

import '../../../ui/data_grid/ui.data_grid';

import { Widget } from '../common/widget';
import { DataGridComponent } from './datagrid_component';
import { DataGridViews } from './data_grid_views';
import { GridInstance } from './common/types';
import { getUpdatedOptions } from './utils/get_updated_options';
import { TPromise } from '../../../core/utils/deferred'; // eslint-disable-line import/named
import { TElement, TElementsArray } from '../../../core/element'; // eslint-disable-line import/named
import DataGridBaseComponent from '../../component_wrapper/data_grid';
import { DisposeEffectReturn } from '../../utils/effect_return';

const aria = { role: 'presentation' };

export const viewFunction = ({
  instance,
  props: {
    accessKey,
    activeStateEnabled,
    disabled,
    focusStateEnabled,
    height,
    hint,
    hoverStateEnabled,
    onContentReady,
    rtlEnabled,
    tabIndex,
    visible,
    width,
  },
  restAttributes,
}: DataGrid): JSX.Element => (
  <Widget // eslint-disable-line jsx-a11y/no-access-key
    accessKey={accessKey}
    activeStateEnabled={activeStateEnabled}
    aria={aria}
    disabled={disabled}
    focusStateEnabled={focusStateEnabled}
    height={height}
    hint={hint}
    hoverStateEnabled={hoverStateEnabled}
    onContentReady={onContentReady}
    rtlEnabled={rtlEnabled}
    tabIndex={tabIndex}
    visible={visible}
    width={width}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    <DataGridViews instance={instance} />
  </Widget>
);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true, component: DataGridBaseComponent },
  view: viewFunction,
})
export class DataGrid extends JSXComponent(DataGridProps) {
  @Mutable() componentInstance!: GridInstance;

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
  byKey(key: any | string | number): TPromise<any> {
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

  @Method()
  columnOption(id: number | string, optionName: any, optionValue: any): void {
    return this.instance?.columnOption(id, optionName, optionValue);
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
  deselectAll(): TPromise {
    return this.instance?.deselectAll();
  }

  @Method()
  deselectRows(keys: any[]): TPromise<any> {
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
  focus(element?: TElement): void {
    return this.instance?.focus(element as HTMLElement);
  }

  @Method()
  getCellElement(
    rowIndex: number, dataField: string | number,
  ): any/* dxElement | undefined */ {
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
  getRowElement(rowIndex: number): TElementsArray | undefined {
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
  ): TPromise | number {
    return this.instance?.pageIndex(newIndex as number);
  }

  @Method()
  pageSize(value: number): void {
    return this.instance?.pageSize(value);
  }

  @Method()
  refresh(
    changesOnly?: boolean,
  ): TPromise {
    return this.instance?.refresh(changesOnly as boolean);
  }

  @Method()
  repaintRows(rowIndexes: number[]): void {
    return this.instance?.repaintRows(rowIndexes);
  }

  @Method()
  saveEditData(): TPromise {
    return this.instance?.saveEditData();
  }

  @Method()
  searchByText(text: string): void {
    return this.instance?.searchByText(text);
  }

  @Method()
  selectAll(): TPromise {
    return this.instance?.selectAll();
  }

  @Method()
  selectRows(
    keys: any[], preserve: boolean,
  ): TPromise<any> {
    return this.instance?.selectRows(keys, preserve);
  }

  @Method()
  selectRowsByIndexes(indexes: number[]): TPromise<any> {
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
  addColumn(columnOptions: any | string): void {
    return this.instance?.addColumn(columnOptions);
  }

  @Method()
  addRow(): TPromise {
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
  collapseRow(key: any): TPromise {
    return this.instance?.collapseRow(key);
  }

  @Method()
  expandAll(groupIndex?: number): void {
    return this.instance?.expandAll(groupIndex);
  }

  @Method()
  expandRow(key: any): TPromise {
    return this.instance?.expandRow(key);
  }

  @Method()
  exportToExcel(selectionOnly: boolean): void {
    return this.instance?.exportToExcel(selectionOnly);
  }

  @Method()
  getSelectedRowKeys(): any[] & TPromise<any> {
    return this.instance?.getSelectedRowKeys();
  }

  @Method()
  getSelectedRowsData(): any[] & TPromise<any> {
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
  getController(name: string): any {
    return this.instance?.getController(name);
  }
  // #endregion

  // It's impossible to define constructor use lazy creation instead
  get instance(): GridInstance {
    if (!this.componentInstance) {
      this.componentInstance = this.createInstance();
    }
    return this.componentInstance;
  }

  @Effect() updateOptions(): void {
    if (this.instance && this.prevProps) {
      const updatedOptions = getUpdatedOptions(this.prevProps, this.props);
      this.instance.beginUpdate();
      updatedOptions.forEach(({ path, value }) => this.instance.option(path, value));
      this.instance.endUpdate();
    }
    this.prevProps = this.props;
  }

  @Effect({ run: 'once' })
  dispose(): DisposeEffectReturn {
    return () => { this.instance.dispose(); };
  }

  // TODO without normalization all nested props defaults overwrite by undefined
  // For example, instance.option('editing') return undefined instead of editing default values
  // Specifically for React
  // result[key] = {
  //   ...props,
  //   columns: __getNestedColumns(),
  //   editing: __getNestedEditing()
  //   ...
  // }
  normalizeProps(): Record<string, unknown> {
    const result = {};
    Object.keys(this.props).forEach((key) => {
      if (this.props[key] !== undefined) {
        result[key] = this.props[key];
      }
    });
    return result;
  }

  createInstance(): GridInstance {
    const instance: unknown = new DataGridComponent(this.normalizeProps());

    return instance as GridInstance;
  }
}
