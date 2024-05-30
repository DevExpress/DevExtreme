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

export { ExplicitTypes } from 'devextreme/ui/tree_list';

import { PositionConfig } from 'devextreme/animation/position';
import { DataStructure, DragDirection, DragHighlight, Mode, ScrollbarMode, ScrollMode, SingleMultipleOrNone, SortOrder } from 'devextreme/common';
import { ApplyFilterMode, ColumnChooserMode, ColumnChooserSearchConfig, ColumnChooserSelectionConfig, ColumnResizeMode, DataChange, DataRenderMode, EnterKeyAction, EnterKeyDirection, GridsEditMode, GridsEditRefreshMode, HeaderFilterSearchConfig, PagerDisplayMode, PagerPageSize, StartEditAction, StateStoreType } from 'devextreme/common/grids';
import { UserDefinedElement } from 'devextreme/core/element';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { Properties as dxFilterBuilderOptions } from 'devextreme/ui/filter_builder';
import { Properties as dxFormOptions } from 'devextreme/ui/form';
import { Properties as dxPopupOptions } from 'devextreme/ui/popup';
import { AdaptiveDetailRowPreparingEvent, CellClickEvent, CellDblClickEvent, CellHoverChangedEvent, CellPreparedEvent, ContentReadyEvent, ContextMenuPreparingEvent, DataErrorOccurredEvent, DisposingEvent, dxTreeListColumn, dxTreeListToolbar, EditCanceledEvent, EditCancelingEvent, EditingStartEvent, EditorPreparedEvent, EditorPreparingEvent, FocusedCellChangedEvent, FocusedCellChangingEvent, FocusedRowChangedEvent, FocusedRowChangingEvent, InitializedEvent, InitNewRowEvent, KeyDownEvent, NodesInitializedEvent, OptionChangedEvent, RowClickEvent, RowCollapsedEvent, RowCollapsingEvent, RowDblClickEvent, RowExpandedEvent, RowExpandingEvent, RowInsertedEvent, RowInsertingEvent, RowPreparedEvent, RowRemovedEvent, RowRemovingEvent, RowUpdatedEvent, RowUpdatingEvent, RowValidatingEvent, SavedEvent, SavingEvent, SelectionChangedEvent, ToolbarPreparingEvent, TreeListFilterMode } from 'devextreme/ui/tree_list';

import DxTreeList from 'devextreme/ui/tree_list';


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
import { DxiToolbarItemModule } from 'devextreme-angular/ui/nested';
import { DxoFilterBuilderModule } from 'devextreme-angular/ui/nested';
import { DxiCustomOperationModule } from 'devextreme-angular/ui/nested';
import { DxiFieldModule } from 'devextreme-angular/ui/nested';
import { DxoFilterOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoGroupOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoFilterBuilderPopupModule } from 'devextreme-angular/ui/nested';
import { DxoFilterPanelModule } from 'devextreme-angular/ui/nested';
import { DxoFilterRowModule } from 'devextreme-angular/ui/nested';
import { DxoOperationDescriptionsModule } from 'devextreme-angular/ui/nested';
import { DxoKeyboardNavigationModule } from 'devextreme-angular/ui/nested';
import { DxoLoadPanelModule } from 'devextreme-angular/ui/nested';
import { DxoPagerModule } from 'devextreme-angular/ui/nested';
import { DxoPagingModule } from 'devextreme-angular/ui/nested';
import { DxoRemoteOperationsModule } from 'devextreme-angular/ui/nested';
import { DxoRowDraggingModule } from 'devextreme-angular/ui/nested';
import { DxoCursorOffsetModule } from 'devextreme-angular/ui/nested';
import { DxoScrollingModule } from 'devextreme-angular/ui/nested';
import { DxoSearchPanelModule } from 'devextreme-angular/ui/nested';
import { DxoSortingModule } from 'devextreme-angular/ui/nested';
import { DxoStateStoringModule } from 'devextreme-angular/ui/nested';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';

import { DxiColumnComponent } from 'devextreme-angular/ui/nested';



/**
 * [descr:dxTreeList]

 */
