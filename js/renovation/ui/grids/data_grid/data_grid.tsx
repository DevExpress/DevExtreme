/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  JSXComponent, Component, Method, Effect, Mutable, RefObject, ForwardRef, InternalState,
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
import { hasWindow } from '../../../../core/utils/window';
import { UserDefinedElement, UserDefinedElementsArray, DxElement } from '../../../../core/element'; // eslint-disable-line import/named
import DataGridBaseComponent from '../../../component_wrapper/data_grid';
import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import type {
  OptionChangedEvent, Column, RowObject,
} from '../../../../ui/data_grid';
import { createDefaultOptionRules } from '../../../../core/options/utils';
import devices from '../../../../core/devices';
import browser from '../../../../core/utils/browser';
import { isMaterial, current } from '../../../../ui/themes';
import { FilterDescriptor } from '../../../../data';
import DataSource from '../../../../data/data_source';
import dxScrollable from '../../../../ui/scroll_view/ui.scrollable';

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

export const viewFunction = <TRowData, TKey>({
  initializedInstance,
  widgetElementRef,
  onHoverStart,
  onHoverEnd,
  onDimensionChanged,
  onVisibilityChange,
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
    className,
  },
  restAttributes,
}: DataGrid<TRowData, string, TKey>): JSX.Element => (
  <Widget // eslint-disable-line jsx-a11y/no-access-key
    rootElementRef={widgetElementRef}
    accessKey={accessKey}
    activeStateEnabled={activeStateEnabled}
    activeStateUnit={rowSelector}
    aria={aria}
    className={className}
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
    onVisibilityChange={onVisibilityChange}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    <DataGridViews
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instance={initializedInstance as any}
      showBorders={showBorders}
    />
  </Widget>
  );

