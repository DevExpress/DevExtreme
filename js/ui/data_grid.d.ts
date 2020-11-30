import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import Store from '../data/abstract_store';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events/index';

import {
    ExcelDataGridCell
} from '../excel_exporter';

import {
    ExcelFont
} from '../exporter/excel/excel.doc_comments';

import dxDraggable from './draggable';

import {
    dxFilterBuilderOptions
} from './filter_builder';

import {
    dxFormOptions,
    dxFormSimpleItem
} from './form';

import {
    dxPopupOptions
} from './popup';

import dxScrollable from './scroll_view/ui.scrollable';

import dxSortable from './sortable';

import {
    dxToolbarOptions
} from './toolbar';

import {
    AsyncRule,
    CompareRule,
    CustomRule,
    EmailRule,
    NumericRule,
    PatternRule,
    RangeRule,
    RequiredRule,
    StringLengthRule
} from './validation_engine';

import Widget, {
    format,
    WidgetOptions
} from './widget/ui.widget';

export interface GridBaseOptions<T = GridBase> extends WidgetOptions<T> {
    /**
     * @docid GridBaseOptions.allowColumnReordering
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowColumnReordering?: boolean;
    /**
     * @docid GridBaseOptions.allowColumnResizing
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowColumnResizing?: boolean;
    /**
     * @docid GridBaseOptions.autoNavigateToFocusedRow
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoNavigateToFocusedRow?: boolean;
    /**
     * @docid GridBaseOptions.cacheEnabled
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cacheEnabled?: boolean;
    /**
     * @docid GridBaseOptions.cellHintEnabled
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellHintEnabled?: boolean;
    /**
     * @docid GridBaseOptions.columnAutoWidth
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnAutoWidth?: boolean;
    /**
     * @docid GridBaseOptions.columnChooser
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnChooser?: { allowSearch?: boolean, emptyPanelText?: string, enabled?: boolean, height?: number, mode?: 'dragAndDrop' | 'select', searchTimeout?: number, title?: string, width?: number };
    /**
     * @docid GridBaseOptions.columnFixing
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnFixing?: { enabled?: boolean, texts?: { fix?: string, leftPosition?: string, rightPosition?: string, unfix?: string } };
    /**
     * @docid GridBaseOptions.columnHidingEnabled
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnHidingEnabled?: boolean;
    /**
     * @docid GridBaseOptions.columnMinWidth
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnMinWidth?: number;
    /**
     * @docid GridBaseOptions.columnResizingMode
     * @type Enums.ColumnResizingMode
     * @default "nextColumn"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnResizingMode?: 'nextColumn' | 'widget';
    /**
     * @docid GridBaseOptions.columnWidth
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnWidth?: number;
    /**
     * @docid GridBaseOptions.columns
     * @fires GridBaseOptions.onOptionChanged
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<GridBaseColumn | string>;
    /**
     * @docid GridBaseOptions.dataSource
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<any> | DataSource | DataSourceOptions;
    /**
     * @docid GridBaseOptions.dateSerializationFormat
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid GridBaseOptions.editing
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editing?: GridBaseEditing;
    /**
     * @docid GridBaseOptions.errorRowEnabled
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    errorRowEnabled?: boolean;
    /**
     * @docid GridBaseOptions.filterBuilder
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterBuilder?: dxFilterBuilderOptions;
    /**
     * @docid GridBaseOptions.filterBuilderPopup
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterBuilderPopup?: dxPopupOptions;
    /**
     * @docid GridBaseOptions.filterPanel
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterPanel?: { customizeText?: ((e: { component?: T, filterValue?: any, text?: string }) => string), filterEnabled?: boolean, texts?: { clearFilter?: string, createFilter?: string, filterEnabledHint?: string }, visible?: boolean };
    /**
     * @docid GridBaseOptions.filterRow
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterRow?: { applyFilter?: 'auto' | 'onClick', applyFilterText?: string, betweenEndText?: string, betweenStartText?: string, operationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string }, resetOperationText?: string, showAllText?: string, showOperationChooser?: boolean, visible?: boolean };
    /**
     * @docid GridBaseOptions.filterSyncEnabled
     * @type boolean|Enums.Mode
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterSyncEnabled?: boolean | 'auto';
    /**
     * @docid GridBaseOptions.filterValue
     * @type Filter expression
     * @default null
     * @fires GridBase.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterValue?: string | Array<any> | Function;
    /**
     * @docid GridBaseOptions.focusedColumnIndex
     * @default -1
     * @fires GridBaseOptions.onFocusedCellChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedColumnIndex?: number;
    /**
     * @docid GridBaseOptions.focusedRowEnabled
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedRowEnabled?: boolean;
    /**
     * @docid GridBaseOptions.focusedRowIndex
     * @default -1
     * @fires GridBaseOptions.onFocusedRowChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedRowIndex?: number;
    /**
     * @docid GridBaseOptions.focusedRowKey
     * @default undefined
     * @fires GridBaseOptions.onFocusedRowChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedRowKey?: any;
    /**
     * @docid GridBaseOptions.headerFilter
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, texts?: { cancel?: string, emptyValue?: string, ok?: string }, visible?: boolean, width?: number };
    /**
     * @docid GridBaseOptions.highlightChanges
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    highlightChanges?: boolean;
    /**
     * @docid GridBaseOptions.keyboardNavigation
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyboardNavigation?: { editOnKeyPress?: boolean, enabled?: boolean, enterKeyAction?: 'startEdit' | 'moveFocus', enterKeyDirection?: 'none' | 'column' | 'row' };
    /**
     * @docid GridBaseOptions.loadPanel
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loadPanel?: { enabled?: boolean | 'auto', height?: number, indicatorSrc?: string, shading?: boolean, shadingColor?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number };
    /**
     * @docid GridBaseOptions.noDataText
     * @default "No data"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    noDataText?: string;
    /**
     * @docid GridBaseOptions.onAdaptiveDetailRowPreparing
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 formOptions:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAdaptiveDetailRowPreparing?: ((e: { component?: T, element?: dxElement, model?: any, formOptions?: any }) => any);
    /**
     * @docid GridBaseOptions.onDataErrorOccurred
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 error:Error
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDataErrorOccurred?: ((e: { component?: T, element?: dxElement, model?: any, error?: Error }) => any);
    /**
     * @docid GridBaseOptions.onEditCanceled
     * @type_function_param1 e:object
     * @type_function_param1_field4 changes:Array<any>
     * @extends Action
     * @action
     * @public
     */
    onEditCanceled?: ((e: { component?: T, element?: dxElement, model?: any, changes?: Array<any> }) => any);
    /**
     * @docid GridBaseOptions.onEditCanceling
     * @type_function_param1 e:object
     * @type_function_param1_field4 changes:Array<any>
     * @type_function_param1_field5 cancel:boolean
     * @extends Action
     * @action
     * @public
     */
    onEditCanceling?: ((e: { component?: T, element?: dxElement, model?: any, changes?: Array<any>, cancel?: boolean }) => any);
    /**
     * @docid GridBaseOptions.onInitNewRow
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 promise:Promise<void>
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onInitNewRow?: ((e: { component?: T, element?: dxElement, model?: any, data?: any, promise?: Promise<void> | JQueryPromise<void> }) => any);
    /**
     * @docid GridBaseOptions.onKeyDown
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 handled:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onKeyDown?: ((e: { component?: T, element?: dxElement, model?: any, event?: event, handled?: boolean }) => any);
    /**
     * @docid GridBaseOptions.onRowCollapsed
     * @type_function_param1 e:object
     * @type_function_param1_field4 key:any
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowCollapsed?: ((e: { component?: T, element?: dxElement, model?: any, key?: any }) => any);
    /**
     * @docid GridBaseOptions.onRowCollapsing
     * @type_function_param1 e:object
     * @type_function_param1_field4 key:any
     * @type_function_param1_field5 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowCollapsing?: ((e: { component?: T, element?: dxElement, model?: any, key?: any, cancel?: boolean }) => any);
    /**
     * @docid GridBaseOptions.onRowExpanded
     * @type_function_param1 e:object
     * @type_function_param1_field4 key:any
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowExpanded?: ((e: { component?: T, element?: dxElement, model?: any, key?: any }) => any);
    /**
     * @docid GridBaseOptions.onRowExpanding
     * @type_function_param1 e:object
     * @type_function_param1_field4 key:any
     * @type_function_param1_field5 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowExpanding?: ((e: { component?: T, element?: dxElement, model?: any, key?: any, cancel?: boolean }) => any);
    /**
     * @docid GridBaseOptions.onRowInserted
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 error:Error
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowInserted?: ((e: { component?: T, element?: dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
    /**
     * @docid GridBaseOptions.onRowInserting
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 cancel:boolean|Promise<void>
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowInserting?: ((e: { component?: T, element?: dxElement, model?: any, data?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
    /**
     * @docid GridBaseOptions.onRowRemoved
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 error:Error
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowRemoved?: ((e: { component?: T, element?: dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
    /**
     * @docid GridBaseOptions.onRowRemoving
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 cancel:boolean|Promise<void>
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowRemoving?: ((e: { component?: T, element?: dxElement, model?: any, data?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
    /**
     * @docid GridBaseOptions.onRowUpdated
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 error:Error
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowUpdated?: ((e: { component?: T, element?: dxElement, model?: any, data?: any, key?: any, error?: Error }) => any);
    /**
     * @docid GridBaseOptions.onRowUpdating
     * @type_function_param1 e:object
     * @type_function_param1_field4 oldData:object
     * @type_function_param1_field5 newData:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 cancel:boolean|Promise<void>
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowUpdating?: ((e: { component?: T, element?: dxElement, model?: any, oldData?: any, newData?: any, key?: any, cancel?: boolean | Promise<void> | JQueryPromise<void> }) => any);
    /**
     * @docid GridBaseOptions.onRowValidating
     * @type_function_param1 e:object
     * @type_function_param1_field4 brokenRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @type_function_param1_field5 isValid:boolean
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 newData:object
     * @type_function_param1_field8 oldData:object
     * @type_function_param1_field9 errorText:string
     * @type_function_param1_field10 promise:Promise<void>
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowValidating?: ((e: { component?: T, element?: dxElement, model?: any, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, isValid?: boolean, key?: any, newData?: any, oldData?: any, errorText?: string, promise?: Promise<void> | JQueryPromise<void> }) => any);
    /**
     * @docid GridBaseOptions.onSaved
     * @type_function_param1 e:object
     * @type_function_param1_field4 changes:Array<any>
     * @extends Action
     * @action
     * @public
     */
    onSaved?: ((e: { component?: T, element?: dxElement, model?: any, changes?: Array<any> }) => any);
    /**
     * @docid GridBaseOptions.onSaving
     * @type_function_param1 e:object
     * @type_function_param1_field4 changes:Array<any>
     * @type_function_param1_field5 promise:Promise<void>
     * @type_function_param1_field6 cancel:boolean
     * @extends Action
     * @action
     * @public
     */
    onSaving?: ((e: { component?: T, element?: dxElement, model?: any, changes?: Array<any>, promise?: Promise<void> | JQueryPromise<void>, cancel?: boolean }) => any);
    /**
     * @docid GridBaseOptions.onSelectionChanged
     * @type_function_param1 e:object
     * @type_function_param1_field4 currentSelectedRowKeys:Array<any>
     * @type_function_param1_field5 currentDeselectedRowKeys:Array<any>
     * @type_function_param1_field6 selectedRowKeys:Array<any>
     * @type_function_param1_field7 selectedRowsData:Array<Object>
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: T, element?: dxElement, model?: any, currentSelectedRowKeys?: Array<any>, currentDeselectedRowKeys?: Array<any>, selectedRowKeys?: Array<any>, selectedRowsData?: Array<any> }) => any);
    /**
     * @docid GridBaseOptions.onToolbarPreparing
     * @type_function_param1 e:object
     * @type_function_param1_field4 toolbarOptions:dxToolbarOptions
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onToolbarPreparing?: ((e: { component?: T, element?: dxElement, model?: any, toolbarOptions?: dxToolbarOptions }) => any);
    /**
     * @docid GridBaseOptions.pager
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pager?: { allowedPageSizes?: Array<(number | 'all')> | 'auto', displayMode: 'adaptive' | 'compact' | 'full', infoText?: string, showInfo?: boolean, showNavigationButtons?: boolean, showPageSizeSelector?: boolean, visible?: boolean | 'auto' };
    /**
     * @docid GridBaseOptions.paging
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    paging?: GridBasePaging;
    /**
     * @docid GridBaseOptions.renderAsync
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    renderAsync?: boolean;
    /**
     * @docid GridBaseOptions.repaintChangesOnly
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid GridBaseOptions.rowAlternationEnabled
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowAlternationEnabled?: boolean;
    /**
     * @docid GridBaseOptions.rowDragging
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowDragging?: { allowDropInsideItem?: boolean, allowReordering?: boolean, autoScroll?: boolean, boundary?: string | Element | JQuery, container?: string | Element | JQuery, cursorOffset?: string | { x?: number, y?: number }, data?: any, dragDirection?: 'both' | 'horizontal' | 'vertical', dragTemplate?: template | ((dragInfo: { itemData?: any, itemElement?: dxElement }, containerElement: dxElement) => string | Element | JQuery), dropFeedbackMode?: 'push' | 'indicate', filter?: string, group?: string, handle?: string, onAdd?: ((e: { event?: event, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragChange?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragEnd?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragMove?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any), onDragStart?: ((e: { event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromIndex?: number, fromData?: any }) => any), onRemove?: ((e: { event?: event, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any), onReorder?: ((e: { event?: event, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean, promise?: Promise<void> | JQueryPromise<void> }) => any), scrollSensitivity?: number, scrollSpeed?: number, showDragIcons?: boolean };
    /**
     * @docid GridBaseOptions.scrolling
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrolling?: GridBaseScrolling;
    /**
     * @docid GridBaseOptions.searchPanel
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchPanel?: { highlightCaseSensitive?: boolean, highlightSearchText?: boolean, placeholder?: string, searchVisibleColumnsOnly?: boolean, text?: string, visible?: boolean, width?: number };
    /**
     * @docid GridBaseOptions.selectedRowKeys
     * @fires GridBaseOptions.onSelectionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedRowKeys?: Array<any>;
    /**
     * @docid GridBaseOptions.selection
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selection?: GridBaseSelection;
    /**
     * @docid GridBaseOptions.showBorders
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showBorders?: boolean;
    /**
     * @docid GridBaseOptions.showColumnHeaders
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnHeaders?: boolean;
    /**
     * @docid GridBaseOptions.showColumnLines
     * @default false [for](Material)
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnLines?: boolean;
    /**
     * @docid GridBaseOptions.showRowLines
     * @default true [for](iOS)
     * @default true [for](Material)
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRowLines?: boolean;
    /**
     * @docid GridBaseOptions.sorting
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sorting?: { ascendingText?: string, clearText?: string, descendingText?: string, mode?: 'multiple' | 'none' | 'single', showSortIndexes?: boolean };
    /**
     * @docid GridBaseOptions.stateStoring
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stateStoring?: { customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((gridState: any) => any), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage' };
    /**
     * @docid GridBaseOptions.twoWayBindingEnabled
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    twoWayBindingEnabled?: boolean;
    /**
     * @docid GridBaseOptions.wordWrapEnabled
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    wordWrapEnabled?: boolean;
}
export interface GridBaseEditing {
    /**
     * @docid GridBaseOptions.editing.confirmDelete
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    confirmDelete?: boolean;
    /**
     * @docid GridBaseOptions.editing.changes
     * @default []
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    changes?: Array<any>;
    /**
     * @docid GridBaseOptions.editing.editColumnName
     * @default null
     * @fires GridBaseOptions.onOptionChanged
     * @public
    */
    editColumnName?: string;
    /**
     * @docid GridBaseOptions.editing.editRowKey
     * @default null
     * @fires GridBaseOptions.onOptionChanged
     * @public
    */
    editRowKey?: any;
    /**
     * @docid GridBaseOptions.editing.form
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    form?: dxFormOptions;
    /**
     * @docid GridBaseOptions.editing.mode
     * @type Enums.GridEditMode
     * @default "row"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
    /**
     * @docid GridBaseOptions.editing.popup
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    popup?: dxPopupOptions;
    /**
     * @docid GridBaseOptions.editing.refreshMode
     * @type Enums.GridEditRefreshMode
     * @default "full"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refreshMode?: 'full' | 'reshape' | 'repaint';
    /**
     * @docid GridBaseOptions.editing.selectTextOnEditStart
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectTextOnEditStart?: boolean;
    /**
     * @docid GridBaseOptions.editing.startEditAction
     * @type Enums.GridStartEditAction
     * @default "click"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    startEditAction?: 'click' | 'dblClick';
    /**
     * @docid GridBaseOptions.editing.texts
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: GridBaseEditingTexts;
    /**
     * @docid GridBaseOptions.editing.useIcons
     * @default true [for](Material)
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useIcons?: boolean;
}
export interface GridBaseEditingTexts {
    /**
     * @docid GridBaseOptions.editing.texts.addRow
     * @default "Add a row"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.cancelAllChanges
     * @default "Discard changes"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelAllChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.cancelRowChanges
     * @default "Cancel"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelRowChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.confirmDeleteMessage
     * @default "Are you sure you want to delete this record?"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    confirmDeleteMessage?: string;
    /**
     * @docid GridBaseOptions.editing.texts.confirmDeleteTitle
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    confirmDeleteTitle?: string;
    /**
     * @docid GridBaseOptions.editing.texts.deleteRow
     * @default "Delete"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.editRow
     * @default "Edit"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.saveAllChanges
     * @default "Save changes"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    saveAllChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.saveRowChanges
     * @default "Save"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    saveRowChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.undeleteRow
     * @default "Undelete"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    undeleteRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.validationCancelChanges
     * @default "Cancel changes"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationCancelChanges?: string;
}
export interface GridBasePaging {
    /**
     * @docid GridBaseOptions.paging.enabled
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    enabled?: boolean;
    /**
     * @docid GridBaseOptions.paging.pageIndex
     * @default 0
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageIndex?: number;
    /**
     * @docid GridBaseOptions.paging.pageSize
     * @default 20
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageSize?: number;
}
export interface GridBaseScrolling {
    /**
     * @docid GridBaseOptions.scrolling.columnRenderingMode
     * @type Enums.GridColumnRenderingMode
     * @default "standard"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnRenderingMode?: 'standard' | 'virtual';
    /**
     * @docid GridBaseOptions.scrolling.preloadEnabled
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    preloadEnabled?: boolean;
    /**
     * @docid GridBaseOptions.scrolling.rowRenderingMode
     * @type Enums.GridRowRenderingMode
     * @default "standard"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowRenderingMode?: 'standard' | 'virtual';
    /**
     * @docid GridBaseOptions.scrolling.scrollByContent
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid GridBaseOptions.scrolling.scrollByThumb
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByThumb?: boolean;
    /**
     * @docid GridBaseOptions.scrolling.showScrollbar
     * @default 'onHover' [for](desktop)
     * @type Enums.ShowScrollbarMode
     * @default 'onScroll'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
    /**
     * @docid GridBaseOptions.scrolling.useNative
     * @type boolean|Enums.Mode
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useNative?: boolean | 'auto';
}
export interface GridBaseSelection {
    /**
     * @docid GridBaseOptions.selection.allowSelectAll
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSelectAll?: boolean;
    /**
     * @docid GridBaseOptions.selection.mode
     * @type Enums.SelectionMode
     * @default "none"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mode?: 'multiple' | 'none' | 'single';
}
/**
 * @docid GridBase
 * @inherits Widget, DataHelperMixin
 * @module ui/grid_base
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export interface GridBase {
    /**
     * @docid GridBase.beginCustomLoading
     * @publicName beginCustomLoading(messageText)
     * @param1 messageText:string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    beginCustomLoading(messageText: string): void;
    /**
     * @docid GridBase.byKey
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @return Promise<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
    /**
     * @docid GridBase.cancelEditData
     * @publicName cancelEditData()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelEditData(): void;
    /**
     * @docid GridBase.cellValue
     * @publicName cellValue(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellValue(rowIndex: number, dataField: string): any;
    /**
     * @docid GridBase.cellValue
     * @publicName cellValue(rowIndex, dataField, value)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @param3 value:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellValue(rowIndex: number, dataField: string, value: any): void;
    /**
     * @docid GridBase.cellValue
     * @publicName cellValue(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    /**
     * @docid GridBase.cellValue
     * @publicName cellValue(rowIndex, visibleColumnIndex, value)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @param3 value:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    /**
     * @docid GridBase.clearFilter
     * @publicName clearFilter()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearFilter(): void;
    /**
     * @docid GridBase.clearFilter
     * @publicName clearFilter(filterName)
     * @param1 filterName:string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearFilter(filterName: string): void;
    /**
     * @docid GridBase.clearSelection
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearSelection(): void;
    /**
     * @docid GridBase.clearSorting
     * @publicName clearSorting()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearSorting(): void;
    /**
     * @docid GridBase.closeEditCell
     * @publicName closeEditCell()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeEditCell(): void;
    /**
     * @docid GridBase.collapseAdaptiveDetailRow
     * @publicName collapseAdaptiveDetailRow()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseAdaptiveDetailRow(): void;
    /**
     * @docid GridBase.columnCount
     * @publicName columnCount()
     * @return number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnCount(): number;
    /**
     * @docid GridBase.columnOption
     * @publicName columnOption(id)
     * @param1 id:number|string
     * @return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnOption(id: number | string): any;
    /**
     * @docid GridBase.columnOption
     * @publicName columnOption(id, optionName)
     * @param1 id:number|string
     * @param2 optionName:string
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnOption(id: number | string, optionName: string): any;
    /**
     * @docid GridBase.columnOption
     * @publicName columnOption(id, optionName, optionValue)
     * @param1 id:number|string
     * @param2 optionName:string
     * @param3 optionValue:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnOption(id: number | string, optionName: string, optionValue: any): void;
    /**
     * @docid GridBase.columnOption
     * @publicName columnOption(id, options)
     * @param1 id:number|string
     * @param2 options:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnOption(id: number | string, options: any): void;
    /**
     * @docid GridBase.deleteColumn
     * @publicName deleteColumn(id)
     * @param1 id:number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteColumn(id: number | string): void;
    /**
     * @docid GridBase.deleteRow
     * @publicName deleteRow(rowIndex)
     * @param1 rowIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteRow(rowIndex: number): void;
    /**
     * @docid GridBase.deselectAll
     * @publicName deselectAll()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deselectAll(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid GridBase.deselectRows
     * @publicName deselectRows(keys)
     * @param1 keys:Array<any>
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deselectRows(keys: Array<any>): Promise<any> & JQueryPromise<any>;
    /**
     * @docid GridBase.editCell
     * @publicName editCell(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editCell(rowIndex: number, dataField: string): void;
    /**
     * @docid GridBase.editCell
     * @publicName editCell(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    /**
     * @docid GridBase.editRow
     * @publicName editRow(rowIndex)
     * @param1 rowIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editRow(rowIndex: number): void;
    /**
     * @docid GridBase.endCustomLoading
     * @publicName endCustomLoading()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endCustomLoading(): void;
    /**
     * @docid GridBase.expandAdaptiveDetailRow
     * @publicName expandAdaptiveDetailRow(key)
     * @param1 key:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandAdaptiveDetailRow(key: any): void;
    /**
     * @docid GridBase.filter
     * @publicName filter()
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filter(): any;
    /**
     * @docid GridBase.filter
     * @publicName filter(filterExpr)
     * @param1 filterExpr:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filter(filterExpr: any): void;
    focus(): void;
    /**
     * @docid GridBase.focus
     * @publicName focus(element)
     * @param1 element:Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focus(element: Element | JQuery): void;
    /**
     * @docid GridBase.getCellElement
     * @publicName getCellElement(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @return dxElement|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCellElement(rowIndex: number, dataField: string): dxElement | undefined;
    /**
     * @docid GridBase.getCellElement
     * @publicName getCellElement(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @return dxElement|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCellElement(rowIndex: number, visibleColumnIndex: number): dxElement | undefined;
    /**
     * @docid GridBase.getCombinedFilter
     * @publicName getCombinedFilter()
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCombinedFilter(): any;
    /**
     * @docid GridBase.getCombinedFilter
     * @publicName getCombinedFilter(returnDataField)
     * @param1 returnDataField:boolean
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    /**
     * @docid GridBase.getKeyByRowIndex
     * @publicName getKeyByRowIndex(rowIndex)
     * @param1 rowIndex:numeric
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getKeyByRowIndex(rowIndex: number): any;
    /**
     * @docid GridBase.getRowElement
     * @publicName getRowElement(rowIndex)
     * @param1 rowIndex:number
     * @return Array<Element>|jQuery|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getRowElement(rowIndex: number): Array<Element> & JQuery | undefined;
    /**
     * @docid GridBase.getRowIndexByKey
     * @publicName getRowIndexByKey(key)
     * @param1 key:object|string|number
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getRowIndexByKey(key: any | string | number): number;
    /**
     * @docid GridBase.getScrollable
     * @publicName getScrollable()
     * @return dxScrollable
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getScrollable(): dxScrollable;
    /**
     * @docid GridBase.getVisibleColumnIndex
     * @publicName getVisibleColumnIndex(id)
     * @param1 id:number|string
     * @return number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleColumnIndex(id: number | string): number;
    /**
     * @docid GridBase.hasEditData
     * @publicName hasEditData()
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasEditData(): boolean;
    /**
     * @docid GridBase.hideColumnChooser
     * @publicName hideColumnChooser()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideColumnChooser(): void;
    /**
     * @docid GridBase.isAdaptiveDetailRowExpanded
     * @publicName isAdaptiveDetailRowExpanded(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isAdaptiveDetailRowExpanded(key: any): boolean;
    /**
     * @docid GridBase.isRowFocused
     * @publicName isRowFocused(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRowFocused(key: any): boolean;
    /**
     * @docid GridBase.isRowSelected(key)
     * @publicName isRowSelected(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRowSelected(key: any): boolean;
    /**
     * @docid GridBase.keyOf
     * @publicName keyOf(obj)
     * @param1 obj:object
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyOf(obj: any): any;
    /**
     * @docid GridBase.navigateToRow
     * @publicName navigateToRow(key)
     * @param1 key:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    navigateToRow(key: any): void;
    /**
     * @docid GridBase.pageCount
     * @publicName pageCount()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageCount(): number;
    /**
     * @docid GridBase.pageIndex
     * @publicName pageIndex()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageIndex(): number;
    /**
     * @docid GridBase.pageIndex
     * @publicName pageIndex(newIndex)
     * @param1 newIndex:numeric
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageIndex(newIndex: number): Promise<void> & JQueryPromise<void>;
    /**
     * @docid GridBase.pageSize
     * @publicName pageSize()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageSize(): number;
    /**
     * @docid GridBase.pageSize
     * @publicName pageSize(value)
     * @param1 value:numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageSize(value: number): void;
    /**
     * @docid GridBase.refresh
     * @publicName refresh()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refresh(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid GridBase.refresh
     * @publicName refresh(changesOnly)
     * @param1 changesOnly:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refresh(changesOnly: boolean): Promise<void> & JQueryPromise<void>;
    /**
     * @docid GridBase.repaintRows
     * @publicName repaintRows(rowIndexes)
     * @param1 rowIndexes:Array<number>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintRows(rowIndexes: Array<number>): void;
    /**
     * @docid GridBase.saveEditData
     * @publicName saveEditData()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    saveEditData(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid GridBase.searchByText
     * @publicName searchByText(text)
     * @param1 text:string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchByText(text: string): void;
    /**
     * @docid GridBase.selectAll
     * @publicName selectAll()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectAll(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid GridBase.selectRows
     * @publicName selectRows(keys, preserve)
     * @param1 keys:Array<any>
     * @param2 preserve:boolean
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectRows(keys: Array<any>, preserve: boolean): Promise<any> & JQueryPromise<any>;
    /**
     * @docid GridBase.selectRowsByIndexes
     * @publicName selectRowsByIndexes(indexes)
     * @param1 indexes:Array<number>
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectRowsByIndexes(indexes: Array<number>): Promise<any> & JQueryPromise<any>;
    /**
     * @docid GridBase.showColumnChooser
     * @publicName showColumnChooser()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnChooser(): void;
    /**
     * @docid GridBase.state
     * @publicName state()
     * @return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    state(): any;
    /**
     * @docid GridBase.state
     * @publicName state(state)
     * @param1 state:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    state(state: any): void;
    /**
     * @docid GridBase.undeleteRow
     * @publicName undeleteRow(rowIndex)
     * @param1 rowIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    undeleteRow(rowIndex: number): void;
    /**
     * @docid GridBase.updateDimensions
     * @publicName updateDimensions()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): void;
}

export interface GridBaseColumn {
    /**
     * @docid GridBaseColumn.alignment
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @acceptValues undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignment?: 'center' | 'left' | 'right' | undefined;
    /**
     * @docid GridBaseColumn.allowEditing
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowEditing?: boolean;
    /**
     * @docid GridBaseColumn.allowFiltering
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowFiltering?: boolean;
    /**
     * @docid GridBaseColumn.allowFixing
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowFixing?: boolean;
    /**
     * @docid GridBaseColumn.allowHeaderFiltering
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowHeaderFiltering?: boolean;
    /**
     * @docid GridBaseColumn.allowHiding
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowHiding?: boolean;
    /**
     * @docid GridBaseColumn.allowReordering
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowReordering?: boolean;
    /**
     * @docid GridBaseColumn.allowResizing
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowResizing?: boolean;
    /**
     * @docid GridBaseColumn.allowSearch
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSearch?: boolean;
    /**
     * @docid GridBaseColumn.allowSorting
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSorting?: boolean;
    /**
     * @docid GridBaseColumn.calculateCellValue
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateCellValue?: ((rowData: any) => any);
    /**
     * @docid GridBaseColumn.calculateDisplayValue
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateDisplayValue?: string | ((rowData: any) => any);
    /**
     * @docid GridBaseColumn.calculateFilterExpression
     * @type_function_param1 filterValue:any
     * @type_function_param2 selectedFilterOperation:string
     * @type_function_param3 target:string
     * @type_function_return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string, target: string) => string | Array<any> | Function);
    /**
     * @docid GridBaseColumn.calculateSortValue
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateSortValue?: string | ((rowData: any) => any);
    /**
     * @docid GridBaseColumn.caption
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid GridBaseColumn.cssClass
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid GridBaseColumn.customizeText
     * @type_function_param1 cellInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 target:string
     * @type_function_param1_field4 groupInterval:string|number
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string, target?: string, groupInterval?: string | number }) => string);
    /**
     * @docid GridBaseColumn.dataField
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataField?: string;
    /**
     * @docid GridBaseColumn.dataType
     * @type Enums.GridColumnDataType
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
    /**
     * @docid GridBaseColumn.editorOptions
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorOptions?: any;
    /**
     * @docid GridBaseColumn.encodeHtml
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    encodeHtml?: boolean;
    /**
     * @docid GridBaseColumn.falseText
     * @default "false"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    falseText?: string;
    /**
     * @docid GridBaseColumn.filterOperations
     * @type Array<Enums.GridFilterOperations, string>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof'>;
    /**
     * @docid GridBaseColumn.filterType
     * @type Enums.FilterType
     * @default "include"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterType?: 'exclude' | 'include';
    /**
     * @docid GridBaseColumn.filterValue
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterValue?: any;
    /**
     * @docid GridBaseColumn.filterValues
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterValues?: Array<any>;
    /**
     * @docid GridBaseColumn.fixed
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fixed?: boolean;
    /**
     * @docid GridBaseColumn.fixedPosition
     * @type Enums.HorizontalEdge
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fixedPosition?: 'left' | 'right';
    /**
     * @docid GridBaseColumn.formItem
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formItem?: dxFormSimpleItem;
    /**
     * @docid GridBaseColumn.format
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    format?: format;
    /**
     * @docid GridBaseColumn.headerFilter
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerFilter?: { allowSearch?: boolean, dataSource?: Array<any> | ((options: { component?: any, dataSource?: DataSourceOptions }) => any) | DataSourceOptions, groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number, height?: number, searchMode?: 'contains' | 'startswith' | 'equals', width?: number };
    /**
     * @docid GridBaseColumn.hidingPriority
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hidingPriority?: number;
    /**
     * @docid GridBaseColumn.isBand
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isBand?: boolean;
    /**
     * @docid GridBaseColumn.lookup
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    lookup?: { allowClearing?: boolean, dataSource?: Array<any> | DataSourceOptions | Store | ((options: { data?: any, key?: any }) => Array<any> | DataSourceOptions | Store), displayExpr?: string | ((data: any) => string), valueExpr?: string };
    /**
     * @docid GridBaseColumn.minWidth
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number;
    /**
     * @docid GridBaseColumn.name
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid GridBaseColumn.ownerBand
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ownerBand?: number;
    /**
     * @docid GridBaseColumn.renderAsync
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    renderAsync?: boolean;
    /**
     * @docid GridBaseColumn.selectedFilterOperation
     * @type Enums.FilterOperations
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedFilterOperation?: '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';
    /**
     * @docid GridBaseColumn.setCellValue
     * @type_function_param1 newData:object
     * @type_function_param2 value:any
     * @type_function_param3 currentRowData:object
     * @type_function_return void|Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    setCellValue?: ((newData: any, value: any, currentRowData: any) => void | Promise<void> | JQueryPromise<void>);
    /**
     * @docid GridBaseColumn.showEditorAlways
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showEditorAlways?: boolean;
    /**
     * @docid GridBaseColumn.showInColumnChooser
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showInColumnChooser?: boolean;
    /**
     * @docid GridBaseColumn.sortIndex
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortIndex?: number;
    /**
     * @docid GridBaseColumn.sortOrder
     * @type Enums.SortOrder
     * @default undefined
     * @acceptValues undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortOrder?: 'asc' | 'desc' | undefined;
    /**
     * @docid GridBaseColumn.sortingMethod
     * @type_function_param1 value1:any
     * @type_function_param2 value2:any
     * @type_function_return number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortingMethod?: ((value1: any, value2: any) => number);
    /**
     * @docid GridBaseColumn.trueText
     * @default "true"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    trueText?: string;
    /**
     * @docid GridBaseColumn.validationRules
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid GridBaseColumn.visible
     * @default true
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid GridBaseColumn.visibleIndex
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
    /**
     * @docid GridBaseColumn.width
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string;
}

export interface GridBaseColumnButton {
    /**
     * @docid GridBaseColumnButton.cssClass
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid GridBaseColumnButton.hint
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hint?: string;
    /**
     * @docid GridBaseColumnButton.icon
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid GridBaseColumnButton.text
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
}

export interface dxDataGridOptions extends GridBaseOptions<dxDataGrid> {
    /**
     * @docid dxDataGridOptions.columns
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<dxDataGridColumn | string>;
    /**
     * @docid dxDataGridOptions.customizeColumns
     * @type_function_param1 columns:Array<dxDataGridColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeColumns?: ((columns: Array<dxDataGridColumn>) => any);
    /**
     * @docid dxDataGridOptions.customizeExportData
     * @deprecated
     * @type_function_param1 columns:Array<dxDataGridColumn>
     * @type_function_param2 rows:Array<dxDataGridRowObject>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeExportData?: ((columns: Array<dxDataGridColumn>, rows: Array<dxDataGridRowObject>) => any);
    /**
     * @docid dxDataGridOptions.editing
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editing?: dxDataGridEditing;
    /**
     * @docid dxDataGridOptions.export
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    export?: { allowExportSelectedData?: boolean, customizeExcelCell?: ((options: { component?: dxDataGrid, horizontalAlignment?: 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right', verticalAlignment?: 'bottom' | 'center' | 'distributed' | 'justify' | 'top', wrapTextEnabled?: boolean, backgroundColor?: string, fillPatternType?: 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid', fillPatternColor?: string, font?: ExcelFont, value?: string | number | Date, numberFormat?: string, gridCell?: ExcelDataGridCell }) => any), enabled?: boolean, excelFilterEnabled?: boolean, excelWrapTextEnabled?: boolean, fileName?: string, ignoreExcelErrors?: boolean, proxyUrl?: string, texts?: { exportAll?: string, exportSelectedRows?: string, exportTo?: string } };
    /**
     * @docid dxDataGridOptions.groupPanel
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupPanel?: { allowColumnDragging?: boolean, emptyPanelText?: string, visible?: boolean | 'auto' };
    /**
     * @docid dxDataGridOptions.grouping
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grouping?: { allowCollapsing?: boolean, autoExpandAll?: boolean, contextMenuEnabled?: boolean, expandMode?: 'buttonClick' | 'rowClick', texts?: { groupByThisColumn?: string, groupContinuedMessage?: string, groupContinuesMessage?: string, ungroup?: string, ungroupAll?: string } };
    /**
     * @docid dxDataGridOptions.keyExpr
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string | Array<string>;
    /**
     * @docid dxDataGridOptions.masterDetail
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    masterDetail?: { autoExpandAll?: boolean, enabled?: boolean, template?: template | ((detailElement: dxElement, detailInfo: { key?: any, data?: any, watch?: Function }) => any) };
    /**
     * @docid dxDataGridOptions.onCellClick
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 value:any
     * @type_function_param1_field8 displayValue:any
     * @type_function_param1_field9 text:string
     * @type_function_param1_field10 columnIndex:number
     * @type_function_param1_field11 column:object
     * @type_function_param1_field12 rowIndex:number
     * @type_function_param1_field13 rowType:string
     * @type_function_param1_field14 cellElement:dxElement
     * @type_function_param1_field15 row:dxDataGridRowObject
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellClick?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, event?: event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: dxElement, row?: dxDataGridRowObject }) => any) | string;
    /**
     * @docid dxDataGridOptions.onCellDblClick
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 value:any
     * @type_function_param1_field8 displayValue:any
     * @type_function_param1_field9 text:string
     * @type_function_param1_field10 columnIndex:number
     * @type_function_param1_field11 column:dxDataGridColumn
     * @type_function_param1_field12 rowIndex:number
     * @type_function_param1_field13 rowType:string
     * @type_function_param1_field14 cellElement:dxElement
     * @type_function_param1_field15 row:dxDataGridRowObject
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellDblClick?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, event?: event, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, cellElement?: dxElement, row?: dxDataGridRowObject }) => any);
    /**
     * @docid dxDataGridOptions.onCellHoverChanged
     * @type_function_param1 e:object
     * @type_function_param1_field4 eventType:string
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 value:any
     * @type_function_param1_field8 text:string
     * @type_function_param1_field9 displayValue:any
     * @type_function_param1_field10 columnIndex:number
     * @type_function_param1_field11 rowIndex:number
     * @type_function_param1_field12 column:dxDataGridColumn
     * @type_function_param1_field13 rowType:string
     * @type_function_param1_field14 cellElement:dxElement
     * @type_function_param1_field15 row:dxDataGridRowObject
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellHoverChanged?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, rowType?: string, cellElement?: dxElement, row?: dxDataGridRowObject }) => any);
    /**
     * @docid dxDataGridOptions.onCellPrepared
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 value:any
     * @type_function_param1_field7 displayValue:any
     * @type_function_param1_field8 text:string
     * @type_function_param1_field9 columnIndex:number
     * @type_function_param1_field10 column:dxDataGridColumn
     * @type_function_param1_field11 rowIndex:number
     * @type_function_param1_field12 rowType:string
     * @type_function_param1_field13 row:dxDataGridRowObject
     * @type_function_param1_field14 isSelected:boolean
     * @type_function_param1_field15 isExpanded:boolean
     * @type_function_param1_field16 isNewRow:boolean
     * @type_function_param1_field17 cellElement:dxElement
     * @type_function_param1_field18 watch:function
     * @type_function_param1_field19 oldValue:any
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellPrepared?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, cellElement?: dxElement, watch?: Function, oldValue?: any }) => any);
    /**
     * @docid dxDataGridOptions.onContextMenuPreparing
     * @type_function_param1 e:Object
     * @type_function_param1_field4 items:Array<Object>
     * @type_function_param1_field5 target:string
     * @type_function_param1_field6 targetElement:dxElement
     * @type_function_param1_field7 columnIndex:number
     * @type_function_param1_field8 column:dxDataGridColumn
     * @type_function_param1_field9 rowIndex:number
     * @type_function_param1_field10 row:dxDataGridRowObject
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContextMenuPreparing?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, items?: Array<any>, target?: string, targetElement?: dxElement, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, row?: dxDataGridRowObject }) => any);
    /**
     * @docid dxDataGridOptions.onEditingStart
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 cancel:boolean
     * @type_function_param1_field7 column:object
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditingStart?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
    /**
     * @docid dxDataGridOptions.onEditorPrepared
     * @type_function_param1 options:object
     * @type_function_param1_field4 parentType:string
     * @type_function_param1_field5 value:any
     * @type_function_param1_field6 setValue(newValue, newText):any
     * @type_function_param1_field7 updateValueTimeout:number
     * @type_function_param1_field8 width:number
     * @type_function_param1_field9 disabled:boolean
     * @type_function_param1_field10 rtlEnabled:boolean
     * @type_function_param1_field11 editorElement:dxElement
     * @type_function_param1_field12 readOnly:boolean
     * @type_function_param1_field13 dataField:string
     * @type_function_param1_field14 row:dxDataGridRowObject
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorPrepared?: ((options: { component?: dxDataGrid, element?: dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: dxElement, readOnly?: boolean, dataField?: string, row?: dxDataGridRowObject }) => any);
    /**
     * @docid dxDataGridOptions.onEditorPreparing
     * @type_function_param1 e:object
     * @type_function_param1_field4 parentType:string
     * @type_function_param1_field5 value:any
     * @type_function_param1_field6 setValue(newValue, newText):any
     * @type_function_param1_field7 updateValueTimeout:number
     * @type_function_param1_field8 width:number
     * @type_function_param1_field9 disabled:boolean
     * @type_function_param1_field10 rtlEnabled:boolean
     * @type_function_param1_field11 cancel:boolean
     * @type_function_param1_field12 editorElement:dxElement
     * @type_function_param1_field13 readOnly:boolean
     * @type_function_param1_field14 editorName:string
     * @type_function_param1_field15 editorOptions:object
     * @type_function_param1_field16 dataField:string
     * @type_function_param1_field17 row:dxDataGridRowObject
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorPreparing?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: dxElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxDataGridRowObject }) => any);
    /**
     * @docid dxDataGridOptions.onExported
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated
     */
    onExported?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxDataGridOptions.onExporting
     * @type_function_param1 e:object
     * @type_function_param1_field4 fileName:string
     * @type_function_param1_field5 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onExporting?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
    /**
     * @docid dxDataGridOptions.onFileSaving
     * @type_function_param1 e:object
     * @type_function_param1_field3 fileName:string
     * @type_function_param1_field4 format:string
     * @type_function_param1_field5 data:BLOB
     * @type_function_param1_field6 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated
     */
    onFileSaving?: ((e: { component?: dxDataGrid, element?: dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
    /**
     * @docid dxDataGridOptions.onFocusedCellChanged
     * @type_function_param1 e:object
     * @type_function_param1_field4 cellElement:dxElement
     * @type_function_param1_field5 columnIndex:number
     * @type_function_param1_field6 rowIndex:number
     * @type_function_param1_field7 row:dxDataGridRowObject
     * @type_function_param1_field8 column:dxDataGridColumn
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedCellChanged?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, cellElement?: dxElement, columnIndex?: number, rowIndex?: number, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any);
    /**
     * @docid dxDataGridOptions.onFocusedCellChanging
     * @type_function_param1 e:object
     * @type_function_param1_field4 cellElement:dxElement
     * @type_function_param1_field5 prevColumnIndex:number
     * @type_function_param1_field6 prevRowIndex:number
     * @type_function_param1_field7 newColumnIndex:number
     * @type_function_param1_field8 newRowIndex:number
     * @type_function_param1_field9 event:event
     * @type_function_param1_field10 rows:Array<dxDataGridRowObject>
     * @type_function_param1_field11 columns:Array<dxDataGridColumn>
     * @type_function_param1_field12 cancel:boolean
     * @type_function_param1_field13 isHighlighted:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedCellChanging?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, cellElement?: dxElement, prevColumnIndex?: number, prevRowIndex?: number, newColumnIndex?: number, newRowIndex?: number, event?: event, rows?: Array<dxDataGridRowObject>, columns?: Array<dxDataGridColumn>, cancel?: boolean, isHighlighted?: boolean }) => any);
    /**
     * @docid dxDataGridOptions.onFocusedRowChanged
     * @type_function_param1 e:object
     * @type_function_param1_field4 rowElement:dxElement
     * @type_function_param1_field5 rowIndex:number
     * @type_function_param1_field6 row:dxDataGridRowObject
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedRowChanged?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, rowElement?: dxElement, rowIndex?: number, row?: dxDataGridRowObject }) => any);
    /**
     * @docid dxDataGridOptions.onFocusedRowChanging
     * @type_function_param1 e:object
     * @type_function_param1_field4 rowElement:dxElement
     * @type_function_param1_field5 prevRowIndex:number
     * @type_function_param1_field6 newRowIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 rows:Array<dxDataGridRowObject>
     * @type_function_param1_field9 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedRowChanging?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, rowElement?: dxElement, prevRowIndex?: number, newRowIndex?: number, event?: event, rows?: Array<dxDataGridRowObject>, cancel?: boolean }) => any);
    /**
     * @docid dxDataGridOptions.onRowClick
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 values:Array<any>
     * @type_function_param1_field8 columns:Array<Object>
     * @type_function_param1_field9 rowIndex:number
     * @type_function_param1_field10 rowType:string
     * @type_function_param1_field11 isSelected:boolean
     * @type_function_param1_field12 isExpanded:boolean
     * @type_function_param1_field13 isNewRow:boolean
     * @type_function_param1_field14 groupIndex:number
     * @type_function_param1_field15 rowElement:dxElement
     * @type_function_param1_field16 handled:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowClick?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, event?: event, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: dxElement, handled?: boolean }) => any) | string;
    /**
     * @docid dxDataGridOptions.onRowDblClick
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 values:Array<any>
     * @type_function_param1_field8 columns:Array<dxDataGridColumn>
     * @type_function_param1_field9 rowIndex:number
     * @type_function_param1_field10 rowType:string
     * @type_function_param1_field11 isSelected:boolean
     * @type_function_param1_field12 isExpanded:boolean
     * @type_function_param1_field13 isNewRow:boolean
     * @type_function_param1_field14 groupIndex:number
     * @type_function_param1_field15 rowElement:dxElement
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowDblClick?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, event?: event, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: dxElement }) => any);
    /**
     * @docid dxDataGridOptions.onRowPrepared
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 values:Array<any>
     * @type_function_param1_field7 columns:Array<dxDataGridColumn>
     * @type_function_param1_field8 rowIndex:number
     * @type_function_param1_field9 rowType:string
     * @type_function_param1_field10 groupIndex:number
     * @type_function_param1_field11 isSelected:boolean
     * @type_function_param1_field12 isExpanded:boolean
     * @type_function_param1_field13 isNewRow:boolean
     * @type_function_param1_field14 rowElement:dxElement
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowPrepared?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, groupIndex?: number, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: dxElement }) => any);
    /**
     * @docid dxDataGridOptions.remoteOperations
     * @type boolean|object|Enums.Mode
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    remoteOperations?: boolean | { filtering?: boolean, groupPaging?: boolean, grouping?: boolean, paging?: boolean, sorting?: boolean, summary?: boolean } | 'auto';
    /**
     * @docid dxDataGridOptions.rowTemplate
     * @type_function_param1 rowElement:dxElement
     * @type_function_param2 rowInfo:object
     * @type_function_param2_field1 data:any
     * @type_function_param2_field2 component:dxDataGrid
     * @type_function_param2_field3 values:Array<any>
     * @type_function_param2_field4 rowIndex:number
     * @type_function_param2_field5 columns:Array<dxDataGridColumn>
     * @type_function_param2_field6 isSelected:boolean
     * @type_function_param2_field7 rowType:string
     * @type_function_param2_field8 groupIndex:number
     * @type_function_param2_field9 isExpanded:boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowTemplate?: template | ((rowElement: dxElement, rowInfo: { data?: any, component?: dxDataGrid, values?: Array<any>, rowIndex?: number, columns?: Array<dxDataGridColumn>, isSelected?: boolean, rowType?: string, groupIndex?: number, isExpanded?: boolean }) => any);
    /**
     * @docid dxDataGridOptions.scrolling
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrolling?: dxDataGridScrolling;
    /**
     * @docid dxDataGridOptions.selection
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selection?: dxDataGridSelection;
    /**
     * @docid dxDataGridOptions.selectionFilter
     * @type Filter expression
     * @default []
     * @fires dxDataGridOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionFilter?: string | Array<any> | Function;
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortByGroupSummaryInfo?: Array<{ groupColumn?: string, sortOrder?: 'asc' | 'desc', summaryItem?: string | number }>;
    /**
     * @docid dxDataGridOptions.summary
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    summary?: { calculateCustomSummary?: ((options: { component?: dxDataGrid, name?: string, summaryProcess?: string, value?: any, totalValue?: any, groupIndex?: number }) => any), groupItems?: Array<{ alignByColumn?: boolean, column?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), displayFormat?: string, name?: string, showInColumn?: string, showInGroupFooter?: boolean, skipEmptyValues?: boolean, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string, valueFormat?: format }>, recalculateWhileEditing?: boolean, skipEmptyValues?: boolean, texts?: { avg?: string, avgOtherColumn?: string, count?: string, max?: string, maxOtherColumn?: string, min?: string, minOtherColumn?: string, sum?: string, sumOtherColumn?: string }, totalItems?: Array<{ alignment?: 'center' | 'left' | 'right', column?: string, cssClass?: string, customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string), displayFormat?: string, name?: string, showInColumn?: string, skipEmptyValues?: boolean, summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string, valueFormat?: format }> };
}
export interface dxDataGridEditing extends GridBaseEditing {
    /**
     * @docid dxDataGridOptions.editing.allowAdding
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowAdding?: boolean;
    /**
     * @docid dxDataGridOptions.editing.allowDeleting
     * @default false
     * @type_function_param1 options:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 row:dxDataGridRowObject
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowDeleting?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject }) => boolean);
    /**
     * @docid dxDataGridOptions.editing.allowUpdating
     * @default false
     * @type_function_param1 options:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 row:dxDataGridRowObject
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowUpdating?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject }) => boolean);
    /**
     * @docid dxDataGridOptions.editing.texts
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: any;
}
export interface dxDataGridScrolling extends GridBaseScrolling {
    /**
     * @docid dxDataGridOptions.scrolling.mode
     * @type Enums.GridScrollingMode
     * @default "standard"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mode?: 'infinite' | 'standard' | 'virtual';
}
export interface dxDataGridSelection extends GridBaseSelection {
    /**
     * @docid dxDataGridOptions.selection.deferred
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferred?: boolean;
    /**
     * @docid dxDataGridOptions.selection.selectAllMode
     * @type Enums.SelectAllMode
     * @default "allPages"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * @docid dxDataGridOptions.selection.showCheckBoxesMode
     * @type Enums.GridSelectionShowCheckBoxesMode
     * @default "onClick"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
}
/**
 * @docid dxDataGrid
 * @inherits GridBase
 * @module ui/data_grid
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
declare class dxDataGrid extends Widget implements GridBase {
    constructor(element: Element, options?: dxDataGridOptions)
    constructor(element: JQuery, options?: dxDataGridOptions)
    /**
     * @docid dxDataGrid.addColumn
     * @publicName addColumn(columnOptions)
     * @param1 columnOptions:object|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addColumn(columnOptions: any | string): void;
    /**
     * @docid dxDataGrid.addRow
     * @publicName addRow()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRow(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxDataGrid.clearGrouping
     * @publicName clearGrouping()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearGrouping(): void;
    /**
     * @docid dxDataGrid.collapseAll
     * @publicName collapseAll(groupIndex)
     * @param1 groupIndex:number | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseAll(groupIndex?: number): void;
    /**
     * @docid dxDataGrid.collapseRow
     * @publicName collapseRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseRow(key: any): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxDataGrid.expandAll
     * @publicName expandAll(groupIndex)
     * @param1 groupIndex:number | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandAll(groupIndex?: number): void;
    /**
     * @docid dxDataGrid.expandRow
     * @publicName expandRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandRow(key: any): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxDataGrid.exportToExcel
     * @publicName exportToExcel(selectionOnly)
     * @deprecated excelExporter.exportDataGrid
     * @param1 selectionOnly:boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    exportToExcel(selectionOnly: boolean): void;
    /**
     * @docid dxDataGrid.getSelectedRowKeys
     * @publicName getSelectedRowKeys()
     * @return Array<any> | Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedRowKeys(): Array<any> & Promise<any> & JQueryPromise<any>;
    /**
     * @docid dxDataGrid.getSelectedRowsData
     * @publicName getSelectedRowsData()
     * @return Array<any> | Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedRowsData(): Array<any> & Promise<any> & JQueryPromise<any>;
    /**
     * @docid dxDataGrid.getTotalSummaryValue
     * @publicName getTotalSummaryValue(summaryItemName)
     * @param1 summaryItemName:String
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getTotalSummaryValue(summaryItemName: string): any;
    /**
     * @docid dxDataGrid.getVisibleColumns
     * @publicName getVisibleColumns()
     * @return Array<dxDataGridColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleColumns(): Array<dxDataGridColumn>;
    /**
     * @docid dxDataGrid.getVisibleColumns
     * @publicName getVisibleColumns(headerLevel)
     * @param1 headerLevel:number
     * @return Array<dxDataGridColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleColumns(headerLevel: number): Array<dxDataGridColumn>;
    /**
     * @docid dxDataGrid.getVisibleRows
     * @publicName getVisibleRows()
     * @return Array<dxDataGridRowObject>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleRows(): Array<dxDataGridRowObject>;
    /**
     * @docid dxDataGrid.isRowExpanded
     * @publicName isRowExpanded(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRowExpanded(key: any): boolean;
    /**
     * @docid dxDataGrid.isRowSelected(data)
     * @publicName isRowSelected(data)
     * @param1 data:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRowSelected(data: any): boolean;
    isRowSelected(key: any): boolean;
    /**
     * @docid dxDataGrid.totalCount
     * @publicName totalCount()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    totalCount(): number;

    beginCustomLoading(messageText: string): void;
    byKey(key: any | string | number): Promise<any> & JQueryPromise<any>;
    cancelEditData(): void;
    cellValue(rowIndex: number, dataField: string): any;
    cellValue(rowIndex: number, dataField: string, value: any): void;
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    clearFilter(): void;
    clearFilter(filterName: string): void;
    clearSelection(): void;
    clearSorting(): void;
    closeEditCell(): void;
    collapseAdaptiveDetailRow(): void;
    columnCount(): number;
    columnOption(id: number | string): any;
    columnOption(id: number | string, optionName: string): any;
    columnOption(id: number | string, optionName: string, optionValue: any): void;
    columnOption(id: number | string, options: any): void;
    deleteColumn(id: number | string): void;
    deleteRow(rowIndex: number): void;
    deselectAll(): Promise<void> & JQueryPromise<void>;
    deselectRows(keys: Array<any>): Promise<any> & JQueryPromise<any>;
    editCell(rowIndex: number, dataField: string): void;
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    editRow(rowIndex: number): void;
    endCustomLoading(): void;
    expandAdaptiveDetailRow(key: any): void;
    filter(): any;
    filter(filterExpr: any): void;
    focus(): void;
    focus(element: Element | JQuery): void;
    getCellElement(rowIndex: number, dataField: string): dxElement | undefined;
    getCellElement(rowIndex: number, visibleColumnIndex: number): dxElement | undefined;
    getCombinedFilter(): any;
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    getKeyByRowIndex(rowIndex: number): any;
    getRowElement(rowIndex: number): Array<Element> & JQuery | undefined;
    getRowIndexByKey(key: any | string | number): number;
    getScrollable(): dxScrollable;
    getVisibleColumnIndex(id: number | string): number;
    hasEditData(): boolean;
    hideColumnChooser(): void;
    isAdaptiveDetailRowExpanded(key: any): boolean;
    isRowFocused(key: any): boolean;
    isRowSelected(key: any): boolean;
    keyOf(obj: any): any;
    navigateToRow(key: any): void;
    pageCount(): number;
    pageIndex(): number;
    pageIndex(newIndex: number): Promise<void> & JQueryPromise<void>;
    pageSize(): number;
    pageSize(value: number): void;
    refresh(): Promise<void> & JQueryPromise<void>;
    refresh(changesOnly: boolean): Promise<void> & JQueryPromise<void>;
    repaintRows(rowIndexes: Array<number>): void;
    saveEditData(): Promise<void> & JQueryPromise<void>;
    searchByText(text: string): void;
    selectAll(): Promise<void> & JQueryPromise<void>;
    selectRows(keys: Array<any>, preserve: boolean): Promise<any> & JQueryPromise<any>;
    selectRowsByIndexes(indexes: Array<number>): Promise<any> & JQueryPromise<any>;
    showColumnChooser(): void;
    state(): any;
    state(state: any): void;
    undeleteRow(rowIndex: number): void;
    updateDimensions(): void;
}

export interface dxDataGridColumn extends GridBaseColumn {
    /**
     * @docid dxDataGridColumn.allowExporting
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowExporting?: boolean;
    /**
     * @docid dxDataGridColumn.allowGrouping
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowGrouping?: boolean;
    /**
     * @docid dxDataGridColumn.autoExpandGroup
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoExpandGroup?: boolean;
    /**
     * @docid dxDataGridColumn.buttons
     * @type Array<Enums.GridColumnButtonName,dxDataGridColumnButton>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttons?: Array<'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | dxDataGridColumnButton>;
    /**
     * @docid dxDataGridColumn.calculateGroupValue
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateGroupValue?: string | ((rowData: any) => any);
    /**
     * @docid dxDataGridColumn.cellTemplate
     * @type_function_param1 cellElement:dxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 data:object
     * @type_function_param2_field2 component:dxDataGrid
     * @type_function_param2_field3 value:any
     * @type_function_param2_field4 oldValue:any
     * @type_function_param2_field5 displayValue:any
     * @type_function_param2_field6 text:string
     * @type_function_param2_field7 columnIndex:number
     * @type_function_param2_field8 rowIndex:number
     * @type_function_param2_field9 column:dxDataGridColumn
     * @type_function_param2_field10 row:dxDataGridRowObject
     * @type_function_param2_field11 rowType:string
     * @type_function_param2_field12 watch:function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellTemplate?: template | ((cellElement: dxElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, oldValue?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
    /**
     * @docid dxDataGridColumn.columns
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<dxDataGridColumn | string>;
    /**
     * @docid dxDataGridColumn.editCellTemplate
     * @type_function_param1 cellElement:dxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 setValue(newValue, newText):any
     * @type_function_param2_field2 data:object
     * @type_function_param2_field3 component:dxDataGrid
     * @type_function_param2_field4 value:any
     * @type_function_param2_field5 displayValue:any
     * @type_function_param2_field6 text:string
     * @type_function_param2_field7 columnIndex:number
     * @type_function_param2_field8 rowIndex:number
     * @type_function_param2_field9 column:dxDataGridColumn
     * @type_function_param2_field10 row:dxDataGridRowObject
     * @type_function_param2_field11 rowType:string
     * @type_function_param2_field12 watch:function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editCellTemplate?: template | ((cellElement: dxElement, cellInfo: { setValue?: any, data?: any, component?: dxDataGrid, value?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
    /**
     * @docid dxDataGridColumn.groupCellTemplate
     * @type_function_param1 cellElement:dxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 data:object
     * @type_function_param2_field2 component:dxDataGrid
     * @type_function_param2_field3 value:any
     * @type_function_param2_field4 text:string
     * @type_function_param2_field5 displayValue:any
     * @type_function_param2_field6 columnIndex:number
     * @type_function_param2_field7 rowIndex:number
     * @type_function_param2_field8 column:dxDataGridColumn
     * @type_function_param2_field9 row:dxDataGridRowObject
     * @type_function_param2_field10 summaryItems:Array<any>
     * @type_function_param2_field11 groupContinuesMessage:string
     * @type_function_param2_field12 groupContinuedMessage:string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupCellTemplate?: template | ((cellElement: dxElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, summaryItems?: Array<any>, groupContinuesMessage?: string, groupContinuedMessage?: string }) => any);
    /**
     * @docid dxDataGridColumn.groupIndex
     * @default undefined
     * @fires dxDataGridOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupIndex?: number;
    /**
     * @docid dxDataGridColumn.headerCellTemplate
     * @type_function_param1 columnHeader:dxElement
     * @type_function_param2 headerInfo:object
     * @type_function_param2_field1 component:dxDataGrid
     * @type_function_param2_field2 columnIndex:number
     * @type_function_param2_field3 column:dxDataGridColumn
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerCellTemplate?: template | ((columnHeader: dxElement, headerInfo: { component?: dxDataGrid, columnIndex?: number, column?: dxDataGridColumn }) => any);
    /**
     * @docid dxDataGridColumn.showWhenGrouped
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showWhenGrouped?: boolean;
    /**
     * @docid dxDataGridColumn.type
     * @publicName type
     * @type Enums.GridCommandColumnType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection';
}

export interface dxDataGridColumnButton extends GridBaseColumnButton {
    /**
     * @docid dxDataGridColumnButton.name
     * @type Enums.GridColumnButtonName|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
    /**
     * @docid dxDataGridColumnButton.onClick
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:dxElement
     * @type_function_param1_field3 model:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 row:dxDataGridRowObject
     * @type_function_param1_field6 column:dxDataGridColumn
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: { component?: dxDataGrid, element?: dxElement, model?: any, event?: event, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any) | string;
    /**
     * @docid dxDataGridColumnButton.template
     * @type_function_param1 cellElement:dxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 component:dxDataGrid
     * @type_function_param2_field2 data:object
     * @type_function_param2_field3 key:any
     * @type_function_param2_field4 columnIndex:number
     * @type_function_param2_field5 column:dxDataGridColumn
     * @type_function_param2_field6 rowIndex:number
     * @type_function_param2_field7 rowType:string
     * @type_function_param2_field8 row:dxDataGridRowObject
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((cellElement: dxElement, cellInfo: { component?: dxDataGrid, data?: any, key?: any, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject }) => string | Element | JQuery);
    /**
     * @docid dxDataGridColumnButton.visible
     * @default true
     * @type_function_param1 options:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 row:dxDataGridRowObject
     * @type_function_param1_field3 column:dxDataGridColumn
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean | ((options: { component?: dxDataGrid, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => boolean);
}

export interface dxDataGridRowObject {
    /**
     * @docid dxDataGridRowObject.data
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    data?: any;
    /**
     * @docid dxDataGridRowObject.groupIndex
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupIndex?: number;
    /**
     * @docid dxDataGridRowObject.isEditing
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isEditing?: boolean;
    /**
     * @docid dxDataGridRowObject.isExpanded
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isExpanded?: boolean;
    /**
     * @docid dxDataGridRowObject.isNewRow
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isNewRow?: boolean;
    /**
     * @docid dxDataGridRowObject.isSelected
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isSelected?: boolean;
    /**
     * @docid dxDataGridRowObject.key
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    key?: any;
    /**
     * @docid dxDataGridRowObject.rowIndex
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowIndex?: number;
    /**
     * @docid dxDataGridRowObject.rowType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowType?: string;
    /**
     * @docid dxDataGridRowObject.values
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    values?: Array<any>;
}

declare global {
interface JQuery {
    dxDataGrid(): JQuery;
    dxDataGrid(options: "instance"): dxDataGrid;
    dxDataGrid(options: string): any;
    dxDataGrid(options: string, ...params: any[]): any;
    dxDataGrid(options: dxDataGridOptions): JQuery;
}
}
export type Options = dxDataGridOptions;

/** @deprecated use Options instead */
export type IOptions = dxDataGridOptions;
export type Column = dxDataGridColumn;

export default dxDataGrid;
