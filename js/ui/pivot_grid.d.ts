import {
    DxElement,
} from '../core/element';

import {
    Cancelable,
    NativeEventInfo,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import PivotGridDataSource, {
    Field,
    Options as PivotGridDataSourceOptions,
    dxPivotGridSummaryCell as SummaryCell,
} from './pivot_grid/data_source';

import dxPopup from './popup';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    Mode,
    FieldChooserLayout,
    ScrollMode,
} from '../common';

import {
    ApplyChangesMode,
    StateStoreType,
} from '../common/grids';

export {
    ApplyChangesMode,
    FieldChooserLayout,
    Mode,
    ScrollMode,
    StateStoreType,
};

/** @public */
export type PivotGridDataFieldArea = 'column' | 'row';
/** @public */
export type PivotGridRowHeaderLayout = 'standard' | 'tree';
/** @public */
export type PivotGridTotalDisplayMode = 'both' | 'columns' | 'none' | 'rows';

/** @public */
export type CellClickEvent = Cancelable & NativeEventInfo<dxPivotGrid, MouseEvent | PointerEvent> & {
    readonly area?: string;
    readonly cellElement?: DxElement;
    readonly cell?: Cell;
    readonly rowIndex?: number;
    readonly columnIndex?: number;
    readonly columnFields?: Array<Field>;
    readonly rowFields?: Array<Field>;
    readonly dataFields?: Array<Field>;
};

/** @public */
export type CellPreparedEvent = EventInfo<dxPivotGrid> & {
    readonly area?: string;
    readonly cellElement?: DxElement;
    readonly cell?: Cell;
    readonly rowIndex?: number;
    readonly columnIndex?: number;
};

/** @public */
export type ContentReadyEvent = EventInfo<dxPivotGrid>;

/** @public */
export type ContextMenuPreparingEvent = EventInfo<dxPivotGrid> & {
    readonly area?: string;
    readonly cell?: Cell;
    readonly cellElement?: DxElement;
    readonly columnIndex?: number;
    readonly rowIndex?: number;
    readonly dataFields?: Array<Field>;
    readonly rowFields?: Array<Field>;
    readonly columnFields?: Array<Field>;
    readonly field?: Field;
    items?: Array<any>;
};

/** @public */
export type DisposingEvent = EventInfo<dxPivotGrid>;

/** @public */
export type ExportingEvent = Cancelable & EventInfo<dxPivotGrid> & {
    fileName?: string;
};

/** @public */
export type InitializedEvent = InitializedEventInfo<dxPivotGrid>;

