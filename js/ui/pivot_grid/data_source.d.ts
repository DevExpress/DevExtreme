import {
    DxPromise,
} from '../../core/utils/deferred';

import Store, {
    StoreOptions,
} from '../../data/abstract_store';

import DataSource from '../../data/data_source';

import {
    Format,
  } from '../../localization';

import XmlaStore, {
    XmlaStoreOptions,
} from './xmla_store';

import {
    SortOrder,
    FilterType,
    SummaryType,
    PivotGridDataType,
    PivotGridGroupInterval,
    PivotGridArea,
    PivotGridSortBy,
    PivotGridSummaryDisplayMode,
    PivotGridRunningTotalMode,
    PivotGridStoreType,
} from '../../docEnums';

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
interface dxPivotGridSummaryCell {
    /**
     * @docid
     * @publicName child(direction, fieldValue)
     * @param1 direction:string
     * @param2 fieldValue:number|string
     * @return dxPivotGridSummaryCell
     * @public
     */
    child(direction: string, fieldValue: number | string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName children(direction)
     * @param1 direction:string
     * @return Array<dxPivotGridSummaryCell>
     * @public
     */
    children(direction: string): Array<dxPivotGridSummaryCell>;
    /**
     * @docid
     * @publicName field(area)
     * @param1 area:string
     * @return PivotGridDataSourceOptions.fields
     * @public
     */
    field(area: string): Field;
    /**
     * @docid
     * @publicName grandTotal()
     * @return dxPivotGridSummaryCell
     * @public
     */
    grandTotal(): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName grandTotal(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @public
     */
    grandTotal(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName isPostProcessed(field)
     * @param1 field:PivotGridDataSourceOptions.fields|string
     * @return boolean
     * @public
     */
    isPostProcessed(field: Field | string): boolean;
    /**
     * @docid
     * @publicName next(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @public
     */
    next(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName next(direction, allowCrossGroup)
     * @param1 direction:string
     * @param2 allowCrossGroup:bool
     * @return dxPivotGridSummaryCell
     * @public
     */
    next(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName parent(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @public
     */
    parent(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName prev(direction)
     * @param1 direction:string
     * @return dxPivotGridSummaryCell
     * @public
     */
    prev(direction: string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName prev(direction, allowCrossGroup)
     * @param1 direction:string
     * @param2 allowCrossGroup:bool
     * @return dxPivotGridSummaryCell
     * @public
     */
    prev(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName slice(field, value)
     * @param1 field:PivotGridDataSourceOptions.fields
     * @param2 value:number|string
     * @return dxPivotGridSummaryCell
     * @public
     */
    slice(field: Field, value: number | string): dxPivotGridSummaryCell;
    /**
     * @docid
     * @publicName value()
     * @return any
     * @public
     */
    value(): any;
    /**
     * @docid
     * @publicName value(field)
     * @param1 field:PivotGridDataSourceOptions.fields|string
     * @return any
     * @public
     */
    value(field: Field | string): any;
    /**
     * @docid
     * @publicName value(field, postProcessed)
     * @param1 field:PivotGridDataSourceOptions.fields|string
     * @param2 postProcessed:boolean
     * @return any
     * @public
     */
    value(field: Field | string, postProcessed: boolean): any;
    /**
     * @docid
     * @publicName value(postProcessed)
     * @param1 postProcessed:boolean
     * @return any
     * @public
     */
    value(postProcessed: boolean): any;
}

/** @namespace DevExpress.data */
export interface PivotGridDataSourceOptions {
    /**
     * @docid
     * @type Array<Object>
     * @default undefined
     * @public
     */
    fields?: Array<Field>;
    /**
     * @docid
     * @type Filter expression
     * @public
     */
    filter?: string | Array<any> | Function;
    /**
     * @docid
     * @action
     * @public
     */
    onChanged?: Function;
    /**
     * @docid
     * @type_function_param1 fields:Array<PivotGridDataSourceOptions.fields>
     * @action
     * @public
     */
    onFieldsPrepared?: ((fields: Array<Field>) => void);
    /**
     * @docid
     * @type_function_param1 error:Object
     * @action
     * @public
     */
    onLoadError?: ((error: any) => void);
    /**
     * @docid
     * @action
     * @public
     */
    onLoadingChanged?: ((isLoading: boolean) => void);
    /**
     * @docid
     * @default false
     * @public
     */
    paginate?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    remoteOperations?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    retrieveFields?: boolean;
    /**
     * @docid
     * @public
     */
    store?: Store | StoreOptions | XmlaStore | XmlaStoreOptions | Array<{
      /**
       * @docid
       */
      type?: PivotGridStoreType;
    }> | {
      /**
       * @docid
       */
      type?: PivotGridStoreType;
    };
}

/**
 * @public
 * @namespace DevExpress.data.PivotGridDataSource
 */
export type Field = PivotGridDataSourceField;

/**
 * @namespace DevExpress.data
 * @deprecated Use Field instead
 */
export interface PivotGridDataSourceField {
    /**
     * @docid PivotGridDataSourceOptions.fields.allowCrossGroupCalculation
     * @default false
     * @public
     */
    allowCrossGroupCalculation?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.allowExpandAll
     * @default false
     * @public
     */
    allowExpandAll?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.allowFiltering
     * @default false
     * @public
     */
    allowFiltering?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.allowSorting
     * @default false
     * @public
     */
    allowSorting?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.allowSortingBySummary
     * @default false
     * @public
     */
    allowSortingBySummary?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.area
     * @type PivotGridArea
     * @default undefined
     * @acceptValues undefined
     * @public
     */
    area?: PivotGridArea | undefined;
    /**
     * @docid PivotGridDataSourceOptions.fields.areaIndex
     * @default undefined
     * @public
     */
    areaIndex?: number;
    /**
     * @docid PivotGridDataSourceOptions.fields.calculateCustomSummary
     * @public
     */
    calculateCustomSummary?: ((options: { summaryProcess?: string; value?: any; totalValue?: any }) => void);
    /**
     * @docid PivotGridDataSourceOptions.fields.calculateSummaryValue
     * @default undefined
     * @public
     */
    calculateSummaryValue?: ((e: dxPivotGridSummaryCell) => number);
    /**
     * @docid PivotGridDataSourceOptions.fields.caption
     * @default undefined
     * @public
     */
    caption?: string;
    /**
     * @docid PivotGridDataSourceOptions.fields.customizeText
     * @type_function_param1_field1 value:string|number|date
     * @public
     */
    customizeText?: ((cellInfo: { value?: string | number | Date; valueText?: string }) => string);
    /**
     * @docid PivotGridDataSourceOptions.fields.dataField
     * @default undefined
     * @public
     */
    dataField?: string;
    /**
     * @docid PivotGridDataSourceOptions.fields.dataType
     * @default undefined
     * @public
     */
    dataType?: PivotGridDataType;
    /**
     * @docid PivotGridDataSourceOptions.fields.displayFolder
     * @default undefined
     * @public
     */
    displayFolder?: string;
    /**
     * @docid PivotGridDataSourceOptions.fields.expanded
     * @default false
     * @public
     */
    expanded?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.filterType
     * @default 'include'
     * @public
     */
    filterType?: FilterType;
    /**
     * @docid PivotGridDataSourceOptions.fields.filterValues
     * @default undefined
     * @public
     */
    filterValues?: Array<any>;
    /**
     * @docid PivotGridDataSourceOptions.fields.format
     * @default ''
     * @public
     */
    format?: Format;
    /**
     * @docid PivotGridDataSourceOptions.fields.groupIndex
     * @default undefined
     * @public
     */
    groupIndex?: number;
    /**
     * @docid PivotGridDataSourceOptions.fields.groupInterval
     * @type docEnums.PivotGridGroupInterval|number
     * @default undefined
     * @public
     */
    groupInterval?: PivotGridGroupInterval | number;
    /**
     * @docid PivotGridDataSourceOptions.fields.groupName
     * @default undefined
     * @public
     */
    groupName?: string;
    /**
     * @docid PivotGridDataSourceOptions.fields.headerFilter
     * @public
     */
    headerFilter?: { allowSearch?: boolean; height?: number; width?: number };
    /**
     * @docid PivotGridDataSourceOptions.fields.isMeasure
     * @default undefined
     * @public
     */
    isMeasure?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.name
     * @default undefined
     * @public
     */
    name?: string;
    /**
     * @docid PivotGridDataSourceOptions.fields.runningTotal
     * @default undefined
     * @public
     */
    runningTotal?: PivotGridRunningTotalMode;
    /**
     * @docid PivotGridDataSourceOptions.fields.selector
     * @type function(data)
     * @default undefined
     * @public
     */
    selector?: Function;
    /**
     * @docid PivotGridDataSourceOptions.fields.showGrandTotals
     * @default true
     * @public
     */
    showGrandTotals?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.showTotals
     * @default true
     * @public
     */
    showTotals?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.showValues
     * @default undefined
     * @public
     */
    showValues?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.sortBy
     * @default undefined
     * @public
     */
    sortBy?: PivotGridSortBy;
    /**
     * @docid PivotGridDataSourceOptions.fields.sortBySummaryField
     * @default undefined
     * @public
     */
    sortBySummaryField?: string;
    /**
     * @docid PivotGridDataSourceOptions.fields.sortBySummaryPath
     * @default undefined
     * @public
     */
    sortBySummaryPath?: Array<number | string>;
    /**
     * @docid PivotGridDataSourceOptions.fields.sortOrder
     * @default 'asc'
     * @public
     */
    sortOrder?: SortOrder;
    /**
     * @docid PivotGridDataSourceOptions.fields.sortingMethod
     * @default undefined
     * @public
     */
    sortingMethod?: ((a: { value?: string | number; children?: Array<any> }, b: { value?: string | number; children?: Array<any> }) => number);
    /**
     * @docid PivotGridDataSourceOptions.fields.summaryDisplayMode
     * @default undefined
     * @public
     */
    summaryDisplayMode?: PivotGridSummaryDisplayMode;
    /**
     * @docid PivotGridDataSourceOptions.fields.summaryType
     * @type docEnums.SummaryType|string
     * @default 'count'
     * @public
     */
    summaryType?: SummaryType | string;
    /**
     * @docid PivotGridDataSourceOptions.fields.visible
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid PivotGridDataSourceOptions.fields.width
     * @default undefined
     * @public
     */
    width?: number;
    /**
     * @docid PivotGridDataSourceOptions.fields.wordWrapEnabled
     * @default undefined
     * @public
     */
    wordWrapEnabled?: boolean;
}
/**
 * @docid
 * @namespace DevExpress.data
 * @public
 */
export default class PivotGridDataSource {
    constructor(options?: PivotGridDataSourceOptions)
    /**
     * @docid
     * @publicName collapseAll(id)
     * @public
     */
    collapseAll(id: number | string): void;
    /**
     * @docid
     * @publicName collapseHeaderItem(area, path)
     * @param2 path:Array<string, number, Date>
     * @public
     */
    collapseHeaderItem(area: string, path: Array<string | number | Date>): void;
    /**
     * @docid
     * @publicName createDrillDownDataSource(options)
     * @param1_field1 columnPath:Array<string, number, Date>
     * @param1_field2 rowPath:Array<string, number, Date>
     * @public
     */
    createDrillDownDataSource(options: { columnPath?: Array<string | number | Date>; rowPath?: Array<string | number | Date>; dataIndex?: number; maxRowCount?: number; customColumns?: Array<string> }): DataSource;
    /**
     * @docid
     * @publicName dispose()
     * @public
     */
    dispose(): void;
    /**
     * @docid
     * @publicName expandAll(id)
     * @public
     */
    expandAll(id: number | string): void;
    /**
     * @docid
     * @publicName expandHeaderItem(area, path)
     * @param2 path:Array<Object>
     * @public
     */
    expandHeaderItem(area: string, path: Array<any>): void;
    /**
     * @docid
     * @publicName field(id)
     * @return object
     * @public
     */
    field(id: number | string): any;
    /**
     * @docid
     * @publicName field(id, options)
     * @param2 options:object
     * @public
     */
    field(id: number | string, options: any): void;
    /**
     * @docid
     * @publicName fields()
     * @return Array<PivotGridDataSourceOptions.fields>
     * @public
     */
    fields(): Array<Field>;
    /**
     * @docid
     * @publicName fields(fields)
     * @param1 fields:Array<PivotGridDataSourceOptions.fields>
     * @public
     */
    fields(fields: Array<Field>): void;
    /**
     * @docid
     * @publicName filter()
     * @return object
     * @public
     */
    filter(): any;
    /**
     * @docid
     * @publicName filter(filterExpr)
     * @param1 filterExpr:object
     * @public
     */
    filter(filterExpr: any): void;
    /**
     * @docid
     * @publicName getAreaFields(area, collectGroups)
     * @return Array<PivotGridDataSourceOptions.fields>
     * @public
     */
    getAreaFields(area: string, collectGroups: boolean): Array<Field>;
    /**
     * @docid
     * @publicName getData()
     * @return object
     * @public
     */
    getData(): any;
    /**
     * @docid
     * @publicName isLoading()
     * @public
     */
    isLoading(): boolean;
    /**
     * @docid
     * @publicName load()
     * @return Promise<any>
     * @public
     */
    load(): DxPromise<any>;
    /**
     * @docid
     * @publicName off(eventName)
     * @param1 eventName:string
     * @return this
     * @public
     */
    off(eventName: EventName): this;
    /**
     * @docid
     * @publicName off(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @public
     */
    off(eventName: EventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(eventName, eventHandler)
     * @param1 eventName:string
     * @param2 eventHandler:function
     * @return this
     * @public
     */
    on(eventName: EventName, eventHandler: Function): this;
    /**
     * @docid
     * @publicName on(events)
     * @param1 events:object
     * @return this
     * @public
     */
    on(events: { [key in EventName]?: Function }): this;
    /**
     * @docid
     * @publicName reload()
     * @return Promise<any>
     * @public
     */
    reload(): DxPromise<any>;
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
}

type EventName = 'changed' | 'fieldsPrepared' | 'loadError' | 'loadingChanged';
