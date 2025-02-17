import {
    DxPromise,
} from '../../core/utils/deferred';

import {
    DataSource,
    Store,
    StoreOptions,
} from '../../common/data';

import {
    Format,
  } from '../../localization';

import XmlaStore, {
    XmlaStoreOptions,
} from './xmla_store';

import {
    SortOrder,
} from '../../common';

import {
    FilterType,
    HeaderFilterSearchConfig,
    SummaryType,
} from '../../common/grids';

export {
    FilterType,
    SortOrder,
    SummaryType,
};

export type PivotGridArea = 'column' | 'data' | 'filter' | 'row';
export type PivotGridDataType = 'date' | 'number' | 'string';
export type PivotGridGroupInterval = 'day' | 'dayOfWeek' | 'month' | 'quarter' | 'year';
export type PivotGridRunningTotalMode = 'column' | 'row';
export type PivotGridSortBy = 'displayText' | 'value' | 'none';
export type PivotGridStoreType = 'array' | 'local' | 'odata' | 'xmla';
export type PivotGridSummaryDisplayMode = 'absoluteVariation' | 'percentOfColumnGrandTotal' | 'percentOfColumnTotal' | 'percentOfGrandTotal' | 'percentOfRowGrandTotal' | 'percentOfRowTotal' | 'percentVariation';