/** @public */
export type OptionChangedEvent = EventInfo<dxPivotGrid> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxPivotGridOptions extends WidgetOptions<dxPivotGrid> {
    /**
     * @docid
     * @default false
     * @public
     */
    allowExpandAll?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    allowFiltering?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    allowSorting?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    allowSortingBySummary?: boolean;
    /**
     * @docid
     * @default "column"
     * @public
     */
    dataFieldArea?: PivotGridDataFieldArea;
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: Array<any> | PivotGridDataSource | PivotGridDataSourceOptions | null;
    /**
     * @docid
     * @default true
     * @public
     */
    encodeHtml?: boolean;
    /**
     * @docid
     * @public
     */
    export?: {
      /**
       * @docid
       * @default false
       */
      enabled?: boolean;
    };
    /**
     * @docid
     * @public
     */
    fieldChooser?: {
      /**
       * @docid
       * @default false
       */
      allowSearch?: boolean;
      /**
       * @docid
       * @default "instantly"
       */
      applyChangesMode?: ApplyChangesMode;
      /**
       * @docid
       * @default true
       */
      enabled?: boolean;
      /**
       * @docid
       * @default 600
       */
      height?: number;
      /**
       * @docid
       * @default 0
       */
      layout?: FieldChooserLayout;
      /**
       * @docid
       * @default 500
       */
      searchTimeout?: number;
      /**
       * @docid
       */
      texts?: {
        /**
         * @docid
         * @default 'All Fields'
         */
        allFields?: string;
        /**
         * @docid
         * @default 'Column Fields'
         */
        columnFields?: string;
        /**
         * @docid
         * @default 'Data Fields'
         */
        dataFields?: string;
        /**
         * @docid
         * @default 'Filter Fields'
         */
        filterFields?: string;
        /**
         * @docid
         * @default 'Row Fields'
         */
        rowFields?: string;
      };
      /**
       * @docid
       * @default "Field Chooser"
       */
      title?: string;
      /**
       * @docid
       * @default 600
       */
      width?: number;
    };
    /**
     * @docid
     * @public
     */
    fieldPanel?: {
      /**
       * @docid
       * @default true
       */
      allowFieldDragging?: boolean;
      /**
       * @docid
       * @default true
       */
      showColumnFields?: boolean;
      /**
       * @docid
       * @default true
       */
      showDataFields?: boolean;
      /**
       * @docid
       * @default true
       */
      showFilterFields?: boolean;
      /**
      * @docid
      * @default true
      */
      showRowFields?: boolean;
      /**
       * @docid
       */
      texts?: {
        /**
         * @docid
         * @default "Drop Column Fields Here"
         */
        columnFieldArea?: string;
        /**
         * @docid
         * @default "Drop Data Fields Here"
         */
        dataFieldArea?: string;
        /**
         * @docid
         * @default "Drop Filter Fields Here"
         */
        filterFieldArea?: string;
        /**
         * @docid
         * @default "Drop Row Fields Here"
         */
        rowFieldArea?: string;
      };
      /**
       * @docid
       * @default false
       */
      visible?: boolean;
    };
    /**
     * @docid
     * @public
     */
    headerFilter?: {
      /**
       * @docid
       * @default false
       */
      allowSearch?: boolean;
      /**
       * @docid
       * @default 325
       */
      height?: number;
      /**
       * @docid
       * @default 500
       */
      searchTimeout?: number;
      /**
       * @docid
       * @default false
       */
      showRelevantValues?: boolean;
      /**
       * @docid
       */
      texts?: {
        /**
         * @docid
         * @default "Cancel"
         */
        cancel?: string;
        /**
         * @docid
         * @default "(Blanks)"
         */
        emptyValue?: string;
        /**
         * @docid
         * @default "Ok"
         */
        ok?: string;
      };
      /**
       * @docid
       * @default 252
       */
      width?: number;
    };
    /**
     * @docid
     * @default true
     * @public
     */
    hideEmptySummaryCells?: boolean;
    /**
     * @docid
     * @public
     */
    loadPanel?: {
      /**
       * @docid
       * @default true
       */
      enabled?: boolean;
      /**
       * @docid
       * @default 70
       */
      height?: number;
      /**
       * @docid
       * @default ""
       */
      indicatorSrc?: string;
      /**
       * @docid
       * @default false
       */
      shading?: boolean;
      /**
       * @docid
       * @default ''
       */
      shadingColor?: string;
      /**
       * @docid
       * @default true
       */
      showIndicator?: boolean;
      /**
       * @docid
       * @default true
       */
      showPane?: boolean;
      /**
       * @docid
       * @default 'Loading...'
       */
      text?: string;
      /**
       * @docid
       * @default 200
       */
      width?: number;
    };
    /**
     * @docid
     * @type_function_param1 e:Object
     * @default null
     * @type_function_param1_field component:dxPivotGrid
     * @type_function_param1_field event:event
     * @type_function_param1_field cell:dxPivotGridPivotGridCell
     * @type_function_param1_field columnFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field rowFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field dataFields:Array<PivotGridDataSourceOptions.fields>
     * @action
     * @public
     */
    onCellClick?: ((e: CellClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field cell:dxPivotGridPivotGridCell
     * @default null
     * @type_function_param1_field component:dxPivotGrid
     * @action
     * @public
     */
    onCellPrepared?: ((e: CellPreparedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:Object
     * @type_function_param1_field component:dxPivotGrid
     * @type_function_param1_field cell:dxPivotGridPivotGridCell
     * @type_function_param1_field dataFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field rowFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field columnFields:Array<PivotGridDataSourceOptions.fields>
     * @type_function_param1_field field:PivotGridDataSourceOptions.fields
     * @type_function_param1_field items:Array<Object>
     * @default null
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @default null
     * @type_function_param1_field component:dxPivotGrid
     * @action
     * @public
     */
    onExporting?: ((e: ExportingEvent) => void);
    /**
     * @docid
     * @default "standard"
     * @public
     */
    rowHeaderLayout?: PivotGridRowHeaderLayout;
    /**
     * @docid
     * @public
     */
    scrolling?: {
      /**
       * @docid
       * @default "standard"
       */
      mode?: ScrollMode;
      /**
       * @docid
       * @default "auto"
       */
      useNative?: boolean | Mode;
    };
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
    showColumnGrandTotals?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showColumnTotals?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showRowGrandTotals?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showRowTotals?: boolean;
    /**
     * @docid
     * @default "none"
     * @public
     */
    showTotalsPrior?: PivotGridTotalDisplayMode;
    /**
     * @docid
     * @public
     */
    stateStoring?: {
      /**
       * @docid
       * @type_function_return Promise<Object>
       */
      customLoad?: (() => PromiseLike<any>);
      /**
       * @docid
       * @type_function_param1 state:object
       * @type_function_return void
       */
      customSave?: ((state: any) => any);
      /**
       * @docid
       * @default false
       */
      enabled?: boolean;
      /**
       * @docid
       * @default 2000
       */
      savingTimeout?: number;
      /**
       * @docid
       * @default null
       */
      storageKey?: string;
      /**
       * @docid
       * @default "localStorage"
       */
      type?: StateStoreType;
    };
    /**
     * @docid
     * @public
     */
    texts?: {
      /**
       * @docid
       * @default 'Collapse All'
       */
      collapseAll?: string;
      /**
       * @docid
       * @default "N/A"
       */
      dataNotAvailable?: string;
      /**
       * @docid
       * @default 'Expand All'
       */
      expandAll?: string;
      /**
       * @docid
       * @default "Export to Excel file"
       */
      exportToExcel?: string;
      /**
       * @docid
       * @default 'Grand Total'
       */
      grandTotal?: string;
      /**
       * @docid
       * @default 'No data'
       */
      noData?: string;
      /**
       * @docid
       * @default 'Remove All Sorting'
       */
      removeAllSorting?: string;
      /**
       * @docid
       * @default 'Show Field Chooser'
       */
      showFieldChooser?: string;
      /**
       * @docid
       * @default 'Sort {0} by This Column'
       */
      sortColumnBySummary?: string;
      /**
       * @docid
       * @default 'Sort {0} by This Row'
       */
      sortRowBySummary?: string;
      /**
       * @docid
       * @default '{0} Total'
       */
      total?: string;
    };
    /**
     * @docid
     * @default true
     * @public
     */
    wordWrapEnabled?: boolean;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxPivotGrid extends Widget<dxPivotGridOptions> {
    /**
     * @docid
     * @publicName bindChart(chart, integrationOptions)
     * @param1 chart:string|jQuery|object
     * @param2_field processCell:function(cellData)
     * @param2_field customizeChart:function(chartOptions)
     * @param2_field customizeSeries:function(seriesName, seriesOptions)
     * @public
     */
    bindChart(chart: string | DxElement | any, integrationOptions: { inverted?: boolean; dataFieldsDisplayMode?: string; putDataFieldsInto?: string; alternateDataFields?: boolean; processCell?: Function; customizeChart?: Function; customizeSeries?: Function }): Function & null;
    /**
     * @docid
     * @publicName getDataSource()
     * @public
     */
    getDataSource(): PivotGridDataSource;
    /**
     * @docid
     * @publicName getFieldChooserPopup()
     * @public
     */
    getFieldChooserPopup(): dxPopup;
    /**
     * @docid
     * @publicName updateDimensions()
     * @public
     */
    updateDimensions(): void;
}

/**
 * @public
 * @namespace DevExpress.ui.dxPivotGrid
 */
export type Cell = dxPivotGridPivotGridCell;

/**
 * @namespace DevExpress.ui
 * @deprecated Use Cell instead
 */
export interface dxPivotGridPivotGridCell {
    /**
     * @docid
     * @public
     */
    columnPath?: Array<string | number | Date>;
    /**
     * @docid
     * @public
     */
    columnType?: 'D' | 'T' | 'GT';
    /**
     * @docid
     * @public
     */
    dataIndex?: number;
    /**
     * @docid
     * @public
     */
    expanded?: boolean;
    /**
     * @docid
     * @public
     */
    path?: Array<string | number | Date>;
    /**
     * @docid
     * @public
     */
    rowPath?: Array<string | number | Date>;
    /**
     * @docid
     * @public
     */
    rowType?: 'D' | 'T' | 'GT';
    /**
     * @docid
     * @public
     */
    text?: string;
    /**
     * @docid
     * @public
     */
    type?: 'D' | 'T' | 'GT';
    /**
     * @docid
     * @public
     */
    value?: any;
}

export type dxPivotGridSummaryCell = SummaryCell;

/** @public */
export type Properties = dxPivotGridOptions;

/** @deprecated use Properties instead */
export type Options = dxPivotGridOptions;
