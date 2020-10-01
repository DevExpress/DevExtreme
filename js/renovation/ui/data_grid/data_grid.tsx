/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Ref, Component, JSXComponent, Method,
} from 'devextreme-generator/component_declaration/common';
import LegacyDataGrid from '../../../ui/data_grid/ui.data_grid';

import { DataGridProps } from './props';

import { DomComponentWrapper } from '../common/dom_component_wrapper';

/* eslint-enable import/named */

export const viewFunction = ({ widgetRef, props, restAttributes }: DataGrid): JSX.Element => (
  <DomComponentWrapper
    rootElementRef={widgetRef}
    componentType={LegacyDataGrid as any}
    componentProps={props}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export class DataGrid extends JSXComponent(DataGridProps) {
  @Ref()
  widgetRef!: HTMLDivElement;

  get instance(): any {
    return (LegacyDataGrid as any).getInstance(this.widgetRef);
  }

  @Method()
  beginCustomLoading(messageText: string): void {
    return this.instance?.beginCustomLoading(messageText);
  }

  @Method()
  byKey(key: any | string | number): Promise<any> & JQueryPromise<any> {
    return this.instance?.byKey(key);
  }

  @Method()
  cancelEditData(): void {
    return this.instance?.cancelEditData();
  }

  @Method()
  cellValue(rowIndex: number, dataField: string | number, value: any): any {
    return this.instance?.cellValue(rowIndex, dataField, value);
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
  deselectAll(): Promise<void> & JQueryPromise<void> {
    return this.instance?.deselectAll();
  }

  @Method()
  deselectRows(keys: any[]): Promise<any> & JQueryPromise<any> {
    return this.instance?.deselectRows(keys);
  }

  @Method()
  editCell(rowIndex: number, dataField: string | number): void {
    return this.instance?.editCell(rowIndex, dataField);
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
  focus(element: undefined | Element | JQuery): void {
    return this.instance?.focus(element);
  }

  @Method()
  getCellElement(
    rowIndex: number, dataField: string | number,
  ): any/* dxElement | undefined */ {
    return this.instance?.getCellElement(rowIndex, dataField);
  }

  @Method()
  getCombinedFilter(returnDataField: undefined | boolean): any {
    return this.instance?.getCombinedFilter(returnDataField);
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
  getRowElement(rowIndex: number): Element[] & JQuery | undefined {
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
    newIndex: undefined | number,
  ): Promise<void> & JQueryPromise<void> | number {
    return this.instance?.pageIndex(newIndex);
  }

  @Method()
  pageSize(value: number): void {
    return this.instance?.pageSize(value);
  }

  @Method()
  refresh(
    changesOnly: undefined | boolean,
  ): Promise<void> & JQueryPromise<void> {
    return this.instance?.refresh(changesOnly);
  }

  @Method()
  repaintRows(rowIndexes: number[]): void {
    return this.instance?.repaintRows(rowIndexes);
  }

  @Method()
  saveEditData(): Promise<void> & JQueryPromise<void> {
    return this.instance?.saveEditData();
  }

  @Method()
  searchByText(text: string): void {
    return this.instance?.searchByText(text);
  }

  @Method()
  selectAll(): Promise<void> & JQueryPromise<void> {
    return this.instance?.selectAll();
  }

  @Method()
  selectRows(
    keys: any[], preserve: boolean,
  ): Promise<any> & JQueryPromise<any> {
    return this.instance?.selectRows(keys, preserve);
  }

  @Method()
  selectRowsByIndexes(indexes: number[]): Promise<any> & JQueryPromise<any> {
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
  addRow(): Promise<void> & JQueryPromise<void> {
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
  collapseRow(key: any): Promise<void> & JQueryPromise<void> {
    return this.instance?.collapseRow(key);
  }

  @Method()
  expandAll(groupIndex?: number): void {
    return this.instance?.expandAll(groupIndex);
  }

  @Method()
  expandRow(key: any): Promise<void> & JQueryPromise<void> {
    return this.instance?.expandRow(key);
  }

  @Method()
  exportToExcel(selectionOnly: boolean): void {
    return this.instance?.exportToExcel(selectionOnly);
  }

  @Method()
  getSelectedRowKeys(): any[] & Promise<any> & JQueryPromise<any> {
    return this.instance?.getSelectedRowKeys();
  }

  @Method()
  getSelectedRowsData(): any[] & Promise<any> & JQueryPromise<any> {
    return this.instance?.getSelectedRowsData();
  }

  @Method()
  getTotalSummaryValue(summaryItemName: string): any {
    return this.instance?.getTotalSummaryValue(summaryItemName);
  }

  @Method()
  getVisibleColumns(headerLevel: undefined | number): any /* dxDataGridColumn[] */ {
    return this.instance?.getVisibleColumns(headerLevel);
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
}