export const defaultOptionRules = createDefaultOptionRules<
DataGridProps<unknown, string, unknown>
>([{
  device: (): boolean => devices.real().platform === 'ios',
  options: { showRowLines: true },
}, {
  device: (): boolean => devices.real().deviceType !== 'desktop',
  options: {
    grouping: {
      expandMode: 'rowClick',
    },
  },
}, {
  device: (): boolean => isMaterial(current()),
  options: {
    showRowLines: true,
    showColumnLines: false,
    headerFilter: {
      height: 315,
    },
    editing: {
      useIcons: true,
    },
  },
},
{
  device: () => browser.webkit === true,
  options: {
    loadingTimeout: 30, // T344031
  },
},
]);
@Component({
  defaultOptionRules,
  jQuery: { register: true, component: DataGridBaseComponent },
  view: viewFunction,
})
export class DataGrid
  <TRowData,
   TKeyExpr extends string | string[],
   /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
   TKey=TKeyExpr extends keyof TRowData ? TRowData[TKeyExpr] : any,
   /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
   TColumns extends Column<TRowData, TKey, any>[]=Column<TRowData, TKey, any>[],
  >
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  extends JSXComponent<DataGridProps<any, string, any, Column<any, any, any>[]>>()
  implements DataGridForComponentWrapper<TRowData, TKeyExpr, TKey, TColumns> {
  @ForwardRef() widgetElementRef?: RefObject<HTMLDivElement>;

  @Mutable() instance!: GridInstance<TRowData, TKeyExpr, TKey, TColumns>;

  @InternalState() initialized = false;

  @Mutable() isTwoWayPropUpdating = false;

  @Mutable() prevProps!: DataGridProps<TRowData, TKeyExpr, TKey, TColumns>;

  get initializedInstance(): GridInstance<TRowData, TKeyExpr, TKey, TColumns> | undefined {
    return this.initialized ? this.instance : undefined;
  }

  @Method()
  getComponentInstance(): GridInstance<TRowData, TKeyExpr, TKey, TColumns> {
    return this.instance;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */

  // #region methods
  @Method()
  beginCustomLoading(messageText: string): void {
    return this.instance?.beginCustomLoading(messageText);
  }

  @Method()
  byKey(key: TKey): DxPromise<TRowData> {
    return this.instance?.byKey(key);
  }

  @Method()
  cancelEditData(): void {
    return this.instance?.cancelEditData();
  }

  @Method()
  cellValue(
    rowIndex: number,
    dataField: string | number,
    value?: TColumns[number] extends Column<TRowData, TKey, infer T> ? T : any,
  ): TColumns[number] extends Column<TRowData, TKey, infer T> ? T : any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.instance?.cellValue(rowIndex, dataField as any, value as any) as any;
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
  columnOption<T extends string>(
    id: number | string,
    optionName?: T,
    optionValue?: T extends keyof Column<TRowData, TKey, any>
      ? Column<TRowData, TKey, any>[T]
      : any,
  ): T extends keyof Column<TRowData, TKey, any> ? Column<TRowData, TKey, any>[T] : any {
    if (this.instance) {
      if (arguments.length === 1 || optionName === undefined) {
        return this.instance.columnOption(id);
      } if (arguments.length === 2) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.instance.columnOption(id, optionName);
      }
      return this.instance.columnOption(id, optionName, optionValue);
    }
    return null;
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
  deselectRows(keys: TKey[]): DxPromise<TRowData[]> {
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
  expandAdaptiveDetailRow(key: TKey): void {
    return this.instance?.expandAdaptiveDetailRow(key);
  }

  @Method()
  filter(filterExpr: FilterDescriptor): void {
    return this.instance?.filter(filterExpr);
  }

  @Method()
  focus(element?: UserDefinedElement): void {
    return this.instance?.focus(element as HTMLElement);
  }

  @Method()
  getCellElement(
    rowIndex: number, dataField: string | number,
  ): DxElement | undefined {
    return this.instance?.getCellElement(rowIndex, dataField as string);
  }

  @Method()
  getCombinedFilter(returnDataField?: boolean): FilterDescriptor {
    return this.instance?.getCombinedFilter(returnDataField as boolean);
  }

  @Method()
  getDataSource(): DataSource<TKey, TRowData> /* DataSource */ {
    return this.instance?.getDataSource();
  }

  @Method()
  getKeyByRowIndex(rowIndex: number): TKey {
    return this.instance?.getKeyByRowIndex(rowIndex);
  }

  @Method()
  getRowElement(rowIndex: number): UserDefinedElementsArray | undefined {
    return this.instance?.getRowElement(rowIndex);
  }

  @Method()
  getRowIndexByKey(key: TKey): number {
    return this.instance?.getRowIndexByKey(key);
  }

  @Method()
  getScrollable(): dxScrollable /* dxScrollable */ {
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
  isAdaptiveDetailRowExpanded(key: TKey): boolean {
    return this.instance?.isAdaptiveDetailRowExpanded(key);
  }

  @Method()
  isRowFocused(key: TKey): boolean {
    return this.instance?.isRowFocused(key);
  }

  @Method()
  isRowSelected(key: TKey): boolean {
    return this.instance?.isRowSelected(key);
  }

  @Method()
  keyOf(obj: TRowData): TKey {
    return this.instance?.keyOf(obj);
  }

  @Method()
  navigateToRow(key: TKey): DxPromise {
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
    keys: TKey[], preserve: boolean,
  ): DxPromise<TRowData[]> {
    return this.instance?.selectRows(keys, preserve);
  }

  @Method()
  selectRowsByIndexes(indexes: number[]): DxPromise<TRowData[]> {
    return this.instance?.selectRowsByIndexes(indexes);
  }

  @Method()
  showColumnChooser(): void {
    return this.instance?.showColumnChooser();
  }

  // @Method()
  // state(state?: State<TKey, TRowData, dxDataGrid<TKey, TRowData>>):
  // State<TKey, TRowData, dxDataGrid> | void {
  //   return this.instance?.state(state);
  // }

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
  addColumn(columnOptions: Column<TRowData, TKey, any> | string): void {
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
  collapseRow(key: TKey): DxPromise {
    return this.instance?.collapseRow(key);
  }

  @Method()
  expandAll(groupIndex?: number): void {
    return this.instance?.expandAll(groupIndex);
  }

  @Method()
  expandRow(key: TKey): DxPromise {
    return this.instance?.expandRow(key);
  }

  @Method()
  exportToExcel(selectionOnly: boolean): void {
    return this.instance?.exportToExcel(selectionOnly);
  }

  @Method()
  getSelectedRowKeys(): TKey[] | DxPromise<TKey[]> {
    return this.instance?.getSelectedRowKeys();
  }

  @Method()
  getSelectedRowsData(): TKey[] | DxPromise<TKey[]> {
    return this.instance?.getSelectedRowsData();
  }

  @Method()
  getTotalSummaryValue(summaryItemName: string): any {
    return this.instance?.getTotalSummaryValue(summaryItemName);
  }

  @Method()
  getVisibleColumns(headerLevel?: number): TColumns {
    return this.instance?.getVisibleColumns(headerLevel as number);
  }

  @Method()
  getVisibleRows(): RowObject<TRowData, TKey, TColumns>[] /* dxDataGridRowObject[] */ {
    return this.instance?.getVisibleRows();
  }

  @Method()
  isRowExpanded(key: TKey): boolean {
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
  getTopVisibleRowData(): TRowData {
    return this.instance?.getTopVisibleRowData();
  }

  @Method()
  getScrollbarWidth(isHorizontal: boolean): number {
    return this.instance?.getScrollbarWidth(isHorizontal);
  }

  @Method()
  getDataProvider(selectedRowsOnly: boolean): any {
    return this.instance?.getDataProvider(selectedRowsOnly);
  }

  // #endregion

  /* eslint-enable @typescript-eslint/no-explicit-any */
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */

  @Effect() updateOptions(): void {
    if (this.instance && this.prevProps && !this.isTwoWayPropUpdating) {
      const updatedOptions = getUpdatedOptions(this.prevProps, this.props);
      this.instance.beginUpdate();
      updatedOptions.forEach(({ path, value, previousValue }) => {
        // eslint-disable-next-line no-underscore-dangle
        this.instance._options.silent(path, previousValue);
        this.instance.option(path, value);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.prevProps = this.props as any;
      this.instance.endUpdate();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.prevProps = this.props as any;
    }
  }

  @Effect({ run: 'once' })
  dispose(): DisposeEffectReturn {
    return () => { this.instance.dispose(); };
  }

  @Effect({ run: 'once' })
  setupInstance(): void {
    const element = this.widgetElementRef?.current as HTMLElement;
    // TODO Vitik: Not only optionChanged should be rewrited.
    // All other events should be re-raised by renovated grid.

    const restAttributes = this.restAttributes as unknown as Record<string, unknown>;
    const { onInitialized, onContentReady } = restAttributes;

    const { onOptionChanged, ...restProps } = {
      ...this.props,
      onInitialized: (e: { component: GridInstance<TRowData, TKeyExpr, TKey, TColumns> }) => {
        this.instance = e.component;

        (onInitialized as (e: unknown) => void)?.(e);
      },
      onContentReady,
    } as unknown as Record<string, unknown>;

    new DataGridComponent(
      element,
      normalizeProps(restProps),
    ) as unknown as GridInstance<TRowData, TKeyExpr, TKey, TColumns>;
    if (hasWindow()) {
      this.instance.getController('resizing').updateSize(element);
    }

    this.instance.on('optionChanged', this.instanceOptionChangedHandler.bind(this));
    this.initialized = true;
  }

  instanceOptionChangedHandler(e: OptionChangedEvent<TKey, TRowData>): void {
    try {
      this.isTwoWayPropUpdating = true;
      this.updateTwoWayValue(e);
    } finally {
      this.isTwoWayPropUpdating = false;
    }
  }

  updateTwoWayValue(e: OptionChangedEvent<TKey, TRowData>): void {
    // T867777
    const optionValue = e.component.option(e.fullName);
    const isValueCorrect = e.value === optionValue;

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
      if (e.fullName === 'filterValue' && this.props.filterValue !== e.value) {
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

  onVisibilityChange(visible: boolean): void {
    if (visible) {
      this.instance?.updateDimensions();
    }
  }
}
