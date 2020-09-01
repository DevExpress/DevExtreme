/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Ref, Effect, Component, JSXComponent, Method, InternalState,
} from 'devextreme-generator/component_declaration/common';
import LegacyDataGrid from '../../../ui/data_grid/ui.data_grid';

import { DataGridProps } from './props';

/*
import type { Options, dxDataGridColumn, dxDataGridRowObject } from '../../../ui/data_grid';
import type dxScrollable from '../../../ui/scroll_view/ui.scrollable';
import type { dxElement } from '../../../core/element';
*/

export const viewFunction = ({
  widgetRef,
  props: { className },
  restAttributes,
}: DataGrid): JSX.Element => (
  <div
    ref={widgetRef as any}
    className={className}
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

  @InternalState() widget: any;

  @Effect()
  updateWidget(): void {
    this.widget?.option(this.properties);
  }

  @Effect({ run: 'once' })
  setupWidget(): () => void {
    const widget = new LegacyDataGrid(this.widgetRef, this.properties);
    this.widget = widget;

    return (): void => {
      widget.dispose();
    };
  }

  get properties(): any /* Options */ {
    return this.props;
  }

  @Method()
  beginCustomLoading(messageText: string): void {
    return this.widget?.beginCustomLoading(messageText);
  }

  @Method()
  byKey(key: any | string | number): Promise<any> & JQueryPromise<any> {
    return this.widget?.byKey(key);
  }

  @Method()
  cancelEditData(): void {
    return this.widget?.cancelEditData();
  }

  @Method()
  cellValue(rowIndex: number, dataField: string | number, value: any): any {
    return this.widget?.cellValue(rowIndex, dataField, value);
  }

  @Method()
  clearFilter(filterName: string): void {
    return this.widget?.clearFilter(filterName);
  }

  @Method()
  clearSelection(): void {
    return this.widget?.clearSelection();
  }

  @Method()
  clearSorting(): void {
    return this.widget?.clearSorting();
  }

  @Method()
  closeEditCell(): void {
    return this.widget?.closeEditCell();
  }

  @Method()
  collapseAdaptiveDetailRow(): void {
    return this.widget?.collapseAdaptiveDetailRow();
  }

  @Method()
  columnCount(): number {
    return this.widget?.columnCount();
  }

  @Method()
  columnOption(id: number | string, optionName: any, optionValue: any): void {
    return this.widget?.columnOption(id, optionName, optionValue);
  }

  @Method()
  deleteColumn(id: number | string): void {
    return this.widget?.deleteColumn(id);
  }

  @Method()
  deleteRow(rowIndex: number): void {
    return this.widget?.deleteRow(rowIndex);
  }

  @Method()
  deselectAll(): Promise<void> & JQueryPromise<void> {
    return this.widget?.deselectAll();
  }

  @Method()
  deselectRows(keys: any[]): Promise<any> & JQueryPromise<any> {
    return this.widget?.deselectRows(keys);
  }

  @Method()
  editCell(rowIndex: number, dataField: string | number): void {
    return this.widget?.editCell(rowIndex, dataField);
  }

  @Method()
  editRow(rowIndex: number): void {
    return this.widget?.editRow(rowIndex);
  }

  @Method()
  endCustomLoading(): void {
    return this.widget?.endCustomLoading();
  }

  @Method()
  expandAdaptiveDetailRow(key: any): void {
    return this.widget?.expandAdaptiveDetailRow(key);
  }

  @Method()
  filter(filterExpr: any): void {
    return this.widget?.filter(filterExpr);
  }

  @Method()
  focus(element: undefined | Element | JQuery): void {
    return this.widget?.focus(element);
  }

  @Method()
  getCellElement(
    rowIndex: number, dataField: string | number,
  ): any/* dxElement | undefined */ {
    return this.widget?.getCellElement(rowIndex, dataField);
  }

  @Method()
  getCombinedFilter(returnDataField: undefined | boolean): any {
    return this.widget?.getCombinedFilter(returnDataField);
  }

  @Method()
  getDataSource(): any /* DataSource */ {
    return this.widget?.getDataSource();
  }

  @Method()
  getKeyByRowIndex(rowIndex: number): any {
    return this.widget?.getKeyByRowIndex(rowIndex);
  }

  @Method()
  getRowElement(rowIndex: number): Element[] & JQuery | undefined {
    return this.widget?.getRowElement(rowIndex);
  }

  @Method()
  getRowIndexByKey(key: any | string | number): number {
    return this.widget?.getRowIndexByKey(key);
  }

  @Method()
  getScrollable(): any /* dxScrollable */ {
    return this.widget?.getScrollable();
  }

  @Method()
  getVisibleColumnIndex(id: number | string): number {
    return this.widget?.getVisibleColumnIndex(id);
  }

  @Method()
  hasEditData(): boolean {
    return this.widget?.hasEditData();
  }

  @Method()
  hideColumnChooser(): void {
    return this.widget?.hideColumnChooser();
  }

  @Method()
  isAdaptiveDetailRowExpanded(key: any): boolean {
    return this.widget?.isAdaptiveDetailRowExpanded(key);
  }

  @Method()
  isRowFocused(key: any): boolean {
    return this.widget?.isRowFocused(key);
  }

  @Method()
  isRowSelected(key: any): boolean {
    return this.widget?.isRowSelected(key);
  }

  @Method()
  keyOf(obj: any): any {
    return this.widget?.keyOf(obj);
  }

  @Method()
  navigateToRow(key: any): void {
    return this.widget?.navigateToRow(key);
  }

  @Method()
  pageCount(): number {
    return this.widget?.pageCount();
  }

  @Method()
  pageIndex(
    newIndex: undefined | number,
  ): Promise<void> & JQueryPromise<void> | number {
    return this.widget?.pageIndex(newIndex);
  }

  @Method()
  pageSize(value: number): void {
    return this.widget?.pageSize(value);
  }

  @Method()
  refresh(
    changesOnly: undefined | boolean,
  ): Promise<void> & JQueryPromise<void> {
    return this.widget?.refresh(changesOnly);
  }

  @Method()
  repaintRows(rowIndexes: number[]): void {
    return this.widget?.repaintRows(rowIndexes);
  }

  @Method()
  saveEditData(): Promise<void> & JQueryPromise<void> {
    return this.widget?.saveEditData();
  }

  @Method()
  searchByText(text: string): void {
    return this.widget?.searchByText(text);
  }

  @Method()
  selectAll(): Promise<void> & JQueryPromise<void> {
    return this.widget?.selectAll();
  }

  @Method()
  selectRows(
    keys: any[], preserve: boolean,
  ): Promise<any> & JQueryPromise<any> {
    return this.widget?.selectRows(keys, preserve);
  }

  @Method()
  selectRowsByIndexes(indexes: number[]): Promise<any> & JQueryPromise<any> {
    return this.widget?.selectRowsByIndexes(indexes);
  }

  @Method()
  showColumnChooser(): void {
    return this.widget?.showColumnChooser();
  }

  /*
  @Method()
  state(state: any): any {
    return this.widget?.state();
  } */

  @Method()
  undeleteRow(rowIndex: number): void {
    return this.widget?.undeleteRow(rowIndex);
  }

  @Method()
  updateDimensions(): void {
    return this.widget?.updateDimensions();
  }

  @Method()
  addColumn(columnOptions: any | string): void {
    return this.widget?.addColumn(columnOptions);
  }

  @Method()
  addRow(): Promise<void> & JQueryPromise<void> {
    return this.widget?.addRow();
  }

  @Method()
  clearGrouping(): void {
    return this.widget?.clearGrouping();
  }

  @Method()
  collapseAll(groupIndex?: number): void {
    return this.widget?.collapseAll(groupIndex);
  }

  @Method()
  collapseRow(key: any): Promise<void> & JQueryPromise<void> {
    return this.widget?.collapseRow(key);
  }

  @Method()
  expandAll(groupIndex?: number): void {
    return this.widget?.expandAll(groupIndex);
  }

  @Method()
  expandRow(key: any): Promise<void> & JQueryPromise<void> {
    return this.widget?.expandRow(key);
  }

  @Method()
  exportToExcel(selectionOnly: boolean): void {
    return this.widget?.exportToExcel(selectionOnly);
  }

  @Method()
  getSelectedRowKeys(): any[] & Promise<any> & JQueryPromise<any> {
    return this.widget?.getSelectedRowKeys();
  }

  @Method()
  getSelectedRowsData(): any[] & Promise<any> & JQueryPromise<any> {
    return this.widget?.getSelectedRowsData();
  }

  @Method()
  getTotalSummaryValue(summaryItemName: string): any {
    return this.widget?.getTotalSummaryValue(summaryItemName);
  }

  @Method()
  getVisibleColumns(headerLevel: undefined | number): any /* dxDataGridColumn[] */ {
    return this.widget?.getVisibleColumns(headerLevel);
  }

  @Method()
  getVisibleRows(): any /* dxDataGridRowObject[] */ {
    return this.widget?.getVisibleRows();
  }

  @Method()
  isRowExpanded(key: any): boolean {
    return this.widget?.isRowExpanded(key);
  }

  @Method()
  totalCount(): number {
    return this.widget?.totalCount();
  }

  @Method()
  getController(name: string): any {
    return this.widget?.getController(name);
  }
}
