import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events/index';

import PivotGridDataSource, {
    PivotGridDataSourceField,
    PivotGridDataSourceOptions
} from './pivot_grid/data_source';

import dxPopup from './popup';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxPivotGridOptions extends WidgetOptions<dxPivotGrid> {
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowExpandAll?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowFiltering?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSorting?: boolean;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSortingBySummary?: boolean;
    /**
     * @docid
     * @type Enums.PivotGridDataFieldArea
     * @default "column"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataFieldArea?: 'column' | 'row';
    /**
     * @docid
     * @type Array<Object>|PivotGridDataSource|PivotGridDataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: Array<any> | PivotGridDataSource | PivotGridDataSourceOptions;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    export?: {
      /**
       * @docid
       * @type boolean
       * @default false
       */
      enabled?: boolean,
      /**
       * @docid
       * @type string
       * @default "PivotGrid"
       * @deprecated
       */
      fileName?: string,
      /**
       * @docid
       * @type boolean
       * @default true
       * @deprecated
       */
      ignoreExcelErrors?: boolean,
      /**
       * @docid
       * @type string
       * @default undefined
       * @deprecated
       */
      proxyUrl?: string
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldChooser?: {
      /**
       * @docid
       * @type boolean
       * @default false
       */
      allowSearch?: boolean,
      /**
       * @docid
       * @type Enums.ApplyChangesMode
       * @default "instantly"
       */
      applyChangesMode?: 'instantly' | 'onDemand',
      /**
       * @docid
       * @type boolean
       * @default true
       */
      enabled?: boolean,
      /**
       * @docid
       * @type number
       * @default 600
       */
      height?: number,
      /**
       * @docid
       * @type Enums.PivotGridFieldChooserLayout
       * @default 0
       */
      layout?: 0 | 1 | 2,
      /**
       * @docid
       * @type number
       * @default searchTimeout
       */
      searchTimeout?: number,
      /**
       * @docid
       * @type object
       */
      texts?: {
        /**
         * @docid
         * @type string
         * @default 'All Fields'
         */
        allFields?: string,
        /**
         * @docid
         * @type string
         * @default 'Column Fields'
         */
        columnFields?: string,
        /**
         * @docid
         * @type string
         * @default 'Data Fields'
         */
        dataFields?: string,
        /**
         * @docid
         * @type string
         * @default 'Filter Fields'
         */
        filterFields?: string,
        /**
         * @docid
         * @type string
         * @default 'Row Fields'
         */
        rowFields?: string
      },
      /**
       * @docid
       * @type string
       * @default "Field Chooser"
       */
      title?: string,
      /**
       * @docid
       * @type number
       * @default 600
       */
      width?: number
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldPanel?: {
      /**
      * @docid
      * @type boolean
      * @default true
      */
      allowFieldDragging?: boolean,
      /**
      * @docid
      * @type boolean
      * @default true
      */
      showColumnFields?: boolean,
      /**
      * @docid
      * @type boolean
      * @default true
      */
      showDataFields?: boolean,
      /**
      * @docid
      * @type boolean
      * @default true
      */
      showFilterFields?: boolean,
      /**
      * @docid
      * @type boolean
      * @default true
      */
      showRowFields?: boolean,
      /**
      * @docid
      * @type object
      */
      texts?: {
        /**
        * @docid
        * @type string
        * @default "Drop Column Fields Here"
        */
        columnFieldArea?: string,
        /**
        * @docid
        * @type string
        * @default "Drop Data Fields Here"
        */
        dataFieldArea?: string,
        /**
        * @docid
        * @type string
        * @default "Drop Filter Fields Here"
        */
        filterFieldArea?: string,
        /**
        * @docid
        * @type string
        * @default "Drop Row Fields Here"
        */
        rowFieldArea?: string
      },
      /**
      * @docid
      * @type boolean
      * @default false
      */
      visible?: boolean
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerFilter?: {
      /**
       * @docid
       * @type boolean
       * @default false
       */
      allowSearch?: boolean,
      /**
       * @docid
       * @type number
       * @default 325
       */
      height?: number,
      /**
       * @docid
       * @type number
       * @default searchTimeout
       */
      searchTimeout?: number,
      /**
       * @docid
       * @type boolean
       * @default false
       */
      showRelevantValues?: boolean,
      /**
       * @docid
       * @type object
       */
      texts?: {
        /**
         * @docid
         * @type string
         * @default "Cancel"
         */
        cancel?: string,
        /**
         * @docid
         * @type string
         * @default "(Blanks)"
         */
        emptyValue?: string,
        /**
         * @docid
         * @type string
         * @default "Ok"
         */
        ok?: string
      },
      /**
       * @docid
       * @type number
       * @default 252
       */
      width?: number
    };
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideEmptySummaryCells?: boolean;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loadPanel?: {
      /**
       * @docid
       * @type boolean
       * @default true
       */
      enabled?: boolean,
      /**
       * @docid
       * @type number
       * @default 70
       */
      height?: number,
      /**
       * @docid
       * @type string
       * @default ""
       */
      indicatorSrc?: string,
      /**
       * @docid
       * @type boolean
       * @default false
       */
      shading?: boolean,
      /**
       * @docid
       * @type string
       * @default ''
       */
      shadingColor?: string,
      /**
       * @docid
       * @type boolean
       * @default true
       */
      showIndicator?: boolean,
      /**
       * @docid
       * @type boolean
       * @default true
       */
      showPane?: boolean,
      /**
       * @docid
       * @type string
       * @default 'Loading...'
       */
      text?: string,
      /**
       * @docid
       * @type number
       * @default 200
       */
      width?: number
    };
    /**
     * @docid
     * @type function(e)
     * @type_function_param1 e:Object
     * @type_function_param1_field4 area:string
     * @type_function_param1_field5 cellElement:dxElement
     * @type_function_param1_field6 cell:dxPivotGridPivotGridCell
     * @type_function_param1_field7 rowIndex:number
     * @type_function_param1_field8 columnIndex:number
     * @type_function_param1_field9 columnFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field10 rowFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field11 dataFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field12 event:event
     * @type_function_param1_field13 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellClick?: ((e: { component?: dxPivotGrid, element?: dxElement, model?: any, area?: string, cellElement?: dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number, columnFields?: Array<PivotGridDataSourceField>, rowFields?: Array<PivotGridDataSourceField>, dataFields?: Array<PivotGridDataSourceField>, event?: event, cancel?: boolean }) => any);
    /**
     * @docid
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 area:string
     * @type_function_param1_field5 cellElement:dxElement
     * @type_function_param1_field6 cell:dxPivotGridPivotGridCell
     * @type_function_param1_field7 rowIndex:number
     * @type_function_param1_field8 columnIndex:number
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellPrepared?: ((e: { component?: dxPivotGrid, element?: dxElement, model?: any, area?: string, cellElement?: dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number }) => any);
    /**
     * @docid
     * @type function(e)
     * @type_function_param1 e:Object
     * @type_function_param1_field4 items:Array<Object>
     * @type_function_param1_field5 area:string
     * @type_function_param1_field6 cell:dxPivotGridPivotGridCell
     * @type_function_param1_field7 cellElement:dxElement
     * @type_function_param1_field8 columnIndex:number
     * @type_function_param1_field9 rowIndex:number
     * @type_function_param1_field10 dataFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field11 rowFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field12 columnFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field13 field:PivotGridDataSourceOptions.fields
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContextMenuPreparing?: ((e: { component?: dxPivotGrid, element?: dxElement, model?: any, items?: Array<any>, area?: string, cell?: dxPivotGridPivotGridCell, cellElement?: dxElement, columnIndex?: number, rowIndex?: number, dataFields?: Array<PivotGridDataSourceField>, rowFields?: Array<PivotGridDataSourceField>, columnFields?: Array<PivotGridDataSourceField>, field?: PivotGridDataSourceField }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     * @deprecated
     */
    onExported?: ((e: { component?: dxPivotGrid, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 fileName:string
     * @type_function_param1_field5 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onExporting?: ((e: { component?: dxPivotGrid, element?: dxElement, model?: any, fileName?: string, cancel?: boolean }) => any);
    /**
     * @docid
     * @type function(e)
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
    onFileSaving?: ((e: { component?: dxPivotGrid, element?: dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
    /**
     * @docid
     * @type Enums.PivotGridRowHeadersLayout
     * @default "standard"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowHeaderLayout?: 'standard' | 'tree';
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrolling?: {
      /**
       * @docid
       * @type Enums.PivotGridScrollingMode
       * @default "standard"
       */
      mode?: 'standard' | 'virtual',
      /**
       * @docid
       * @type boolean|Enums.Mode
       * @default "auto"
       */
      useNative?: boolean | 'auto'
    };
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showBorders?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnGrandTotals?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnTotals?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRowGrandTotals?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRowTotals?: boolean;
    /**
     * @docid
     * @type Enums.PivotGridTotalsDisplayMode
     * @default "none"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showTotalsPrior?: 'both' | 'columns' | 'none' | 'rows';
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stateStoring?: {
      /**
       * @docid
       * @type function()
       * @type_function_return Promise<Object>
       */
      customLoad?: (() => Promise<any> | JQueryPromise<any>),
      /**
       * @docid
       * @type function(state)
       * @type_function_param1 state:object
       */
      customSave?: ((state: any) => any),
      /**
       * @docid
       * @type boolean
       * @default false
       */
      enabled?: boolean,
      /**
       * @docid
       * @type number
       * @default 2000
       */
      savingTimeout?: number,
      /**
       * @docid
       * @type string
       * @default null
       */
      storageKey?: string,
      /**
       * @docid
       * @type Enums.StateStoringType
       * @default "localStorage"
       */
      type?: 'custom' | 'localStorage' | 'sessionStorage'
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: {
      /**
       * @docid
       * @type string
       * @default 'Collapse All'
       */
      collapseAll?: string,
      /**
       * @docid
       * @type string
       * @default "N/A"
       */
      dataNotAvailable?: string,
      /**
       * @docid
       * @type string
       * @default 'Expand All'
       */
      expandAll?: string,
      /**
       * @docid
       * @type string
       * @default "Export to Excel file"
       */
      exportToExcel?: string,
      /**
       * @docid
       * @type string
       * @default 'Grand Total'
       */
      grandTotal?: string,
      /**
       * @docid
       * @type string
       * @default 'No data'
       */
      noData?: string,
      /**
       * @docid
       * @type string
       * @default 'Remove All Sorting'
       */
      removeAllSorting?: string,
      /**
        * @docid
        * @type string
        * @default 'Show Field Chooser'
        */
      showFieldChooser?: string,
      /**
       * @docid
       * @type string
       * @default 'Sort {0} by This Column'
       */
      sortColumnBySummary?: string,
      /**
       * @docid
       * @type string
       * @default 'Sort {0} by This Row'
       */
      sortRowBySummary?: string,
      /**
       * @docid
       * @type string
       * @default '{0} Total'
       */
      total?: string
    };
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    wordWrapEnabled?: boolean;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/pivot_grid
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxPivotGrid extends Widget {
    constructor(element: Element, options?: dxPivotGridOptions)
    constructor(element: JQuery, options?: dxPivotGridOptions)
    /**
     * @docid
     * @publicName bindChart(chart, integrationOptions)
     * @param1 chart:string|jQuery|object
     * @param2 integrationOptions:object
     * @param2_field1 inverted:boolean
     * @param2_field2 dataFieldsDisplayMode:string
     * @param2_field3 putDataFieldsInto:string
     * @param2_field4 alternateDataFields:boolean
     * @param2_field5 processCell:function(cellData)
     * @param2_field6 customizeChart:function(chartOptions)
     * @param2_field7 customizeSeries:function(seriesName, seriesOptions)
     * @return function | null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    bindChart(chart: string | JQuery | any, integrationOptions: { inverted?: boolean, dataFieldsDisplayMode?: string, putDataFieldsInto?: string, alternateDataFields?: boolean, processCell?: Function, customizeChart?: Function, customizeSeries?: Function }): Function & null;
    /**
     * @docid
     * @publicName exportToExcel()
     * @deprecated excelExporter.exportPivotGrid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    exportToExcel(): void;
    /**
     * @docid
     * @publicName getDataSource()
     * @return PivotGridDataSource
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getDataSource(): PivotGridDataSource;
    /**
     * @docid
     * @publicName getFieldChooserPopup()
     * @return dxPopup
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getFieldChooserPopup(): dxPopup;
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
export interface dxPivotGridPivotGridCell {
    /**
     * @docid
     * @type Array<string, number, Date>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnPath?: Array<string | number | Date>;
    /**
     * @docid
     * @acceptValues "D" | "T" | "GT"
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnType?: 'D' | 'T' | 'GT';
    /**
     * @docid
     * @type number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataIndex?: number;
    /**
     * @docid
     * @type boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expanded?: boolean;
    /**
     * @docid
     * @type Array<string, number, Date>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    path?: Array<string | number | Date>;
    /**
     * @docid
     * @type Array<string, number, Date>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowPath?: Array<string | number | Date>;
    /**
     * @docid
     * @acceptValues "D" | "T" | "GT"
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowType?: 'D' | 'T' | 'GT';
    /**
     * @docid
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @acceptValues "D" | "T" | "GT"
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'D' | 'T' | 'GT';
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
}

/**
* @docid
* @type object
*/
export interface dxPivotGridSummaryCell {
    /**
     * @docid
     * @publicName child(direction, fieldValue)
     * @param1 direction:string
     * @param2 fieldValue:number|string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    child(direction: string, fieldValue: number | string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName children(direction)
     * @param1 direction:string
     * @return Array<dxPivotGridSummaryCell>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    children(direction: string): Array<dxPivotGridSummaryCell>;
    /**
     * @docid
     * @publicName field(area)
     * @param1 area:string
     * @return PivotGridDataSourceOptions.fields
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    field(area: string): PivotGridDataSourceField;
    /**
     * @docid
     * @publicName grandTotal()
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grandTotal(): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName grandTotal(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grandTotal(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName isPostProcessed(field)
     * @param1 field:PivotGridDataSourceOptions.fields|string
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isPostProcessed(field: PivotGridDataSourceField | string): boolean;
    /**
     * @docid
     * @publicName next(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    next(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName next(direction, allowCrossGroup)
     * @param1 direction:string
     * @param2 allowCrossGroup:bool
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    next(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName parent(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    parent(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName prev(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    prev(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName prev(direction, allowCrossGroup)
     * @param1 direction:string
     * @param2 allowCrossGroup:bool
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    prev(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName slice(field, value)
     * @param1 field:PivotGridDataSourceOptions.fields
     * @param2 value:number|string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    slice(field: PivotGridDataSourceField, value: number | string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName value()
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value(): any;
    /**
     * @docid
     * @publicName value(field)
     * @param1 field:PivotGridDataSourceOptions.fields|string
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value(field: PivotGridDataSourceField | string): any;
    /**
     * @docid
     * @publicName value(field, postProcessed)
     * @param1 field:PivotGridDataSourceOptions.fields|string
     * @param2 postProcessed:boolean
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value(field: PivotGridDataSourceField | string, postProcessed: boolean): any;
    /**
     * @docid
     * @publicName value(postProcessed)
     * @param1 postProcessed:boolean
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value(postProcessed: boolean): any;
}

declare global {
interface JQuery {
    dxPivotGrid(): JQuery;
    dxPivotGrid(options: "instance"): dxPivotGrid;
    dxPivotGrid(options: string): any;
    dxPivotGrid(options: string, ...params: any[]): any;
    dxPivotGrid(options: dxPivotGridOptions): JQuery;
}
}
export type Options = dxPivotGridOptions;

/** @deprecated use Options instead */
export type IOptions = dxPivotGridOptions;
