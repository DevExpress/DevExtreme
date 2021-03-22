import {
  TElement,
  TElementsArray
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    template
} from '../core/templates/template';

import Store from '../data/abstract_store';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    TEvent
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

export interface GridBaseOptions<T = GridBase> extends WidgetOptions<T> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowColumnReordering?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowColumnResizing?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoNavigateToFocusedRow?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cacheEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellHintEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnAutoWidth?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnChooser?: {
    /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @default false
       */
      allowSearch?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Drag a column here to hide it"
       */
      emptyPanelText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      enabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 260
       */
      height?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.GridColumnChooserMode
       * @default "dragAndDrop"
       */
      mode?: 'dragAndDrop' | 'select',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 500
       */
      searchTimeout?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Column Chooser"
       */
      title?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 250
       */
      width?: number
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnFixing?: {
    /**
      * @docid
       * @prevFileNamespace DevExpress.ui
     * @default false
      */
      enabled?: boolean,
      /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       */
      texts?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Fix"
         */
        fix?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "To the left"
         */
        leftPosition?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "To the right"
         */
        rightPosition?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Unfix"
         */
        unfix?: string
      }
    };
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnHidingEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnMinWidth?: number;
    /**
     * @docid
     * @type Enums.ColumnResizingMode
     * @default "nextColumn"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnResizingMode?: 'nextColumn' | 'widget';
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnWidth?: number;
    /**
     * @docid
     * @fires GridBaseOptions.onOptionChanged
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<GridBaseColumn | string>;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    editing?: GridBaseEditing;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    errorRowEnabled?: boolean;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterBuilder?: dxFilterBuilderOptions;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterBuilderPopup?: dxPopupOptions;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterPanel?: {
    /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:this
       * @type_function_param1_field2 filterValue:object
       * @type_function_param1_field3 text:string
       * @type_function_return string
       */
      customizeText?: ((e: { component?: T, filterValue?: any, text?: string }) => string),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       * @fires GridBaseOptions.onOptionChanged
       */
      filterEnabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default {}
       */
      texts?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Clear"
         */
        clearFilter?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Create Filter"
         */
        createFilter?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Enable the filter"
         */
        filterEnabledHint?: string
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      visible?: boolean
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterRow?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.GridApplyFilterMode
       * @default "auto"
       */
      applyFilter?: 'auto' | 'onClick',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Apply filter"
       */
      applyFilterText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "End"
       */
      betweenEndText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Start"
       */
      betweenStartText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      operationDescriptions?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Between"
         */
        between?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Contains"
         */
        contains?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Ends with"
         */
        endsWith?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Equals"
         */
        equal?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Greater than"
         */
        greaterThan?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Greater than or equal to"
         */
        greaterThanOrEqual?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Less than"
         */
        lessThan?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Less than or equal to"
         */
        lessThanOrEqual?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Does not contain"
         */
        notContains?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Does not equal"
         */
        notEqual?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Starts with"
         */
        startsWith?: string
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default "Reset"
      */
      resetOperationText?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default "(All)"
      */
      showAllText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      showOperationChooser?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      visible?: boolean
    };
    /**
     * @docid
     * @type boolean|Enums.Mode
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterSyncEnabled?: boolean | 'auto';
    /**
     * @docid
     * @type Filter expression
     * @default null
     * @fires GridBase.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterValue?: string | Array<any> | Function;
    /**
     * @docid
     * @default -1
     * @fires GridBaseOptions.onFocusedCellChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedColumnIndex?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedRowEnabled?: boolean;
    /**
     * @docid
     * @default -1
     * @fires GridBaseOptions.onFocusedRowChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedRowIndex?: number;
    /**
     * @docid
     * @default undefined
     * @fires GridBaseOptions.onFocusedRowChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedRowKey?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerFilter?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
     * @default false
       */
      allowSearch?: boolean,
      /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @default 315 [for](Material)
       * @default 325
       */
      height?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 500
       */
      searchTimeout?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      texts?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Cancel"
         */
        cancel?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "(Blanks)"
         */
        emptyValue?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Ok"
         */
        ok?: string
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      visible?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 252
       */
      width?: number
    };
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    highlightChanges?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyboardNavigation?: {
    /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @default false
       */
      editOnKeyPress?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      enabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.GridEnterKeyAction
       * @default "startEdit"
       */
      enterKeyAction?: 'startEdit' | 'moveFocus',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.GridEnterKeyDirection
       * @default "none"
       */
      enterKeyDirection?: 'none' | 'column' | 'row'
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loadPanel?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type boolean|Enums.Mode
       * @default "auto"
       */
      enabled?: boolean | 'auto',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 90
       */
      height?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default ""
      */
      indicatorSrc?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default false
      */
      shading?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default ''
      */
      shadingColor?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default true
      */
      showIndicator?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default true
      */
      showPane?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Loading..."
       */
      text?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 200
       */
      width?: number
    };
    /**
     * @docid
     * @default "No data"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 formOptions:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAdaptiveDetailRowPreparing?: ((e: { component?: T, element?: TElement, model?: any, formOptions?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 error:Error
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDataErrorOccurred?: ((e: { component?: T, element?: TElement, model?: any, error?: Error }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 changes:Array<any>
     * @extends Action
     * @action
     * @public
     */
    onEditCanceled?: ((e: { component?: T, element?: TElement, model?: any, changes?: Array<any> }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 changes:Array<any>
     * @type_function_param1_field5 cancel:boolean
     * @extends Action
     * @action
     * @public
     */
    onEditCanceling?: ((e: { component?: T, element?: TElement, model?: any, changes?: Array<any>, cancel?: boolean }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 promise:Promise<void>
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onInitNewRow?: ((e: { component?: T, element?: TElement, model?: any, data?: any, promise?: TPromise<void> }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 handled:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onKeyDown?: ((e: { component?: T, element?: TElement, model?: any, event?: TEvent, handled?: boolean }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 key:any
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowCollapsed?: ((e: { component?: T, element?: TElement, model?: any, key?: any }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 key:any
     * @type_function_param1_field5 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowCollapsing?: ((e: { component?: T, element?: TElement, model?: any, key?: any, cancel?: boolean }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 key:any
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowExpanded?: ((e: { component?: T, element?: TElement, model?: any, key?: any }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 key:any
     * @type_function_param1_field5 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowExpanding?: ((e: { component?: T, element?: TElement, model?: any, key?: any, cancel?: boolean }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 error:Error
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowInserted?: ((e: { component?: T, element?: TElement, model?: any, data?: any, key?: any, error?: Error }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 cancel:boolean|Promise<void>
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowInserting?: ((e: { component?: T, element?: TElement, model?: any, data?: any, cancel?: boolean | TPromise<void> }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 error:Error
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowRemoved?: ((e: { component?: T, element?: TElement, model?: any, data?: any, key?: any, error?: Error }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 cancel:boolean|Promise<void>
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowRemoving?: ((e: { component?: T, element?: TElement, model?: any, data?: any, key?: any, cancel?: boolean | TPromise<void> }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 error:Error
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowUpdated?: ((e: { component?: T, element?: TElement, model?: any, data?: any, key?: any, error?: Error }) => any);
    /**
     * @docid
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
    onRowUpdating?: ((e: { component?: T, element?: TElement, model?: any, oldData?: any, newData?: any, key?: any, cancel?: boolean | TPromise<void> }) => any);
    /**
     * @docid
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
    onRowValidating?: ((e: { component?: T, element?: TElement, model?: any, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, isValid?: boolean, key?: any, newData?: any, oldData?: any, errorText?: string, promise?: TPromise<void> }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 changes:Array<any>
     * @extends Action
     * @action
     * @public
     */
    onSaved?: ((e: { component?: T, element?: TElement, model?: any, changes?: Array<any> }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 changes:Array<any>
     * @type_function_param1_field5 promise:Promise<void>
     * @type_function_param1_field6 cancel:boolean
     * @extends Action
     * @action
     * @public
     */
    onSaving?: ((e: { component?: T, element?: TElement, model?: any, changes?: Array<any>, promise?: TPromise<void>, cancel?: boolean }) => any);
    /**
     * @docid
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
    onSelectionChanged?: ((e: { component?: T, element?: TElement, model?: any, currentSelectedRowKeys?: Array<any>, currentDeselectedRowKeys?: Array<any>, selectedRowKeys?: Array<any>, selectedRowsData?: Array<any> }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 toolbarOptions:dxToolbarOptions
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onToolbarPreparing?: ((e: { component?: T, element?: TElement, model?: any, toolbarOptions?: dxToolbarOptions }) => any);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pager?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Array<(number | 'all')>|Enums.Mode
       * @default "auto"
       */
      allowedPageSizes?: Array<(number | 'all')> | 'auto',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.GridPagerDisplayMode
       * @default "adaptive"
       */
      displayMode: 'adaptive' | 'compact' | 'full',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Page {0} of {1} ({2} items)"
       */
      infoText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      showInfo?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      showNavigationButtons?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
      */
      showPageSizeSelector?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type boolean|Enums.Mode
       * @default "auto"
       */
      visible?: boolean | 'auto'
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    paging?: GridBasePaging;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    renderAsync?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowAlternationEnabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowDragging?: {
    /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @default false
       */
      allowDropInsideItem?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      allowReordering?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      autoScroll?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      boundary?: string | TElement,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      container?: string | TElement,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      cursorOffset?: string | {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default 0
         */
        x?: number,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default 0
         */
        y?: number
      },
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      data?: any,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.DragDirection
       * @default "both"
       */
      dragDirection?: 'both' | 'horizontal' | 'vertical',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 dragInfo:object
       * @type_function_param1_field1 itemData:any
       * @type_function_param1_field2 itemElement:dxElement
       * @type_function_param2 containerElement:dxElement
       * @type_function_return string|Element|jQuery
       * @default undefined
       */
      dragTemplate?: template | ((dragInfo: { itemData?: any, itemElement?: TElement }, containerElement: TElement) => string | TElement),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.DropFeedbackMode
       * @default "indicate"
       */
      dropFeedbackMode?: 'push' | 'indicate',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "> *"
       */
      filter?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      group?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default ""
       */
      handle?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:this
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:dxElement
       * @type_function_param1_field5 fromIndex:number
       * @type_function_param1_field6 toIndex:number
       * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field9 fromData:any
       * @type_function_param1_field10 toData:any
       * @type_function_param1_field11 dropInsideItem:boolean
       */
      onAdd?: ((e: { component?: T, event?: TEvent, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:this
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:dxElement
       * @type_function_param1_field6 fromIndex:number
       * @type_function_param1_field7 toIndex:number
       * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field10 fromData:any
       * @type_function_param1_field11 toData:any
       * @type_function_param1_field12 dropInsideItem:boolean
       */
      onDragChange?: ((e: { component?: T, event?: TEvent, cancel?: boolean, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:this
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:dxElement
       * @type_function_param1_field6 fromIndex:number
       * @type_function_param1_field7 toIndex:number
       * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field10 fromData:any
       * @type_function_param1_field11 toData:any
       * @type_function_param1_field12 dropInsideItem:boolean
       */
      onDragEnd?: ((e: { component?: T, event?: TEvent, cancel?: boolean, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:this
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:dxElement
       * @type_function_param1_field6 fromIndex:number
       * @type_function_param1_field7 toIndex:number
       * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field10 fromData:any
       * @type_function_param1_field11 toData:any
       * @type_function_param1_field12 dropInsideItem:boolean
       */
      onDragMove?: ((e: { component?: T, event?: TEvent, cancel?: boolean, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:this
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 cancel:boolean
       * @type_function_param1_field4 itemData:any
       * @type_function_param1_field5 itemElement:dxElement
       * @type_function_param1_field6 fromIndex:number
       * @type_function_param1_field7 fromData:any
       */
      onDragStart?: ((e: { component?: T, event?: TEvent, cancel?: boolean, itemData?: any, itemElement?: TElement, fromIndex?: number, fromData?: any }) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:this
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:dxElement
       * @type_function_param1_field5 fromIndex:number
       * @type_function_param1_field6 toIndex:number
       * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field9 fromData:any
       * @type_function_param1_field10 toData:any
       */
      onRemove?: ((e: { component?: T, event?: TEvent, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 e:object
       * @type_function_param1_field1 component:this
       * @type_function_param1_field2 event:event
       * @type_function_param1_field3 itemData:any
       * @type_function_param1_field4 itemElement:dxElement
       * @type_function_param1_field5 fromIndex:number
       * @type_function_param1_field6 toIndex:number
       * @type_function_param1_field7 fromComponent:dxSortable|dxDraggable
       * @type_function_param1_field8 toComponent:dxSortable|dxDraggable
       * @type_function_param1_field9 fromData:any
       * @type_function_param1_field10 toData:any
       * @type_function_param1_field11 dropInsideItem:boolean
       * @type_function_param1_field12 promise:Promise<void>
       */
      onReorder?: ((e: { component?: T, event?: TEvent, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean, promise?: TPromise<void> }) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 60
       */
      scrollSensitivity?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 30
       */
      scrollSpeed?: number,
      /**
      * @docid
       * @prevFileNamespace DevExpress.ui
      * @default true
      */
      showDragIcons?: boolean
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    scrolling?: GridBaseScrolling;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchPanel?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      highlightCaseSensitive?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      highlightSearchText?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Search..."
       */
      placeholder?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      searchVisibleColumnsOnly?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default ""
       * @fires GridBaseOptions.onOptionChanged
       */
      text?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      visible?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 160
       */
      width?: number
    };
    /**
     * @docid
     * @fires GridBaseOptions.onSelectionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedRowKeys?: Array<any>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    selection?: GridBaseSelection;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showBorders?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnHeaders?: boolean;
    /**
     * @docid
     * @default false [for](Material)
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnLines?: boolean;
    /**
     * @docid
     * @default true [for](iOS)
     * @default true [for](Material)
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRowLines?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sorting?: {
    /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @default "Sort Ascending"
       */
      ascendingText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Clear Sorting"
       */
      clearText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Sort Descending"
       */
      descendingText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.GridSortingMode
       * @default "single"
       */
      mode?: 'multiple' | 'none' | 'single',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      showSortIndexes?: boolean
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stateStoring?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_return Promise<Object>
       */
      customLoad?: (() => TPromise<any>),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 gridState:object
       */
      customSave?: ((gridState: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      enabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 2000
       */
      savingTimeout?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default null
       */
      storageKey?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.StateStoringType
       * @default "localStorage"
       */
      type?: 'custom' | 'localStorage' | 'sessionStorage'
    };
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    twoWayBindingEnabled?: boolean;
    /**
     * @docid
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
 * @docid
 * @inherits Widget, DataHelperMixin
 * @module ui/grid_base
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export interface GridBase {
    /**
     * @docid
     * @publicName beginCustomLoading(messageText)
     * @param1 messageText:string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    beginCustomLoading(messageText: string): void;
    /**
     * @docid
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @return Promise<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    byKey(key: any | string | number): TPromise<any>;
    /**
     * @docid
     * @publicName cancelEditData()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelEditData(): void;
    /**
     * @docid
     * @publicName cellValue(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellValue(rowIndex: number, dataField: string): any;
    /**
     * @docid
     * @publicName cellValue(rowIndex, dataField, value)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @param3 value:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellValue(rowIndex: number, dataField: string, value: any): void;
    /**
     * @docid
     * @publicName cellValue(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    /**
     * @docid
     * @publicName cellValue(rowIndex, visibleColumnIndex, value)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @param3 value:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    /**
     * @docid
     * @publicName clearFilter()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearFilter(): void;
    /**
     * @docid
     * @publicName clearFilter(filterName)
     * @param1 filterName:string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearFilter(filterName: string): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName clearSorting()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearSorting(): void;
    /**
     * @docid
     * @publicName closeEditCell()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeEditCell(): void;
    /**
     * @docid
     * @publicName collapseAdaptiveDetailRow()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseAdaptiveDetailRow(): void;
    /**
     * @docid
     * @publicName columnCount()
     * @return number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnCount(): number;
    /**
     * @docid
     * @publicName columnOption(id)
     * @param1 id:number|string
     * @return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnOption(id: number | string): any;
    /**
     * @docid
     * @publicName columnOption(id, optionName)
     * @param1 id:number|string
     * @param2 optionName:string
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnOption(id: number | string, optionName: string): any;
    /**
     * @docid
     * @publicName columnOption(id, optionName, optionValue)
     * @param1 id:number|string
     * @param2 optionName:string
     * @param3 optionValue:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnOption(id: number | string, optionName: string, optionValue: any): void;
    /**
     * @docid
     * @publicName columnOption(id, options)
     * @param1 id:number|string
     * @param2 options:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnOption(id: number | string, options: any): void;
    /**
     * @docid
     * @publicName deleteColumn(id)
     * @param1 id:number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteColumn(id: number | string): void;
    /**
     * @docid
     * @publicName deleteRow(rowIndex)
     * @param1 rowIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteRow(rowIndex: number): void;
    /**
     * @docid
     * @publicName deselectAll()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deselectAll(): TPromise<void>;
    /**
     * @docid
     * @publicName deselectRows(keys)
     * @param1 keys:Array<any>
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deselectRows(keys: Array<any>): TPromise<any>;
    /**
     * @docid
     * @publicName editCell(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editCell(rowIndex: number, dataField: string): void;
    /**
     * @docid
     * @publicName editCell(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    /**
     * @docid
     * @publicName editRow(rowIndex)
     * @param1 rowIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editRow(rowIndex: number): void;
    /**
     * @docid
     * @publicName endCustomLoading()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    endCustomLoading(): void;
    /**
     * @docid
     * @publicName expandAdaptiveDetailRow(key)
     * @param1 key:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandAdaptiveDetailRow(key: any): void;
    /**
     * @docid
     * @publicName filter()
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filter(): any;
    /**
     * @docid
     * @publicName filter(filterExpr)
     * @param1 filterExpr:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filter(filterExpr: any): void;
    focus(): void;
    /**
     * @docid
     * @publicName focus(element)
     * @param1 element:Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focus(element: TElement): void;
    /**
     * @docid
     * @publicName getCellElement(rowIndex, dataField)
     * @param1 rowIndex:number
     * @param2 dataField:string
     * @return dxElement|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCellElement(rowIndex: number, dataField: string): TElement | undefined;
    /**
     * @docid
     * @publicName getCellElement(rowIndex, visibleColumnIndex)
     * @param1 rowIndex:number
     * @param2 visibleColumnIndex:number
     * @return dxElement|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCellElement(rowIndex: number, visibleColumnIndex: number): TElement | undefined;
    /**
     * @docid
     * @publicName getCombinedFilter()
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCombinedFilter(): any;
    /**
     * @docid
     * @publicName getCombinedFilter(returnDataField)
     * @param1 returnDataField:boolean
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName getKeyByRowIndex(rowIndex)
     * @param1 rowIndex:numeric
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getKeyByRowIndex(rowIndex: number): any;
    /**
     * @docid
     * @publicName getRowElement(rowIndex)
     * @param1 rowIndex:number
     * @return Array<Element>|jQuery|undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getRowElement(rowIndex: number): TElementsArray | undefined;
    /**
     * @docid
     * @publicName getRowIndexByKey(key)
     * @param1 key:object|string|number
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getRowIndexByKey(key: any | string | number): number;
    /**
     * @docid
     * @publicName getScrollable()
     * @return dxScrollable
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getScrollable(): dxScrollable;
    /**
     * @docid
     * @publicName getVisibleColumnIndex(id)
     * @param1 id:number|string
     * @return number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleColumnIndex(id: number | string): number;
    /**
     * @docid
     * @publicName hasEditData()
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasEditData(): boolean;
    /**
     * @docid
     * @publicName hideColumnChooser()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideColumnChooser(): void;
    /**
     * @docid
     * @publicName isAdaptiveDetailRowExpanded(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isAdaptiveDetailRowExpanded(key: any): boolean;
    /**
     * @docid
     * @publicName isRowFocused(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRowFocused(key: any): boolean;
    /**
     * @docid
     * @publicName isRowSelected(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRowSelected(key: any): boolean;
    /**
     * @docid
     * @publicName keyOf(obj)
     * @param1 obj:object
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyOf(obj: any): any;
    /**
     * @docid
     * @publicName navigateToRow(key)
     * @param1 key:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    navigateToRow(key: any): void;
    /**
     * @docid
     * @publicName pageCount()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageCount(): number;
    /**
     * @docid
     * @publicName pageIndex()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageIndex(): number;
    /**
     * @docid
     * @publicName pageIndex(newIndex)
     * @param1 newIndex:numeric
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageIndex(newIndex: number): TPromise<void>;
    /**
     * @docid
     * @publicName pageSize()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageSize(): number;
    /**
     * @docid
     * @publicName pageSize(value)
     * @param1 value:numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageSize(value: number): void;
    /**
     * @docid
     * @publicName refresh()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refresh(): TPromise<void>;
    /**
     * @docid
     * @publicName refresh(changesOnly)
     * @param1 changesOnly:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refresh(changesOnly: boolean): TPromise<void>;
    /**
     * @docid
     * @publicName repaintRows(rowIndexes)
     * @param1 rowIndexes:Array<number>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintRows(rowIndexes: Array<number>): void;
    /**
     * @docid
     * @publicName saveEditData()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    saveEditData(): TPromise<void>;
    /**
     * @docid
     * @publicName searchByText(text)
     * @param1 text:string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchByText(text: string): void;
    /**
     * @docid
     * @publicName selectAll()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectAll(): TPromise<void>;
    /**
     * @docid
     * @publicName selectRows(keys, preserve)
     * @param1 keys:Array<any>
     * @param2 preserve:boolean
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectRows(keys: Array<any>, preserve: boolean): TPromise<any>;
    /**
     * @docid
     * @publicName selectRowsByIndexes(indexes)
     * @param1 indexes:Array<number>
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectRowsByIndexes(indexes: Array<number>): TPromise<any>;
    /**
     * @docid
     * @publicName showColumnChooser()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnChooser(): void;
    /**
     * @docid
     * @publicName state()
     * @return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    state(): any;
    /**
     * @docid
     * @publicName state(state)
     * @param1 state:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    state(state: any): void;
    /**
     * @docid
     * @publicName undeleteRow(rowIndex)
     * @param1 rowIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    undeleteRow(rowIndex: number): void;
    /**
     * @docid
     * @publicName updateDimensions()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): void;
}

/**
 * @docid
 * @type object
 */
export interface GridBaseColumn {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @acceptValues undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignment?: 'center' | 'left' | 'right' | undefined;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowEditing?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowFiltering?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowFixing?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowHeaderFiltering?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowHiding?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowReordering?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowResizing?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSearch?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSorting?: boolean;
    /**
     * @docid
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateCellValue?: ((rowData: any) => any);
    /**
     * @docid
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateDisplayValue?: string | ((rowData: any) => any);
    /**
     * @docid
     * @type_function_param1 filterValue:any
     * @type_function_param2 selectedFilterOperation:string
     * @type_function_param3 target:string
     * @type_function_return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string, target: string) => string | Array<any> | Function);
    /**
     * @docid
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateSortValue?: string | ((rowData: any) => any);
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
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
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataField?: string;
    /**
     * @docid
     * @type Enums.GridColumnDataType
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorOptions?: any;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    encodeHtml?: boolean;
    /**
     * @docid
     * @default "false"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    falseText?: string;
    /**
     * @docid
     * @type Array<Enums.GridFilterOperations, string>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof'>;
    /**
     * @docid
     * @type Enums.FilterType
     * @default "include"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterType?: 'exclude' | 'include';
    /**
     * @docid
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterValue?: any;
    /**
     * @docid
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterValues?: Array<any>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fixed?: boolean;
    /**
     * @docid
     * @type Enums.HorizontalEdge
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fixedPosition?: 'left' | 'right';
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formItem?: dxFormSimpleItem;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    format?: format;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerFilter?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      allowSearch?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 options:object
       * @type_function_param1_field1 component:object
       * @type_function_param1_field2 dataSource:DataSourceOptions
     * @default undefined
       */
      dataSource?: Array<any> | ((options: { component?: any, dataSource?: DataSourceOptions }) => any) | DataSourceOptions,
      /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @type Enums.HeaderFilterGroupInterval|number
       * @default undefined
       */
      groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      height?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.CollectionSearchMode
       * @default 'contains'
       */
      searchMode?: 'contains' | 'startswith' | 'equals',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      width?: number
    };
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hidingPriority?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isBand?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    lookup?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      allowClearing?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 options:object
       * @type_function_param1_field1 data:object
       * @type_function_param1_field2 key:any
       * @type_function_return Array<any>|DataSourceOptions|Store
     * @default undefined
       */
      dataSource?: Array<any> | DataSourceOptions | Store | ((options: { data?: any, key?: any }) => Array<any> | DataSourceOptions | Store),
      /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @default undefined
       * @type_function_param1 data:object
       * @type_function_return string
       */
      displayExpr?: string | ((data: any) => string),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      valueExpr?: string
    };
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ownerBand?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    renderAsync?: boolean;
    /**
     * @docid
     * @type Enums.FilterOperations
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedFilterOperation?: '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';
    /**
     * @docid
     * @type_function_param1 newData:object
     * @type_function_param2 value:any
     * @type_function_param3 currentRowData:object
     * @type_function_return void|Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    setCellValue?: ((newData: any, value: any, currentRowData: any) => void | TPromise<void>);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showEditorAlways?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showInColumnChooser?: boolean;
    /**
     * @docid
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortIndex?: number;
    /**
     * @docid
     * @type Enums.SortOrder
     * @default undefined
     * @acceptValues undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortOrder?: 'asc' | 'desc' | undefined;
    /**
     * @docid
     * @type_function_param1 value1:any
     * @type_function_param2 value2:any
     * @type_function_return number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortingMethod?: ((value1: any, value2: any) => number);
    /**
     * @docid
     * @default "true"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    trueText?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid
     * @default true
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string;
}

/**
 * @docid
 * @type object
 */
export interface GridBaseColumnButton {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hint?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
}

export interface dxDataGridOptions extends GridBaseOptions<dxDataGrid> {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<dxDataGridColumn | string>;
    /**
     * @docid
     * @type_function_param1 columns:Array<dxDataGridColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeColumns?: ((columns: Array<dxDataGridColumn>) => any);
    /**
     * @docid
     * @deprecated
     * @type_function_param1 columns:Array<dxDataGridColumn>
     * @type_function_param2 rows:Array<dxDataGridRowObject>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeExportData?: ((columns: Array<dxDataGridColumn>, rows: Array<dxDataGridRowObject>) => any);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    editing?: dxDataGridEditing;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    export?: {
    /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @default false
       */
      allowExportSelectedData?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
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
      customizeExcelCell?: ((options: { component?: dxDataGrid, horizontalAlignment?: 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right', verticalAlignment?: 'bottom' | 'center' | 'distributed' | 'justify' | 'top', wrapTextEnabled?: boolean, backgroundColor?: string, fillPatternType?: 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid', fillPatternColor?: string, font?: ExcelFont, value?: string | number | Date, numberFormat?: string, gridCell?: ExcelDataGridCell }) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      enabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       * @deprecated
       */
      excelFilterEnabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       * @deprecated
       */
      excelWrapTextEnabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "DataGrid"
       * @deprecated
       */
      fileName?: string,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default true
      * @deprecated
      */
      ignoreExcelErrors?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       * @deprecated
       */
      proxyUrl?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      texts?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Export all data"
         */
        exportAll?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Export selected rows"
         */
        exportSelectedRows?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Export"
         */
        exportTo?: string
      }
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupPanel?: {
    /**
       * @docid
     * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowColumnDragging?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Drag a column header here to group by that column"
       */
      emptyPanelText?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type boolean|Enums.Mode
       * @default false
       */
      visible?: boolean | 'auto'
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grouping?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowCollapsing?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      autoExpandAll?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      contextMenuEnabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 'rowClick' [for](mobile_devices)
       * @type Enums.GridGroupingExpandMode
       * @default "buttonClick"
       */
      expandMode?: 'buttonClick' | 'rowClick',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      texts?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.ui
        * @default "Group by This Column"
        */
        groupByThisColumn?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Continued from the previous page"
         */
        groupContinuedMessage?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.ui
        * @default "Continues on the next page"
        */
        groupContinuesMessage?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.ui
        * @default "Ungroup"
        */
        ungroup?: string,
        /**
        * @docid
        * @prevFileNamespace DevExpress.ui
        * @default "Ungroup All"
        */
        ungroupAll?: string
      }
    };
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string | Array<string>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    masterDetail?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      autoExpandAll?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      enabled?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 detailElement:dxElement
       * @type_function_param2 detailInfo:object
       * @type_function_param2_field1 key:any
       * @type_function_param2_field2 data:object
       * @type_function_param2_field3 watch:function
       */
      template?: template | ((detailElement: TElement, detailInfo: { key?: any, data?: any, watch?: Function }) => any)
    };
    /**
     * @docid
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
    onCellClick?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, event?: TEvent, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: any, rowIndex?: number, rowType?: string, cellElement?: TElement, row?: dxDataGridRowObject }) => any) | string;
    /**
     * @docid
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
    onCellDblClick?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, event?: TEvent, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, cellElement?: TElement, row?: dxDataGridRowObject }) => any);
    /**
     * @docid
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
    onCellHoverChanged?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, eventType?: string, data?: any, key?: any, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, rowType?: string, cellElement?: TElement, row?: dxDataGridRowObject }) => any);
    /**
     * @docid
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
    onCellPrepared?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, data?: any, key?: any, value?: any, displayValue?: any, text?: string, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, cellElement?: TElement, watch?: Function, oldValue?: any }) => any);
    /**
     * @docid
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
    onContextMenuPreparing?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, items?: Array<any>, target?: string, targetElement?: TElement, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, row?: dxDataGridRowObject }) => any);
    /**
     * @docid
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
    onEditingStart?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, data?: any, key?: any, cancel?: boolean, column?: any }) => any);
    /**
     * @docid
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
    onEditorPrepared?: ((options: { component?: dxDataGrid, element?: TElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, editorElement?: TElement, readOnly?: boolean, dataField?: string, row?: dxDataGridRowObject }) => any);
    /**
     * @docid
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
    onEditorPreparing?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, parentType?: string, value?: any, setValue?: any, updateValueTimeout?: number, width?: number, disabled?: boolean, rtlEnabled?: boolean, cancel?: boolean, editorElement?: TElement, readOnly?: boolean, editorName?: string, editorOptions?: any, dataField?: string, row?: dxDataGridRowObject }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated
     */
    onExported?: ((e: { component?: dxDataGrid, element?: TElement, model?: any }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 fileName:string
     * @type_function_param1_field5 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onExporting?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, fileName?: string, cancel?: boolean }) => any);
    /**
     * @docid
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
    onFileSaving?: ((e: { component?: dxDataGrid, element?: TElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
    /**
     * @docid
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
    onFocusedCellChanged?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, cellElement?: TElement, columnIndex?: number, rowIndex?: number, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any);
    /**
     * @docid
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
    onFocusedCellChanging?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, cellElement?: TElement, prevColumnIndex?: number, prevRowIndex?: number, newColumnIndex?: number, newRowIndex?: number, event?: TEvent, rows?: Array<dxDataGridRowObject>, columns?: Array<dxDataGridColumn>, cancel?: boolean, isHighlighted?: boolean }) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 rowElement:dxElement
     * @type_function_param1_field5 rowIndex:number
     * @type_function_param1_field6 row:dxDataGridRowObject
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedRowChanged?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, rowElement?: TElement, rowIndex?: number, row?: dxDataGridRowObject }) => any);
    /**
     * @docid
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
    onFocusedRowChanging?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, rowElement?: TElement, prevRowIndex?: number, newRowIndex?: number, event?: TEvent, rows?: Array<dxDataGridRowObject>, cancel?: boolean }) => any);
    /**
     * @docid
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
    onRowClick?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, event?: TEvent, data?: any, key?: any, values?: Array<any>, columns?: Array<any>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: TElement, handled?: boolean }) => any) | string;
    /**
     * @docid
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
    onRowDblClick?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, event?: TEvent, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, groupIndex?: number, rowElement?: TElement }) => any);
    /**
     * @docid
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
    onRowPrepared?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, data?: any, key?: any, values?: Array<any>, columns?: Array<dxDataGridColumn>, rowIndex?: number, rowType?: string, groupIndex?: number, isSelected?: boolean, isExpanded?: boolean, isNewRow?: boolean, rowElement?: TElement }) => any);
    /**
     * @docid
     * @type boolean|object|Enums.Mode
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    remoteOperations?: boolean | {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      filtering?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      groupPaging?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      grouping?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      paging?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      sorting?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      summary?: boolean
    } | 'auto';
    /**
     * @docid
     * @type_function_param1 rowElement:dxElement
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowTemplate?: template | ((rowElement: TElement, rowInfo: { key?: any, data?: any, component?: dxDataGrid, values?: Array<any>, rowIndex?: number, columns?: Array<dxDataGridColumn>, isSelected?: boolean, rowType?: string, groupIndex?: number, isExpanded?: boolean }) => any);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    scrolling?: dxDataGridScrolling;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    selection?: dxDataGridSelection;
    /**
     * @docid
     * @type Filter expression
     * @default []
     * @fires dxDataGridOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionFilter?: string | Array<any> | Function;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortByGroupSummaryInfo?: Array<{
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      groupColumn?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type Enums.SortOrder
       * @default undefined
       * @acceptValues undefined
       */
      sortOrder?: 'asc' | 'desc',
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      summaryItem?: string | number
    }>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    summary?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 options:object
       * @type_function_param1_field1 component:dxDataGrid
       * @type_function_param1_field2 name:string
       * @type_function_param1_field3 summaryProcess:string
       * @type_function_param1_field4 value:any
       * @type_function_param1_field5 totalValue:any
       * @type_function_param1_field6 groupIndex:number
       */
      calculateCustomSummary?: ((options: { component?: dxDataGrid, name?: string, summaryProcess?: string, value?: any, totalValue?: any, groupIndex?: number }) => any),
      /**
       * @docid
       * @type Array<object>
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      groupItems?: Array<{
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default false
         */
        alignByColumn?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        column?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type_function_param1 itemInfo:object
         * @type_function_param1_field1 value:string|number|date
         * @type_function_param1_field2 valueText:string
         * @type_function_return string
         */
        customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string),
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        displayFormat?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        name?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        showInColumn?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default false
         */
        showInGroupFooter?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        skipEmptyValues?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type Enums.SummaryType|string
         * @default undefined
         */
        summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        valueFormat?: format
      }>,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      recalculateWhileEditing?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      skipEmptyValues?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      texts?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Avg={0}"
         */
        avg?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Avg of {1} is {0}"
         */
        avgOtherColumn?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Count={0}"
         */
        count?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Max={0}"
         */
        max?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Max of {1} is {0}"
         */
        maxOtherColumn?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Min={0}"
         */
        min?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Min of {1} is {0}"
         */
        minOtherColumn?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Sum={0}"
         */
        sum?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default "Sum of {1} is {0}"
         */
        sumOtherColumn?: string
      },
      /**
       * @docid
       * @type Array<object>
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      totalItems?: Array<{
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type Enums.HorizontalAlignment
         * @default undefined
         */
        alignment?: 'center' | 'left' | 'right',
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        column?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        cssClass?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type_function_param1 itemInfo:object
         * @type_function_param1_field1 value:string|number|date
         * @type_function_param1_field2 valueText:string
         * @type_function_return string
         */
        customizeText?: ((itemInfo: { value?: string | number | Date, valueText?: string }) => string),
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        displayFormat?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        name?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        showInColumn?: string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         */
        skipEmptyValues?: boolean,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @type Enums.SummaryType|string
         * @default undefined
         */
        summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string,
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default undefined
         */
        valueFormat?: format
      }>
    };
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
 * @docid
 * @inherits GridBase
 * @module ui/data_grid
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
declare class dxDataGrid extends Widget implements GridBase {
    constructor(element: TElement, options?: dxDataGridOptions)
    /**
     * @docid
     * @publicName addColumn(columnOptions)
     * @param1 columnOptions:object|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addColumn(columnOptions: any | string): void;
    /**
     * @docid
     * @publicName addRow()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRow(): TPromise<void>;
    /**
     * @docid
     * @publicName clearGrouping()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearGrouping(): void;
    /**
     * @docid
     * @publicName collapseAll(groupIndex)
     * @param1 groupIndex:number | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseAll(groupIndex?: number): void;
    /**
     * @docid
     * @publicName collapseRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseRow(key: any): TPromise<void>;
    /**
     * @docid
     * @publicName expandAll(groupIndex)
     * @param1 groupIndex:number | undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandAll(groupIndex?: number): void;
    /**
     * @docid
     * @publicName expandRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandRow(key: any): TPromise<void>;
    /**
     * @docid
     * @publicName exportToExcel(selectionOnly)
     * @deprecated excelExporter.exportDataGrid
     * @param1 selectionOnly:boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    exportToExcel(selectionOnly: boolean): void;
    /**
     * @docid
     * @publicName getSelectedRowKeys()
     * @return Array<any> | Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedRowKeys(): Array<any> & TPromise<any>;
    /**
     * @docid
     * @publicName getSelectedRowsData()
     * @return Array<any> | Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedRowsData(): Array<any> & TPromise<any>;
    /**
     * @docid
     * @publicName getTotalSummaryValue(summaryItemName)
     * @param1 summaryItemName:String
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getTotalSummaryValue(summaryItemName: string): any;
    /**
     * @docid
     * @publicName getVisibleColumns()
     * @return Array<dxDataGridColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleColumns(): Array<dxDataGridColumn>;
    /**
     * @docid
     * @publicName getVisibleColumns(headerLevel)
     * @param1 headerLevel:number
     * @return Array<dxDataGridColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleColumns(headerLevel: number): Array<dxDataGridColumn>;
    /**
     * @docid
     * @publicName getVisibleRows()
     * @return Array<dxDataGridRowObject>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleRows(): Array<dxDataGridRowObject>;
    /**
     * @docid
     * @publicName isRowExpanded(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRowExpanded(key: any): boolean;
    /**
     * @docid
     * @publicName isRowSelected(data)
     * @param1 data:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRowSelected(data: any): boolean;
    isRowSelected(key: any): boolean;
    /**
     * @docid
     * @publicName totalCount()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    totalCount(): number;

    beginCustomLoading(messageText: string): void;
    byKey(key: any | string | number): TPromise<any>;
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
    deselectAll(): TPromise<void>;
    deselectRows(keys: Array<any>): TPromise<any>;
    editCell(rowIndex: number, dataField: string): void;
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    editRow(rowIndex: number): void;
    endCustomLoading(): void;
    expandAdaptiveDetailRow(key: any): void;
    filter(): any;
    filter(filterExpr: any): void;
    focus(): void;
    focus(element: TElement): void;
    getCellElement(rowIndex: number, dataField: string): TElement | undefined;
    getCellElement(rowIndex: number, visibleColumnIndex: number): TElement | undefined;
    getCombinedFilter(): any;
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    getKeyByRowIndex(rowIndex: number): any;
    getRowElement(rowIndex: number): TElementsArray | undefined;
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
    pageIndex(newIndex: number): TPromise<void>;
    pageSize(): number;
    pageSize(value: number): void;
    refresh(): TPromise<void>;
    refresh(changesOnly: boolean): TPromise<void>;
    repaintRows(rowIndexes: Array<number>): void;
    saveEditData(): TPromise<void>;
    searchByText(text: string): void;
    selectAll(): TPromise<void>;
    selectRows(keys: Array<any>, preserve: boolean): TPromise<any>;
    selectRowsByIndexes(indexes: Array<number>): TPromise<any>;
    showColumnChooser(): void;
    state(): any;
    state(state: any): void;
    undeleteRow(rowIndex: number): void;
    updateDimensions(): void;
}

/**
 * @docid
 * @inherits GridBaseColumn
 * @type object
 */
export interface dxDataGridColumn extends GridBaseColumn {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowExporting?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowGrouping?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoExpandGroup?: boolean;
    /**
     * @docid
     * @type Array<Enums.GridColumnButtonName,dxDataGridColumnButton>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttons?: Array<'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | dxDataGridColumnButton>;
    /**
     * @docid
     * @type_function_param1 rowData:object
     * @type_function_return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateGroupValue?: string | ((rowData: any) => any);
    /**
     * @docid
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
    cellTemplate?: template | ((cellElement: TElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, oldValue?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<dxDataGridColumn | string>;
    /**
     * @docid
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
    editCellTemplate?: template | ((cellElement: TElement, cellInfo: { setValue?: any, data?: any, component?: dxDataGrid, value?: any, displayValue?: any, text?: string, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, rowType?: string, watch?: Function }) => any);
    /**
     * @docid
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
    groupCellTemplate?: template | ((cellElement: TElement, cellInfo: { data?: any, component?: dxDataGrid, value?: any, text?: string, displayValue?: any, columnIndex?: number, rowIndex?: number, column?: dxDataGridColumn, row?: dxDataGridRowObject, summaryItems?: Array<any>, groupContinuesMessage?: string, groupContinuedMessage?: string }) => any);
    /**
     * @docid
     * @default undefined
     * @fires dxDataGridOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupIndex?: number;
    /**
     * @docid
     * @type_function_param1 columnHeader:dxElement
     * @type_function_param2 headerInfo:object
     * @type_function_param2_field1 component:dxDataGrid
     * @type_function_param2_field2 columnIndex:number
     * @type_function_param2_field3 column:dxDataGridColumn
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerCellTemplate?: template | ((columnHeader: TElement, headerInfo: { component?: dxDataGrid, columnIndex?: number, column?: dxDataGridColumn }) => any);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showWhenGrouped?: boolean;
    /**
     * @docid
     * @publicName type
     * @type Enums.GridCommandColumnType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection';
}

/**
 * @docid
 * @inherits GridBaseColumnButton
 * @type object
 */
export interface dxDataGridColumnButton extends GridBaseColumnButton {
    /**
     * @docid
     * @type Enums.GridColumnButtonName|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
    /**
     * @docid
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
    onClick?: ((e: { component?: dxDataGrid, element?: TElement, model?: any, event?: TEvent, row?: dxDataGridRowObject, column?: dxDataGridColumn }) => any) | string;
    /**
     * @docid
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
    template?: template | ((cellElement: TElement, cellInfo: { component?: dxDataGrid, data?: any, key?: any, columnIndex?: number, column?: dxDataGridColumn, rowIndex?: number, rowType?: string, row?: dxDataGridRowObject }) => string | TElement);
    /**
     * @docid
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

/**
 * @docid
 * @type object
 */
export interface dxDataGridRowObject {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    data?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupIndex?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isEditing?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isExpanded?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isNewRow?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isSelected?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    key?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowIndex?: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowType?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    values?: Array<any>;
}

export type Options = dxDataGridOptions;

/** @deprecated use Options instead */
export type IOptions = dxDataGridOptions;
export type Column = dxDataGridColumn;

export default dxDataGrid;
