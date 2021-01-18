/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Component, Method, Ref,
} from 'devextreme-generator/component_declaration/common';
import {
  DataGridProps,
} from './props';

import '../../../ui/data_grid/ui.data_grid';

import gridCore from '../../../ui/data_grid/ui.data_grid.core';

import { Widget } from '../common/widget';
import { DataGridComponent } from './datagrid_component';
import { DataGridViews } from './data_grid_views';
import { GridInstance } from './common/types';

gridCore.registerModulesOrder([
  'stateStoring',
  'columns',
  'selection',
  'editorFactory',
  'columnChooser',
  'grouping',
  'editing',
  'masterDetail',
  'validating',
  'adaptivity',
  'data',
  'virtualScrolling',
  'columnHeaders',
  'filterRow',
  'headerPanel',
  'headerFilter',
  'sorting',
  'search',
  'rows',
  'pager',
  'columnsResizingReordering',
  'contextMenu',
  'keyboardNavigation',
  'errorHandling',
  'summary',
  'columnFixing',
  'export',
  'gridView']);

export const viewFunction = ({
  gridInstance,
  // widgetRef,
  restAttributes,
}: DataGrid) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Widget {...restAttributes}>
    <DataGridViews gridInstance={gridInstance} />
  </Widget>
);

@Component({ defaultOptionRules: null, jQuery: { register: true }, view: viewFunction })
export class DataGrid extends JSXComponent(DataGridProps) {
  @Ref() componentInstance!: GridInstance;

  @Method()
  beginCustomLoading(messageText: string): void {
    return this.gridInstance?.beginCustomLoading(messageText);
  }

  @Method()
  byKey(key: any | string | number): Promise<any> & JQueryPromise<any> {
    return this.gridInstance?.byKey(key);
  }

  @Method()
  cancelEditData(): void {
    return this.gridInstance?.cancelEditData();
  }

  @Method()
  cellValue(rowIndex: number, dataField: string, value: any): any {
    return this.gridInstance?.cellValue(rowIndex, dataField, value);
  }

  @Method()
  clearFilter(filterName: string): void {
    return this.gridInstance?.clearFilter(filterName);
  }

  @Method()
  clearSelection(): void {
    return this.gridInstance?.clearSelection();
  }

  @Method()
  clearSorting(): void {
    return this.gridInstance?.clearSorting();
  }

  @Method()
  closeEditCell(): void {
    return this.gridInstance?.closeEditCell();
  }

  @Method()
  collapseAdaptiveDetailRow(): void {
    return this.gridInstance?.collapseAdaptiveDetailRow();
  }

  @Method()
  columnCount(): number {
    return this.gridInstance?.columnCount();
  }

  @Method()
  columnOption(id: number | string, optionName: any, optionValue: any): void {
    return this.gridInstance?.columnOption(id, optionName, optionValue);
  }

  @Method()
  deleteColumn(id: number | string): void {
    return this.gridInstance?.deleteColumn(id);
  }

  @Method()
  deleteRow(rowIndex: number): void {
    return this.gridInstance?.deleteRow(rowIndex);
  }

  @Method()
  deselectAll(): Promise<void> & JQueryPromise<void> {
    return this.gridInstance?.deselectAll();
  }

  @Method()
  deselectRows(keys: any[]): Promise<any> & JQueryPromise<any> {
    return this.gridInstance?.deselectRows(keys);
  }

  @Method()
  editCell(rowIndex: number, dataFieldColumnIndex: string | number): void {
    return this.gridInstance?.editCell(rowIndex, dataFieldColumnIndex as string);
  }

  @Method()
  editRow(rowIndex: number): void {
    return this.gridInstance?.editRow(rowIndex);
  }

  @Method()
  endCustomLoading(): void {
    return this.gridInstance?.endCustomLoading();
  }

  @Method()
  expandAdaptiveDetailRow(key: any): void {
    return this.gridInstance?.expandAdaptiveDetailRow(key);
  }

  @Method()
  filter(filterExpr: any): void {
    return this.gridInstance?.filter(filterExpr);
  }

  @Method()
  focus(element?: Element | JQuery): void {
    return this.gridInstance?.focus(element as Element);
  }

  @Method()
  getCellElement(
    rowIndex: number, dataField: string | number,
  ): any/* dxElement | undefined */ {
    return this.gridInstance?.getCellElement(rowIndex, dataField as string);
  }

  @Method()
  getCombinedFilter(returnDataField?: boolean): any {
    return this.gridInstance?.getCombinedFilter(returnDataField as boolean);
  }

  @Method()
  getDataSource(): any /* DataSource */ {
    return this.gridInstance?.getDataSource();
  }

  @Method()
  getKeyByRowIndex(rowIndex: number): any {
    return this.gridInstance?.getKeyByRowIndex(rowIndex);
  }

  @Method()
  getRowElement(rowIndex: number): Element[] & JQuery | undefined {
    return this.gridInstance?.getRowElement(rowIndex);
  }

  @Method()
  getRowIndexByKey(key: any | string | number): number {
    return this.gridInstance?.getRowIndexByKey(key);
  }

  @Method()
  getScrollable(): any /* dxScrollable */ {
    return this.gridInstance?.getScrollable();
  }

  @Method()
  getVisibleColumnIndex(id: number | string): number {
    return this.gridInstance?.getVisibleColumnIndex(id);
  }

  @Method()
  hasEditData(): boolean {
    return this.gridInstance?.hasEditData();
  }

