import {
  UserDefinedElement,
  DxElement,
  UserDefinedElementsArray
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    template
} from '../core/templates/template';

import Store from '../data/abstract_store';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
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
} from './validation_rules';

import Widget, {
    format,
    WidgetOptions
} from './widget/ui.widget';

export interface AdaptiveDetailRowPreparingInfo {
  readonly formOptions: any;
}

export interface DataErrorOccurredInfo {
  readonly error?: Error;
}

export interface DataChangeInfo {
  readonly changes: Array<DataChange>;
}

export interface NewRowInfo {
  data: any;
  promise?: PromiseLike<void>;
}

export interface KeyDownInfo {
  handled: boolean;
}

export interface RowKeyInfo {
  readonly key: any;
}

export interface RowInsertedInfo {
  readonly data: any;
  readonly key: any;
  readonly error: Error;
}

export interface RowInsertingInfo {
  data: any;
  cancel: boolean | PromiseLike<void>;
}

export interface RowRemovedInfo {
  readonly data: any;
  readonly key: any;
  readonly error: Error;
}

export interface RowRemovingInfo {
  readonly data: any;
  readonly key: any;
  cancel: boolean | PromiseLike<void>;
}

export interface RowUpdatedInfo {
  readonly data: any;
  readonly key: any;
  readonly error: Error;
}

export interface RowUpdatingInfo {
  readonly oldData: any;
  newData: any;
  readonly key: any;
  cancel: boolean | PromiseLike<void>;
}

export interface RowValidatingInfo {
  readonly brokenRules: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
  isValid: boolean;
  readonly key: any;
  readonly newData: any;
  readonly oldData: any;
  errorText: string;
  promise?: PromiseLike<void>;
}

export interface SavingInfo {
  changes: Array<DataChange>;
  promise?: PromiseLike<void>;
  cancel: boolean;
}

export interface SelectionChangedInfo {
  readonly currentSelectedRowKeys: Array<any>;
  readonly currentDeselectedRowKeys: Array<any>;
  readonly selectedRowKeys: Array<any>;
  readonly selectedRowsData: Array<any>;
}

export interface ToolbarPreparingInfo {
  toolbarOptions: dxToolbarOptions;
}

export interface RowDraggingEventInfo<T extends GridBase> {
  readonly component: T;
  readonly event: DxEvent;
  readonly itemData?: any;
  readonly itemElement: DxElement;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly fromComponent: dxSortable | dxDraggable;
  readonly toComponent: dxSortable | dxDraggable;
  readonly fromData?: any;
  readonly toData?: any;
}

export interface DragStartEventInfo<T extends GridBase> {
  readonly component: T;
  readonly event: DxEvent;
  itemData?: any;
  readonly itemElement: DxElement;
  readonly fromIndex: number;
  readonly fromData?: any;
}

export interface DragDropInfo {
  readonly dropInsideItem: boolean;
}

export interface DragReorderInfo {
  readonly dropInsideItem: boolean;
  promise?: PromiseLike<void>;
}

export interface RowDraggingTemplateDataModel {
  readonly itemData: any;
  readonly itemElement: DxElement;
}

export interface FilterPanelCustomizeTextArg<T> { 
  readonly component: T,
  readonly filterValue: any,
  readonly text: string
}

export interface FilterPanel<T extends GridBase> {
  /**
   * @docid GridBaseOptions.filterPanel.customizeText
   * @type_function_param1 e:object
   * @type_function_param1_field1 component:this
   * @type_function_param1_field2 filterValue:object
   * @type_function_param1_field3 text:string
   * @type_function_return string
   */
  customizeText?: ((e: FilterPanelCustomizeTextArg<T>) => string),
  /**
   * @docid GridBaseOptions.filterPanel.filterEnabled
   * @default true
   * @fires GridBaseOptions.onOptionChanged
   */
  filterEnabled?: boolean,
  /**
   * @docid GridBaseOptions.filterPanel.texts
   * @type object
   * @default {}
   */
  texts?: FilterPanelTexts,
  /**
   * @docid GridBaseOptions.filterPanel.visible
   * @default false
   */
  visible?: boolean
}

export interface RowDragging<T extends GridBase> {
    /**
     * @docid GridBaseOptions.rowDragging.allowDropInsideItem
     * @default false
     */
    allowDropInsideItem?: boolean,
    /**
     * @docid GridBaseOptions.rowDragging.allowReordering
     * @default false
     */
    allowReordering?: boolean,
    /**
     * @docid GridBaseOptions.rowDragging.autoScroll
     * @default true
     */
    autoScroll?: boolean,
    /**
     * @docid GridBaseOptions.rowDragging.boundary
     * @default undefined
     */
    boundary?: string | UserDefinedElement,
    /**
     * @docid GridBaseOptions.rowDragging.container
     * @default undefined
     */
    container?: string | UserDefinedElement,
    /**
     * @docid GridBaseOptions.rowDragging.cursorOffset
     */
    cursorOffset?: string | {
      /**
       * @docid GridBaseOptions.rowDragging.cursorOffset.x
       * @default 0
       */
      x?: number,
      /**
       * @docid GridBaseOptions.rowDragging.cursorOffset.y
       * @default 0
       */
      y?: number
    },
    /**
     * @docid GridBaseOptions.rowDragging.data
     * @default undefined
     */
    data?: any,
    /**
     * @docid GridBaseOptions.rowDragging.dragDirection
     * @type Enums.DragDirection
     * @default "both"
     */
    dragDirection?: 'both' | 'horizontal' | 'vertical',
    /**
     * @docid GridBaseOptions.rowDragging.dragTemplate
     * @type_function_param1 dragInfo:object
     * @type_function_param1_field1 itemData:any
     * @type_function_param1_field2 itemElement:DxElement
     * @type_function_param2 containerElement:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     */
    dragTemplate?: template | ((dragInfo: RowDraggingTemplateData, containerElement: DxElement) => string | UserDefinedElement),
    /**
     * @docid GridBaseOptions.rowDragging.dropFeedbackMode
     * @type Enums.DropFeedbackMode
     * @default "indicate"
     */
    dropFeedbackMode?: 'push' | 'indicate',
    /**
     * @docid GridBaseOptions.rowDragging.filter
     * @default "> *"
     */
    filter?: string,
    /**
     * @docid GridBaseOptions.rowDragging.group
     * @default undefined
     */
    group?: string,
    /**
     * @docid GridBaseOptions.rowDragging.handle
     * @default ""
     */
    handle?: string,
    /**
     * @docid GridBaseOptions.rowDragging.onAdd
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 event:event
     * @type_function_param1_field3 itemData:any
     * @type_function_param1_field4 itemElement:DxElement
     * @type_function_param1_field5 fromIndex:number
     * @type_function_param1_field6 toIndex:number
     * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 fromData:any
     * @type_function_param1_field10 toData:any
     * @type_function_param1_field11 dropInsideItem:boolean
     */
    onAdd?: ((e: RowDraggingEventInfo<T> & DragDropInfo) => void),
    /**
     * @docid GridBaseOptions.rowDragging.onDragChange
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 event:event
     * @type_function_param1_field3 cancel:boolean
     * @type_function_param1_field4 itemData:any
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 fromIndex:number
     * @type_function_param1_field7 toIndex:number
     * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 fromData:any
     * @type_function_param1_field11 toData:any
     * @type_function_param1_field12 dropInsideItem:boolean
     */
    onDragChange?: ((e: Cancelable & RowDraggingEventInfo<T> & DragDropInfo) => void),
    /**
     * @docid GridBaseOptions.rowDragging.onDragEnd
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 event:event
     * @type_function_param1_field3 cancel:boolean
     * @type_function_param1_field4 itemData:any
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 fromIndex:number
     * @type_function_param1_field7 toIndex:number
     * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 fromData:any
     * @type_function_param1_field11 toData:any
     * @type_function_param1_field12 dropInsideItem:boolean
     */
    onDragEnd?: ((e: Cancelable & RowDraggingEventInfo<T> & DragDropInfo) => void),
    /**
     * @docid GridBaseOptions.rowDragging.onDragMove
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 event:event
     * @type_function_param1_field3 cancel:boolean
     * @type_function_param1_field4 itemData:any
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 fromIndex:number
     * @type_function_param1_field7 toIndex:number
     * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 fromData:any
     * @type_function_param1_field11 toData:any
     * @type_function_param1_field12 dropInsideItem:boolean
     */
    onDragMove?: ((e: Cancelable & RowDraggingEventInfo<T> & DragDropInfo) => void),
    /**
     * @docid GridBaseOptions.rowDragging.onDragStart
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 event:event
     * @type_function_param1_field3 cancel:boolean
     * @type_function_param1_field4 itemData:any
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 fromIndex:number
     * @type_function_param1_field7 fromData:any
     */
    onDragStart?: ((e: Cancelable & DragStartEventInfo<T>) => void),
    /**
     * @docid GridBaseOptions.rowDragging.onRemove
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 event:event
     * @type_function_param1_field3 itemData:any
     * @type_function_param1_field4 itemElement:DxElement
     * @type_function_param1_field5 fromIndex:number
     * @type_function_param1_field6 toIndex:number
     * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 fromData:any
     * @type_function_param1_field10 toData:any
     */
    onRemove?: ((e: RowDraggingEventInfo<T>) => void),
    /**
     * @docid GridBaseOptions.rowDragging.onReorder
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 event:event
     * @type_function_param1_field3 itemData:any
     * @type_function_param1_field4 itemElement:DxElement
     * @type_function_param1_field5 fromIndex:number
     * @type_function_param1_field6 toIndex:number
     * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 fromData:any
     * @type_function_param1_field10 toData:any
     * @type_function_param1_field11 dropInsideItem:boolean
     * @type_function_param1_field12 promise:Promise<void>
     */
    onReorder?: ((e: RowDraggingEventInfo<dxDataGrid> & DragReorderInfo) => void),
    /**
     * @docid GridBaseOptions.rowDragging.scrollSensitivity
     * @default 60
     */
    scrollSensitivity?: number,
    /**
     * @docid GridBaseOptions.rowDragging.scrollSpeed
     * @default 30
     */
    scrollSpeed?: number,
    /**
     * @docid GridBaseOptions.rowDragging.showDragIcons
     * @default true
     */
    showDragIcons?: boolean
}

/**
 * @namespace DevExpress.ui
 */
