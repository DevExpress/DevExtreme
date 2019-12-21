import {
    JQueryEventObject,
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events';

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
     * @docid dxPivotGridOptions.allowExpandAll
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowExpandAll?: boolean;
    /**
     * @docid dxPivotGridOptions.allowFiltering
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowFiltering?: boolean;
    /**
     * @docid dxPivotGridOptions.allowSorting
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSorting?: boolean;
    /**
     * @docid dxPivotGridOptions.allowSortingBySummary
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSortingBySummary?: boolean;
    /**
     * @docid dxPivotGridOptions.dataFieldArea
     * @type Enums.PivotGridDataFieldArea
     * @default "column"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataFieldArea?: 'column' | 'row';
    /**
     * @docid dxPivotGridOptions.dataSource
     * @type Array<Object>|PivotGridDataSource|PivotGridDataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: Array<any> | PivotGridDataSource | PivotGridDataSourceOptions;
    /**
     * @docid dxPivotGridOptions.export
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    export?: { enabled?: boolean, fileName?: string, ignoreExcelErrors?: boolean, proxyUrl?: string };
    /**
     * @docid dxPivotGridOptions.fieldChooser
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldChooser?: { allowSearch?: boolean, applyChangesMode?: 'instantly' | 'onDemand', enabled?: boolean, height?: number, layout?: 0 | 1 | 2, searchTimeout?: number, texts?: { allFields?: string, columnFields?: string, dataFields?: string, filterFields?: string, rowFields?: string }, title?: string, width?: number };
    /**
     * @docid dxPivotGridOptions.fieldPanel
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldPanel?: { allowFieldDragging?: boolean, showColumnFields?: boolean, showDataFields?: boolean, showFilterFields?: boolean, showRowFields?: boolean, texts?: { columnFieldArea?: string, dataFieldArea?: string, filterFieldArea?: string, rowFieldArea?: string }, visible?: boolean };
    /**
     * @docid dxPivotGridOptions.headerFilter
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerFilter?: { allowSearch?: boolean, height?: number, searchTimeout?: number, showRelevantValues?: boolean, texts?: { cancel?: string, emptyValue?: string, ok?: string }, width?: number };
    /**
     * @docid dxPivotGridOptions.hideEmptySummaryCells
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideEmptySummaryCells?: boolean;
    /**
     * @docid dxPivotGridOptions.loadPanel
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loadPanel?: { enabled?: boolean, height?: number, indicatorSrc?: string, showIndicator?: boolean, showPane?: boolean, text?: string, width?: number };
    /**
     * @docid dxPivotGridOptions.onCellClick
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
     * @type_function_param1_field12 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field13 event:event
     * @type_function_param1_field14 cancel:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellClick?: ((e: { component?: dxPivotGrid, element?: dxElement, model?: any, area?: string, cellElement?: dxElement, cell?: dxPivotGridPivotGridCell, rowIndex?: number, columnIndex?: number, columnFields?: Array<PivotGridDataSourceField>, rowFields?: Array<PivotGridDataSourceField>, dataFields?: Array<PivotGridDataSourceField>, jQueryEvent?: JQueryEventObject, event?: event, cancel?: boolean }) => any);
    /**
     * @docid dxPivotGridOptions.onCellPrepared
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
     * @docid dxPivotGridOptions.onContextMenuPreparing
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
     * @docid dxPivotGridOptions.onExported
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onExported?: ((e: { component?: dxPivotGrid, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxPivotGridOptions.onExporting
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
     * @docid dxPivotGridOptions.onFileSaving
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
     */
    onFileSaving?: ((e: { component?: dxPivotGrid, element?: dxElement, fileName?: string, format?: string, data?: Blob, cancel?: boolean }) => any);
    /**
     * @docid dxPivotGridOptions.rowHeaderLayout
     * @type Enums.PivotGridRowHeadersLayout
     * @default "standard"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowHeaderLayout?: 'standard' | 'tree';
    /**
     * @docid dxPivotGridOptions.scrolling
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrolling?: { mode?: 'standard' | 'virtual', useNative?: boolean | 'auto' };
    /**
     * @docid dxPivotGridOptions.showBorders
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showBorders?: boolean;
    /**
     * @docid dxPivotGridOptions.showColumnGrandTotals
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnGrandTotals?: boolean;
    /**
     * @docid dxPivotGridOptions.showColumnTotals
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showColumnTotals?: boolean;
    /**
     * @docid dxPivotGridOptions.showRowGrandTotals
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRowGrandTotals?: boolean;
    /**
     * @docid dxPivotGridOptions.showRowTotals
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRowTotals?: boolean;
    /**
     * @docid dxPivotGridOptions.showTotalsPrior
     * @type Enums.PivotGridTotalsDisplayMode
     * @default "none"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showTotalsPrior?: 'both' | 'columns' | 'none' | 'rows';
    /**
     * @docid dxPivotGridOptions.stateStoring
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stateStoring?: { customLoad?: (() => Promise<any> | JQueryPromise<any>), customSave?: ((state: any) => any), enabled?: boolean, savingTimeout?: number, storageKey?: string, type?: 'custom' | 'localStorage' | 'sessionStorage' };
    /**
     * @docid dxPivotGridOptions.texts
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: { collapseAll?: string, dataNotAvailable?: string, expandAll?: string, exportToExcel?: string, grandTotal?: string, noData?: string, removeAllSorting?: string, showFieldChooser?: string, sortColumnBySummary?: string, sortRowBySummary?: string, total?: string };
    /**
     * @docid dxPivotGridOptions.wordWrapEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    wordWrapEnabled?: boolean;
}
/**
 * @docid dxPivotGrid
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
     * @docid dxPivotGridMethods.bindChart
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
     * @docid dxPivotGridMethods.exportToExcel
     * @publicName exportToExcel()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    exportToExcel(): void;
    /**
     * @docid dxPivotGridMethods.getDataSource
     * @publicName getDataSource()
     * @return PivotGridDataSource
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getDataSource(): PivotGridDataSource;
    /**
     * @docid dxPivotGridMethods.getFieldChooserPopup
     * @publicName getFieldChooserPopup()
     * @return dxPopup
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getFieldChooserPopup(): dxPopup;
    /**
     * @docid dxPivotGridMethods.updateDimensions
     * @publicName updateDimensions()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): void;
}

export interface dxPivotGridPivotGridCell {
    /**
     * @docid dxPivotGridPivotGridCell.columnPath
     * @type Array<string, number, Date>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnPath?: Array<string | number | Date>;
    /**
     * @docid dxPivotGridPivotGridCell.columnType
     * @acceptValues "D" | "T" | "GT"
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columnType?: 'D' | 'T' | 'GT';
    /**
     * @docid dxPivotGridPivotGridCell.dataIndex
     * @type number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataIndex?: number;
    /**
     * @docid dxPivotGridPivotGridCell.expanded
     * @type boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expanded?: boolean;
    /**
     * @docid dxPivotGridPivotGridCell.path
     * @type Array<string, number, Date>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    path?: Array<string | number | Date>;
    /**
     * @docid dxPivotGridPivotGridCell.rowPath
     * @type Array<string, number, Date>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowPath?: Array<string | number | Date>;
    /**
     * @docid dxPivotGridPivotGridCell.rowType
     * @acceptValues "D" | "T" | "GT"
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rowType?: 'D' | 'T' | 'GT';
    /**
     * @docid dxPivotGridPivotGridCell.text
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid dxPivotGridPivotGridCell.type
     * @acceptValues "D" | "T" | "GT"
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'D' | 'T' | 'GT';
    /**
     * @docid dxPivotGridPivotGridCell.value
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
}

export interface dxPivotGridSummaryCell {
    /**
     * @docid dxPivotGridSummaryCell.child
     * @publicName child(direction, fieldValue)
     * @param1 direction:string
     * @param2 fieldValue:number|string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    child(direction: string, fieldValue: number | string): dxPivotGridSummaryCell;
    /**
     * @docid dxPivotGridSummaryCell.children
     * @publicName children(direction)
     * @param1 direction:string
     * @return Array<dxPivotGridSummaryCell>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    children(direction: string): Array<dxPivotGridSummaryCell>;
    /**
     * @docid dxPivotGridSummaryCell.field
     * @publicName field(area)
     * @param1 area:string
     * @return PivotGridDataSourceOptions.fields
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    field(area: string): PivotGridDataSourceField;
    /**
     * @docid dxPivotGridSummaryCell.grandTotal
     * @publicName grandTotal()
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grandTotal(): dxPivotGridSummaryCell;
    /**
     * @docid dxPivotGridSummaryCell.grandTotal
     * @publicName grandTotal(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grandTotal(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid dxPivotGridSummaryCell.isPostProcessed
     * @publicName isPostProcessed(field)
     * @param1 field:PivotGridDataSourceOptions.fields|string
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isPostProcessed(field: PivotGridDataSourceField | string): boolean;
    /**
     * @docid dxPivotGridSummaryCell.next
     * @publicName next(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    next(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid dxPivotGridSummaryCell.next
     * @publicName next(direction, allowCrossGroup)
     * @param1 direction:string
     * @param2 allowCrossGroup:bool
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    next(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * @docid dxPivotGridSummaryCell.parent
     * @publicName parent(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    parent(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid dxPivotGridSummaryCell.prev
     * @publicName prev(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    prev(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid dxPivotGridSummaryCell.prev
     * @publicName prev(direction, allowCrossGroup)
     * @param1 direction:string
     * @param2 allowCrossGroup:bool
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    prev(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * @docid dxPivotGridSummaryCell.slice
     * @publicName slice(field, value)
     * @param1 field:PivotGridDataSourceOptions.fields
     * @param2 value:number|string
     * @return dxPivotGridSummaryCell
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    slice(field: PivotGridDataSourceField, value: number | string): dxPivotGridSummaryCell;
    /**
     * @docid dxPivotGridSummaryCell.value
     * @publicName value()
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value(): any;
    /**
     * @docid dxPivotGridSummaryCell.value
     * @publicName value(field)
     * @param1 field:PivotGridDataSourceOptions.fields|string
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value(field: PivotGridDataSourceField | string): any;
    /**
     * @docid dxPivotGridSummaryCell.value
     * @publicName value(field, postProcessed)
     * @param1 field:PivotGridDataSourceOptions.fields|string
     * @param2 postProcessed:boolean
     * @return any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value(field: PivotGridDataSourceField | string, postProcessed: boolean): any;
    /**
     * @docid dxPivotGridSummaryCell.value
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