  @Method()
  hideColumnChooser(): void {
    return this.gridInstance?.hideColumnChooser();
  }

  @Method()
  isAdaptiveDetailRowExpanded(key: any): boolean {
    return this.gridInstance?.isAdaptiveDetailRowExpanded(key);
  }

  @Method()
  isRowFocused(key: any): boolean {
    return this.gridInstance?.isRowFocused(key);
  }

  @Method()
  isRowSelected(key: any): boolean {
    return this.gridInstance?.isRowSelected(key);
  }

  @Method()
  keyOf(obj: any): any {
    return this.gridInstance?.keyOf(obj);
  }

  @Method()
  navigateToRow(key: any): void {
    return this.gridInstance?.navigateToRow(key);
  }

  @Method()
  pageCount(): number {
    return this.gridInstance?.pageCount();
  }

  @Method()
  pageIndex(
    newIndex?: number,
  ): Promise<void> & JQueryPromise<void> | number {
    return this.gridInstance?.pageIndex(newIndex as number);
  }

  @Method()
  pageSize(value: number): void {
    return this.gridInstance?.pageSize(value);
  }

  @Method()
  refresh(
    changesOnly?: boolean,
  ): Promise<void> & JQueryPromise<void> {
    return this.gridInstance?.refresh(changesOnly as boolean);
  }

  @Method()
  repaintRows(rowIndexes: number[]): void {
    return this.gridInstance?.repaintRows(rowIndexes);
  }

  @Method()
  saveEditData(): Promise<void> & JQueryPromise<void> {
    return this.gridInstance?.saveEditData();
  }

  @Method()
  searchByText(text: string): void {
    return this.gridInstance?.searchByText(text);
  }

  @Method()
  selectAll(): Promise<void> & JQueryPromise<void> {
    return this.gridInstance?.selectAll();
  }

  @Method()
  selectRows(
    keys: any[], preserve: boolean,
  ): Promise<any> & JQueryPromise<any> {
    return this.gridInstance?.selectRows(keys, preserve);
  }

  @Method()
  selectRowsByIndexes(indexes: number[]): Promise<any> & JQueryPromise<any> {
    return this.gridInstance?.selectRowsByIndexes(indexes);
  }

  @Method()
  showColumnChooser(): void {
    return this.gridInstance?.showColumnChooser();
  }

  /*
  @Method()
  state(state: any): any {
    return this.gridInstance?.state();
  } */

  @Method()
  undeleteRow(rowIndex: number): void {
    return this.gridInstance?.undeleteRow(rowIndex);
  }

  @Method()
  updateDimensions(): void {
    return this.gridInstance?.updateDimensions();
  }

  @Method()
  addColumn(columnOptions: any | string): void {
    return this.gridInstance?.addColumn(columnOptions);
  }

  @Method()
  addRow(): Promise<void> & JQueryPromise<void> {
    return this.gridInstance?.addRow();
  }

  @Method()
  clearGrouping(): void {
    return this.gridInstance?.clearGrouping();
  }

  @Method()
  collapseAll(groupIndex?: number): void {
    return this.gridInstance?.collapseAll(groupIndex);
  }

  @Method()
  collapseRow(key: any): Promise<void> & JQueryPromise<void> {
    return this.gridInstance?.collapseRow(key);
  }

  @Method()
  expandAll(groupIndex?: number): void {
    return this.gridInstance?.expandAll(groupIndex);
  }

  @Method()
  expandRow(key: any): Promise<void> & JQueryPromise<void> {
    return this.gridInstance?.expandRow(key);
  }

  @Method()
  exportToExcel(selectionOnly: boolean): void {
    return this.gridInstance?.exportToExcel(selectionOnly);
  }

  @Method()
  getSelectedRowKeys(): any[] & Promise<any> & JQueryPromise<any> {
    return this.gridInstance?.getSelectedRowKeys();
  }

  @Method()
  getSelectedRowsData(): any[] & Promise<any> & JQueryPromise<any> {
    return this.gridInstance?.getSelectedRowsData();
  }

  @Method()
  getTotalSummaryValue(summaryItemName: string): any {
    return this.gridInstance?.getTotalSummaryValue(summaryItemName);
  }

  @Method()
  getVisibleColumns(headerLevel?: number): any /* dxDataGridColumn[] */ {
    return this.gridInstance?.getVisibleColumns(headerLevel as number);
  }

  @Method()
  getVisibleRows(): any /* dxDataGridRowObject[] */ {
    return this.gridInstance?.getVisibleRows();
  }

  @Method()
  isRowExpanded(key: any): boolean {
    return this.gridInstance?.isRowExpanded(key);
  }

  @Method()
  totalCount(): number {
    return this.gridInstance?.totalCount();
  }

  @Method()
  getController(name: string): any {
    return this.gridInstance?.getController(name);
  }

  // It's impossible to define constructor, so it's workaround to lazy creation
  // of gridInstance within componentHolder by imutable way
  get gridInstance() {
    if (!this.componentInstance) {
      this.componentInstance = this.init();
    }
    return this.componentInstance;
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
  normalizeProps(): {} {
    const result = {};
    Object.keys(this.props).forEach((key) => {
      if (this.props[key] !== undefined) {
        result[key] = this.props[key];
      }
    });
    return result;
  }

  // TODO Move to constructor of DataGridComponent
  init() {
    const instance: any = new DataGridComponent(this.normalizeProps());

    return instance as GridInstance;
  }
}