export interface GridBaseOptions<T extends GridBase> extends WidgetOptions<T> {
    /**
     * @docid
     * @default false
     * @public
     */
    allowColumnReordering?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    allowColumnResizing?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    autoNavigateToFocusedRow?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    cacheEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    cellHintEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    columnAutoWidth?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    columnChooser?: ColumnChooser;
    /**
     * @docid
     * @type object
     * @public
     */
    columnFixing?: ColumnFixing;
    /**
     * @docid
     * @default false
     * @public
     */
    columnHidingEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    columnMinWidth?: number;
    /**
     * @docid
     * @type Enums.ColumnResizingMode
     * @default "nextColumn"
     * @public
     */
    columnResizingMode?: 'nextColumn' | 'widget';
    /**
     * @docid
     * @default undefined
     * @public
     */
    columnWidth?: number;
    /**
     * @docid
     * @type Array<GridBaseColumn|string>
     * @fires GridBaseOptions.onOptionChanged
     * @default undefined
     * @public
     */
    columns?: Array<ColumnBase | string>;
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid
     * @public
     * @type object
     */
    editing?: EditingBase;
    /**
     * @docid
     * @default true
     * @public
     */
    errorRowEnabled?: boolean;
    /**
     * @docid
     * @default {}
     * @public
     */
    filterBuilder?: dxFilterBuilderOptions;
    /**
     * @docid
     * @default {}
     * @public
     */
    filterBuilderPopup?: dxPopupOptions;
    /**
     * @docid
     * @type object
     * @default {}
     * @public
     */
    filterPanel?: FilterPanel<T>;
    /**
     * @docid
     * @type object
     * @public
     */
    filterRow?: FilterRow;
    /**
     * @docid
     * @type boolean|Enums.Mode
     * @default "auto"
     * @public
     */
    filterSyncEnabled?: boolean | 'auto';
    /**
     * @docid
     * @type Filter expression
     * @default null
     * @fires GridBase.onOptionChanged
     * @public
     */
    filterValue?: string | Array<any> | Function;
    /**
     * @docid
     * @default -1
     * @fires GridBaseOptions.onFocusedCellChanged
     * @public
     */
    focusedColumnIndex?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    focusedRowEnabled?: boolean;
    /**
     * @docid
     * @default -1
     * @fires GridBaseOptions.onFocusedRowChanged
     * @public
     */
    focusedRowIndex?: number;
    /**
     * @docid
     * @default undefined
     * @fires GridBaseOptions.onFocusedRowChanged
     * @public
     */
    focusedRowKey?: any;
    /**
     * @docid
     * @type object
     * @public
     */
    headerFilter?: HeaderFilter;
    /**
     * @docid
     * @default false
     * @public
     */
    highlightChanges?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    keyboardNavigation?: KeyboardNavigation;
    /**
     * @docid
     * @type object
     * @public
     */
    loadPanel?: LoadPanel;
    /**
     * @docid
     * @default "No data"
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 formOptions:object
     * @action
     * @public
     */
    onAdaptiveDetailRowPreparing?: ((e: EventInfo<T> & AdaptiveDetailRowPreparingInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 error:Error
     * @action
     * @public
     */
    onDataErrorOccurred?: ((e: EventInfo<T> & DataErrorOccurredInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 changes:Array<DataChange>
     * @default null
     * @action
     * @public
     */
    onEditCanceled?: ((e: EventInfo<T> & DataChangeInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 changes:Array<DataChange>
     * @type_function_param1_field5 cancel:boolean
     * @default null
     * @action
     * @public
     */
    onEditCanceling?: ((e: Cancelable & EventInfo<T> & DataChangeInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 promise:Promise<void>
     * @default null
     * @action
     * @public
     */
    onInitNewRow?: ((e: EventInfo<T> & NewRowInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 handled:boolean
     * @default null
     * @action
     * @public
     */
    onKeyDown?: ((e: NativeEventInfo<T> & KeyDownInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 key:any
     * @default null
     * @action
     * @public
     */
    onRowCollapsed?: ((e: EventInfo<T> & RowKeyInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 key:any
     * @type_function_param1_field5 cancel:boolean
     * @default null
     * @action
     * @public
     */
    onRowCollapsing?: ((e: Cancelable & EventInfo<T> & RowKeyInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 key:any
     * @default null
     * @action
     * @public
     */
    onRowExpanded?: ((e: EventInfo<T> & RowKeyInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 key:any
     * @type_function_param1_field5 cancel:boolean
     * @default null
     * @action
     * @public
     */
    onRowExpanding?: ((e: Cancelable & EventInfo<T> & RowKeyInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 error:Error
     * @default null
     * @action
     * @public
     */
    onRowInserted?: ((e: EventInfo<T> & RowInsertedInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onRowInserting?: ((e: EventInfo<T> & RowInsertingInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 error:Error
     * @default null
     * @action
     * @public
     */
    onRowRemoved?: ((e: EventInfo<T> & RowRemovedInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onRowRemoving?: ((e: EventInfo<T> & RowRemovingInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 error:Error
     * @default null
     * @action
     * @public
     */
    onRowUpdated?: ((e: EventInfo<T> & RowUpdatedInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 oldData:object
     * @type_function_param1_field5 newData:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onRowUpdating?: ((e: EventInfo<T> & RowUpdatingInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 brokenRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @type_function_param1_field5 isValid:boolean
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 newData:object
     * @type_function_param1_field8 oldData:object
     * @type_function_param1_field9 errorText:string
     * @type_function_param1_field10 promise:Promise<void>
     * @default null
     * @action
     * @public
     */
    onRowValidating?: ((e: EventInfo<T> & RowValidatingInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 changes:Array<DataChange>
     * @default null
     * @action
     * @public
     */
    onSaved?: ((e: EventInfo<T> & DataChangeInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 changes:Array<DataChange>
     * @type_function_param1_field5 promise:Promise<void>
     * @type_function_param1_field6 cancel:boolean
     * @default null
     * @action
     * @public
     */
    onSaving?: ((e: EventInfo<T> & SavingInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 currentSelectedRowKeys:Array<any>
     * @type_function_param1_field5 currentDeselectedRowKeys:Array<any>
     * @type_function_param1_field6 selectedRowKeys:Array<any>
     * @type_function_param1_field7 selectedRowsData:Array<Object>
     * @default null
     * @action
     * @public
     */
    onSelectionChanged?: ((e: EventInfo<T> & SelectionChangedInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 toolbarOptions:dxToolbarOptions
     * @default null
     * @action
     * @public
     */
    onToolbarPreparing?: ((e: EventInfo<T> & ToolbarPreparingInfo) => void);
    /**
     * @docid
     * @type object
     * @public
     */
    pager?: Pager;
    /**
     * @docid
     * @public
     * @type object
     */
    paging?: PagingBase;
    /**
     * @docid
     * @default false
     * @public
     */
    renderAsync?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    rowAlternationEnabled?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    rowDragging?: RowDragging<T>;
    /**
     * @docid
     * @public
     * @type object
     */
    scrolling?: ScrollingBase;
    /**
     * @docid
     * @type object
     * @public
     */
    searchPanel?: SearchPanel;
    /**
     * @docid
     * @fires GridBaseOptions.onSelectionChanged
     * @public
     */
    selectedRowKeys?: Array<any>;
    /**
     * @docid
     * @public
     * @type object
     */
    selection?: SelectionBase;
    /**
     * @docid
     * @default false
     * @public
     */
    showBorders?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showColumnHeaders?: boolean;
    /**
     * @docid
     * @default false [for](Material)
     * @default true
     * @public
     */
    showColumnLines?: boolean;
    /**
     * @docid
     * @default true [for](iOS)
     * @default true [for](Material)
     * @default false
     * @public
     */
    showRowLines?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    sorting?: Sorting;
    /**
     * @docid
     * @type object
     * @public
     */
    stateStoring?: StateStoring;
    /**
     * @docid
     * @default true
     * @public
     */
    twoWayBindingEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    wordWrapEnabled?: boolean;
}

export interface ColumnChooser {
    /**
     * @docid GridBaseOptions.columnChooser.allowSearch
     * @default false
     */
    allowSearch?: boolean,
    /**
     * @docid GridBaseOptions.columnChooser.emptyPanelText
     * @default "Drag a column here to hide it"
     */
    emptyPanelText?: string,
    /**
     * @docid GridBaseOptions.columnChooser.enabled
     * @default false
     */
    enabled?: boolean,
    /**
     * @docid GridBaseOptions.columnChooser.height
     * @default 260
     */
    height?: number,
    /**
     * @docid GridBaseOptions.columnChooser.mode
     * @type Enums.GridColumnChooserMode
     * @default "dragAndDrop"
     */
    mode?: 'dragAndDrop' | 'select',
    /**
     * @docid GridBaseOptions.columnChooser.searchTimeout
     * @default 500
     */
    searchTimeout?: number,
    /**
     * @docid GridBaseOptions.columnChooser.title
     * @default "Column Chooser"
     */
    title?: string,
    /**
     * @docid GridBaseOptions.columnChooser.width
     * @default 250
     */
    width?: number,
    /**
     * @docid GridBaseOptions.columnChooser.sortOrder
     * @type Enums.SortOrder
     * @default undefined
     */
    sortOrder?: 'asc' | 'desc'
}

export interface ColumnFixing {
    /**
     * @docid GridBaseOptions.columnFixing.enabled
     * @default false
     */
    enabled?: boolean,
    /**
     * @docid GridBaseOptions.columnFixing.texts
     * @type object
     */
    texts?: ColumnFixingTexts
}

export interface ColumnFixingTexts {
    /**
     * @docid GridBaseOptions.columnFixing.texts.fix
     * @default "Fix"
     */
    fix?: string,
    /**
     * @docid GridBaseOptions.columnFixing.texts.leftPosition
     * @default "To the left"
     */
    leftPosition?: string,
    /**
     * @docid GridBaseOptions.columnFixing.texts.rightPosition
     * @default "To the right"
     */
    rightPosition?: string,
    /**
     * @docid GridBaseOptions.columnFixing.texts.unfix
     * @default "Unfix"
     */
    unfix?: string
}

export interface FilterPanelTexts {
    /**
     * @docid GridBaseOptions.filterPanel.texts.clearFilter
     * @default "Clear"
     */
    clearFilter?: string,
    /**
     * @docid GridBaseOptions.filterPanel.texts.createFilter
     * @default "Create Filter"
     */
    createFilter?: string,
    /**
     * @docid GridBaseOptions.filterPanel.texts.filterEnabledHint
     * @default "Enable the filter"
     */
    filterEnabledHint?: string
}

export interface FilterRow {
    /**
     * @docid GridBaseOptions.filterRow.applyFilter
     * @type Enums.GridApplyFilterMode
     * @default "auto"
     */
    applyFilter?: 'auto' | 'onClick',
    /**
     * @docid GridBaseOptions.filterRow.applyFilterText
     * @default "Apply filter"
     */
    applyFilterText?: string,
    /**
     * @docid GridBaseOptions.filterRow.betweenEndText
     * @default "End"
     */
    betweenEndText?: string,
    /**
     * @docid GridBaseOptions.filterRow.betweenStartText
     * @default "Start"
     */
    betweenStartText?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions
     * @type object
     */
    operationDescriptions?: FilterRowOperationDescriptions,
    /**
     * @docid GridBaseOptions.filterRow.resetOperationText
     * @default "Reset"
     */
    resetOperationText?: string,
    /**
     * @docid GridBaseOptions.filterRow.showAllText
     * @default "(All)"
     */
    showAllText?: string,
    /**
     * @docid GridBaseOptions.filterRow.showOperationChooser
     * @default true
     */
    showOperationChooser?: boolean,
    /**
     * @docid GridBaseOptions.filterRow.visible
     * @default false
     */
    visible?: boolean
}

export interface FilterRowOperationDescriptions {
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.between
     * @default "Between"
     */
    between?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.contains
     * @default "Contains"
     */
    contains?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.endsWith
     * @default "Ends with"
     */
    endsWith?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.equal
     * @default "Equals"
     */
    equal?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.greaterThan
     * @default "Greater than"
     */
    greaterThan?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.greaterThanOrEqual
     * @default "Greater than or equal to"
     */
    greaterThanOrEqual?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.lessThan
     * @default "Less than"
     */
    lessThan?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.lessThanOrEqual
     * @default "Less than or equal to"
     */
    lessThanOrEqual?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.notContains
     * @default "Does not contain"
     */
    notContains?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.notEqual
     * @default "Does not equal"
     */
    notEqual?: string,
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.startsWith
     * @default "Starts with"
     */
    startsWith?: string
}

export interface HeaderFilter {
    /**
     * @docid GridBaseOptions.headerFilter.allowSearch
     * @default false
     */
    allowSearch?: boolean,
    /**
     * @docid GridBaseOptions.headerFilter.height
     * @default 315 [for](Material)
     * @default 325
     */
    height?: number,
    /**
     * @docid GridBaseOptions.headerFilter.searchTimeout
     * @default 500
     */
    searchTimeout?: number,
    /**
     * @docid GridBaseOptions.headerFilter.texts
     * @type object
     */
    texts?: HeaderFilterTexts,
    /**
     * @docid GridBaseOptions.headerFilter.visible
     * @default false
     */
    visible?: boolean,
    /**
     * @docid GridBaseOptions.headerFilter.width
     * @default 252
     */
    width?: number
}

export interface HeaderFilterTexts {
    /**
     * @docid GridBaseOptions.headerFilter.texts.cancel
     * @default "Cancel"
     */
    cancel?: string,
    /**
     * @docid GridBaseOptions.headerFilter.texts.emptyValue
     * @default "(Blanks)"
     */
    emptyValue?: string,
    /**
     * @docid GridBaseOptions.headerFilter.texts.ok
     * @default "Ok"
     */
    ok?: string
}

export interface KeyboardNavigation {
    /**
     * @docid GridBaseOptions.keyboardNavigation.editOnKeyPress
     * @default false
     */
    editOnKeyPress?: boolean,
    /**
     * @docid GridBaseOptions.keyboardNavigation.enabled
     * @default true
     */
    enabled?: boolean,
    /**
     * @docid GridBaseOptions.keyboardNavigation.enterKeyAction
     * @type Enums.GridEnterKeyAction
     * @default "startEdit"
     */
    enterKeyAction?: 'startEdit' | 'moveFocus',
    /**
     * @docid GridBaseOptions.keyboardNavigation.enterKeyDirection
     * @type Enums.GridEnterKeyDirection
     * @default "none"
     */
    enterKeyDirection?: 'none' | 'column' | 'row'
}

export interface LoadPanel {
    /**
     * @docid GridBaseOptions.loadPanel.enabled
     * @type boolean|Enums.Mode
     * @default "auto"
     */
    enabled?: boolean | 'auto',
    /**
     * @docid GridBaseOptions.loadPanel.height
     * @default 90
     */
    height?: number,
    /**
     * @docid GridBaseOptions.loadPanel.indicatorSrc
     * @default ""
     */
    indicatorSrc?: string,
    /**
     * @docid GridBaseOptions.loadPanel.shading
     * @default false
     */
    shading?: boolean,
    /**
     * @docid GridBaseOptions.loadPanel.shadingColor
     * @default ''
     */
    shadingColor?: string,
    /**
     * @docid GridBaseOptions.loadPanel.showIndicator
     * @default true
     */
    showIndicator?: boolean,
    /**
     * @docid GridBaseOptions.loadPanel.showPane
     * @default true
     */
    showPane?: boolean,
    /**
     * @docid GridBaseOptions.loadPanel.text
     * @default "Loading..."
     */
    text?: string,
    /**
     * @docid GridBaseOptions.loadPanel.width
     * @default 200
     */
    width?: number
}

export interface Pager {
    /**
     * @docid GridBaseOptions.pager.allowedPageSizes
     * @type Array<number, Enums.GridPagerPageSize>|Enums.Mode
     * @default "auto"
     */
    allowedPageSizes?: Array<(number | 'all')> | 'auto',
    /**
     * @docid GridBaseOptions.pager.displayMode
     * @default "adaptive"
     * @type Enums.GridPagerDisplayMode
     */
    displayMode?: 'adaptive' | 'compact' | 'full',
    /**
     * @docid GridBaseOptions.pager.infoText
     * @default "Page {0} of {1} ({2} items)"
     */
    infoText?: string,
    /**
     * @docid GridBaseOptions.pager.showInfo
     * @default false
     */
    showInfo?: boolean,
    /**
     * @docid GridBaseOptions.pager.showNavigationButtons
     * @default false
     */
    showNavigationButtons?: boolean,
    /**
     * @docid GridBaseOptions.pager.showPageSizeSelector
     * @default false
     */
    showPageSizeSelector?: boolean,
    /**
     * @docid GridBaseOptions.pager.visible
     * @type boolean|Enums.Mode
     * @default "auto"
     */
    visible?: boolean | 'auto'
}

export interface SearchPanel {
    /**
     * @docid GridBaseOptions.searchPanel.highlightCaseSensitive
     * @default false
     */
    highlightCaseSensitive?: boolean,
    /**
     * @docid GridBaseOptions.searchPanel.highlightSearchText
     * @default true
     */
    highlightSearchText?: boolean,
    /**
     * @docid GridBaseOptions.searchPanel.placeholder
     * @default "Search..."
     */
    placeholder?: string,
    /**
     * @docid GridBaseOptions.searchPanel.searchVisibleColumnsOnly
     * @default false
     */
    searchVisibleColumnsOnly?: boolean,
    /**
     * @docid GridBaseOptions.searchPanel.text
     * @default ""
     * @fires GridBaseOptions.onOptionChanged
     */
    text?: string,
    /**
     * @docid GridBaseOptions.searchPanel.visible
     * @default false
     */
    visible?: boolean,
    /**
     * @docid GridBaseOptions.searchPanel.width
     * @default 160
     */
    width?: number
}

export interface Sorting {
    /**
     * @docid GridBaseOptions.sorting.ascendingText
     * @default "Sort Ascending"
     */
    ascendingText?: string,
    /**
     * @docid GridBaseOptions.sorting.clearText
     * @default "Clear Sorting"
     */
    clearText?: string,
    /**
     * @docid GridBaseOptions.sorting.descendingText
     * @default "Sort Descending"
     */
    descendingText?: string,
    /**
     * @docid GridBaseOptions.sorting.mode
     * @type Enums.GridSortingMode
     * @default "single"
     */
    mode?: 'multiple' | 'none' | 'single',
    /**
     * @docid GridBaseOptions.sorting.showSortIndexes
     * @default true
     */
    showSortIndexes?: boolean
}

export interface StateStoring {
    /**
     * @docid GridBaseOptions.stateStoring.customLoad
     * @type_function_return Promise<Object>
     */
    customLoad?: (() => PromiseLike<any>),
    /**
     * @docid GridBaseOptions.stateStoring.customSave
     * @type_function_param1 gridState:object
     */
    customSave?: ((gridState: any) => any),
    /**
     * @docid GridBaseOptions.stateStoring.enabled
     * @default false
     */
    enabled?: boolean,
    /**
     * @docid GridBaseOptions.stateStoring.savingTimeout
     * @default 2000
     */
    savingTimeout?: number,
    /**
     * @docid GridBaseOptions.stateStoring.storageKey
     * @default null
     */
    storageKey?: string,
    /**
     * @docid GridBaseOptions.stateStoring.type
     * @type Enums.StateStoringType
     * @default "localStorage"
     */
    type?: 'custom' | 'localStorage' | 'sessionStorage'
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseEditing = EditingBase;
export interface EditingBase {
    /**
     * @docid GridBaseOptions.editing.confirmDelete
     * @default true
     * @public
     */
    confirmDelete?: boolean;
    /**
     * @docid GridBaseOptions.editing.changes
     * @default []
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    changes?: Array<DataChange>;
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
     * @public
     */
    form?: dxFormOptions;
    /**
     * @docid GridBaseOptions.editing.mode
     * @type Enums.GridEditMode
     * @default "row"
     * @public
     */
    mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
    /**
     * @docid GridBaseOptions.editing.popup
     * @public
     */
    popup?: dxPopupOptions;
    /**
     * @docid GridBaseOptions.editing.refreshMode
     * @type Enums.GridEditRefreshMode
     * @default "full"
     * @public
     */
    refreshMode?: 'full' | 'reshape' | 'repaint';
    /**
     * @docid GridBaseOptions.editing.selectTextOnEditStart
     * @default false
     * @public
     */
    selectTextOnEditStart?: boolean;
    /**
     * @docid GridBaseOptions.editing.startEditAction
     * @type Enums.GridStartEditAction
     * @default "click"
     * @public
     */
    startEditAction?: 'click' | 'dblClick';
    /**
     * @docid GridBaseOptions.editing.texts
     * @type object
     * @public
     */
    texts?: EditingTextsBase;
    /**
     * @docid GridBaseOptions.editing.useIcons
     * @default true [for](Material)
     * @default false
     * @public
     */
    useIcons?: boolean;
}

/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface DataChange {
    /**
     * @docid
     */
    key: any;
    /**
     * @docid
     * @type Enums.GridDataChangeType
     */
    type: 'insert' | 'update' | 'remove';
    /**
     * @docid
     */
    data: object;
    /**
     * @docid
     */
    index?: number;
    /**
     * @docid
     */
    pageIndex?: number;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseEditingTexts = EditingTextsBase;
export interface EditingTextsBase {
    /**
     * @docid GridBaseOptions.editing.texts.addRow
     * @default "Add a row"
     * @public
     */
    addRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.cancelAllChanges
     * @default "Discard changes"
     * @public
     */
    cancelAllChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.cancelRowChanges
     * @default "Cancel"
     * @public
     */
    cancelRowChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.confirmDeleteMessage
     * @default "Are you sure you want to delete this record?"
     * @public
     */
    confirmDeleteMessage?: string;
    /**
     * @docid GridBaseOptions.editing.texts.confirmDeleteTitle
     * @default ""
     * @public
     */
    confirmDeleteTitle?: string;
    /**
     * @docid GridBaseOptions.editing.texts.deleteRow
     * @default "Delete"
     * @public
     */
    deleteRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.editRow
     * @default "Edit"
     * @public
     */
    editRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.saveAllChanges
     * @default "Save changes"
     * @public
     */
    saveAllChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.saveRowChanges
     * @default "Save"
     * @public
     */
    saveRowChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.undeleteRow
     * @default "Undelete"
     * @public
     */
    undeleteRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.validationCancelChanges
     * @default "Cancel changes"
     * @public
     */
    validationCancelChanges?: string;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBasePaging = PagingBase;
export interface PagingBase {
    /**
     * @docid GridBaseOptions.paging.enabled
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid GridBaseOptions.paging.pageIndex
     * @default 0
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    pageIndex?: number;
    /**
     * @docid GridBaseOptions.paging.pageSize
     * @default 20
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    pageSize?: number;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseScrolling = ScrollingBase;
export interface ScrollingBase {
    /**
     * @docid GridBaseOptions.scrolling.columnRenderingMode
     * @type Enums.GridColumnRenderingMode
     * @default "standard"
     * @public
     */
    columnRenderingMode?: 'standard' | 'virtual';
    /**
     * @docid GridBaseOptions.scrolling.preloadEnabled
     * @default false
     * @public
     */
    preloadEnabled?: boolean;
    /**
     * @docid GridBaseOptions.scrolling.rowRenderingMode
     * @type Enums.GridRowRenderingMode
     * @default "standard"
     * @public
     */
    rowRenderingMode?: 'standard' | 'virtual';
    /**
     * @docid GridBaseOptions.scrolling.scrollByContent
     * @default true
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid GridBaseOptions.scrolling.scrollByThumb
     * @default false
     * @public
     */
    scrollByThumb?: boolean;
    /**
     * @docid GridBaseOptions.scrolling.showScrollbar
     * @default 'onHover' [for](desktop)
     * @type Enums.ShowScrollbarMode
     * @default 'onScroll'
     * @public
     */
    showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
    /**
     * @docid GridBaseOptions.scrolling.useNative
     * @type boolean|Enums.Mode
     * @default "auto"
     * @public
     */
    useNative?: boolean | 'auto';
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseSelection = SelectionBase;
export interface SelectionBase {
    /**
     * @docid GridBaseOptions.selection.allowSelectAll
     * @default true
     * @public
     */
    allowSelectAll?: boolean;
    /**
     * @docid GridBaseOptions.selection.mode
     * @type Enums.SelectionMode
     * @default "none"
     * @public
     */
    mode?: 'multiple' | 'none' | 'single';
}

/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @module ui/grid_base
 * @export default
 * @hidden
 * @namespace DevExpress.ui
 */
export interface GridBase {
    /**
     * @docid
     * @publicName beginCustomLoading(messageText)
     * @param1 messageText:string
     * @public
     */
    beginCustomLoading(messageText: string): void;
    /**
     * @docid
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @return Promise<Object>
     * @public
     */
    byKey(key: any | string | number): DxPromise<any>;
    /**
     * @docid
     * @publicName cancelEditData()
     * @public
     */
    cancelEditData(): void;
    /**
     * @docid
     * @publicName cellValue(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @return any
     * @public
     */
    cellValue(rowIndex: number, dataField: string): any;
    /**
     * @docid
     * @publicName cellValue(rowIndex, dataField, value)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @param3 value:any
     * @public
     */
    cellValue(rowIndex: number, dataField: string, value: any): void;
    /**
     * @docid
     * @publicName cellValue(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @return any
     * @public
     */
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    /**
     * @docid
     * @publicName cellValue(rowIndex, visibleColumnIndex, value)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @param3 value:any
     * @public
     */
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    /**
     * @docid
     * @publicName clearFilter()
     * @public
     */
    clearFilter(): void;
    /**
     * @docid
     * @publicName clearFilter(filterName)
     * @param1 filterName:string
     * @public
     */
    clearFilter(filterName: string): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName clearSorting()
     * @public
     */
    clearSorting(): void;
    /**
     * @docid
     * @publicName closeEditCell()
     * @public
     */
    closeEditCell(): void;
    /**
     * @docid
     * @publicName collapseAdaptiveDetailRow()
     * @public
     */
    collapseAdaptiveDetailRow(): void;
    /**
     * @docid
     * @publicName columnCount()
     * @return number
     * @public
     */
    columnCount(): number;
    /**
     * @docid
     * @publicName columnOption(id)
     * @param1 id:number|string
     * @return object
     * @public
     */
    columnOption(id: number | string): any;
    /**
     * @docid
     * @publicName columnOption(id, optionName)
     * @param1 id:number|string
     * @param2 optionName:string
     * @return any
     * @public
     */
    columnOption(id: number | string, optionName: string): any;
    /**
     * @docid
     * @publicName columnOption(id, optionName, optionValue)
     * @param1 id:number|string
     * @param2 optionName:string
     * @param3 optionValue:any
     * @public
     */
    columnOption(id: number | string, optionName: string, optionValue: any): void;
    /**
     * @docid
     * @publicName columnOption(id, options)
     * @param1 id:number|string
     * @param2 options:object
     * @public
     */
    columnOption(id: number | string, options: any): void;
    /**
     * @docid
     * @publicName deleteColumn(id)
     * @param1 id:number|string
     * @public
     */
    deleteColumn(id: number | string): void;
    /**
     * @docid
     * @publicName deleteRow(rowIndex)
     * @param1 rowIndex:number
     * @public
     */
    deleteRow(rowIndex: number): void;
    /**
     * @docid
     * @publicName deselectAll()
     * @return Promise<void>
     * @public
     */
    deselectAll(): DxPromise<void>;
    /**
     * @docid
     * @publicName deselectRows(keys)
     * @param1 keys:Array<any>
     * @return Promise<any>
     * @public
     */
    deselectRows(keys: Array<any>): DxPromise<any>;
    /**
     * @docid
     * @publicName editCell(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @public
     */
    editCell(rowIndex: number, dataField: string): void;
    /**
     * @docid
     * @publicName editCell(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @public
     */
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    /**
     * @docid
     * @publicName editRow(rowIndex)
     * @param1 rowIndex:number
     * @public
     */
    editRow(rowIndex: number): void;
    /**
     * @docid
     * @publicName endCustomLoading()
     * @public
     */
    endCustomLoading(): void;
    /**
     * @docid
     * @publicName expandAdaptiveDetailRow(key)
     * @param1 key:any
     * @public
     */
    expandAdaptiveDetailRow(key: any): void;
    /**
     * @docid
     * @publicName filter()
     * @return any
     * @public
     */
    filter(): any;
    /**
     * @docid
     * @publicName filter(filterExpr)
     * @param1 filterExpr:any
     * @public
     */
    filter(filterExpr: any): void;
    focus(): void;
    /**
     * @docid
     * @publicName focus(element)
     * @param1 element:Element|jQuery
     * @public
     */
    focus(element: UserDefinedElement): void;
    /**
     * @docid
     * @publicName getCellElement(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @return DxElement|undefined
     * @public
     */
    getCellElement(rowIndex: number, dataField: string): DxElement | undefined;
    /**
     * @docid
     * @publicName getCellElement(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @return DxElement|undefined
     * @public
     */
    getCellElement(rowIndex: number, visibleColumnIndex: number): DxElement | undefined;
    /**
     * @docid
     * @publicName getCombinedFilter()
     * @return any
     * @public
     */
    getCombinedFilter(): any;
    /**
     * @docid
     * @publicName getCombinedFilter(returnDataField)
     * @param1 returnDataField:boolean
     * @return any
     * @public
     */
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getKeyByRowIndex(rowIndex)
     * @param1 rowIndex:numeric
     * @return any
     * @public
     */
    getKeyByRowIndex(rowIndex: number): any;
    /**
     * @docid
     * @publicName getRowElement(rowIndex)
     * @param1 rowIndex:number
     * @return Array<Element>|jQuery|undefined
     * @public
     */
    getRowElement(rowIndex: number): UserDefinedElementsArray | undefined;
    /**
     * @docid
     * @publicName getRowIndexByKey(key)
     * @param1 key:object|string|number
     * @return numeric
     * @public
     */
    getRowIndexByKey(key: any | string | number): number;
    /**
     * @docid
     * @publicName getScrollable()
     * @return dxScrollable
     * @public
     */
    getScrollable(): dxScrollable;
    /**
     * @docid
     * @publicName getVisibleColumnIndex(id)
     * @param1 id:number|string
     * @return number
     * @public
     */
    getVisibleColumnIndex(id: number | string): number;
    /**
     * @docid
     * @publicName hasEditData()
     * @return boolean
     * @public
     */
    hasEditData(): boolean;
    /**
     * @docid
     * @publicName hideColumnChooser()
     * @public
     */
    hideColumnChooser(): void;
    /**
     * @docid
     * @publicName isAdaptiveDetailRowExpanded(key)
     * @param1 key:any
     * @return boolean
     * @public
     */
    isAdaptiveDetailRowExpanded(key: any): boolean;
    /**
     * @docid
     * @publicName isRowFocused(key)
     * @param1 key:any
     * @return boolean
     * @public
     */
    isRowFocused(key: any): boolean;
    /**
     * @docid
     * @publicName isRowSelected(key)
     * @param1 key:any
     * @return boolean
     * @public
     */
    isRowSelected(key: any): boolean;
    /**
     * @docid
     * @publicName keyOf(obj)
     * @param1 obj:object
     * @return any
     * @public
     */
    keyOf(obj: any): any;
    /**
     * @docid
     * @publicName navigateToRow(key)
     * @param1 key:any
     * @public
     */
    navigateToRow(key: any): void;
    /**
     * @docid
     * @publicName pageCount()
     * @return numeric
     * @public
     */
    pageCount(): number;
    /**
     * @docid
     * @publicName pageIndex()
     * @return numeric
     * @public
     */
    pageIndex(): number;
    /**
     * @docid
     * @publicName pageIndex(newIndex)
     * @param1 newIndex:numeric
     * @return Promise<void>
     * @public
     */
    pageIndex(newIndex: number): DxPromise<void>;
    /**
     * @docid
     * @publicName pageSize()
     * @return numeric
     * @public
     */
    pageSize(): number;
    /**
     * @docid
     * @publicName pageSize(value)
     * @param1 value:numeric
     * @public
     */
    pageSize(value: number): void;
    /**
     * @docid
     * @publicName refresh()
     * @return Promise<void>
     * @public
     */
    refresh(): DxPromise<void>;
    /**
     * @docid
     * @publicName refresh(changesOnly)
     * @param1 changesOnly:boolean
     * @return Promise<void>
     * @public
     */
    refresh(changesOnly: boolean): DxPromise<void>;
    /**
     * @docid
     * @publicName repaintRows(rowIndexes)
     * @param1 rowIndexes:Array<number>
     * @public
     */
    repaintRows(rowIndexes: Array<number>): void;
    /**
     * @docid
     * @publicName saveEditData()
     * @return Promise<void>
     * @public
     */
    saveEditData(): DxPromise<void>;
    /**
     * @docid
     * @publicName searchByText(text)
     * @param1 text:string
     * @public
     */
    searchByText(text: string): void;
    /**
     * @docid
     * @publicName selectAll()
     * @return Promise<void>
     * @public
     */
    selectAll(): DxPromise<void>;
    /**
     * @docid
     * @publicName selectRows(keys, preserve)
     * @param1 keys:Array<any>
     * @param2 preserve:boolean
     * @return Promise<any>
     * @public
     */
    selectRows(keys: Array<any>, preserve: boolean): DxPromise<any>;
    /**
     * @docid
     * @publicName selectRowsByIndexes(indexes)
     * @param1 indexes:Array<number>
     * @return Promise<any>
     * @public
     */
    selectRowsByIndexes(indexes: Array<number>): DxPromise<any>;
    /**
     * @docid
     * @publicName showColumnChooser()
     * @public
     */
    showColumnChooser(): void;
    /**
     * @docid
     * @publicName state()
     * @return object
     * @public
     */
    state(): any;
    /**
     * @docid
     * @publicName state(state)
     * @param1 state:object
     * @public
     */
    state(state: any): void;
    /**
     * @docid
     * @publicName undeleteRow(rowIndex)
     * @param1 rowIndex:number
     * @public
     */
    undeleteRow(rowIndex: number): void;
    /**
     * @docid
     * @publicName updateDimensions()
     * @public
     */
    updateDimensions(): void;
}

export interface ColumnCustomizeTextArg {
  value?: string | number | Date;
  valueText?: string;
  target?: string;
  groupInterval?: string | number;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseColumn = ColumnBase;
/**
 * @docid GridBaseColumn
 * @type object
 */
export interface ColumnBase {
    /**
     * @docid GridBaseColumn.alignment
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @acceptValues undefined
     * @public
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * @docid GridBaseColumn.allowEditing
     * @default true
     * @public
     */
    allowEditing?: boolean;
    /**
     * @docid GridBaseColumn.allowFiltering
     * @default true
     * @public
     */
    allowFiltering?: boolean;
    /**
     * @docid GridBaseColumn.allowFixing
     * @default true
     * @public
     */
    allowFixing?: boolean;
    /**
     * @docid GridBaseColumn.allowHeaderFiltering
     * @default true
     * @public
     */
    allowHeaderFiltering?: boolean;
    /**
     * @docid GridBaseColumn.allowHiding
     * @default true
     * @public
     */
    allowHiding?: boolean;
    /**
     * @docid GridBaseColumn.allowReordering
     * @default true
     * @public
     */
    allowReordering?: boolean;
    /**
     * @docid GridBaseColumn.allowResizing
     * @default true
     * @public
     */
    allowResizing?: boolean;
    /**
     * @docid GridBaseColumn.allowSearch
     * @default true
     * @public
     */
    allowSearch?: boolean;
    /**
     * @docid GridBaseColumn.allowSorting
     * @default true
     * @public
     */
    allowSorting?: boolean;
    /**
     * @docid GridBaseColumn.calculateCellValue
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @public
     */
    calculateCellValue?: ((rowData: any) => any);
    /**
     * @docid GridBaseColumn.calculateDisplayValue
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @public
     */
    calculateDisplayValue?: string | ((rowData: any) => any);
    /**
     * @docid GridBaseColumn.calculateFilterExpression
     * @type_function_param1 filterValue:any
     * @type_function_param2 selectedFilterOperation:string
     * @type_function_param3 target:string
     * @type_function_return Filter expression
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string, target: string) => string | Array<any> | Function);
    /**
     * @docid GridBaseColumn.calculateSortValue
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @public
     */
    calculateSortValue?: string | ((rowData: any) => any);
    /**
     * @docid GridBaseColumn.caption
     * @default undefined
     * @public
     */
    caption?: string;
    /**
     * @docid GridBaseColumn.cssClass
     * @default undefined
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
     * @public
     */
    customizeText?: ((cellInfo: ColumnCustomizeTextArg) => string);
    /**
     * @docid GridBaseColumn.dataField
     * @default undefined
     * @public
     */
    dataField?: string;
    /**
     * @docid GridBaseColumn.dataType
     * @type Enums.GridColumnDataType
     * @default undefined
     * @public
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
    /**
     * @docid GridBaseColumn.editorOptions
     * @public
     */
    editorOptions?: any;
    /**
     * @docid GridBaseColumn.encodeHtml
     * @default true
     * @public
     */
    encodeHtml?: boolean;
    /**
     * @docid GridBaseColumn.falseText
     * @default "false"
     * @public
     */
    falseText?: string;
    /**
     * @docid GridBaseColumn.filterOperations
     * @type Array<Enums.GridFilterOperations, string>
     * @default undefined
     * @public
     */
    filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof'>;
    /**
     * @docid GridBaseColumn.filterType
     * @type Enums.FilterType
     * @default "include"
     * @public
     */
    filterType?: 'exclude' | 'include';
    /**
     * @docid GridBaseColumn.filterValue
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    filterValue?: any;
    /**
     * @docid GridBaseColumn.filterValues
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    filterValues?: Array<any>;
    /**
     * @docid GridBaseColumn.fixed
     * @default false
     * @public
     */
    fixed?: boolean;
    /**
     * @docid GridBaseColumn.fixedPosition
     * @type Enums.HorizontalEdge
     * @default undefined
     * @public
     */
    fixedPosition?: 'left' | 'right';
    /**
     * @docid GridBaseColumn.formItem
     * @public
     */
    formItem?: dxFormSimpleItem;
    /**
     * @docid GridBaseColumn.format
     * @default ""
     * @public
     */
    format?: format;
    /**
     * @docid GridBaseColumn.headerFilter
     * @type object
     * @default undefined
     * @public
     */
    headerFilter?: ColumnHeaderFilter;
    /**
     * @docid GridBaseColumn.hidingPriority
     * @default undefined
     * @public
     */
    hidingPriority?: number;
    /**
     * @docid GridBaseColumn.isBand
     * @default undefined
     * @public
     */
    isBand?: boolean;
    /**
     * @docid GridBaseColumn.lookup
     * @type object
     * @default undefined
     * @public
     */
    lookup?: ColumnLookup;
    /**
     * @docid GridBaseColumn.minWidth
     * @default undefined
     * @public
     */
    minWidth?: number;
    /**
     * @docid GridBaseColumn.name
     * @default undefined
     * @public
     */
    name?: string;
    /**
     * @docid GridBaseColumn.ownerBand
     * @default undefined
     * @public
     */
    ownerBand?: number;
    /**
     * @docid GridBaseColumn.renderAsync
     * @default false
     * @public
     */
    renderAsync?: boolean;
    /**
     * @docid GridBaseColumn.selectedFilterOperation
     * @type Enums.FilterOperations
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    selectedFilterOperation?: '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';
    /**
     * @docid GridBaseColumn.setCellValue
     * @type_function_param1 newData:object
     * @type_function_param2 value:any
     * @type_function_param3 currentRowData:object
     * @type_function_return void|Promise<void>
     * @public
     */
    setCellValue?: ((newData: any, value: any, currentRowData: any) => void | PromiseLike<void>);
    /**
     * @docid GridBaseColumn.showEditorAlways
     * @default false
     * @public
     */
    showEditorAlways?: boolean;
    /**
     * @docid GridBaseColumn.showInColumnChooser
     * @default true
     * @public
     */
    showInColumnChooser?: boolean;
    /**
     * @docid GridBaseColumn.sortIndex
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    sortIndex?: number;
    /**
     * @docid GridBaseColumn.sortOrder
     * @type Enums.SortOrder
     * @default undefined
     * @acceptValues undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    sortOrder?: 'asc' | 'desc';
    /**
     * @docid GridBaseColumn.sortingMethod
     * @type_function_param1 value1:any
     * @type_function_param2 value2:any
     * @type_function_return number
     * @default undefined
     * @public
     */
    sortingMethod?: ((value1: any, value2: any) => number);
    /**
     * @docid GridBaseColumn.trueText
     * @default "true"
     * @public
     */
    trueText?: string;
    /**
     * @docid GridBaseColumn.validationRules
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid GridBaseColumn.visible
     * @default true
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    visible?: boolean;
    /**
     * @docid GridBaseColumn.visibleIndex
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    visibleIndex?: number;
    /**
     * @docid GridBaseColumn.width
     * @default undefined
     * @public
     */
    width?: number | string;
}

export interface ColumnHeaderFilter {
  /**
   * @docid GridBaseColumn.headerFilter.allowSearch
   * @default false
   */
  allowSearch?: boolean,
  /**
   * @docid GridBaseColumn.headerFilter.dataSource
   * @type_function_param1 options:object
   * @type_function_param1_field1 component:object
   * @type_function_param1_field2 dataSource:DataSourceOptions
   * @default undefined
   */
  dataSource?: Array<any> | ((options: { component?: any, dataSource?: DataSourceOptions }) => any) | DataSourceOptions,
  /**
   * @docid GridBaseColumn.headerFilter.groupInterval
   * @type Enums.HeaderFilterGroupInterval|number
   * @default undefined
   */
  groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number,
  /**
   * @docid GridBaseColumn.headerFilter.height
   * @default undefined
   */
  height?: number,
  /**
   * @docid GridBaseColumn.headerFilter.searchMode
   * @type Enums.CollectionSearchMode
   * @default 'contains'
   */
  searchMode?: 'contains' | 'startswith' | 'equals',
  /**
   * @docid GridBaseColumn.headerFilter.width
   * @default undefined
   */
  width?: number
}

export interface ColumnLookup {
  /**
   * @docid GridBaseColumn.lookup.allowClearing
   * @default false
   */
  allowClearing?: boolean,
  /**
   * @docid GridBaseColumn.lookup.dataSource
   * @type_function_param1 options:object
   * @type_function_param1_field1 data:object
   * @type_function_param1_field2 key:any
   * @type_function_return Array<any>|DataSourceOptions|Store
   * @default undefined
   */
  dataSource?: Array<any> | DataSourceOptions | Store | ((options: { data?: any, key?: any }) => Array<any> | DataSourceOptions | Store),
  /**
   * @docid GridBaseColumn.lookup.displayExpr
   * @default undefined
   * @type_function_param1 data:object
   * @type_function_return string
   */
  displayExpr?: string | ((data: any) => string),
  /**
   * @docid GridBaseColumn.lookup.valueExpr
   * @default undefined
   */
  valueExpr?: string
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseColumnButton = ColumnButtonBase;
/**
 * @docid GridBaseColumnButton
 * @type object
 */
export interface ColumnButtonBase {
    /**
     * @docid GridBaseColumnButton.cssClass
     * @public
     */
    cssClass?: string;
    /**
     * @docid GridBaseColumnButton.hint
     * @public
     */
    hint?: string;
    /**
     * @docid GridBaseColumnButton.icon
     * @public
     */
    icon?: string;
    /**
     * @docid GridBaseColumnButton.text
     * @public
     */
    text?: string;
}

/** @public */
export type AdaptiveDetailRowPreparingEvent = EventInfo<dxDataGrid> & AdaptiveDetailRowPreparingInfo;

/** @public */
export type CellClickEvent = NativeEventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly value?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly column: any;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly cellElement: DxElement;
  readonly row: RowObject;
}

/** @public */
export type CellDblClickEvent = NativeEventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly value?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly column: Column;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly cellElement: DxElement;
  readonly row: RowObject;
}

/** @public */
export type CellHoverChangedEvent = EventInfo<dxDataGrid> & {
  readonly eventType: string;
  readonly data: any;
  readonly key: any;
  readonly value?: any;
  readonly text: string;
  readonly displayValue?: any;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column;
  readonly rowType: string;
  readonly cellElement: DxElement;
  readonly row: RowObject;
}

/** @public */
export type CellPreparedEvent = EventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly value?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly column: Column;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly row: RowObject;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly cellElement: DxElement;
  readonly watch?: Function;
  readonly oldValue?: any;
}

/** @public */
export type ContentReadyEvent = EventInfo<dxDataGrid>;

/** @public */
export type ContextMenuPreparingEvent = EventInfo<dxDataGrid> & {
  items?: Array<any>;
  readonly target: string;
  readonly targetElement: DxElement;
  readonly columnIndex: number;
  readonly column?: Column;
  readonly rowIndex: number;
  readonly row?: RowObject;
}

/** @public */
export type DataErrorOccurredEvent = EventInfo<dxDataGrid> & DataErrorOccurredInfo;

/** @public */
export type DisposingEvent = EventInfo<dxDataGrid>;

/** @public */
export type EditCanceledEvent = EventInfo<dxDataGrid> & DataChangeInfo;

/** @public */
export type EditCancelingEvent = Cancelable & EventInfo<dxDataGrid> & DataChangeInfo;

/** @public */
export type EditingStartEvent = Cancelable & EventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly column?: any;
}

/** @public */
export type EditorPreparedEvent = EventInfo<dxDataGrid> & {
  readonly parentType: string;
  readonly value?: any;
  readonly setValue?: any;
  readonly updateValueTimeout?: number;
  readonly width?: number;
  readonly disabled: boolean;
  readonly rtlEnabled: boolean;
  readonly editorElement: DxElement;
  readonly readOnly: boolean;
  readonly dataField?: string;
  readonly row?: RowObject;
}

/** @public */
export type EditorPreparingEvent = EventInfo<dxDataGrid> & {
  readonly parentType: string;
  readonly value?: any;
  readonly setValue?: any;
  readonly updateValueTimeout?: number;
  readonly width?: number;
  readonly disabled: boolean;
  readonly rtlEnabled: boolean;
  cancel: boolean;
  readonly editorElement: DxElement;
  readonly readOnly: boolean;
  editorName: string;
  editorOptions: any;
  readonly dataField?: string;
  readonly row?: RowObject;
}

/** @public */
export type ExportedEvent  = EventInfo<dxDataGrid>;

/** @public */
export type ExportingEvent = Cancelable & EventInfo<dxDataGrid> & {
  fileName?: string;
}

/** @public */
export type FileSavingEvent = Cancelable & {
  readonly component: dxDataGrid;
  readonly element: DxElement;
  fileName?: string;
  format?: string;
  readonly data: Blob;
}

/** @public */
export type FocusedCellChangedEvent = EventInfo<dxDataGrid> & {
  readonly cellElement: DxElement;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly row?: RowObject;
  readonly column?: Column;
}

/** @public */
export type FocusedCellChangingEvent = Cancelable & NativeEventInfo<dxDataGrid> & {
  readonly cellElement: DxElement;
  readonly prevColumnIndex: number;
  readonly prevRowIndex: number;
  newColumnIndex: number;
  newRowIndex: number;
  readonly rows: Array<RowObject>;
  readonly columns: Array<Column>;
  isHighlighted: boolean;
}

/** @public */
export type FocusedRowChangedEvent = EventInfo<dxDataGrid> & {
  readonly rowElement: DxElement;
  readonly rowIndex: number;
  readonly row?: RowObject;
}

/** @public */
export type FocusedRowChangingEvent = Cancelable & NativeEventInfo<dxDataGrid> & {
  readonly rowElement: DxElement;
  readonly prevRowIndex: number;
  newRowIndex: number;
  readonly rows: Array<RowObject>;
}

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDataGrid>;

/** @public */
export type InitNewRowEvent = EventInfo<dxDataGrid> & NewRowInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxDataGrid> & KeyDownInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxDataGrid> & ChangedOptionInfo;

/** @public */
export type RowClickEvent = NativeEventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly values: Array<any>;
  readonly columns: Array<any>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly groupIndex?: number;
  readonly rowElement: DxElement;
  readonly handled: boolean;
}

/** @public */
export type RowCollapsedEvent = EventInfo<dxDataGrid> & RowKeyInfo;

/** @public */
export type RowCollapsingEvent = Cancelable & EventInfo<dxDataGrid> & RowKeyInfo;

/** @public */
export type RowDblClickEvent = NativeEventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly values: Array<any>;
  readonly columns: Array<Column>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly groupIndex?: number;
  readonly rowElement: DxElement;
}

/** @public */
export type RowExpandedEvent = EventInfo<dxDataGrid> & RowKeyInfo;

/** @public */
export type RowExpandingEvent = Cancelable & EventInfo<dxDataGrid> & RowKeyInfo;

/** @public */
export type RowInsertedEvent = EventInfo<dxDataGrid> & RowInsertedInfo;

/** @public */
export type RowInsertingEvent = EventInfo<dxDataGrid> & RowInsertingInfo;

/** @public */
export type RowPreparedEvent = EventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly values: Array<any>;
  readonly columns: Array<Column>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly groupIndex?: number;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly rowElement: DxElement;
}

/** @public */
export type RowRemovedEvent = EventInfo<dxDataGrid> & RowRemovedInfo;

/** @public */
export type RowRemovingEvent = EventInfo<dxDataGrid> & RowRemovingInfo;

/** @public */
export type RowUpdatedEvent = EventInfo<dxDataGrid> & RowUpdatedInfo;

/** @public */
export type RowUpdatingEvent = EventInfo<dxDataGrid> & RowUpdatingInfo;

/** @public */
export type RowValidatingEvent = EventInfo<dxDataGrid> & RowValidatingInfo;

/** @public */
export type SavedEvent = EventInfo<dxDataGrid> & DataChangeInfo;

/** @public */
export type SavingEvent = EventInfo<dxDataGrid> & SavingInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxDataGrid> & SelectionChangedInfo;

/** @public */
export type ToolbarPreparingEvent = EventInfo<dxDataGrid> & ToolbarPreparingInfo;


/** @public */
export type RowDraggingAddEvent = RowDraggingEventInfo<dxDataGrid> & DragDropInfo;

/** @public */
export type RowDraggingChangeEvent = Cancelable & RowDraggingEventInfo<dxDataGrid> & DragDropInfo;

/** @public */
export type RowDraggingEndEvent = Cancelable & RowDraggingEventInfo<dxDataGrid> & DragDropInfo;

/** @public */
export type RowDraggingMoveEvent = Cancelable & RowDraggingEventInfo<dxDataGrid> & DragDropInfo;

/** @public */
export type RowDraggingStartEvent = Cancelable & DragStartEventInfo<dxDataGrid>;

/** @public */
export type RowDraggingRemoveEvent = RowDraggingEventInfo<dxDataGrid>;

/** @public */
export type RowDraggingReorderEvent = RowDraggingEventInfo<dxDataGrid> & DragReorderInfo;

/** @public */
export type ColumnButtonClickEvent = NativeEventInfo<dxDataGrid> & {
  row?: RowObject;
  column?: Column;
}

/** @public */
export type ColumnButtonTemplateData = {
  readonly component: dxDataGrid;
  readonly data?: any;
  readonly key?: any;
  readonly columnIndex: number;
  readonly column: Column;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly row: RowObject;
}

/** @public */
export type ColumnCellTemplateData = {
  readonly data?: any;
  readonly component: dxDataGrid;
  readonly value?: any;
  readonly oldValue?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column;
  readonly row: RowObject;
  readonly rowType: string;
  readonly watch?: Function;
}

/** @public */
export type ColumnEditCellTemplateData = {
  readonly setValue?: any;
  readonly data?: any;
  readonly component: dxDataGrid;
  readonly value?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column;
  readonly row: RowObject;
  readonly rowType: string;
  readonly watch?: Function;
}

/** @public */
export type ColumnGroupCellTemplateData = {
  readonly data?: any;
  readonly component: dxDataGrid;
  readonly value?: any;
  readonly text: string;
  readonly displayValue?: any;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column;
  readonly row: RowObject;
  readonly summaryItems: Array<any>;
  readonly groupContinuesMessage?: string;
  readonly groupContinuedMessage?: string;
}

/** @public */
export type ColumnHeaderCellTemplateData = {
  readonly component: dxDataGrid;
  readonly columnIndex: number;
  readonly column: Column;
}

/** @public */
export type MasterDetailTemplateData = {
  readonly key: any;
  readonly data: any;
  readonly watch?: Function;
}

/** @public */
export type RowDraggingTemplateData = RowDraggingTemplateDataModel;

/** @public */
export type RowTemplateData = {
  readonly key: any;
  readonly data: any;
  readonly component: dxDataGrid;
  readonly values: Array<any>;
  readonly rowIndex: number;
  readonly columns: Array<Column>;
  readonly isSelected?: boolean;
  readonly rowType: string;
  readonly groupIndex?: number;
  readonly isExpanded?: boolean;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxDataGridOptions extends GridBaseOptions<dxDataGrid> {
    /**
     * @docid
     * @type Array<dxDataGridColumn|string>
     * @default undefined
     * @public
     */
    columns?: Array<Column | string>;
    /**
     * @docid
     * @type_function_param1 columns:Array<dxDataGridColumn>
     * @public
     */
    customizeColumns?: ((columns: Array<Column>) => void);
    /**
     * @docid
     * @deprecated
     * @type_function_param1 columns:Array<dxDataGridColumn>
     * @type_function_param2 rows:Array<dxDataGridRowObject>
     * @public
     */
    customizeExportData?: ((columns: Array<Column>, rows: Array<RowObject>) => void);
    /**
     * @docid
     * @public
     * @type object
     */
    editing?: Editing;
    /**
     * @docid
     * @type object
     * @public
     */
    export?: Export;
    /**
     * @docid
     * @type object
     * @public
     */
    groupPanel?: GroupPanel;
    /**
     * @docid
     * @type object
     * @public
     */
    grouping?: Grouping;
    /**
     * @docid
     * @default undefined
     * @public
     */
    keyExpr?: string | Array<string>;
    /**
     * @docid
     * @type object
     * @public
     */
    masterDetail?: MasterDetail;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field14 cellElement:DxElement
     * @type_function_param1_field15 row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onCellClick?: ((e: CellClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field14 cellElement:DxElement
     * @type_function_param1_field15 row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onCellDblClick?: ((e: CellDblClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field14 cellElement:DxElement
     * @type_function_param1_field15 row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onCellHoverChanged?: ((e: CellHoverChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field17 cellElement:DxElement
     * @type_function_param1_field18 watch:function
     * @type_function_param1_field19 oldValue:any
     * @default null
     * @action
     * @public
     */
    onCellPrepared?: ((e: CellPreparedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:Object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 items:Array<Object>
     * @type_function_param1_field5 target:string
     * @type_function_param1_field6 targetElement:DxElement
     * @type_function_param1_field7 columnIndex:number
     * @type_function_param1_field8 column:dxDataGridColumn
     * @type_function_param1_field9 rowIndex:number
     * @type_function_param1_field10 row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 cancel:boolean
     * @type_function_param1_field7 column:object
     * @default null
     * @action
     * @public
     */
    onEditingStart?: ((e: EditingStartEvent) => void);
    /**
     * @docid
     * @type_function_param1 options:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 parentType:string
     * @type_function_param1_field5 value:any
     * @type_function_param1_field6 setValue(newValue, newText):any
     * @type_function_param1_field7 updateValueTimeout:number
     * @type_function_param1_field8 width:number
     * @type_function_param1_field9 disabled:boolean
     * @type_function_param1_field10 rtlEnabled:boolean
     * @type_function_param1_field11 editorElement:DxElement
     * @type_function_param1_field12 readOnly:boolean
     * @type_function_param1_field13 dataField:string
     * @type_function_param1_field14 row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onEditorPrepared?: ((options: EditorPreparedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 parentType:string
     * @type_function_param1_field5 value:any
     * @type_function_param1_field6 setValue(newValue, newText):any
     * @type_function_param1_field7 updateValueTimeout:number
     * @type_function_param1_field8 width:number
     * @type_function_param1_field9 disabled:boolean
     * @type_function_param1_field10 rtlEnabled:boolean
     * @type_function_param1_field11 cancel:boolean
     * @type_function_param1_field12 editorElement:DxElement
     * @type_function_param1_field13 readOnly:boolean
     * @type_function_param1_field14 editorName:string
     * @type_function_param1_field15 editorOptions:object
     * @type_function_param1_field16 dataField:string
     * @type_function_param1_field17 row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onEditorPreparing?: ((e: EditorPreparingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     * @deprecated
     */
    onExported?: ((e: ExportedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 fileName:string
     * @type_function_param1_field5 cancel:boolean
     * @default null
     * @action
     * @public
     */
    onExporting?: ((e: ExportingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 fileName:string
     * @type_function_param1_field4 format:string
     * @type_function_param1_field5 data:BLOB
     * @type_function_param1_field6 cancel:boolean
     * @default null
     * @action
     * @public
     * @deprecated
     */
    onFileSaving?: ((e: FileSavingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cellElement:DxElement
     * @type_function_param1_field5 columnIndex:number
     * @type_function_param1_field6 rowIndex:number
     * @type_function_param1_field7 row:dxDataGridRowObject
     * @type_function_param1_field8 column:dxDataGridColumn
     * @default null
     * @action
     * @public
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cellElement:DxElement
     * @type_function_param1_field5 prevColumnIndex:number
     * @type_function_param1_field6 prevRowIndex:number
     * @type_function_param1_field7 newColumnIndex:number
     * @type_function_param1_field8 newRowIndex:number
     * @type_function_param1_field9 event:event
     * @type_function_param1_field10 rows:Array<dxDataGridRowObject>
     * @type_function_param1_field11 columns:Array<dxDataGridColumn>
     * @type_function_param1_field12 cancel:boolean
     * @type_function_param1_field13 isHighlighted:boolean
     * @default null
     * @action
     * @public
     */
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 rowElement:DxElement
     * @type_function_param1_field5 rowIndex:number
     * @type_function_param1_field6 row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 rowElement:DxElement
     * @type_function_param1_field5 prevRowIndex:number
     * @type_function_param1_field6 newRowIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 rows:Array<dxDataGridRowObject>
     * @type_function_param1_field9 cancel:boolean
     * @default null
     * @action
     * @public
     */
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field15 rowElement:DxElement
     * @type_function_param1_field16 handled:boolean
     * @default null
     * @action
     * @public
     */
    onRowClick?: ((e: RowClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field15 rowElement:DxElement
     * @default null
     * @action
     * @public
     */
    onRowDblClick?: ((e: RowDblClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field14 rowElement:DxElement
     * @default null
     * @action
     * @public
     */
    onRowPrepared?: ((e: RowPreparedEvent) => void);
    /**
     * @docid
     * @type boolean|object|Enums.Mode
     * @default "auto"
     * @public
     */
    remoteOperations?: boolean | {
      /**
       * @docid
       * @default false
       */
      filtering?: boolean,
      /**
       * @docid
       * @default false
       */
      groupPaging?: boolean,
      /**
       * @docid
       * @default false
       */
      grouping?: boolean,
      /**
       * @docid
       * @default false
       */
      paging?: boolean,
      /**
       * @docid
       * @default false
       */
      sorting?: boolean,
      /**
       * @docid
       * @default false
       */
      summary?: boolean
    } | 'auto';
    /**
     * @docid
     * @type_function_param1 rowElement:DxElement
     * @type_function_param2 rowInfo:object
     * @type_function_param2_field1 key:any
     * @type_function_param2_field2 data:any
     * @type_function_param2_field3 component:dxDataGrid
     * @type_function_param2_field4 values:Array<any>
     * @type_function_param2_field5 rowIndex:number
     * @type_function_param2_field6 columns:Array<dxDataGridColumn>
     * @type_function_param2_field7 isSelected:boolean
     * @type_function_param2_field8 rowType:string
     * @type_function_param2_field9 groupIndex:number
     * @type_function_param2_field10 isExpanded:boolean
     * @public
     */
    rowTemplate?: template | ((rowElement: DxElement, rowInfo: RowTemplateData) => any);
    /**
     * @docid
     * @public
     * @type object
     */
    scrolling?: Scrolling;
    /**
     * @docid
     * @public
     * @type object
     */
    selection?: Selection;
    /**
     * @docid
     * @type Filter expression
     * @default []
     * @fires dxDataGridOptions.onOptionChanged
     * @public
     */
    selectionFilter?: string | Array<any> | Function;
    /**
     * @docid
     * @type Array<object>
     * @default undefined
     * @public
     */
    sortByGroupSummaryInfo?: Array<dxDataGridSortByGroupSummaryInfoItem>;
    /**
     * @docid
     * @type object
     * @public
     */
    summary?: Summary;
}

export interface ExcelCellInfo {
  readonly component: dxDataGrid;
  horizontalAlignment?: 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right';
  verticalAlignment?: 'bottom' | 'center' | 'distributed' | 'justify' | 'top';
  wrapTextEnabled?: boolean;
  backgroundColor?: string;
  fillPatternType?: 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid';
  fillPatternColor?: string;
  font?: ExcelFont;
  readonly value?: string | number | Date;
  numberFormat?: string;
  gridCell?: ExcelDataGridCell;
}

export interface Export {
  /**
   * @docid dxDataGridOptions.export.allowExportSelectedData
   * @default false
   */
  allowExportSelectedData?: boolean,
  /**
   * @docid dxDataGridOptions.export.customizeExcelCell
   * @deprecated
   * @type_function_param1 options:object
   * @type_function_param1_field1 component:dxDataGrid
   * @type_function_param1_field2 horizontalAlignment:Enums.ExcelCellHorizontalAlignment
   * @type_function_param1_field3 verticalAlignment:Enums.ExcelCellVerticalAlignment
   * @type_function_param1_field4 wrapTextEnabled:boolean
   * @type_function_param1_field5 backgroundColor:string
   * @type_function_param1_field6 fillPatternType:Enums.ExcelCellPatternType
   * @type_function_param1_field7 fillPatternColor:string
   * @type_function_param1_field8 font:ExcelFont
   * @type_function_param1_field9 value:string|number|date
   * @type_function_param1_field10 numberFormat:string
   * @type_function_param1_field11 gridCell:ExcelDataGridCell
   */
  customizeExcelCell?: ((options: ExcelCellInfo) => void),
  /**
   * @docid dxDataGridOptions.export.enabled
   * @default false
   */
  enabled?: boolean,
  /**
   * @docid dxDataGridOptions.export.excelFilterEnabled
   * @default false
   * @deprecated
   */
  excelFilterEnabled?: boolean,
  /**
   * @docid dxDataGridOptions.export.excelWrapTextEnabled
   * @default undefined
   * @deprecated
   */
  excelWrapTextEnabled?: boolean,
  /**
   * @docid dxDataGridOptions.export.fileName
   * @default "DataGrid"
   * @deprecated
   */
  fileName?: string,
  /**
   * @docid dxDataGridOptions.export.ignoreExcelErrors
   * @default true
   * @deprecated
   */
  ignoreExcelErrors?: boolean,
  /**
   * @docid dxDataGridOptions.export.proxyUrl
   * @default undefined
   * @deprecated
   */
  proxyUrl?: string,
  /**
   * @docid dxDataGridOptions.export.texts
   * @type object
   */
  texts?: ExportTexts
}

export interface ExportTexts {
  /**
   * @docid dxDataGridOptions.export.texts.exportAll
   * @default "Export all data"
   */
  exportAll?: string,
  /**
   * @docid dxDataGridOptions.export.texts.exportSelectedRows
   * @default "Export selected rows"
   */
  exportSelectedRows?: string,
  /**
   * @docid dxDataGridOptions.export.texts.exportTo
   * @default "Export"
   */
  exportTo?: string
}

export interface GroupPanel {
  /**
   * @docid dxDataGridOptions.groupPanel.allowColumnDragging
   * @default true
   */
  allowColumnDragging?: boolean,
  /**
   * @docid dxDataGridOptions.groupPanel.emptyPanelText
   * @default "Drag a column header here to group by that column"
   */
  emptyPanelText?: string,
  /**
   * @docid dxDataGridOptions.groupPanel.visible
   * @type boolean|Enums.Mode
   * @default false
   */
  visible?: boolean | 'auto'
}

export interface Grouping {
  /**
   * @docid dxDataGridOptions.grouping.allowCollapsing
   * @default true
   */
  allowCollapsing?: boolean,
  /**
   * @docid dxDataGridOptions.grouping.autoExpandAll
   * @default true
   */
  autoExpandAll?: boolean,
  /**
   * @docid dxDataGridOptions.grouping.contextMenuEnabled
   * @default false
   */
  contextMenuEnabled?: boolean,
  /**
   * @docid dxDataGridOptions.grouping.expandMode
   * @default 'rowClick' [for](mobile_devices)
   * @type Enums.GridGroupingExpandMode
   * @default "buttonClick"
   */
  expandMode?: 'buttonClick' | 'rowClick',
  /**
   * @docid dxDataGridOptions.grouping.texts
   * @type object
   */
  texts?: GroupingTexts
}

export interface GroupingTexts {
  /**
   * @docid dxDataGridOptions.grouping.texts.groupByThisColumn
   * @default "Group by This Column"
   */
  groupByThisColumn?: string,
  /**
   * @docid dxDataGridOptions.grouping.texts.groupContinuedMessage
   * @default "Continued from the previous page"
   */
  groupContinuedMessage?: string,
  /**
   * @docid dxDataGridOptions.grouping.texts.groupContinuesMessage
   * @default "Continues on the next page"
   */
  groupContinuesMessage?: string,
  /**
   * @docid dxDataGridOptions.grouping.texts.ungroup
   * @default "Ungroup"
   */
  ungroup?: string,
  /**
   * @docid dxDataGridOptions.grouping.texts.ungroupAll
   * @default "Ungroup All"
   */
  ungroupAll?: string
}

export interface MasterDetail {
  /**
   * @docid dxDataGridOptions.masterDetail.autoExpandAll
   * @default false
   */
  autoExpandAll?: boolean,
  /**
   * @docid dxDataGridOptions.masterDetail.enabled
   * @default false
   */
  enabled?: boolean,
  /**
   * @docid dxDataGridOptions.masterDetail.template
   * @type_function_param1 detailElement:DxElement
   * @type_function_param2 detailInfo:object
   * @type_function_param2_field1 key:any
   * @type_function_param2_field2 data:object
   * @type_function_param2_field3 watch:function
   */
  template?: template | ((detailElement: DxElement, detailInfo: MasterDetailTemplateData) => any)
}

export interface dxDataGridSortByGroupSummaryInfoItem {
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo.groupColumn
     * @default undefined
     */
    groupColumn?: string,
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo.sortOrder
     * @type Enums.SortOrder
     * @default undefined
     * @acceptValues undefined
     */
    sortOrder?: 'asc' | 'desc',
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo.summaryItem
     * @default undefined
     */
    summaryItem?: string | number
}

export interface CustomSummaryInfo {
  readonly component: dxDataGrid;
  readonly name?: string;
  readonly summaryProcess: string;
  readonly value?: any;
  totalValue?: any;
  readonly groupIndex?: number;
}

export interface Summary {
  /**
   * @docid dxDataGridOptions.summary.calculateCustomSummary
   * @type_function_param1 options:object
   * @type_function_param1_field1 component:dxDataGrid
   * @type_function_param1_field2 name:string
   * @type_function_param1_field3 summaryProcess:string
   * @type_function_param1_field4 value:any
   * @type_function_param1_field5 totalValue:any
   * @type_function_param1_field6 groupIndex:number
   */
  calculateCustomSummary?: ((options: CustomSummaryInfo) => void),
  /**
   * @docid dxDataGridOptions.summary.groupItems
   * @type Array<object>
   * @default undefined
   */
  groupItems?: Array<SummaryGroupItem>,
  /**
   * @docid dxDataGridOptions.summary.recalculateWhileEditing
   * @default false
   */
  recalculateWhileEditing?: boolean,
  /**
   * @docid dxDataGridOptions.summary.skipEmptyValues
   * @default true
   */
  skipEmptyValues?: boolean,
  /**
   * @docid dxDataGridOptions.summary.texts
   * @type object
   */
  texts?: SummaryTexts,
  /**
   * @docid dxDataGridOptions.summary.totalItems
   * @type Array<object>
   * @default undefined
   */
  totalItems?: Array<SummaryTotalItem>
}

export interface SummaryItemTextInfo {
  readonly value?: string | number | Date;
  readonly valueText: string;
}

export interface SummaryGroupItem {
    /**
     * @docid dxDataGridOptions.summary.groupItems.alignByColumn
     * @default false
     */
    alignByColumn?: boolean,
    /**
     * @docid dxDataGridOptions.summary.groupItems.column
     * @default undefined
     */
    column?: string,
    /**
     * @docid dxDataGridOptions.summary.groupItems.customizeText
     * @type_function_param1 itemInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     */
    customizeText?: ((itemInfo: SummaryItemTextInfo) => string),
    /**
     * @docid dxDataGridOptions.summary.groupItems.displayFormat
     * @default undefined
     */
    displayFormat?: string,
    /**
     * @docid dxDataGridOptions.summary.groupItems.name
     * @default undefined
     */
    name?: string,
    /**
     * @docid dxDataGridOptions.summary.groupItems.showInColumn
     * @default undefined
     */
    showInColumn?: string,
    /**
     * @docid dxDataGridOptions.summary.groupItems.showInGroupFooter
     * @default false
     */
    showInGroupFooter?: boolean,
    /**
     * @docid dxDataGridOptions.summary.groupItems.skipEmptyValues
     */
    skipEmptyValues?: boolean,
    /**
     * @docid dxDataGridOptions.summary.groupItems.summaryType
     * @type Enums.SummaryType|string
     * @default undefined
     */
    summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string,
    /**
     * @docid dxDataGridOptions.summary.groupItems.valueFormat
     * @default undefined
     */
    valueFormat?: format
}

export interface SummaryTotalItem {
  /**
   * @docid dxDataGridOptions.summary.totalItems.alignment
   * @type Enums.HorizontalAlignment
   * @default undefined
   */
  alignment?: 'center' | 'left' | 'right',
  /**
   * @docid dxDataGridOptions.summary.totalItems.column
   * @default undefined
   */
  column?: string,
  /**
   * @docid dxDataGridOptions.summary.totalItems.cssClass
   * @default undefined
   */
  cssClass?: string,
  /**
   * @docid dxDataGridOptions.summary.totalItems.customizeText
   * @type_function_param1 itemInfo:object
   * @type_function_param1_field1 value:string|number|date
   * @type_function_param1_field2 valueText:string
   * @type_function_return string
   */
  customizeText?: ((itemInfo: SummaryItemTextInfo) => string),
  /**
   * @docid dxDataGridOptions.summary.totalItems.displayFormat
   * @default undefined
   */
  displayFormat?: string,
  /**
   * @docid dxDataGridOptions.summary.totalItems.name
   * @default undefined
   */
  name?: string,
  /**
   * @docid dxDataGridOptions.summary.totalItems.showInColumn
   * @default undefined
   */
  showInColumn?: string,
  /**
   * @docid dxDataGridOptions.summary.totalItems.skipEmptyValues
   */
  skipEmptyValues?: boolean,
  /**
   * @docid dxDataGridOptions.summary.totalItems.summaryType
   * @type Enums.SummaryType|string
   * @default undefined
   */
  summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string,
  /**
   * @docid dxDataGridOptions.summary.totalItems.valueFormat
   * @default undefined
   */
  valueFormat?: format
}

export interface SummaryTexts {
    /**
     * @docid dxDataGridOptions.summary.texts.avg
     * @default "Avg={0}"
     */
    avg?: string,
    /**
     * @docid dxDataGridOptions.summary.texts.avgOtherColumn
     * @default "Avg of {1} is {0}"
     */
    avgOtherColumn?: string,
    /**
     * @docid dxDataGridOptions.summary.texts.count
     * @default "Count={0}"
     */
    count?: string,
    /**
     * @docid dxDataGridOptions.summary.texts.max
     * @default "Max={0}"
     */
    max?: string,
    /**
     * @docid dxDataGridOptions.summary.texts.maxOtherColumn
     * @default "Max of {1} is {0}"
     */
    maxOtherColumn?: string,
    /**
     * @docid dxDataGridOptions.summary.texts.min
     * @default "Min={0}"
     */
    min?: string,
    /**
     * @docid dxDataGridOptions.summary.texts.minOtherColumn
     * @default "Min of {1} is {0}"
     */
    minOtherColumn?: string,
    /**
     * @docid dxDataGridOptions.summary.texts.sum
     * @default "Sum={0}"
     */
    sum?: string,
    /**
     * @docid dxDataGridOptions.summary.texts.sumOtherColumn
     * @default "Sum of {1} is {0}"
     */
    sumOtherColumn?: string
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxDataGridEditing = Editing;

export interface Editing extends EditingBase {
    /**
     * @docid dxDataGridOptions.editing.allowAdding
     * @default false
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
     * @public
     */
    allowDeleting?: boolean | ((options: { component?: dxDataGrid, row?: RowObject }) => boolean);
    /**
     * @docid dxDataGridOptions.editing.allowUpdating
     * @default false
     * @type_function_param1 options:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 row:dxDataGridRowObject
     * @type_function_return Boolean
     * @public
     */
    allowUpdating?: boolean | ((options: { component?: dxDataGrid, row?: RowObject }) => boolean);
    /**
     * @docid dxDataGridOptions.editing.texts
     * @public
     */
    texts?: any;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxDataGridScrolling = Scrolling;

export interface Scrolling extends ScrollingBase {
    /**
     * @docid dxDataGridOptions.scrolling.mode
     * @type Enums.GridScrollingMode
     * @default "standard"
     * @public
     */
    mode?: 'infinite' | 'standard' | 'virtual';
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxDataGridSelection = Selection;

export interface Selection extends SelectionBase {
    /**
     * @docid dxDataGridOptions.selection.deferred
     * @default false
     * @public
     */
    deferred?: boolean;
    /**
     * @docid dxDataGridOptions.selection.selectAllMode
     * @type Enums.SelectAllMode
     * @default "allPages"
     * @public
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * @docid dxDataGridOptions.selection.showCheckBoxesMode
     * @type Enums.GridSelectionShowCheckBoxesMode
     * @default "onClick"
     * @public
     */
    showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
}
/**
 * @docid
 * @inherits GridBase
 * @module ui/data_grid
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
declare class dxDataGrid extends Widget implements GridBase {
    constructor(element: UserDefinedElement, options?: dxDataGridOptions)
    /**
     * @docid
     * @publicName addColumn(columnOptions)
     * @param1 columnOptions:object|string
     * @public
     */
    addColumn(columnOptions: any | string): void;
    /**
     * @docid
     * @publicName addRow()
     * @return Promise<void>
     * @public
     */
    addRow(): DxPromise<void>;
    /**
     * @docid
     * @publicName clearGrouping()
     * @public
     */
    clearGrouping(): void;
    /**
     * @docid
     * @publicName collapseAll(groupIndex)
     * @param1 groupIndex:number | undefined
     * @public
     */
    collapseAll(groupIndex?: number): void;
    /**
     * @docid
     * @publicName collapseRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @public
     */
    collapseRow(key: any): DxPromise<void>;
    /**
     * @docid
     * @publicName expandAll(groupIndex)
     * @param1 groupIndex:number | undefined
     * @public
     */
    expandAll(groupIndex?: number): void;
    /**
     * @docid
     * @publicName expandRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @public
     */
    expandRow(key: any): DxPromise<void>;
    /**
     * @docid
     * @publicName exportToExcel(selectionOnly)
     * @deprecated excelExporter.exportDataGrid
     * @param1 selectionOnly:boolean
     * @public
     */
    exportToExcel(selectionOnly: boolean): void;
    /**
     * @docid
     * @publicName getSelectedRowKeys()
     * @return Array<any> | Promise<any>
     * @public
     */
    getSelectedRowKeys(): Array<any> & DxPromise<any>;
    /**
     * @docid
     * @publicName getSelectedRowsData()
     * @return Array<any> | Promise<any>
     * @public
     */
    getSelectedRowsData(): Array<any> & DxPromise<any>;
    /**
     * @docid
     * @publicName getTotalSummaryValue(summaryItemName)
     * @param1 summaryItemName:String
     * @return any
     * @public
     */
    getTotalSummaryValue(summaryItemName: string): any;
    /**
     * @docid
     * @publicName getVisibleColumns()
     * @return Array<dxDataGridColumn>
     * @public
     */
    getVisibleColumns(): Array<Column>;
    /**
     * @docid
     * @publicName getVisibleColumns(headerLevel)
     * @param1 headerLevel:number
     * @return Array<dxDataGridColumn>
     * @public
     */
    getVisibleColumns(headerLevel: number): Array<Column>;
    /**
     * @docid
     * @publicName getVisibleRows()
     * @return Array<dxDataGridRowObject>
     * @public
     */
    getVisibleRows(): Array<RowObject>;
    /**
     * @docid
     * @publicName isRowExpanded(key)
     * @param1 key:any
     * @return boolean
     * @public
     */
    isRowExpanded(key: any): boolean;
    /**
     * @docid
     * @publicName isRowSelected(data)
     * @param1 data:any
     * @return boolean
     * @public
     */
    isRowSelected(data: any): boolean;
    isRowSelected(key: any): boolean;
    /**
     * @docid
     * @publicName totalCount()
     * @return numeric
     * @public
     */
    totalCount(): number;

    beginCustomLoading(messageText: string): void;
    byKey(key: any | string | number): DxPromise<any>;
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
    deselectAll(): DxPromise<void>;
    deselectRows(keys: Array<any>): DxPromise<any>;
    editCell(rowIndex: number, dataField: string): void;
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    editRow(rowIndex: number): void;
    endCustomLoading(): void;
    expandAdaptiveDetailRow(key: any): void;
    filter(): any;
    filter(filterExpr: any): void;
    focus(): void;
    focus(element: UserDefinedElement): void;
    getCellElement(rowIndex: number, dataField: string): DxElement | undefined;
    getCellElement(rowIndex: number, visibleColumnIndex: number): DxElement | undefined;
    getCombinedFilter(): any;
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    getKeyByRowIndex(rowIndex: number): any;
    getRowElement(rowIndex: number): UserDefinedElementsArray | undefined;
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
    pageIndex(newIndex: number): DxPromise<void>;
    pageSize(): number;
    pageSize(value: number): void;
    refresh(): DxPromise<void>;
    refresh(changesOnly: boolean): DxPromise<void>;
    repaintRows(rowIndexes: Array<number>): void;
    saveEditData(): DxPromise<void>;
    searchByText(text: string): void;
    selectAll(): DxPromise<void>;
    selectRows(keys: Array<any>, preserve: boolean): DxPromise<any>;
    selectRowsByIndexes(indexes: Array<number>): DxPromise<any>;
    showColumnChooser(): void;
    state(): any;
    state(state: any): void;
    undeleteRow(rowIndex: number): void;
    updateDimensions(): void;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxDataGridColumn = Column;

/**
 * @docid dxDataGridColumn
 * @inherits GridBaseColumn
 * @type object
 */
export interface Column extends ColumnBase {
    /**
     * @docid dxDataGridColumn.allowExporting
     * @default true
     * @public
     */
    allowExporting?: boolean;
    /**
     * @docid dxDataGridColumn.allowGrouping
     * @default true
     * @public
     */
    allowGrouping?: boolean;
    /**
     * @docid dxDataGridColumn.autoExpandGroup
     * @default true
     * @public
     */
    autoExpandGroup?: boolean;
    /**
     * @docid dxDataGridColumn.buttons
     * @type Array<Enums.GridColumnButtonName,dxDataGridColumnButton>
     * @public
     */
    buttons?: Array<'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | ColumnButton>;
    /**
     * @docid dxDataGridColumn.calculateGroupValue
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @public
     */
    calculateGroupValue?: string | ((rowData: any) => any);
    /**
     * @docid dxDataGridColumn.cellTemplate
     * @type_function_param1 cellElement:DxElement
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
     * @public
     */
    cellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnCellTemplateData) => any);
    /**
     * @docid dxDataGridColumn.columns
     * @type Array<dxDataGridColumn|string>
     * @default undefined
     * @public
     */
    columns?: Array<Column | string>;
    /**
     * @docid dxDataGridColumn.editCellTemplate
     * @type_function_param1 cellElement:DxElement
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
     * @public
     */
    editCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnEditCellTemplateData) => any);
    /**
     * @docid dxDataGridColumn.groupCellTemplate
     * @type_function_param1 cellElement:DxElement
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
     * @public
     */
    groupCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnGroupCellTemplateData) => any);
    /**
     * @docid dxDataGridColumn.groupIndex
     * @default undefined
     * @fires dxDataGridOptions.onOptionChanged
     * @public
     */
    groupIndex?: number;
    /**
     * @docid dxDataGridColumn.headerCellTemplate
     * @type_function_param1 columnHeader:DxElement
     * @type_function_param2 headerInfo:object
     * @type_function_param2_field1 component:dxDataGrid
     * @type_function_param2_field2 columnIndex:number
     * @type_function_param2_field3 column:dxDataGridColumn
     * @public
     */
    headerCellTemplate?: template | ((columnHeader: DxElement, headerInfo: ColumnHeaderCellTemplateData) => any);
    /**
     * @docid dxDataGridColumn.showWhenGrouped
     * @default false
     * @public
     */
    showWhenGrouped?: boolean;
    /**
     * @docid dxDataGridColumn.type
     * @publicName type
     * @type Enums.GridCommandColumnType
     * @public
     */
    type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection';
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxDataGridColumnButton = ColumnButton;
/**
 * @docid dxDataGridColumnButton
 * @inherits GridBaseColumnButton
 * @prevFileNamespace DevExpress.ui
 * @type object
 */
export interface ColumnButton extends ColumnButtonBase {
    /**
     * @docid dxDataGridColumnButton.name
     * @type Enums.GridColumnButtonName|string
     * @public
     */
    name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
    /**
     * @docid dxDataGridColumnButton.onClick
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 row:dxDataGridRowObject
     * @type_function_param1_field6 column:dxDataGridColumn
     * @public
     */
    onClick?: ((e: ColumnButtonClickEvent) => void);
    /**
     * @docid dxDataGridColumnButton.template
     * @type_function_param1 cellElement:DxElement
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
     * @public
     */
    template?: template | ((cellElement: DxElement, cellInfo: ColumnButtonTemplateData) => string | UserDefinedElement);
    /**
     * @docid dxDataGridColumnButton.visible
     * @default true
     * @type_function_param1 options:object
     * @type_function_param1_field1 component:dxDataGrid
     * @type_function_param1_field2 row:dxDataGridRowObject
     * @type_function_param1_field3 column:dxDataGridColumn
     * @type_function_return Boolean
     * @public
     */
    visible?: boolean | ((options: { component?: dxDataGrid, row?: RowObject, column?: Column }) => boolean);
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxDataGridRowObject = RowObject;

/**
 * @docid dxDataGridRowObject
 * @type object
 */
export interface RowObject {
    /**
     * @docid dxDataGridRowObject.data
     * @public
     */
    readonly data: any;
    /**
     * @docid dxDataGridRowObject.groupIndex
     * @public
     */
    readonly groupIndex?: number;
    /**
     * @docid dxDataGridRowObject.isEditing
     * @public
     */
    readonly isEditing?: boolean;
    /**
     * @docid dxDataGridRowObject.isExpanded
     * @public
     */
    readonly isExpanded?: boolean;
    /**
     * @docid dxDataGridRowObject.isNewRow
     * @public
     */
    readonly isNewRow?: boolean;
    /**
     * @docid dxDataGridRowObject.isSelected
     * @public
     */
    readonly isSelected?: boolean;
    /**
     * @docid dxDataGridRowObject.key
     * @public
     */
    readonly key: any;
    /**
     * @docid dxDataGridRowObject.rowIndex
     * @public
     */
    readonly rowIndex: number;
    /**
     * @docid dxDataGridRowObject.rowType
     * @public
     */
    readonly rowType: string;
    /**
     * @docid dxDataGridRowObject.values
     * @public
     */
    readonly values: Array<any>;
}

/** @public */
export type Properties = dxDataGridOptions;

/** @deprecated use Properties instead */
export type Options = dxDataGridOptions;

/** @deprecated use Properties instead */
export type IOptions = dxDataGridOptions;

export default dxDataGrid;