/**
 * An object exposing methods that manipulate a summary cell and provide access to its neighboring cells.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPivotGridSummaryCell {
    /**
     * Gets the child cell in a specified direction.
     */
    child(direction: string, fieldValue: number | string): dxPivotGridSummaryCell;
    /**
     * Gets all child cells in a specified direction.
     */
    children(direction: string): Array<dxPivotGridSummaryCell>;
    /**
     * Gets a pivot grid field that corresponds to the summary cell.
     */
    field(area: string): Field;
    /**
     * Gets the Grand Total of the entire pivot grid.
     */
    grandTotal(): dxPivotGridSummaryCell;
    /**
     * Gets a partial Grand Total cell of a row or column.
     */
    grandTotal(direction: string): dxPivotGridSummaryCell;
    /**
     * Indicates whether the summaryDisplayMode or calculateSummaryValue post-processed the summary value.
     */
    isPostProcessed(field: Field | string): boolean;
    /**
     * Gets the cell next to the current one in a specified direction.
     */
    next(direction: string): dxPivotGridSummaryCell;
    /**
     * Gets the cell next to current in a specified direction.
     */
    next(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * Gets the parent cell in a specified direction.
     */
    parent(direction: string): dxPivotGridSummaryCell;
    /**
     * Gets the cell prior to the current one in a specified direction.
     */
    prev(direction: string): dxPivotGridSummaryCell;
    /**
     * Gets the cell previous to current in a specified direction.
     */
    prev(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * Gets the cell located by the path of the source cell with one field value changed.
     */
    slice(field: Field, value: number | string): dxPivotGridSummaryCell;
    /**
     * Gets the summary cell value.
     */
    value(): any;
    /**
     * Gets the value of any field associated with the summary cell.
     */
    value(field: Field | string): any;
    /**
     * Gets the value of any field associated with the summary cell.
     */
    value(field: Field | string, postProcessed: boolean): any;
    /**
     * Gets the summary cell value.
     */
    value(postProcessed: boolean): any;
}

export type Options = PivotGridDataSourceOptions;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface PivotGridDataSourceOptions {
    /**
     * Configures pivot grid fields.
     */
    fields?: Array<Field>;
    /**
     * Specifies data filtering conditions. Cannot be used with an XmlaStore.
     */
    filter?: string | Array<any> | Function;
    /**
     * A function that is executed after data is successfully loaded.
     */
    onChanged?: Function;
    /**
     * A function that is executed when all fields are loaded from the store and they are ready to be displayed in the PivotGrid.
     */
    onFieldsPrepared?: ((fields: Array<Field>) => void);
    /**
     * A function that is executed when data loading fails.
     */
    onLoadError?: ((error: any) => void);
    /**
     * A function that is executed when the data loading status changes.
     */
    onLoadingChanged?: ((isLoading: boolean) => void);
    /**
     * Specifies whether the PivotGridDataSource should load data in portions. Can be used only with an XmlaStore.
     */
    paginate?: boolean;
    /**
     * Specifies whether the data processing operations (filtering, grouping, summary calculation) should be performed on the server.
     */
    remoteOperations?: boolean;
    /**
     * Specifies whether to auto-generate pivot grid fields from the store&apos;s data.
     */
    retrieveFields?: boolean;
    /**
     * Configures the DataSource&apos;s underlying store.
     */
    store?: Store | StoreOptions | XmlaStore | (XmlaStoreOptions & { type: 'xmla' }) | Array<{
      /**
       * Specifies the PivotGridDataSource&apos;s storage type.
       */
      type?: PivotGridStoreType;
    }> | {
      /**
       * Specifies the PivotGridDataSource&apos;s storage type.
       */
      type?: PivotGridStoreType;
    };
}

/**
 * Configures pivot grid fields.
 */
export type Field = PivotGridDataSourceField;

/**
 * @deprecated Use Field instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface PivotGridDataSourceField {
    /**
     * Specifies whether to take neighboring groups&apos; summary values into account when calculating a running total and absolute or percent variation.
     */
    allowCrossGroupCalculation?: boolean;
    /**
     * Allows users to expand/collapse all header items within the same header level. Ignored if the PivotGridDataSource&apos;s paginate property is true.
     */
    allowExpandAll?: boolean;
    /**
     * Specifies whether a user can filter the field&apos;s values.
     */
    allowFiltering?: boolean;
    /**
     * Specifies whether a user can change the field&apos;s sorting.
     */
    allowSorting?: boolean;
    /**
     * Allows users to sort the pivot grid by summary values instead of field values. Ignored if the PivotGridDataSource&apos;s paginate property is true.
     */
    allowSortingBySummary?: boolean;
    /**
     * Specifies the field&apos;s area.
     */
    area?: PivotGridArea | undefined;
    /**
     * Specifies the field&apos;s order among the other fields in the same area. Corresponds to the field&apos;s order in the fields array by default.
     */
    areaIndex?: number;
    /**
     * Specifies a custom aggregate function. Applies only if the summaryType is &apos;custom&apos; and the remoteOperations is false. Cannot be used with an XmlaStore.
     */
    calculateCustomSummary?: ((options: { summaryProcess?: string; value?: any; totalValue?: any }) => void);
    /**
     * Specifies a custom post-processing function for summary values.
     */
    calculateSummaryValue?: ((e: dxPivotGridSummaryCell) => number | null);
    /**
     * Specifies the field&apos;s caption to be displayed in the field chooser and on the field panel.
     */
    caption?: string;
    /**
     * Customizes the text displayed in summary cells.
     */
    customizeText?: ((cellInfo: { value?: string | number | Date; valueText?: string }) => string);
    /**
     * Specifies which data source field provides data for the pivot grid field.
     */
    dataField?: string;
    /**
     * Casts field values to a specific data type.
     */
    dataType?: PivotGridDataType;
    /**
     * Specifies the name of the directory in which the field is located when displayed in the field chooser.
     */
    displayFolder?: string;
    /**
     * Specifies whether to expand all items within the field&apos;s header level.
     */
    expanded?: boolean;
    /**
     * Specifies whether a user changes the current filter by including (selecting) or excluding (clearing the selection of) values.
     */
    filterType?: FilterType;
    /**
     * Specifies the values by which the field is filtered.
     */
    filterValues?: Array<any>;
    /**
     * Formats field values before they are displayed.
     */
    format?: Format;
    /**
     * Specifies the field&apos;s index within its group.
     */
    groupIndex?: number;
    /**
     * Specifies how the field&apos;s values are combined into groups for the headers. Cannot be used with an XmlaStore.
     */
    groupInterval?: PivotGridGroupInterval | number;
    /**
     * Specifies the name of the field&apos;s group.
     */
    groupName?: string;
    /**
     * Configures the field&apos;s header filter.
     */
    headerFilter?: {
        allowSearch?: boolean;
        /**
         * Specifies whether a &apos;Select All&apos; option is available to users.
         */
        allowSelectAll?: boolean;
        height?: number;
        /**
         * Configures the header filter&apos;s search functionality.
         */
        search?: HeaderFilterSearchConfig;
        width?: number;
    };
    /**
     * Specifies whether the field should be treated as a measure (a field providing data for calculation).
     */
    isMeasure?: boolean;
    /**
     * Specifies the field&apos;s identifier.
     */
    name?: string;
    /**
     * Specifies whether to calculate the running total by rows or by columns.
     */
    runningTotal?: PivotGridRunningTotalMode;
    /**
     * Specifies a function that combines the field&apos;s values into groups for the headers. Cannot be used with an XmlaStore or remote operations.
     */
    selector?: Function;
    /**
     * Specifies whether to display the field&apos;s grand totals. Applies only if the field is in the data area.
     */
    showGrandTotals?: boolean;
    /**
     * Specifies whether to display the field&apos;s totals.
     */
    showTotals?: boolean;
    /**
     * Specifies whether to display the field&apos;s summary values. Applies only if the field is in the data area. Inherits the showTotals&apos; value by default.
     */
    showValues?: boolean;
    /**
     * Specifies how the field&apos;s values in the headers should be sorted.
     */
    sortBy?: PivotGridSortBy;
    /**
     * Sorts the field&apos;s values in the headers by the specified measure&apos;s summary values. Accepts the measure&apos;s name, caption, dataField, or index in the fields array.
     */
    sortBySummaryField?: string;
    /**
     * Specifies a path to the column or row whose summary values should be used to sort the field&apos;s values in the headers.
     */
    sortBySummaryPath?: Array<number | string>;
    /**
     * Specifies the field values&apos; sorting order.
     */
    sortOrder?: SortOrder;
    /**
     * Specifies a custom comparison function that sorts the field&apos;s values in the headers.
     */
    sortingMethod?: ((a: { value?: string | number; children?: Array<any> }, b: { value?: string | number; children?: Array<any> }) => number);
    /**
     * Specifies a predefined post-processing function. Does not apply when the calculateSummaryValue property is set.
     */
    summaryDisplayMode?: PivotGridSummaryDisplayMode;
    /**
     * Specifies how to aggregate the field&apos;s data. Cannot be used with an XmlaStore.
     */
    summaryType?: SummaryType | string;
    /**
     * Specifies whether the field is visible in the pivot grid and field chooser.
     */
    visible?: boolean;
    /**
     * Specifies the field&apos;s width in pixels when the field is displayed in the pivot grid.
     */
    width?: number;
    /**
     * Specifies whether text that does not fit into a header item should be wrapped.
     */
    wordWrapEnabled?: boolean;
}
/**
 * The PivotGridDataSource is an object that provides an API for processing data from an underlying store. This object is used in the PivotGrid UI component.
 */