@Component({
    selector: 'dx-tree-list',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxTreeListComponent<TRowData = any, TKey = any> extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxTreeList<TRowData, TKey> = null;

    /**
     * [descr:WidgetOptions.accessKey]
    
     */
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
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
     * [descr:dxTreeListOptions.autoExpandAll]
    
     */
    @Input()
    get autoExpandAll(): boolean {
        return this._getOption('autoExpandAll');
    }
    set autoExpandAll(value: boolean) {
        this._setOption('autoExpandAll', value);
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
    get columnChooser(): { allowSearch?: boolean, container?: UserDefinedElement | string | undefined, emptyPanelText?: string, enabled?: boolean, height?: number | string, mode?: ColumnChooserMode, position?: PositionConfig | undefined, search?: ColumnChooserSearchConfig, searchTimeout?: number, selection?: ColumnChooserSelectionConfig, sortOrder?: SortOrder | undefined, title?: string, width?: number | string } {
        return this._getOption('columnChooser');
    }
    set columnChooser(value: { allowSearch?: boolean, container?: UserDefinedElement | string | undefined, emptyPanelText?: string, enabled?: boolean, height?: number | string, mode?: ColumnChooserMode, position?: PositionConfig | undefined, search?: ColumnChooserSearchConfig, searchTimeout?: number, selection?: ColumnChooserSelectionConfig, sortOrder?: SortOrder | undefined, title?: string, width?: number | string }) {
        this._setOption('columnChooser', value);
    }


    /**
     * [descr:GridBaseOptions.columnFixing]
    
     */
    @Input()
    get columnFixing(): { enabled?: boolean, texts?: { fix?: string, leftPosition?: string, rightPosition?: string, unfix?: string } } {
        return this._getOption('columnFixing');
    }
    set columnFixing(value: { enabled?: boolean, texts?: { fix?: string, leftPosition?: string, rightPosition?: string, unfix?: string } }) {
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
    get columnMinWidth(): number | undefined {
        return this._getOption('columnMinWidth');
    }
    set columnMinWidth(value: number | undefined) {
        this._setOption('columnMinWidth', value);
    }


    /**
     * [descr:GridBaseOptions.columnResizingMode]
    
     */
    @Input()
    get columnResizingMode(): ColumnResizeMode {
        return this._getOption('columnResizingMode');
    }
    set columnResizingMode(value: ColumnResizeMode) {
        this._setOption('columnResizingMode', value);
    }


    /**
     * [descr:dxTreeListOptions.columns]
    
     */
    @Input()
    get columns(): Array<dxTreeListColumn | string> {
        return this._getOption('columns');
    }
    set columns(value: Array<dxTreeListColumn | string>) {
        this._setOption('columns', value);
    }


    /**
     * [descr:GridBaseOptions.columnWidth]
    
     */
    @Input()
    get columnWidth(): Mode | number | undefined {
        return this._getOption('columnWidth');
    }
    set columnWidth(value: Mode | number | undefined) {
        this._setOption('columnWidth', value);
    }


    /**
     * [descr:dxTreeListOptions.customizeColumns]
    
     */
    @Input()
    get customizeColumns(): Function {
        return this._getOption('customizeColumns');
    }
    set customizeColumns(value: Function) {
        this._setOption('customizeColumns', value);
    }


    /**
     * [descr:GridBaseOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<any>) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:dxTreeListOptions.dataStructure]
    
     */
    @Input()
    get dataStructure(): DataStructure {
        return this._getOption('dataStructure');
    }
    set dataStructure(value: DataStructure) {
        this._setOption('dataStructure', value);
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
     * [descr:dxTreeListOptions.editing]
    
     */
    @Input()
    get editing(): { allowAdding?: boolean | Function, allowDeleting?: boolean | Function, allowUpdating?: boolean | Function, changes?: Array<DataChange>, confirmDelete?: boolean, editColumnName?: string, editRowKey?: any, form?: dxFormOptions, mode?: GridsEditMode, popup?: dxPopupOptions, refreshMode?: GridsEditRefreshMode, selectTextOnEditStart?: boolean, startEditAction?: StartEditAction, texts?: { addRow?: string, addRowToNode?: string, cancelAllChanges?: string, cancelRowChanges?: string, confirmDeleteMessage?: string, confirmDeleteTitle?: string, deleteRow?: string, editRow?: string, saveAllChanges?: string, saveRowChanges?: string, undeleteRow?: string, validationCancelChanges?: string }, useIcons?: boolean } {
        return this._getOption('editing');
    }
    set editing(value: { allowAdding?: boolean | Function, allowDeleting?: boolean | Function, allowUpdating?: boolean | Function, changes?: Array<DataChange>, confirmDelete?: boolean, editColumnName?: string, editRowKey?: any, form?: dxFormOptions, mode?: GridsEditMode, popup?: dxPopupOptions, refreshMode?: GridsEditRefreshMode, selectTextOnEditStart?: boolean, startEditAction?: StartEditAction, texts?: { addRow?: string, addRowToNode?: string, cancelAllChanges?: string, cancelRowChanges?: string, confirmDeleteMessage?: string, confirmDeleteTitle?: string, deleteRow?: string, editRow?: string, saveAllChanges?: string, saveRowChanges?: string, undeleteRow?: string, validationCancelChanges?: string }, useIcons?: boolean }) {
        this._setOption('editing', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
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
     * [descr:dxTreeListOptions.expandedRowKeys]
    
     */
    @Input()
    get expandedRowKeys(): Array<any> {
        return this._getOption('expandedRowKeys');
    }
    set expandedRowKeys(value: Array<any>) {
        this._setOption('expandedRowKeys', value);
    }


    /**
     * [descr:dxTreeListOptions.expandNodesOnFiltering]
    
     */
    @Input()
    get expandNodesOnFiltering(): boolean {
        return this._getOption('expandNodesOnFiltering');
    }
    set expandNodesOnFiltering(value: boolean) {
        this._setOption('expandNodesOnFiltering', value);
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
    get filterBuilderPopup(): dxPopupOptions {
        return this._getOption('filterBuilderPopup');
    }
    set filterBuilderPopup(value: dxPopupOptions) {
        this._setOption('filterBuilderPopup', value);
    }


    /**
     * [descr:dxTreeListOptions.filterMode]
    
     */
    @Input()
    get filterMode(): TreeListFilterMode {
        return this._getOption('filterMode');
    }
    set filterMode(value: TreeListFilterMode) {
        this._setOption('filterMode', value);
    }


    /**
     * [descr:GridBaseOptions.filterPanel]
    
     */
    @Input()
    get filterPanel(): { customizeText?: Function, filterEnabled?: boolean, texts?: { clearFilter?: string, createFilter?: string, filterEnabledHint?: string }, visible?: boolean } {
        return this._getOption('filterPanel');
    }
    set filterPanel(value: { customizeText?: Function, filterEnabled?: boolean, texts?: { clearFilter?: string, createFilter?: string, filterEnabledHint?: string }, visible?: boolean }) {
        this._setOption('filterPanel', value);
    }


    /**
     * [descr:GridBaseOptions.filterRow]
    
     */
    @Input()
    get filterRow(): { applyFilter?: ApplyFilterMode, applyFilterText?: string, betweenEndText?: string, betweenStartText?: string, operationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }, resetOperationText?: string, showAllText?: string, showOperationChooser?: boolean, visible?: boolean } {
        return this._getOption('filterRow');
    }
    set filterRow(value: { applyFilter?: ApplyFilterMode, applyFilterText?: string, betweenEndText?: string, betweenStartText?: string, operationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }, resetOperationText?: string, showAllText?: string, showOperationChooser?: boolean, visible?: boolean }) {
        this._setOption('filterRow', value);
    }


    /**
     * [descr:GridBaseOptions.filterSyncEnabled]
    
     */
    @Input()
    get filterSyncEnabled(): Mode | boolean {
        return this._getOption('filterSyncEnabled');
    }
    set filterSyncEnabled(value: Mode | boolean) {
        this._setOption('filterSyncEnabled', value);
    }


    /**
     * [descr:GridBaseOptions.filterValue]
    
     */
    @Input()
    get filterValue(): any {
        return this._getOption('filterValue');
    }
    set filterValue(value: any) {
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
    get focusedRowKey(): any | undefined {
        return this._getOption('focusedRowKey');
    }
    set focusedRowKey(value: any | undefined) {
        this._setOption('focusedRowKey', value);
    }


    /**
     * [descr:dxTreeListOptions.hasItemsExpr]
    
     */
    @Input()
    get hasItemsExpr(): Function | string {
        return this._getOption('hasItemsExpr');
    }
    set hasItemsExpr(value: Function | string) {
        this._setOption('hasItemsExpr', value);
    }


    /**
     * [descr:GridBaseOptions.headerFilter]
    
     */
    @Input()
    get headerFilter(): { allowSearch?: boolean, allowSelectAll?: boolean, height?: number | string, search?: HeaderFilterSearchConfig, searchTimeout?: number, texts?: { cancel?: string, emptyValue?: string, ok?: string }, visible?: boolean, width?: number | string } {
        return this._getOption('headerFilter');
    }
    set headerFilter(value: { allowSearch?: boolean, allowSelectAll?: boolean, height?: number | string, search?: HeaderFilterSearchConfig, searchTimeout?: number, texts?: { cancel?: string, emptyValue?: string, ok?: string }, visible?: boolean, width?: number | string }) {
        this._setOption('headerFilter', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
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
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
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
     * [descr:dxTreeListOptions.itemsExpr]
    
     */
    @Input()
    get itemsExpr(): Function | string {
        return this._getOption('itemsExpr');
    }
    set itemsExpr(value: Function | string) {
        this._setOption('itemsExpr', value);
    }


    /**
     * [descr:GridBaseOptions.keyboardNavigation]
    
     */
    @Input()
    get keyboardNavigation(): { editOnKeyPress?: boolean, enabled?: boolean, enterKeyAction?: EnterKeyAction, enterKeyDirection?: EnterKeyDirection } {
        return this._getOption('keyboardNavigation');
    }
    set keyboardNavigation(value: { editOnKeyPress?: boolean, enabled?: boolean, enterKeyAction?: EnterKeyAction, enterKeyDirection?: EnterKeyDirection }) {
        this._setOption('keyboardNavigation', value);
    }


    /**
     * [descr:dxTreeListOptions.keyExpr]
    
     */
    @Input()
    get keyExpr(): Function | string {
        return this._getOption('keyExpr');
    }
    set keyExpr(value: Function | string) {
        this._setOption('keyExpr', value);
    }


    /**
     * [descr:GridBaseOptions.loadPanel]
    
     */
    @Input()
    get loadPanel(): { enabled?: Mode | boolean, height?: number | string, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number | string } {
        return this._getOption('loadPanel');
    }
    set loadPanel(value: { enabled?: Mode | boolean, height?: number | string, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number | string }) {
        this._setOption('loadPanel', value);
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
    get pager(): { allowedPageSizes?: Mode | Array<PagerPageSize | number>, displayMode?: PagerDisplayMode, infoText?: string, label?: string, showInfo?: boolean, showNavigationButtons?: boolean, showPageSizeSelector?: boolean, visible?: Mode | boolean } {
        return this._getOption('pager');
    }
    set pager(value: { allowedPageSizes?: Mode | Array<PagerPageSize | number>, displayMode?: PagerDisplayMode, infoText?: string, label?: string, showInfo?: boolean, showNavigationButtons?: boolean, showPageSizeSelector?: boolean, visible?: Mode | boolean }) {
        this._setOption('pager', value);
    }


    /**
     * [descr:dxTreeListOptions.paging]
    
     */
    @Input()
    get paging(): { enabled?: boolean, pageIndex?: number, pageSize?: number } {
        return this._getOption('paging');
    }
    set paging(value: { enabled?: boolean, pageIndex?: number, pageSize?: number }) {
        this._setOption('paging', value);
    }


    /**
     * [descr:dxTreeListOptions.parentIdExpr]
    
     */
    @Input()
    get parentIdExpr(): Function | string {
        return this._getOption('parentIdExpr');
    }
    set parentIdExpr(value: Function | string) {
        this._setOption('parentIdExpr', value);
    }


    /**
     * [descr:dxTreeListOptions.remoteOperations]
    
     */
    @Input()
    get remoteOperations(): Mode | { filtering?: boolean, grouping?: boolean, sorting?: boolean } {
        return this._getOption('remoteOperations');
    }
    set remoteOperations(value: Mode | { filtering?: boolean, grouping?: boolean, sorting?: boolean }) {
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
     * [descr:dxTreeListOptions.rootValue]
    
     */
    @Input()
    get rootValue(): any {
        return this._getOption('rootValue');
    }
    set rootValue(value: any) {
        this._setOption('rootValue', value);
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
    get rowDragging(): { allowDropInsideItem?: boolean, allowReordering?: boolean, autoScroll?: boolean, boundary?: UserDefinedElement | string | undefined, container?: UserDefinedElement | string | undefined, cursorOffset?: string | { x?: number, y?: number }, data?: any | undefined, dragDirection?: DragDirection, dragTemplate?: any | undefined, dropFeedbackMode?: DragHighlight, filter?: string, group?: string | undefined, handle?: string, onAdd?: Function, onDragChange?: Function, onDragEnd?: Function, onDragMove?: Function, onDragStart?: Function, onRemove?: Function, onReorder?: Function, scrollSensitivity?: number, scrollSpeed?: number, showDragIcons?: boolean } {
        return this._getOption('rowDragging');
    }
    set rowDragging(value: { allowDropInsideItem?: boolean, allowReordering?: boolean, autoScroll?: boolean, boundary?: UserDefinedElement | string | undefined, container?: UserDefinedElement | string | undefined, cursorOffset?: string | { x?: number, y?: number }, data?: any | undefined, dragDirection?: DragDirection, dragTemplate?: any | undefined, dropFeedbackMode?: DragHighlight, filter?: string, group?: string | undefined, handle?: string, onAdd?: Function, onDragChange?: Function, onDragEnd?: Function, onDragMove?: Function, onDragStart?: Function, onRemove?: Function, onReorder?: Function, scrollSensitivity?: number, scrollSpeed?: number, showDragIcons?: boolean }) {
        this._setOption('rowDragging', value);
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
     * [descr:dxTreeListOptions.scrolling]
    
     */
    @Input()
    get scrolling(): { columnRenderingMode?: DataRenderMode, mode?: ScrollMode, preloadEnabled?: boolean, renderAsync?: boolean | undefined, rowRenderingMode?: DataRenderMode, scrollByContent?: boolean, scrollByThumb?: boolean, showScrollbar?: ScrollbarMode, useNative?: Mode | boolean } {
        return this._getOption('scrolling');
    }
    set scrolling(value: { columnRenderingMode?: DataRenderMode, mode?: ScrollMode, preloadEnabled?: boolean, renderAsync?: boolean | undefined, rowRenderingMode?: DataRenderMode, scrollByContent?: boolean, scrollByThumb?: boolean, showScrollbar?: ScrollbarMode, useNative?: Mode | boolean }) {
        this._setOption('scrolling', value);
    }


    /**
     * [descr:GridBaseOptions.searchPanel]
    
     */
    @Input()
    get searchPanel(): { highlightCaseSensitive?: boolean, highlightSearchText?: boolean, placeholder?: string, searchVisibleColumnsOnly?: boolean, text?: string, visible?: boolean, width?: number | string } {
        return this._getOption('searchPanel');
    }
    set searchPanel(value: { highlightCaseSensitive?: boolean, highlightSearchText?: boolean, placeholder?: string, searchVisibleColumnsOnly?: boolean, text?: string, visible?: boolean, width?: number | string }) {
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
     * [descr:dxTreeListOptions.selection]
    
     */
    @Input()
    get selection(): { allowSelectAll?: boolean, mode?: SingleMultipleOrNone, recursive?: boolean } {
        return this._getOption('selection');
    }
    set selection(value: { allowSelectAll?: boolean, mode?: SingleMultipleOrNone, recursive?: boolean }) {
        this._setOption('selection', value);
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
     * [descr:GridBaseOptions.sorting]
    
     */
    @Input()
    get sorting(): { ascendingText?: string, clearText?: string, descendingText?: string, mode?: SingleMultipleOrNone, showSortIndexes?: boolean } {
        return this._getOption('sorting');
    }
    set sorting(value: { ascendingText?: string, clearText?: string, descendingText?: string, mode?: SingleMultipleOrNone, showSortIndexes?: boolean }) {
        this._setOption('sorting', value);
    }


    /**
     * [descr:GridBaseOptions.stateStoring]
    
     */
    @Input()
    get stateStoring(): { customLoad?: Function, customSave?: Function, enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: StateStoreType } {
        return this._getOption('stateStoring');
    }
    set stateStoring(value: { customLoad?: Function, customSave?: Function, enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: StateStoreType }) {
        this._setOption('stateStoring', value);
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
     * [descr:dxTreeListOptions.toolbar]
    
     */
    @Input()
    get toolbar(): dxTreeListToolbar | undefined {
        return this._getOption('toolbar');
    }
    set toolbar(value: dxTreeListToolbar | undefined) {
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
    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
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
    
     * [descr:dxTreeListOptions.onAdaptiveDetailRowPreparing]
    
    
     */
    @Output() onAdaptiveDetailRowPreparing: EventEmitter<AdaptiveDetailRowPreparingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onCellClick]
    
    
     */
    @Output() onCellClick: EventEmitter<CellClickEvent>;

    /**
    
     * [descr:dxTreeListOptions.onCellDblClick]
    
    
     */
    @Output() onCellDblClick: EventEmitter<CellDblClickEvent>;

    /**
    
     * [descr:dxTreeListOptions.onCellHoverChanged]
    
    
     */
    @Output() onCellHoverChanged: EventEmitter<CellHoverChangedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onCellPrepared]
    
    
     */
    @Output() onCellPrepared: EventEmitter<CellPreparedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxTreeListOptions.onContextMenuPreparing]
    
    
     */
    @Output() onContextMenuPreparing: EventEmitter<ContextMenuPreparingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onDataErrorOccurred]
    
    
     */
    @Output() onDataErrorOccurred: EventEmitter<DataErrorOccurredEvent>;

    /**
    
     * [descr:dxTreeListOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onEditCanceled]
    
    
     */
    @Output() onEditCanceled: EventEmitter<EditCanceledEvent>;

    /**
    
     * [descr:dxTreeListOptions.onEditCanceling]
    
    
     */
    @Output() onEditCanceling: EventEmitter<EditCancelingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onEditingStart]
    
    
     */
    @Output() onEditingStart: EventEmitter<EditingStartEvent>;

    /**
    
     * [descr:dxTreeListOptions.onEditorPrepared]
    
    
     */
    @Output() onEditorPrepared: EventEmitter<EditorPreparedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onEditorPreparing]
    
    
     */
    @Output() onEditorPreparing: EventEmitter<EditorPreparingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onFocusedCellChanged]
    
    
     */
    @Output() onFocusedCellChanged: EventEmitter<FocusedCellChangedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onFocusedCellChanging]
    
    
     */
    @Output() onFocusedCellChanging: EventEmitter<FocusedCellChangingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onFocusedRowChanged]
    
    
     */
    @Output() onFocusedRowChanged: EventEmitter<FocusedRowChangedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onFocusedRowChanging]
    
    
     */
    @Output() onFocusedRowChanging: EventEmitter<FocusedRowChangingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onInitNewRow]
    
    
     */
    @Output() onInitNewRow: EventEmitter<InitNewRowEvent>;

    /**
    
     * [descr:dxTreeListOptions.onKeyDown]
    
    
     */
    @Output() onKeyDown: EventEmitter<KeyDownEvent>;

    /**
    
     * [descr:dxTreeListOptions.onNodesInitialized]
    
    
     */
    @Output() onNodesInitialized: EventEmitter<NodesInitializedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowClick]
    
    
     */
    @Output() onRowClick: EventEmitter<RowClickEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowCollapsed]
    
    
     */
    @Output() onRowCollapsed: EventEmitter<RowCollapsedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowCollapsing]
    
    
     */
    @Output() onRowCollapsing: EventEmitter<RowCollapsingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowDblClick]
    
    
     */
    @Output() onRowDblClick: EventEmitter<RowDblClickEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowExpanded]
    
    
     */
    @Output() onRowExpanded: EventEmitter<RowExpandedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowExpanding]
    
    
     */
    @Output() onRowExpanding: EventEmitter<RowExpandingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowInserted]
    
    
     */
    @Output() onRowInserted: EventEmitter<RowInsertedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowInserting]
    
    
     */
    @Output() onRowInserting: EventEmitter<RowInsertingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowPrepared]
    
    
     */
    @Output() onRowPrepared: EventEmitter<RowPreparedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowRemoved]
    
    
     */
    @Output() onRowRemoved: EventEmitter<RowRemovedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowRemoving]
    
    
     */
    @Output() onRowRemoving: EventEmitter<RowRemovingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowUpdated]
    
    
     */
    @Output() onRowUpdated: EventEmitter<RowUpdatedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowUpdating]
    
    
     */
    @Output() onRowUpdating: EventEmitter<RowUpdatingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onRowValidating]
    
    
     */
    @Output() onRowValidating: EventEmitter<RowValidatingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onSaved]
    
    
     */
    @Output() onSaved: EventEmitter<SavedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onSaving]
    
    
     */
    @Output() onSaving: EventEmitter<SavingEvent>;

    /**
    
     * [descr:dxTreeListOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxTreeListOptions.onToolbarPreparing]
    
    
     */
    @Output() onToolbarPreparing: EventEmitter<ToolbarPreparingEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string | undefined>;

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
    @Output() autoExpandAllChange: EventEmitter<boolean>;

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
    @Output() columnChooserChange: EventEmitter<{ allowSearch?: boolean, container?: UserDefinedElement | string | undefined, emptyPanelText?: string, enabled?: boolean, height?: number | string, mode?: ColumnChooserMode, position?: PositionConfig | undefined, search?: ColumnChooserSearchConfig, searchTimeout?: number, selection?: ColumnChooserSelectionConfig, sortOrder?: SortOrder | undefined, title?: string, width?: number | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnFixingChange: EventEmitter<{ enabled?: boolean, texts?: { fix?: string, leftPosition?: string, rightPosition?: string, unfix?: string } }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnHidingEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnMinWidthChange: EventEmitter<number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnResizingModeChange: EventEmitter<ColumnResizeMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnsChange: EventEmitter<Array<dxTreeListColumn | string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() columnWidthChange: EventEmitter<Mode | number | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeColumnsChange: EventEmitter<Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Store | DataSource | DataSourceOptions | null | string | Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataStructureChange: EventEmitter<DataStructure>;

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
    @Output() editingChange: EventEmitter<{ allowAdding?: boolean | Function, allowDeleting?: boolean | Function, allowUpdating?: boolean | Function, changes?: Array<DataChange>, confirmDelete?: boolean, editColumnName?: string, editRowKey?: any, form?: dxFormOptions, mode?: GridsEditMode, popup?: dxPopupOptions, refreshMode?: GridsEditRefreshMode, selectTextOnEditStart?: boolean, startEditAction?: StartEditAction, texts?: { addRow?: string, addRowToNode?: string, cancelAllChanges?: string, cancelRowChanges?: string, confirmDeleteMessage?: string, confirmDeleteTitle?: string, deleteRow?: string, editRow?: string, saveAllChanges?: string, saveRowChanges?: string, undeleteRow?: string, validationCancelChanges?: string }, useIcons?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() errorRowEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() expandedRowKeysChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() expandNodesOnFilteringChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterBuilderChange: EventEmitter<dxFilterBuilderOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterBuilderPopupChange: EventEmitter<dxPopupOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterModeChange: EventEmitter<TreeListFilterMode>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterPanelChange: EventEmitter<{ customizeText?: Function, filterEnabled?: boolean, texts?: { clearFilter?: string, createFilter?: string, filterEnabledHint?: string }, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterRowChange: EventEmitter<{ applyFilter?: ApplyFilterMode, applyFilterText?: string, betweenEndText?: string, betweenStartText?: string, operationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }, resetOperationText?: string, showAllText?: string, showOperationChooser?: boolean, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterSyncEnabledChange: EventEmitter<Mode | boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterValueChange: EventEmitter<any>;

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
    @Output() focusedRowKeyChange: EventEmitter<any | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hasItemsExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() headerFilterChange: EventEmitter<{ allowSearch?: boolean, allowSelectAll?: boolean, height?: number | string, search?: HeaderFilterSearchConfig, searchTimeout?: number, texts?: { cancel?: string, emptyValue?: string, ok?: string }, visible?: boolean, width?: number | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | Function | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() highlightChangesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hintChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() keyboardNavigationChange: EventEmitter<{ editOnKeyPress?: boolean, enabled?: boolean, enterKeyAction?: EnterKeyAction, enterKeyDirection?: EnterKeyDirection }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() keyExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() loadPanelChange: EventEmitter<{ enabled?: Mode | boolean, height?: number | string, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() noDataTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pagerChange: EventEmitter<{ allowedPageSizes?: Mode | Array<PagerPageSize | number>, displayMode?: PagerDisplayMode, infoText?: string, label?: string, showInfo?: boolean, showNavigationButtons?: boolean, showPageSizeSelector?: boolean, visible?: Mode | boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pagingChange: EventEmitter<{ enabled?: boolean, pageIndex?: number, pageSize?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() parentIdExprChange: EventEmitter<Function | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() remoteOperationsChange: EventEmitter<Mode | { filtering?: boolean, grouping?: boolean, sorting?: boolean }>;

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
    @Output() rootValueChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rowAlternationEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rowDraggingChange: EventEmitter<{ allowDropInsideItem?: boolean, allowReordering?: boolean, autoScroll?: boolean, boundary?: UserDefinedElement | string | undefined, container?: UserDefinedElement | string | undefined, cursorOffset?: string | { x?: number, y?: number }, data?: any | undefined, dragDirection?: DragDirection, dragTemplate?: any | undefined, dropFeedbackMode?: DragHighlight, filter?: string, group?: string | undefined, handle?: string, onAdd?: Function, onDragChange?: Function, onDragEnd?: Function, onDragMove?: Function, onDragStart?: Function, onRemove?: Function, onReorder?: Function, scrollSensitivity?: number, scrollSpeed?: number, showDragIcons?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() scrollingChange: EventEmitter<{ columnRenderingMode?: DataRenderMode, mode?: ScrollMode, preloadEnabled?: boolean, renderAsync?: boolean | undefined, rowRenderingMode?: DataRenderMode, scrollByContent?: boolean, scrollByThumb?: boolean, showScrollbar?: ScrollbarMode, useNative?: Mode | boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() searchPanelChange: EventEmitter<{ highlightCaseSensitive?: boolean, highlightSearchText?: boolean, placeholder?: string, searchVisibleColumnsOnly?: boolean, text?: string, visible?: boolean, width?: number | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedRowKeysChange: EventEmitter<Array<any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionChange: EventEmitter<{ allowSelectAll?: boolean, mode?: SingleMultipleOrNone, recursive?: boolean }>;

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
    @Output() sortingChange: EventEmitter<{ ascendingText?: string, clearText?: string, descendingText?: string, mode?: SingleMultipleOrNone, showSortIndexes?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stateStoringChange: EventEmitter<{ customLoad?: Function, customSave?: Function, enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: StateStoreType }>;

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
    @Output() toolbarChange: EventEmitter<dxTreeListToolbar | undefined>;

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
    @Output() widthChange: EventEmitter<number | Function | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() wordWrapEnabledChange: EventEmitter<boolean>;




    @ContentChildren(DxiColumnComponent)
    get columnsChildren(): QueryList<DxiColumnComponent> {
        return this._getOption('columns');
    }
    set columnsChildren(value) {
        this.setChildren('columns', value);
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
            { subscribe: 'focusedCellChanged', emit: 'onFocusedCellChanged' },
            { subscribe: 'focusedCellChanging', emit: 'onFocusedCellChanging' },
            { subscribe: 'focusedRowChanged', emit: 'onFocusedRowChanged' },
            { subscribe: 'focusedRowChanging', emit: 'onFocusedRowChanging' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'initNewRow', emit: 'onInitNewRow' },
            { subscribe: 'keyDown', emit: 'onKeyDown' },
            { subscribe: 'nodesInitialized', emit: 'onNodesInitialized' },
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
            { emit: 'autoExpandAllChange' },
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
            { emit: 'dataSourceChange' },
            { emit: 'dataStructureChange' },
            { emit: 'dateSerializationFormatChange' },
            { emit: 'disabledChange' },
            { emit: 'editingChange' },
            { emit: 'elementAttrChange' },
            { emit: 'errorRowEnabledChange' },
            { emit: 'expandedRowKeysChange' },
            { emit: 'expandNodesOnFilteringChange' },
            { emit: 'filterBuilderChange' },
            { emit: 'filterBuilderPopupChange' },
            { emit: 'filterModeChange' },
            { emit: 'filterPanelChange' },
            { emit: 'filterRowChange' },
            { emit: 'filterSyncEnabledChange' },
            { emit: 'filterValueChange' },
            { emit: 'focusedColumnIndexChange' },
            { emit: 'focusedRowEnabledChange' },
            { emit: 'focusedRowIndexChange' },
            { emit: 'focusedRowKeyChange' },
            { emit: 'hasItemsExprChange' },
            { emit: 'headerFilterChange' },
            { emit: 'heightChange' },
            { emit: 'highlightChangesChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemsExprChange' },
            { emit: 'keyboardNavigationChange' },
            { emit: 'keyExprChange' },
            { emit: 'loadPanelChange' },
            { emit: 'noDataTextChange' },
            { emit: 'pagerChange' },
            { emit: 'pagingChange' },
            { emit: 'parentIdExprChange' },
            { emit: 'remoteOperationsChange' },
            { emit: 'renderAsyncChange' },
            { emit: 'repaintChangesOnlyChange' },
            { emit: 'rootValueChange' },
            { emit: 'rowAlternationEnabledChange' },
            { emit: 'rowDraggingChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'scrollingChange' },
            { emit: 'searchPanelChange' },
            { emit: 'selectedRowKeysChange' },
            { emit: 'selectionChange' },
            { emit: 'showBordersChange' },
            { emit: 'showColumnHeadersChange' },
            { emit: 'showColumnLinesChange' },
            { emit: 'showRowLinesChange' },
            { emit: 'sortingChange' },
            { emit: 'stateStoringChange' },
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

        return new DxTreeList(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('columns', changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('expandedRowKeys', changes);
        this.setupChanges('selectedRowKeys', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('columns');
        this._idh.doCheck('dataSource');
        this._idh.doCheck('expandedRowKeys');
        this._idh.doCheck('selectedRowKeys');
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
    DxiToolbarItemModule,
    DxoFilterBuilderModule,
    DxiCustomOperationModule,
    DxiFieldModule,
    DxoFilterOperationDescriptionsModule,
    DxoGroupOperationDescriptionsModule,
    DxoFilterBuilderPopupModule,
    DxoFilterPanelModule,
    DxoFilterRowModule,
    DxoOperationDescriptionsModule,
    DxoKeyboardNavigationModule,
    DxoLoadPanelModule,
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    DxoRowDraggingModule,
    DxoCursorOffsetModule,
    DxoScrollingModule,
    DxoSearchPanelModule,
    DxoSortingModule,
    DxoStateStoringModule,
    DxoToolbarModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxTreeListComponent
  ],
  exports: [
    DxTreeListComponent,
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
    DxiToolbarItemModule,
    DxoFilterBuilderModule,
    DxiCustomOperationModule,
    DxiFieldModule,
    DxoFilterOperationDescriptionsModule,
    DxoGroupOperationDescriptionsModule,
    DxoFilterBuilderPopupModule,
    DxoFilterPanelModule,
    DxoFilterRowModule,
    DxoOperationDescriptionsModule,
    DxoKeyboardNavigationModule,
    DxoLoadPanelModule,
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    DxoRowDraggingModule,
    DxoCursorOffsetModule,
    DxoScrollingModule,
    DxoSearchPanelModule,
    DxoSortingModule,
    DxoStateStoringModule,
    DxoToolbarModule,
    DxTemplateModule
  ]
})
export class DxTreeListModule { }

import type * as DxTreeListTypes from "devextreme/ui/tree_list_types";
export { DxTreeListTypes };


