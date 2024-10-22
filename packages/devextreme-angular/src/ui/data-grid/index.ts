/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';

export { ExplicitTypes } from 'devextreme/ui/data_grid';

import DataSource from 'devextreme/data/data_source';
import { dxDataGridColumn, AdaptiveDetailRowPreparingEvent, CellClickEvent, CellDblClickEvent, CellHoverChangedEvent, CellPreparedEvent, ContentReadyEvent, ContextMenuPreparingEvent, DataErrorOccurredEvent, DisposingEvent, EditCanceledEvent, EditCancelingEvent, EditingStartEvent, EditorPreparedEvent, EditorPreparingEvent, ExportingEvent, FocusedCellChangedEvent, FocusedCellChangingEvent, FocusedRowChangedEvent, FocusedRowChangingEvent, InitializedEvent, InitNewRowEvent, KeyDownEvent, OptionChangedEvent, RowClickEvent, RowCollapsedEvent, RowCollapsingEvent, RowDblClickEvent, RowExpandedEvent, RowExpandingEvent, RowInsertedEvent, RowInsertingEvent, RowPreparedEvent, RowRemovedEvent, RowRemovingEvent, RowUpdatedEvent, RowUpdatingEvent, RowValidatingEvent, SavedEvent, SavingEvent, SelectionChangedEvent, ToolbarPreparingEvent, dxDataGridToolbar } from 'devextreme/ui/data_grid';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { dxFilterBuilderOptions } from 'devextreme/ui/filter_builder';
import { dxPopupOptions } from 'devextreme/ui/popup';
import { Pager } from 'devextreme/common/grids';

import DxDataGrid from 'devextreme/ui/data_grid';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoColumnChooserModule } from 'devextreme-angular/ui/nested';
import { DxoPositionModule } from 'devextreme-angular/ui/nested';
import { DxoAtModule } from 'devextreme-angular/ui/nested';
import { DxoBoundaryOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoCollisionModule } from 'devextreme-angular/ui/nested';
import { DxoMyModule } from 'devextreme-angular/ui/nested';
import { DxoOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoSearchModule } from 'devextreme-angular/ui/nested';
import { DxoSelectionModule } from 'devextreme-angular/ui/nested';
import { DxoColumnFixingModule } from 'devextreme-angular/ui/nested';
import { DxoIconsModule } from 'devextreme-angular/ui/nested';
import { DxoTextsModule } from 'devextreme-angular/ui/nested';
import { DxiColumnModule } from 'devextreme-angular/ui/nested';
import { DxiButtonModule } from 'devextreme-angular/ui/nested';
import { DxoHeaderFilterModule } from 'devextreme-angular/ui/nested';
import { DxoLookupModule } from 'devextreme-angular/ui/nested';
import { DxoFormatModule } from 'devextreme-angular/ui/nested';
import { DxoFormItemModule } from 'devextreme-angular/ui/nested';
import { DxoLabelModule } from 'devextreme-angular/ui/nested';
import { DxiValidationRuleModule } from 'devextreme-angular/ui/nested';
import { DxoEditingModule } from 'devextreme-angular/ui/nested';
import { DxiChangeModule } from 'devextreme-angular/ui/nested';
import { DxoFormModule } from 'devextreme-angular/ui/nested';
import { DxoColCountByScreenModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoTabPanelOptionsModule } from 'devextreme-angular/ui/nested';
import { DxiTabModule } from 'devextreme-angular/ui/nested';
import { DxoButtonOptionsModule } from 'devextreme-angular/ui/nested';
import { DxoPopupModule } from 'devextreme-angular/ui/nested';
import { DxoAnimationModule } from 'devextreme-angular/ui/nested';
import { DxoHideModule } from 'devextreme-angular/ui/nested';
import { DxoFromModule } from 'devextreme-angular/ui/nested';
import { DxoToModule } from 'devextreme-angular/ui/nested';
import { DxoShowModule } from 'devextreme-angular/ui/nested';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxoFilterBuilderModule } from 'devextreme-angular/ui/nested';
import { DxiCustomOperationModule } from 'devextreme-angular/ui/nested';
import { DxiFieldModule } from 'devextreme-angular/ui/nested';
import { DxoFilterOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoGroupOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoFilterBuilderPopupModule } from 'devextreme-angular/ui/nested';
import { DxoFilterPanelModule } from 'devextreme-angular/ui/nested';
import { DxoFilterRowModule } from 'devextreme-angular/ui/nested';
import { DxoOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoGroupingModule } from 'devextreme-angular/ui/nested';
import { DxoGroupPanelModule } from 'devextreme-angular/ui/nested';
import { DxoKeyboardNavigationModule } from 'devextreme-angular/ui/nested';
import { DxoLoadPanelModule } from 'devextreme-angular/ui/nested';
import { DxoMasterDetailModule } from 'devextreme-angular/ui/nested';
import { DxoPagerModule } from 'devextreme-angular/ui/nested';
import { DxoPagingModule } from 'devextreme-angular/ui/nested';
import { DxoRemoteOperationsModule } from 'devextreme-angular/ui/nested';
import { DxoRowDraggingModule } from 'devextreme-angular/ui/nested';
import { DxoCursorOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoScrollingModule } from 'devextreme-angular/ui/nested';
import { DxoSearchPanelModule } from 'devextreme-angular/ui/nested';
import { DxiSortByGroupSummaryInfoModule } from 'devextreme-angular/ui/nested';
import { DxoSortingModule } from 'devextreme-angular/ui/nested';
import { DxoStateStoringModule } from 'devextreme-angular/ui/nested';
import { DxoSummaryModule } from 'devextreme-angular/ui/nested';
import { DxiGroupItemModule } from 'devextreme-angular/ui/nested';
import { DxoValueFormatModule } from 'devextreme-angular/ui/nested';
import { DxiTotalItemModule } from 'devextreme-angular/ui/nested';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';

import { DxoDataGridAnimationModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridAsyncRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridAtModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridBoundaryOffsetModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridButtonModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridChangeModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridColCountByScreenModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridCollisionModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridColumnModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridColumnChooserModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridColumnChooserSearchModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridColumnChooserSelectionModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridColumnFixingModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridColumnFixingTextsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridColumnHeaderFilterModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridColumnHeaderFilterSearchModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridColumnLookupModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridCompareRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridCursorOffsetModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridCustomOperationModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridCustomRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridDataGridHeaderFilterModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridDataGridHeaderFilterSearchModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridDataGridHeaderFilterTextsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridDataGridSelectionModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridEditingModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridEditingTextsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridEmailRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridExportModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridExportTextsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridFieldModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFieldLookupModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFilterBuilderModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFilterBuilderPopupModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFilterOperationDescriptionsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFilterPanelModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFilterPanelTextsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFilterRowModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFormModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFormatModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFormItemModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridFromModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridGroupingModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridGroupingTextsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridGroupItemModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridGroupOperationDescriptionsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridGroupPanelModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridHeaderFilterModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridHideModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridIconsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridItemModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridKeyboardNavigationModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridLabelModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridLoadPanelModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridLookupModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridMasterDetailModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridMyModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridNumericRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridOffsetModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridOperationDescriptionsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridPagerModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridPagingModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridPatternRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridPopupModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridPositionModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridRangeRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridRemoteOperationsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridRequiredRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridRowDraggingModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridScrollingModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridSearchModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridSearchPanelModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridSelectionModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridShowModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridSortByGroupSummaryInfoModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridSortingModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridStateStoringModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridStringLengthRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridSummaryModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridSummaryTextsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridTextsModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridToModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridToolbarModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridToolbarItemModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridTotalItemModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridValidationRuleModule } from 'devextreme-angular/ui/data-grid/nested';
import { DxoDataGridValueFormatModule } from 'devextreme-angular/ui/data-grid/nested';

import { DxiColumnComponent } from 'devextreme-angular/ui/nested';
import { DxiSortByGroupSummaryInfoComponent } from 'devextreme-angular/ui/nested';

import { DxiDataGridColumnComponent } from 'devextreme-angular/ui/data-grid/nested';
import { DxiDataGridSortByGroupSummaryInfoComponent } from 'devextreme-angular/ui/data-grid/nested';


/**
 * [descr:dxDataGrid]

 */