export default class PivotGridDataSource {
    constructor(options?: Options);
    /**
     * Collapses all header items of a field with the specified identifier.
     */
    collapseAll(id: number | string): void;
    /**
     * Collapses a specific header item.
     */
    collapseHeaderItem(area: string, path: Array<string | number | Date>): void;
    /**
     * Provides access to the facts that were used to calculate a specific summary value.
     */
    createDrillDownDataSource(options: { columnPath?: Array<string | number | Date>; rowPath?: Array<string | number | Date>; dataIndex?: number; maxRowCount?: number; customColumns?: Array<string> }): DataSource;
    /**
     * Disposes of all the resources allocated to the PivotGridDataSource instance.
     */
    dispose(): void;
    /**
     * Expands all the header items of a field with the specified identifier.
     */
    expandAll(id: number | string): void;
    /**
     * Expands a specific header item.
     */
    expandHeaderItem(area: string, path: Array<any>): void;
    /**
     * Gets all the properties of a field with the specified identifier.
     */
    field(id: number | string): any;
    /**
     * Updates field options&apos; values.
     */
    field(id: number | string, options: any): void;
    /**
     * Gets all the fields including those generated automatically.
     */
    fields(): Array<Field>;
    /**
     * Specifies a new fields collection.
     */
    fields(fields: Array<Field>): void;
    /**
     * Gets the filter property&apos;s value. Does not affect an XmlaStore.
     */
    filter(): any;
    /**
     * Sets the filter property&apos;s value. Does not affect an XmlaStore.
     */
    filter(filterExpr: any): void;
    /**
     * Gets all the fields within an area.
     */
    getAreaFields(area: string, collectGroups: boolean): Array<Field>;
    /**
     * Gets the loaded data. Another data portion is loaded every time a header item is expanded.
     */
    getData(): any;
    /**
     * Checks whether the PivotGridDataSource is loading data.
     */
    isLoading(): boolean;
    /**
     * Starts loading data.
     */
    load(): DxPromise<any>;
    /**
     * Detaches all event handlers from a single event.
     */
    off(eventName: EventName): this;
    /**
     * Detaches a particular event handler from a single event.
     */
    off(eventName: EventName, eventHandler: Function): this;
    /**
     * Subscribes to an event.
     */
    on(eventName: EventName, eventHandler: Function): this;
    /**
     * Subscribes to events.
     */
    on(events: { [key in EventName]?: Function }): this;
    /**
     * Clears the loaded PivotGridDataSource data and calls the load() method.
     */
    reload(): DxPromise<any>;
    /**
     * Gets the current PivotGridDataSource state. Part of the PivotGrid UI component&apos;s state storing feature.
     */
    state(): any;
    /**
     * Sets the PivotGridDataSource state. Part of the PivotGrid UI component&apos;s state storing feature.
     */
    state(state: any): void;
}

type EventName = 'changed' | 'fieldsPrepared' | 'loadError' | 'loadingChanged';