@Component({
    selector: 'dx-data-grid',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxDataGridComponent<TRowData = any, TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxDataGrid<TRowData, TKey> = null;

    /**
     * [descr:WidgetOptions.accessKey]
    
     */
    @Input()
    get accessKey(): string {
        return this._getOption('accessKey');
    }
    set accessKey(value: string) {
        this._setOption('accessKey', value);
    }


    /**
     * [descr:WidgetOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:GridBaseOptions.allowColumnReordering]
    
     */
    @Input()
    get allowColumnReordering(): boolean {
        return this._getOption('allowColumnReordering');
    }
    set allowColumnReordering(value: boolean) {
        this._setOption('allowColumnReordering', value);
    }


    /**
     * [descr:GridBaseOptions.allowColumnResizing]
    
     */
    @Input()
    get allowColumnResizing(): boolean {
        return this._getOption('allowColumnResizing');
    }
    set allowColumnResizing(value: boolean) {
        this._setOption('allowColumnResizing', value);
    }


    /**
     * [descr:GridBaseOptions.autoNavigateToFocusedRow]
    
     */
    @Input()
    get autoNavigateToFocusedRow(): boolean {
        return this._getOption('autoNavigateToFocusedRow');
    }
    set autoNavigateToFocusedRow(value: boolean) {
        this._setOption('autoNavigateToFocusedRow', value);
    }


    /**
     * [descr:GridBaseOptions.cacheEnabled]
    
     */
    @Input()
    get cacheEnabled(): boolean {
        return this._getOption('cacheEnabled');
    }
    set cacheEnabled(value: boolean) {
        this._setOption('cacheEnabled', value);
    }


    /**
     * [descr:GridBaseOptions.cellHintEnabled]
    
     */
    @Input()
    get cellHintEnabled(): boolean {
        return this._getOption('cellHintEnabled');
    }
    set cellHintEnabled(value: boolean) {
        this._setOption('cellHintEnabled', value);
    }


    /**
     * [descr:GridBaseOptions.columnAutoWidth]
    
     */
    @Input()
    get columnAutoWidth(): boolean {
        return this._getOption('columnAutoWidth');
    }
    set columnAutoWidth(value: boolean) {
        this._setOption('columnAutoWidth', value);
    }


    /**
     * [descr:GridBaseOptions.columnChooser]
    
     */
    @Input()
    get columnChooser(): Record<string, any> {
        return this._getOption('columnChooser');
    }
    set columnChooser(value: Record<string, any>) {
        this._setOption('columnChooser', value);
    }


    /**
     * [descr:GridBaseOptions.columnFixing]
    
     */
    @Input()
    get columnFixing(): Record<string, any> {
        return this._getOption('columnFixing');
    }
    set columnFixing(value: Record<string, any>) {
        this._setOption('columnFixing', value);
    }


    /**
     * [descr:GridBaseOptions.columnHidingEnabled]
    
     */
    @Input()
    get columnHidingEnabled(): boolean {
        return this._getOption('columnHidingEnabled');
    }
    set columnHidingEnabled(value: boolean) {
        this._setOption('columnHidingEnabled', value);
    }


    /**
     * [descr:GridBaseOptions.columnMinWidth]
    
     */
    @Input()
    get columnMinWidth(): number {
        return this._getOption('columnMinWidth');
    }
    set columnMinWidth(value: number) {
        this._setOption('columnMinWidth', value);
    }


    /**
     * [descr:GridBaseOptions.columnResizingMode]
    
     */
    @Input()
    get columnResizingMode(): "nextColumn" | "widget" {
        return this._getOption('columnResizingMode');
    }
    set columnResizingMode(value: "nextColumn" | "widget") {
        this._setOption('columnResizingMode', value);
    }


    /**
     * [descr:dxDataGridOptions.columns]
    
     */
    @Input()
    get columns(): Array<dxDataGridColumn | string> {
        return this._getOption('columns');
    }
    set columns(value: Array<dxDataGridColumn | string>) {
        this._setOption('columns', value);
    }


    /**
     * [descr:GridBaseOptions.columnWidth]
    
     */
    @Input()
    get columnWidth(): number | "auto" {
        return this._getOption('columnWidth');
    }
    set columnWidth(value: number | "auto") {
        this._setOption('columnWidth', value);
    }


    /**
     * [descr:dxDataGridOptions.customizeColumns]
    
     */
    @Input()
    get customizeColumns(): ((columns: Array<dxDataGridColumn>) => void) {
        return this._getOption('customizeColumns');
    }
    set customizeColumns(value: ((columns: Array<dxDataGridColumn>) => void)) {
        this._setOption('customizeColumns', value);
    }


    /**
     * [descr:dxDataGridOptions.dataRowTemplate]
    
     */
    @Input()
    get dataRowTemplate(): any {
        return this._getOption('dataRowTemplate');
    }
    set dataRowTemplate(value: any) {
        this._setOption('dataRowTemplate', value);
    }


    /**
     * [descr:GridBaseOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<any> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<any> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:GridBaseOptions.dateSerializationFormat]
    
     */
    @Input()
    get dateSerializationFormat(): string {
        return this._getOption('dateSerializationFormat');
    }
    set dateSerializationFormat(value: string) {
        this._setOption('dateSerializationFormat', value);
    }


    /**
     * [descr:WidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:dxDataGridOptions.editing]
    
     */
    @Input()
    get editing(): Record<string, any> {
        return this._getOption('editing');
    }
    set editing(value: Record<string, any>) {
        this._setOption('editing', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:GridBaseOptions.errorRowEnabled]
    
     */
    @Input()
    get errorRowEnabled(): boolean {
        return this._getOption('errorRowEnabled');
    }
    set errorRowEnabled(value: boolean) {
        this._setOption('errorRowEnabled', value);
    }


    /**
     * [descr:dxDataGridOptions.export]
    
     */
    @Input()
    get export(): Record<string, any> {
        return this._getOption('export');
    }
    set export(value: Record<string, any>) {
        this._setOption('export', value);
    }


    /**
     * [descr:GridBaseOptions.filterBuilder]
    
     */
    @Input()
    get filterBuilder(): dxFilterBuilderOptions {
        return this._getOption('filterBuilder');
    }
    set filterBuilder(value: dxFilterBuilderOptions) {
        this._setOption('filterBuilder', value);
    }


    /**
     * [descr:GridBaseOptions.filterBuilderPopup]
    
     */
    @Input()
    get filterBuilderPopup(): dxPopupOptions<any> {
        return this._getOption('filterBuilderPopup');
    }
    set filterBuilderPopup(value: dxPopupOptions<any>) {
        this._setOption('filterBuilderPopup', value);
    }


    /**
     * [descr:GridBaseOptions.filterPanel]
    
     */
    @Input()
    get filterPanel(): Record<string, any> {
        return this._getOption('filterPanel');
    }
    set filterPanel(value: Record<string, any>) {
        this._setOption('filterPanel', value);
    }


    /**
     * [descr:GridBaseOptions.filterRow]
    
     */
    @Input()
    get filterRow(): Record<string, any> {
        return this._getOption('filterRow');
    }
    set filterRow(value: Record<string, any>) {
        this._setOption('filterRow', value);
    }


    /**
     * [descr:GridBaseOptions.filterSyncEnabled]
    
     */
    @Input()
    get filterSyncEnabled(): boolean | "auto" {
        return this._getOption('filterSyncEnabled');
    }
    set filterSyncEnabled(value: boolean | "auto") {
        this._setOption('filterSyncEnabled', value);
    }


    /**
     * [descr:GridBaseOptions.filterValue]
    
     */
    @Input()
    get filterValue(): Array<any> | (() => any) | string {
        return this._getOption('filterValue');
    }
    set filterValue(value: Array<any> | (() => any) | string) {
        this._setOption('filterValue', value);
    }


    /**
     * [descr:GridBaseOptions.focusedColumnIndex]
    
     */
    @Input()
    get focusedColumnIndex(): number {
        return this._getOption('focusedColumnIndex');
    }
    set focusedColumnIndex(value: number) {
        this._setOption('focusedColumnIndex', value);
    }


    /**
     * [descr:GridBaseOptions.focusedRowEnabled]
    
     */
    @Input()
    get focusedRowEnabled(): boolean {
        return this._getOption('focusedRowEnabled');
    }
    set focusedRowEnabled(value: boolean) {
        this._setOption('focusedRowEnabled', value);
    }


    /**
     * [descr:GridBaseOptions.focusedRowIndex]
    
     */
    @Input()
    get focusedRowIndex(): number {
        return this._getOption('focusedRowIndex');
    }
    set focusedRowIndex(value: number) {
        this._setOption('focusedRowIndex', value);
    }


    /**
     * [descr:GridBaseOptions.focusedRowKey]
    
     */
    @Input()
    get focusedRowKey(): any {
        return this._getOption('focusedRowKey');
    }
    set focusedRowKey(value: any) {
        this._setOption('focusedRowKey', value);
    }


    /**
     * [descr:dxDataGridOptions.grouping]
    
     */
    @Input()
    get grouping(): Record<string, any> {
        return this._getOption('grouping');
    }
    set grouping(value: Record<string, any>) {
        this._setOption('grouping', value);
    }


    /**
     * [descr:dxDataGridOptions.groupPanel]
    
     */
    @Input()
    get groupPanel(): Record<string, any> {
        return this._getOption('groupPanel');
    }
    set groupPanel(value: Record<string, any>) {
        this._setOption('groupPanel', value);
    }


    /**
     * [descr:GridBaseOptions.headerFilter]
    
     */
    @Input()
    get headerFilter(): Record<string, any> {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: Record<string, any>) {
        this._setOption('headerFilter', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }


    /**
     * [descr:GridBaseOptions.highlightChanges]
    
     */
    @Input()
    get highlightChanges(): boolean {
        return this._getOption('highlightChanges');
    }
    set highlightChanges(value: boolean) {
        this._setOption('highlightChanges', value);
    }


    /**
     * [descr:WidgetOptions.hint]
    
     */
    @Input()
    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
        this._setOption('hint', value);
    }


    /**
     * [descr:WidgetOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:GridBaseOptions.keyboardNavigation]
    
     */
    @Input()
    get keyboardNavigation(): Record<string, any> {
        return this._getOption('keyboardNavigation');
    }
    set keyboardNavigation(value: Record<string, any>) {
        this._setOption('keyboardNavigation', value);
    }


    /**
     * [descr:dxDataGridOptions.keyExpr]
    
     */
    @Input()
    get keyExpr(): Array<string> | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Array<string> | string) {
        this._setOption('keyExpr', value);
    }


    /**
     * [descr:GridBaseOptions.loadPanel]
    
     */
    @Input()
    get loadPanel(): Record<string, any> {
        return this._getOption('loadPanel');
    }
    set loadPanel(value: Record<string, any>) {
        this._setOption('loadPanel', value);
    }


    /**
     * [descr:dxDataGridOptions.masterDetail]
    
     */
    @Input()
    get masterDetail(): Record<string, any> {
        return this._getOption('masterDetail');
    }
    set masterDetail(value: Record<string, any>) {
        this._setOption('masterDetail', value);
    }


    /**
     * [descr:GridBaseOptions.noDataText]
    
     */
    @Input()
    get noDataText(): string {
        return this._getOption('noDataText');
    }
    set noDataText(value: string) {
        this._setOption('noDataText', value);
    }


    /**
     * [descr:GridBaseOptions.pager]
    
     */
    @Input()
    get pager(): Pager {
        return this._getOption('pager');
    }
    set pager(value: Pager) {
        this._setOption('pager', value);
    }


    /**
     * [descr:GridBaseOptions.paging]
    
     */
    @Input()
    get paging(): Record<string, any> {
        return this._getOption('paging');
    }
    set paging(value: Record<string, any>) {
        this._setOption('paging', value);
    }


    /**
     * [descr:dxDataGridOptions.remoteOperations]
    
     */
    @Input()
    get remoteOperations(): boolean | Record<string, any> | "auto" {
        return this._getOption('remoteOperations');
    }
    set remoteOperations(value: boolean | Record<string, any> | "auto") {
        this._setOption('remoteOperations', value);
    }


    /**
     * [descr:GridBaseOptions.renderAsync]
    
     */
    @Input()
    get renderAsync(): boolean {
        return this._getOption('renderAsync');
    }
    set renderAsync(value: boolean) {
        this._setOption('renderAsync', value);
    }


    /**
     * [descr:GridBaseOptions.repaintChangesOnly]
    
     */
    @Input()
    get repaintChangesOnly(): boolean {
        return this._getOption('repaintChangesOnly');
    }
    set repaintChangesOnly(value: boolean) {
        this._setOption('repaintChangesOnly', value);
    }


    /**
     * [descr:GridBaseOptions.rowAlternationEnabled]
    
     */
    @Input()
    get rowAlternationEnabled(): boolean {
        return this._getOption('rowAlternationEnabled');
    }
    set rowAlternationEnabled(value: boolean) {
        this._setOption('rowAlternationEnabled', value);
    }


    /**
     * [descr:GridBaseOptions.rowDragging]
    
     */
    @Input()
    get rowDragging(): Record<string, any> {
        return this._getOption('rowDragging');
    }
    set rowDragging(value: Record<string, any>) {
        this._setOption('rowDragging', value);
    }


    /**
     * [descr:dxDataGridOptions.rowTemplate]
    
     * @deprecated [depNote:dxDataGridOptions.rowTemplate]
    
     */
    @Input()
    get rowTemplate(): any {
        return this._getOption('rowTemplate');
    }
    set rowTemplate(value: any) {
        this._setOption('rowTemplate', value);
    }


    /**
     * [descr:DOMComponentOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxDataGridOptions.scrolling]
    
     */
    @Input()
    get scrolling(): Record<string, any> {
        return this._getOption('scrolling');
    }
    set scrolling(value: Record<string, any>) {
        this._setOption('scrolling', value);
    }


    /**
     * [descr:GridBaseOptions.searchPanel]
    
     */
    @Input()
    get searchPanel(): Record<string, any> {
        return this._getOption('searchPanel');
    }
    set searchPanel(value: Record<string, any>) {
        this._setOption('searchPanel', value);
    }


    /**
     * [descr:GridBaseOptions.selectedRowKeys]
    
     */
    @Input()
    get selectedRowKeys(): Array<any> {
        return this._getOption('selectedRowKeys');
    }
    set selectedRowKeys(value: Array<any>) {
        this._setOption('selectedRowKeys', value);
    }


    /**
     * [descr:dxDataGridOptions.selection]
    
     */
    @Input()
    get selection(): Record<string, any> {
        return this._getOption('selection');
    }
    set selection(value: Record<string, any>) {
        this._setOption('selection', value);
    }


    /**
     * [descr:dxDataGridOptions.selectionFilter]
    
     */
    @Input()
    get selectionFilter(): Array<any> | (() => any) | string {
        return this._getOption('selectionFilter');
    }
    set selectionFilter(value: Array<any> | (() => any) | string) {
        this._setOption('selectionFilter', value);
    }


    /**
     * [descr:GridBaseOptions.showBorders]
    
     */
    @Input()
    get showBorders(): boolean {
        return this._getOption('showBorders');
    }
    set showBorders(value: boolean) {
        this._setOption('showBorders', value);
    }


    /**
     * [descr:GridBaseOptions.showColumnHeaders]
    
     */
    @Input()
    get showColumnHeaders(): boolean {
        return this._getOption('showColumnHeaders');
    }
    set showColumnHeaders(value: boolean) {
        this._setOption('showColumnHeaders', value);
    }


    /**
     * [descr:GridBaseOptions.showColumnLines]
    
     */
    @Input()
    get showColumnLines(): boolean {
        return this._getOption('showColumnLines');
    }
    set showColumnLines(value: boolean) {
        this._setOption('showColumnLines', value);
    }


    /**
     * [descr:GridBaseOptions.showRowLines]
    
     */
    @Input()
    get showRowLines(): boolean {
        return this._getOption('showRowLines');
    }
    set showRowLines(value: boolean) {
        this._setOption('showRowLines', value);
    }


    /**
     * [descr:dxDataGridOptions.sortByGroupSummaryInfo]
    
     */
    @Input()
    get sortByGroupSummaryInfo(): Array<Record<string, any>> {
        return this._getOption('sortByGroupSummaryInfo');
    }
    set sortByGroupSummaryInfo(value: Array<Record<string, any>>) {
        this._setOption('sortByGroupSummaryInfo', value);
    }


    /**
     * [descr:GridBaseOptions.sorting]
    
     */
    @Input()
    get sorting(): Record<string, any> {
        return this._getOption('sorting');
    }
    set sorting(value: Record<string, any>) {
        this._setOption('sorting', value);
    }


    /**
     * [descr:GridBaseOptions.stateStoring]
    
     */
    @Input()
    get stateStoring(): Record<string, any> {
        return this._getOption('stateStoring');
    }
    set stateStoring(value: Record<string, any>) {
        this._setOption('stateStoring', value);
    }


    /**
     * [descr:dxDataGridOptions.summary]
    
     */
    @Input()
    get summary(): Record<string, any> {
        return this._getOption('summary');
    }
    set summary(value: Record<string, any>) {
        this._setOption('summary', value);
    }


    /**
     * [descr:GridBaseOptions.syncLookupFilterValues]
    
     */
    @Input()
    get syncLookupFilterValues(): boolean {
        return this._getOption('syncLookupFilterValues');
    }
    set syncLookupFilterValues(value: boolean) {
        this._setOption('syncLookupFilterValues', value);
    }


    /**
     * [descr:WidgetOptions.tabIndex]
    
     */
    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }


    /**
     * [descr:dxDataGridOptions.toolbar]
    
     */
    @Input()
    get toolbar(): dxDataGridToolbar {
        return this._getOption('toolbar');
    }
    set toolbar(value: dxDataGridToolbar) {
        this._setOption('toolbar', value);
    }


    /**
     * [descr:GridBaseOptions.twoWayBindingEnabled]
    
     */
    @Input()
    get twoWayBindingEnabled(): boolean {
        return this._getOption('twoWayBindingEnabled');
    }
    set twoWayBindingEnabled(value: boolean) {
        this._setOption('twoWayBindingEnabled', value);
    }


    /**
     * [descr:WidgetOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }


    /**
     * [descr:GridBaseOptions.wordWrapEnabled]
    
     */
    @Input()
    get wordWrapEnabled(): boolean {
        return this._getOption('wordWrapEnabled');
    }
    set wordWrapEnabled(value: boolean) {
        this._setOption('wordWrapEnabled', value);
    }

    /**
    
     * [descr:dxDataGridOptions.onAdaptiveDetailRowPreparing]
    
    
     */
    @Output() onAdaptiveDetailRowPreparing: EventEmitter<AdaptiveDetailRowPreparingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onCellClick]
    
    
     */
    @Output() onCellClick: EventEmitter<CellClickEvent>;

    /**
    
     * [descr:dxDataGridOptions.onCellDblClick]
    
    
     */
    @Output() onCellDblClick: EventEmitter<CellDblClickEvent>;

    /**
    
     * [descr:dxDataGridOptions.onCellHoverChanged]
    
    
     */
    @Output() onCellHoverChanged: EventEmitter<CellHoverChangedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onCellPrepared]
    
    
     */
    @Output() onCellPrepared: EventEmitter<CellPreparedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxDataGridOptions.onContextMenuPreparing]
    
    
     */
    @Output() onContextMenuPreparing: EventEmitter<ContextMenuPreparingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onDataErrorOccurred]
    
    
     */
    @Output() onDataErrorOccurred: EventEmitter<DataErrorOccurredEvent>;

    /**
    
     * [descr:dxDataGridOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onEditCanceled]
    
    
     */
    @Output() onEditCanceled: EventEmitter<EditCanceledEvent>;

    /**
    
     * [descr:dxDataGridOptions.onEditCanceling]
    
    
     */
    @Output() onEditCanceling: EventEmitter<EditCancelingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onEditingStart]
    
    
     */
    @Output() onEditingStart: EventEmitter<EditingStartEvent>;

    /**
    
     * [descr:dxDataGridOptions.onEditorPrepared]
    
    
     */
    @Output() onEditorPrepared: EventEmitter<EditorPreparedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onEditorPreparing]
    
    
     */
    @Output() onEditorPreparing: EventEmitter<EditorPreparingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onExporting]
    
    
     */
    @Output() onExporting: EventEmitter<ExportingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onFocusedCellChanged]
    
    
     */
    @Output() onFocusedCellChanged: EventEmitter<FocusedCellChangedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onFocusedCellChanging]
    
    
     */
    @Output() onFocusedCellChanging: EventEmitter<FocusedCellChangingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onFocusedRowChanged]
    
    
     */
    @Output() onFocusedRowChanged: EventEmitter<FocusedRowChangedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onFocusedRowChanging]
    
    
     */
    @Output() onFocusedRowChanging: EventEmitter<FocusedRowChangingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onInitNewRow]
    
    
     */
    @Output() onInitNewRow: EventEmitter<InitNewRowEvent>;

    /**
    
     * [descr:dxDataGridOptions.onKeyDown]
    
    
     */
    @Output() onKeyDown: EventEmitter<KeyDownEvent>;

    /**
    
     * [descr:dxDataGridOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowClick]
    
    
     */
    @Output() onRowClick: EventEmitter<RowClickEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowCollapsed]
    
    
     */
    @Output() onRowCollapsed: EventEmitter<RowCollapsedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowCollapsing]
    
    
     */
    @Output() onRowCollapsing: EventEmitter<RowCollapsingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowDblClick]
    
    
     */
    @Output() onRowDblClick: EventEmitter<RowDblClickEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowExpanded]
    
    
     */
    @Output() onRowExpanded: EventEmitter<RowExpandedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowExpanding]
    
    
     */
    @Output() onRowExpanding: EventEmitter<RowExpandingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowInserted]
    
    
     */
    @Output() onRowInserted: EventEmitter<RowInsertedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowInserting]
    
    
     */
    @Output() onRowInserting: EventEmitter<RowInsertingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowPrepared]
    
    
     */
    @Output() onRowPrepared: EventEmitter<RowPreparedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowRemoved]
    
    
     */
    @Output() onRowRemoved: EventEmitter<RowRemovedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowRemoving]
    
    
     */
    @Output() onRowRemoving: EventEmitter<RowRemovingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowUpdated]
    
    
     */
    @Output() onRowUpdated: EventEmitter<RowUpdatedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowUpdating]
    
    
     */
    @Output() onRowUpdating: EventEmitter<RowUpdatingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onRowValidating]
    
    
     */
    @Output() onRowValidating: EventEmitter<RowValidatingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onSaved]
    
    
     */
    @Output() onSaved: EventEmitter<SavedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onSaving]
    
    
     */
    @Output() onSaving: EventEmitter<SavingEvent>;

    /**
    
     * [descr:dxDataGridOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxDataGridOptions.onToolbarPreparing]
    
    
     */
    @Output() onToolbarPreparing: EventEmitter<ToolbarPreparingEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() activeStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowColumnReorderingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowColumnResizingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() autoNavigateToFocusedRowChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cacheEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() cellHintEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnAutoWidthChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnChooserChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnFixingChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnHidingEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnMinWidthChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnResizingModeChange: EventEmitter<"nextColumn" | "widget">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnsChange: EventEmitter<Array<dxDataGridColumn | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnWidthChange: EventEmitter<number | "auto">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeColumnsChange: EventEmitter<((columns: Array<dxDataGridColumn>) => void)>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataRowTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<any> | DataSource | DataSourceOptions | null | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dateSerializationFormatChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() editingChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() errorRowEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() exportChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterBuilderChange: EventEmitter<dxFilterBuilderOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterBuilderPopupChange: EventEmitter<dxPopupOptions<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterPanelChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterRowChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterSyncEnabledChange: EventEmitter<boolean | "auto">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterValueChange: EventEmitter<Array<any> | (() => any) | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusedColumnIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusedRowEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusedRowIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusedRowKeyChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupingChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() groupPanelChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() headerFilterChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() highlightChangesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hintChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() keyboardNavigationChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() keyExprChange: EventEmitter<Array<string> | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadPanelChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() masterDetailChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() noDataTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pagerChange: EventEmitter<Pager>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pagingChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() remoteOperationsChange: EventEmitter<boolean | Record<string, any> | "auto">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() renderAsyncChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() repaintChangesOnlyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rowAlternationEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rowDraggingChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rowTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollingChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchPanelChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedRowKeysChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionFilterChange: EventEmitter<Array<any> | (() => any) | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showBordersChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showColumnHeadersChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showColumnLinesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showRowLinesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortByGroupSummaryInfoChange: EventEmitter<Array<Record<string, any>>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() sortingChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stateStoringChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() summaryChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() syncLookupFilterValuesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() toolbarChange: EventEmitter<dxDataGridToolbar>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() twoWayBindingEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() wordWrapEnabledChange: EventEmitter<boolean>;




    @ContentChildren(DxiDataGridColumnComponent)
    get columnsChildren(): QueryList<DxiDataGridColumnComponent> {
        return this._getOption('columns');
    }
    set columnsChildren(value) {
        this.setContentChildren('columns', value, 'DxiDataGridColumnComponent');
        this.setChildren('columns', value);
    }

    @ContentChildren(DxiDataGridSortByGroupSummaryInfoComponent)
    get sortByGroupSummaryInfoChildren(): QueryList<DxiDataGridSortByGroupSummaryInfoComponent> {
        return this._getOption('sortByGroupSummaryInfo');
    }
    set sortByGroupSummaryInfoChildren(value) {
        this.setContentChildren('sortByGroupSummaryInfo', value, 'DxiDataGridSortByGroupSummaryInfoComponent');
        this.setChildren('sortByGroupSummaryInfo', value);
    }


    @ContentChildren(DxiColumnComponent)
    get columnsLegacyChildren(): QueryList<DxiColumnComponent> {
        return this._getOption('columns');
    }
    set columnsLegacyChildren(value) {
        if (this.checkContentChildren('columns', value, 'DxiColumnComponent')) {
           this.setChildren('columns', value);
        }
    }

    @ContentChildren(DxiSortByGroupSummaryInfoComponent)
    get sortByGroupSummaryInfoLegacyChildren(): QueryList<DxiSortByGroupSummaryInfoComponent> {
        return this._getOption('sortByGroupSummaryInfo');
    }
    set sortByGroupSummaryInfoLegacyChildren(value) {
        if (this.checkContentChildren('sortByGroupSummaryInfo', value, 'DxiSortByGroupSummaryInfoComponent')) {
           this.setChildren('sortByGroupSummaryInfo', value);
        }
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'adaptiveDetailRowPreparing', emit: 'onAdaptiveDetailRowPreparing' },
            { subscribe: 'cellClick', emit: 'onCellClick' },
            { subscribe: 'cellDblClick', emit: 'onCellDblClick' },
            { subscribe: 'cellHoverChanged', emit: 'onCellHoverChanged' },
            { subscribe: 'cellPrepared', emit: 'onCellPrepared' },
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'contextMenuPreparing', emit: 'onContextMenuPreparing' },
            { subscribe: 'dataErrorOccurred', emit: 'onDataErrorOccurred' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'editCanceled', emit: 'onEditCanceled' },
            { subscribe: 'editCanceling', emit: 'onEditCanceling' },
            { subscribe: 'editingStart', emit: 'onEditingStart' },
            { subscribe: 'editorPrepared', emit: 'onEditorPrepared' },
            { subscribe: 'editorPreparing', emit: 'onEditorPreparing' },
            { subscribe: 'exporting', emit: 'onExporting' },
            { subscribe: 'focusedCellChanged', emit: 'onFocusedCellChanged' },
            { subscribe: 'focusedCellChanging', emit: 'onFocusedCellChanging' },
            { subscribe: 'focusedRowChanged', emit: 'onFocusedRowChanged' },
            { subscribe: 'focusedRowChanging', emit: 'onFocusedRowChanging' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'initNewRow', emit: 'onInitNewRow' },
            { subscribe: 'keyDown', emit: 'onKeyDown' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'rowClick', emit: 'onRowClick' },
            { subscribe: 'rowCollapsed', emit: 'onRowCollapsed' },
            { subscribe: 'rowCollapsing', emit: 'onRowCollapsing' },
            { subscribe: 'rowDblClick', emit: 'onRowDblClick' },
            { subscribe: 'rowExpanded', emit: 'onRowExpanded' },
            { subscribe: 'rowExpanding', emit: 'onRowExpanding' },
            { subscribe: 'rowInserted', emit: 'onRowInserted' },
            { subscribe: 'rowInserting', emit: 'onRowInserting' },
            { subscribe: 'rowPrepared', emit: 'onRowPrepared' },
            { subscribe: 'rowRemoved', emit: 'onRowRemoved' },
            { subscribe: 'rowRemoving', emit: 'onRowRemoving' },
            { subscribe: 'rowUpdated', emit: 'onRowUpdated' },
            { subscribe: 'rowUpdating', emit: 'onRowUpdating' },
            { subscribe: 'rowValidating', emit: 'onRowValidating' },
            { subscribe: 'saved', emit: 'onSaved' },
            { subscribe: 'saving', emit: 'onSaving' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { subscribe: 'toolbarPreparing', emit: 'onToolbarPreparing' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'allowColumnReorderingChange' },
            { emit: 'allowColumnResizingChange' },
            { emit: 'autoNavigateToFocusedRowChange' },
            { emit: 'cacheEnabledChange' },
            { emit: 'cellHintEnabledChange' },
            { emit: 'columnAutoWidthChange' },
            { emit: 'columnChooserChange' },
            { emit: 'columnFixingChange' },
            { emit: 'columnHidingEnabledChange' },
            { emit: 'columnMinWidthChange' },
            { emit: 'columnResizingModeChange' },
            { emit: 'columnsChange' },
            { emit: 'columnWidthChange' },
            { emit: 'customizeColumnsChange' },
            { emit: 'dataRowTemplateChange' },
            { emit: 'dataSourceChange' },
            { emit: 'dateSerializationFormatChange' },
            { emit: 'disabledChange' },
            { emit: 'editingChange' },
            { emit: 'elementAttrChange' },
            { emit: 'errorRowEnabledChange' },
            { emit: 'exportChange' },
            { emit: 'filterBuilderChange' },
            { emit: 'filterBuilderPopupChange' },
            { emit: 'filterPanelChange' },
            { emit: 'filterRowChange' },
            { emit: 'filterSyncEnabledChange' },
            { emit: 'filterValueChange' },
            { emit: 'focusedColumnIndexChange' },
            { emit: 'focusedRowEnabledChange' },
            { emit: 'focusedRowIndexChange' },
            { emit: 'focusedRowKeyChange' },
            { emit: 'groupingChange' },
            { emit: 'groupPanelChange' },
            { emit: 'headerFilterChange' },
            { emit: 'heightChange' },
            { emit: 'highlightChangesChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'keyboardNavigationChange' },
            { emit: 'keyExprChange' },
            { emit: 'loadPanelChange' },
            { emit: 'masterDetailChange' },
            { emit: 'noDataTextChange' },
            { emit: 'pagerChange' },
            { emit: 'pagingChange' },
            { emit: 'remoteOperationsChange' },
            { emit: 'renderAsyncChange' },
            { emit: 'repaintChangesOnlyChange' },
            { emit: 'rowAlternationEnabledChange' },
            { emit: 'rowDraggingChange' },
            { emit: 'rowTemplateChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scrollingChange' },
            { emit: 'searchPanelChange' },
            { emit: 'selectedRowKeysChange' },
            { emit: 'selectionChange' },
            { emit: 'selectionFilterChange' },
            { emit: 'showBordersChange' },
            { emit: 'showColumnHeadersChange' },
            { emit: 'showColumnLinesChange' },
            { emit: 'showRowLinesChange' },
            { emit: 'sortByGroupSummaryInfoChange' },
            { emit: 'sortingChange' },
            { emit: 'stateStoringChange' },
            { emit: 'summaryChange' },
            { emit: 'syncLookupFilterValuesChange' },
            { emit: 'tabIndexChange' },
            { emit: 'toolbarChange' },
            { emit: 'twoWayBindingEnabledChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'wordWrapEnabledChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxDataGrid(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('columns', changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('keyExpr', changes);
        this.setupChanges('selectedRowKeys', changes);
        this.setupChanges('sortByGroupSummaryInfo', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('columns');
        this._idh.doCheck('dataSource');
        this._idh.doCheck('keyExpr');
        this._idh.doCheck('selectedRowKeys');
        this._idh.doCheck('sortByGroupSummaryInfo');
        this._watcherHelper.checkWatchers();
        super.ngDoCheck();
        super.clearChangedOptions();
    }

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
  imports: [
    DxoColumnChooserModule,
    DxoPositionModule,
    DxoAtModule,
    DxoBoundaryOffsetModule,
    DxoCollisionModule,
    DxoMyModule,
    DxoOffsetModule,
    DxoSearchModule,
    DxoSelectionModule,
    DxoColumnFixingModule,
    DxoIconsModule,
    DxoTextsModule,
    DxiColumnModule,
    DxiButtonModule,
    DxoHeaderFilterModule,
    DxoLookupModule,
    DxoFormatModule,
    DxoFormItemModule,
    DxoLabelModule,
    DxiValidationRuleModule,
    DxoEditingModule,
    DxiChangeModule,
    DxoFormModule,
    DxoColCountByScreenModule,
    DxiItemModule,
    DxoTabPanelOptionsModule,
    DxiTabModule,
    DxoButtonOptionsModule,
    DxoPopupModule,
    DxoAnimationModule,
    DxoHideModule,
    DxoFromModule,
    DxoToModule,
    DxoShowModule,
    DxoExportModule,
    DxoFilterBuilderModule,
    DxiCustomOperationModule,
    DxiFieldModule,
    DxoFilterOperationDescriptionsModule,
    DxoGroupOperationDescriptionsModule,
    DxoFilterBuilderPopupModule,
    DxoFilterPanelModule,
    DxoFilterRowModule,
    DxoOperationDescriptionsModule,
    DxoGroupingModule,
    DxoGroupPanelModule,
    DxoKeyboardNavigationModule,
    DxoLoadPanelModule,
    DxoMasterDetailModule,
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    DxoRowDraggingModule,
    DxoCursorOffsetModule,
    DxoScrollingModule,
    DxoSearchPanelModule,
    DxiSortByGroupSummaryInfoModule,
    DxoSortingModule,
    DxoStateStoringModule,
    DxoSummaryModule,
    DxiGroupItemModule,
    DxoValueFormatModule,
    DxiTotalItemModule,
    DxoToolbarModule,
    DxoDataGridAnimationModule,
    DxiDataGridAsyncRuleModule,
    DxoDataGridAtModule,
    DxoDataGridBoundaryOffsetModule,
    DxiDataGridButtonModule,
    DxiDataGridChangeModule,
    DxoDataGridColCountByScreenModule,
    DxoDataGridCollisionModule,
    DxiDataGridColumnModule,
    DxoDataGridColumnChooserModule,
    DxoDataGridColumnChooserSearchModule,
    DxoDataGridColumnChooserSelectionModule,
    DxoDataGridColumnFixingModule,
    DxoDataGridColumnFixingTextsModule,
    DxoDataGridColumnHeaderFilterModule,
    DxoDataGridColumnHeaderFilterSearchModule,
    DxoDataGridColumnLookupModule,
    DxiDataGridCompareRuleModule,
    DxoDataGridCursorOffsetModule,
    DxiDataGridCustomOperationModule,
    DxiDataGridCustomRuleModule,
    DxoDataGridDataGridHeaderFilterModule,
    DxoDataGridDataGridHeaderFilterSearchModule,
    DxoDataGridDataGridHeaderFilterTextsModule,
    DxoDataGridDataGridSelectionModule,
    DxoDataGridEditingModule,
    DxoDataGridEditingTextsModule,
    DxiDataGridEmailRuleModule,
    DxoDataGridExportModule,
    DxoDataGridExportTextsModule,
    DxiDataGridFieldModule,
    DxoDataGridFieldLookupModule,
    DxoDataGridFilterBuilderModule,
    DxoDataGridFilterBuilderPopupModule,
    DxoDataGridFilterOperationDescriptionsModule,
    DxoDataGridFilterPanelModule,
    DxoDataGridFilterPanelTextsModule,
    DxoDataGridFilterRowModule,
    DxoDataGridFormModule,
    DxoDataGridFormatModule,
    DxoDataGridFormItemModule,
    DxoDataGridFromModule,
    DxoDataGridGroupingModule,
    DxoDataGridGroupingTextsModule,
    DxiDataGridGroupItemModule,
    DxoDataGridGroupOperationDescriptionsModule,
    DxoDataGridGroupPanelModule,
    DxoDataGridHeaderFilterModule,
    DxoDataGridHideModule,
    DxoDataGridIconsModule,
    DxiDataGridItemModule,
    DxoDataGridKeyboardNavigationModule,
    DxoDataGridLabelModule,
    DxoDataGridLoadPanelModule,
    DxoDataGridLookupModule,
    DxoDataGridMasterDetailModule,
    DxoDataGridMyModule,
    DxiDataGridNumericRuleModule,
    DxoDataGridOffsetModule,
    DxoDataGridOperationDescriptionsModule,
    DxoDataGridPagerModule,
    DxoDataGridPagingModule,
    DxiDataGridPatternRuleModule,
    DxoDataGridPopupModule,
    DxoDataGridPositionModule,
    DxiDataGridRangeRuleModule,
    DxoDataGridRemoteOperationsModule,
    DxiDataGridRequiredRuleModule,
    DxoDataGridRowDraggingModule,
    DxoDataGridScrollingModule,
    DxoDataGridSearchModule,
    DxoDataGridSearchPanelModule,
    DxoDataGridSelectionModule,
    DxoDataGridShowModule,
    DxiDataGridSortByGroupSummaryInfoModule,
    DxoDataGridSortingModule,
    DxoDataGridStateStoringModule,
    DxiDataGridStringLengthRuleModule,
    DxoDataGridSummaryModule,
    DxoDataGridSummaryTextsModule,
    DxoDataGridTextsModule,
    DxoDataGridToModule,
    DxoDataGridToolbarModule,
    DxiDataGridToolbarItemModule,
    DxiDataGridTotalItemModule,
    DxiDataGridValidationRuleModule,
    DxoDataGridValueFormatModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxDataGridComponent
  ],
  exports: [
    DxDataGridComponent,
    DxoColumnChooserModule,
    DxoPositionModule,
    DxoAtModule,
    DxoBoundaryOffsetModule,
    DxoCollisionModule,
    DxoMyModule,
    DxoOffsetModule,
    DxoSearchModule,
    DxoSelectionModule,
    DxoColumnFixingModule,
    DxoIconsModule,
    DxoTextsModule,
    DxiColumnModule,
    DxiButtonModule,
    DxoHeaderFilterModule,
    DxoLookupModule,
    DxoFormatModule,
    DxoFormItemModule,
    DxoLabelModule,
    DxiValidationRuleModule,
    DxoEditingModule,
    DxiChangeModule,
    DxoFormModule,
    DxoColCountByScreenModule,
    DxiItemModule,
    DxoTabPanelOptionsModule,
    DxiTabModule,
    DxoButtonOptionsModule,
    DxoPopupModule,
    DxoAnimationModule,
    DxoHideModule,
    DxoFromModule,
    DxoToModule,
    DxoShowModule,
    DxoExportModule,
    DxoFilterBuilderModule,
    DxiCustomOperationModule,
    DxiFieldModule,
    DxoFilterOperationDescriptionsModule,
    DxoGroupOperationDescriptionsModule,
    DxoFilterBuilderPopupModule,
    DxoFilterPanelModule,
    DxoFilterRowModule,
    DxoOperationDescriptionsModule,
    DxoGroupingModule,
    DxoGroupPanelModule,
    DxoKeyboardNavigationModule,
    DxoLoadPanelModule,
    DxoMasterDetailModule,
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    DxoRowDraggingModule,
    DxoCursorOffsetModule,
    DxoScrollingModule,
    DxoSearchPanelModule,
    DxiSortByGroupSummaryInfoModule,
    DxoSortingModule,
    DxoStateStoringModule,
    DxoSummaryModule,
    DxiGroupItemModule,
    DxoValueFormatModule,
    DxiTotalItemModule,
    DxoToolbarModule,
    DxoDataGridAnimationModule,
    DxiDataGridAsyncRuleModule,
    DxoDataGridAtModule,
    DxoDataGridBoundaryOffsetModule,
    DxiDataGridButtonModule,
    DxiDataGridChangeModule,
    DxoDataGridColCountByScreenModule,
    DxoDataGridCollisionModule,
    DxiDataGridColumnModule,
    DxoDataGridColumnChooserModule,
    DxoDataGridColumnChooserSearchModule,
    DxoDataGridColumnChooserSelectionModule,
    DxoDataGridColumnFixingModule,
    DxoDataGridColumnFixingTextsModule,
    DxoDataGridColumnHeaderFilterModule,
    DxoDataGridColumnHeaderFilterSearchModule,
    DxoDataGridColumnLookupModule,
    DxiDataGridCompareRuleModule,
    DxoDataGridCursorOffsetModule,
    DxiDataGridCustomOperationModule,
    DxiDataGridCustomRuleModule,
    DxoDataGridDataGridHeaderFilterModule,
    DxoDataGridDataGridHeaderFilterSearchModule,
    DxoDataGridDataGridHeaderFilterTextsModule,
    DxoDataGridDataGridSelectionModule,
    DxoDataGridEditingModule,
    DxoDataGridEditingTextsModule,
    DxiDataGridEmailRuleModule,
    DxoDataGridExportModule,
    DxoDataGridExportTextsModule,
    DxiDataGridFieldModule,
    DxoDataGridFieldLookupModule,
    DxoDataGridFilterBuilderModule,
    DxoDataGridFilterBuilderPopupModule,
    DxoDataGridFilterOperationDescriptionsModule,
    DxoDataGridFilterPanelModule,
    DxoDataGridFilterPanelTextsModule,
    DxoDataGridFilterRowModule,
    DxoDataGridFormModule,
    DxoDataGridFormatModule,
    DxoDataGridFormItemModule,
    DxoDataGridFromModule,
    DxoDataGridGroupingModule,
    DxoDataGridGroupingTextsModule,
    DxiDataGridGroupItemModule,
    DxoDataGridGroupOperationDescriptionsModule,
    DxoDataGridGroupPanelModule,
    DxoDataGridHeaderFilterModule,
    DxoDataGridHideModule,
    DxoDataGridIconsModule,
    DxiDataGridItemModule,
    DxoDataGridKeyboardNavigationModule,
    DxoDataGridLabelModule,
    DxoDataGridLoadPanelModule,
    DxoDataGridLookupModule,
    DxoDataGridMasterDetailModule,
    DxoDataGridMyModule,
    DxiDataGridNumericRuleModule,
    DxoDataGridOffsetModule,
    DxoDataGridOperationDescriptionsModule,
    DxoDataGridPagerModule,
    DxoDataGridPagingModule,
    DxiDataGridPatternRuleModule,
    DxoDataGridPopupModule,
    DxoDataGridPositionModule,
    DxiDataGridRangeRuleModule,
    DxoDataGridRemoteOperationsModule,
    DxiDataGridRequiredRuleModule,
    DxoDataGridRowDraggingModule,
    DxoDataGridScrollingModule,
    DxoDataGridSearchModule,
    DxoDataGridSearchPanelModule,
    DxoDataGridSelectionModule,
    DxoDataGridShowModule,
    DxiDataGridSortByGroupSummaryInfoModule,
    DxoDataGridSortingModule,
    DxoDataGridStateStoringModule,
    DxiDataGridStringLengthRuleModule,
    DxoDataGridSummaryModule,
    DxoDataGridSummaryTextsModule,
    DxoDataGridTextsModule,
    DxoDataGridToModule,
    DxoDataGridToolbarModule,
    DxiDataGridToolbarItemModule,
    DxiDataGridTotalItemModule,
    DxiDataGridValidationRuleModule,
    DxoDataGridValueFormatModule,
    DxTemplateModule
  ]
})
export class DxDataGridModule { }

import type * as DxDataGridTypes from "devextreme/ui/data_grid_types";
export { DxDataGridTypes };


