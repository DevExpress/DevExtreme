import {
    DxElement,
} from '../core/element';

import {
    Cancelable,
    NativeEventInfo,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

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
    HeaderFilterSearchConfig,
    StateStoreType,
} from '../common/grids';

export {
    ApplyChangesMode,
    FieldChooserLayout,
    Mode,
    ScrollMode,
    StateStoreType,
};

export type PivotGridDataFieldArea = 'column' | 'row';
export type PivotGridRowHeaderLayout = 'standard' | 'tree';
export type PivotGridTotalDisplayMode = 'both' | 'columns' | 'none' | 'rows';

/**
 * The type of the cellClick event handler&apos;s argument.
 */
export type CellClickEvent = Cancelable & NativeEventInfo<dxPivotGrid, MouseEvent | PointerEvent> & {
    /**
     * 
     */
    readonly area?: string;
    /**
     * 
     */
    readonly cellElement?: DxElement;
    /**
     * 
     */
    readonly cell?: Cell;
    /**
     * 
     */
    readonly rowIndex?: number;
    /**
     * 
     */
    readonly columnIndex?: number;
    /**
     * 
     */
    readonly columnFields?: Array<Field>;
    /**
     * 
     */
    readonly rowFields?: Array<Field>;
    /**
     * 
     */
    readonly dataFields?: Array<Field>;
};

/**
 * The type of the cellPrepared event handler&apos;s argument.
 */
export type CellPreparedEvent = EventInfo<dxPivotGrid> & {
    /**
     * 
     */
    readonly area?: string;
    /**
     * 
     */
    readonly cellElement?: DxElement;
    /**
     * 
     */
    readonly cell?: Cell;
    /**
     * 
     */
    readonly rowIndex?: number;
    /**
     * 
     */
    readonly columnIndex?: number;
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxPivotGrid>;

/**
 * The type of the contextMenuPreparing event handler&apos;s argument.
 */
export type ContextMenuPreparingEvent = EventInfo<dxPivotGrid> & {
    /**
     * 
     */
    readonly area?: string;
    /**
     * 
     */
    readonly cell?: Cell;
    /**
     * 
     */
    readonly cellElement?: DxElement;
    /**
     * 
     */
    readonly columnIndex?: number;
    /**
     * 
     */
    readonly rowIndex?: number;
    /**
     * 
     */
    readonly dataFields?: Array<Field>;
    /**
     * 
     */
    readonly rowFields?: Array<Field>;
    /**
     * 
     */
    readonly columnFields?: Array<Field>;
    /**
     * 
     */
    readonly field?: Field;
    /**
     * 
     */
    items?: Array<any>;
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxPivotGrid>;

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent = Cancelable & EventInfo<dxPivotGrid> & {
    /**
     * 
     */
    fileName?: string;
};

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxPivotGrid>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxPivotGrid> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPivotGridOptions extends WidgetOptions<dxPivotGrid> {
    /**
     * Allows users to expand/collapse all header items within the same header level. Ignored if the PivotGridDataSource&apos;s paginate property is true.
     */
    allowExpandAll?: boolean;
    /**
     * Allows a user to filter fields by selecting or deselecting values in the popup menu.
     */
    allowFiltering?: boolean;
    /**
     * Allows an end user to change sorting properties.
     */
    allowSorting?: boolean;
    /**
     * Allows users to sort the pivot grid by summary values instead of field values. Ignored if the PivotGridDataSource&apos;s paginate property is true.
     */
    allowSortingBySummary?: boolean;
    /**
     * Specifies the area to which data field headers must belong.
     */
    dataFieldArea?: PivotGridDataFieldArea;
    /**
     * Binds the UI component to data.
     */
    dataSource?: Array<any> | PivotGridDataSource | PivotGridDataSourceOptions | null;
    /**
     * Specifies whether HTML tags are displayed as plain text or applied to cell values.
     */
    encodeHtml?: boolean;
    /**
     * Configures client-side exporting.
     */
    export?: {
      /**
       * Enables client-side exporting.
       */
      enabled?: boolean;
    };
    /**
     * The Field Chooser configuration properties.
     */
    fieldChooser?: {
      /**
       * Specifies whether the field chooser allows search operations in the &apos;All Fields&apos; section.
       */
      allowSearch?: boolean;
      /**
       * Specifies when to apply changes made in the field chooser to the PivotGrid.
       */
      applyChangesMode?: ApplyChangesMode;
      /**
       * Enables or disables the field chooser.
       */
      enabled?: boolean;
      /**
       * Specifies the field chooser height.
       */
      height?: number;
      /**
       * Specifies the field chooser layout.
       */
      layout?: FieldChooserLayout;
      /**
       * Specifies a delay in milliseconds between when a user finishes typing in the field chooser&apos;s search panel, and when the search is executed.
       */
      searchTimeout?: number;
      /**
       * Strings that can be changed or localized in the pivot grid&apos;s integrated Field Chooser.
       */
      texts?: {
        /**
         * The string to display instead of All Fields.
         */
        allFields?: string;
        /**
         * The string to display instead of Column Fields.
         */
        columnFields?: string;
        /**
         * The string to display instead of Data Fields.
         */
        dataFields?: string;
        /**
         * The string to display instead of Filter Fields.
         */
        filterFields?: string;
        /**
         * The string to display instead of Row Fields.
         */
        rowFields?: string;
      };
      /**
       * Specifies the text to display as a title of the field chooser popup window.
       */
      title?: string;
      /**
       * Specifies the field chooser width.
       */
      width?: number;
    };
    /**
     * Configures the field panel.
     */
    fieldPanel?: {
      /**
       * Makes fields on the field panel draggable.
       */
      allowFieldDragging?: boolean;
      /**
       * Shows/hides column fields on the field panel.
       */
      showColumnFields?: boolean;
      /**
       * Shows/hides data fields on the field panel.
       */
      showDataFields?: boolean;
      /**
       * Shows/hides filter fields on the field panel.
       */
      showFilterFields?: boolean;
      /**
       * Shows/hides row fields on the field panel.
       */
      showRowFields?: boolean;
      /**
       * Specifies the placeholders of the field areas.
       */
      texts?: {
        /**
         * Specifies the placeholder of the column field area.
         */
        columnFieldArea?: string;
        /**
         * Specifies the placeholder of the data field area.
         */
        dataFieldArea?: string;
        /**
         * Specifies the placeholder of the filter field area.
         */
        filterFieldArea?: string;
        /**
         * Specifies the placeholder of the row field area.
         */
        rowFieldArea?: string;
      };
      /**
       * Shows/hides the field panel.
       */
      visible?: boolean;
    };
    /**
     * Configures the header filter feature.
     */
    headerFilter?: {
      /**
       * Specifies whether searching is enabled in the header filter.
       * @deprecated Use search.enabled instead.
       */
      allowSearch?: boolean;
      /**
       * Specifies whether a &apos;Select All&apos; option is available to users.
       */
      allowSelectAll?: boolean;
      /**
       * Specifies the height of the popup menu containing filtering values.
       */
      height?: number;
      /**
       * Configures the header filter&apos;s search functionality.
       */
      search?: HeaderFilterSearchConfig;
      /**
       * Specifies a delay in milliseconds between when a user finishes typing in the header filter&apos;s search panel, and when the search is executed.
       * @deprecated Use search.timeout instead.
       */
      searchTimeout?: number;
      /**
       * Specifies whether to show all field values or only those that satisfy the other applied filters.
       */
      showRelevantValues?: boolean;
      /**
       * Configures the texts of the popup menu&apos;s elements.
       */
      texts?: {
        /**
         * Specifies the text of the button that closes the popup menu without applying a filter.
         */
        cancel?: string;
        /**
         * Specifies the name of the item that represents empty values in the popup menu.
         */
        emptyValue?: string;
        /**
         * Specifies the text of the button that applies a filter.
         */
        ok?: string;
      };
      /**
       * Specifies the width of the popup menu containing filtering values.
       */
      width?: number;
    };
    /**
     * Specifies whether or not to hide rows and columns with no data.
     */
    hideEmptySummaryCells?: boolean;
    /**
     * Specifies properties configuring the load panel.
     */
    loadPanel?: {
      /**
       * Enables or disables the load panel.
       */
      enabled?: boolean;
      /**
       * Specifies the height of the load panel.
       */
      height?: number;
      /**
       * Specifies the URL pointing to an image that will be used as a load indicator.
       */
      indicatorSrc?: string;
      /**
       * Specifies whether to shade the UI component when the load panel appears.
       */
      shading?: boolean;
      /**
       * Specifies the shading color. Applies only if shading is true.
       */
      shadingColor?: string;
      /**
       * Specifies whether or not to show a load indicator.
       */
      showIndicator?: boolean;
      /**
       * Specifies whether or not to show load panel background.
       */
      showPane?: boolean;
      /**
       * Specifies the text to display inside a load panel.
       */
      text?: string;
      /**
       * Specifies the width of the load panel.
       */
      width?: number;
    };
    /**
     * A function that is executed when a pivot grid cell is clicked or tapped.
     */
    onCellClick?: ((e: CellClickEvent) => void);
    /**
     * A function that is executed after a pivot grid cell is created.
     */
    onCellPrepared?: ((e: CellPreparedEvent) => void);
    /**
     * A function that is executed before the context menu is rendered.
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * A function that is executed before data is exported.
     */
    onExporting?: ((e: ExportingEvent) => void);
    /**
     * Specifies the layout of items in the row header.
     */
    rowHeaderLayout?: PivotGridRowHeaderLayout;
    /**
     * A configuration object specifying scrolling properties.
     */
    scrolling?: {
      /**
       * Specifies the scrolling mode.
       */
      mode?: ScrollMode;
      /**
       * Specifies whether or not the UI component uses native scrolling.
       */
      useNative?: boolean | Mode;
    };
    /**
     * Specifies whether the outer borders of the grid are visible or not.
     */
    showBorders?: boolean;
    /**
     * Specifies whether to display the Grand Total column.
     */
    showColumnGrandTotals?: boolean;
    /**
     * Specifies whether to display the Total columns.
     */
    showColumnTotals?: boolean;
    /**
     * Specifies whether to display the Grand Total row.
     */
    showRowGrandTotals?: boolean;
    /**
     * Specifies whether to display the Total rows. Applies only if rowHeaderLayout is &apos;standard&apos;.
     */
    showRowTotals?: boolean;
    /**
     * Specifies where to show the total rows or columns.
     */
    showTotalsPrior?: PivotGridTotalDisplayMode;
    /**
     * A configuration object specifying properties related to state storing.
     */
    stateStoring?: {
      /**
       * Specifies a function that is executed on state loading. Applies only if the type is &apos;custom&apos;.
       */
      customLoad?: (() => PromiseLike<any>);
      /**
       * Specifies a function that is executed on state change. Applies only if the type is &apos;custom&apos;.
       */
      customSave?: ((state: any) => any);
      /**
       * Specifies whether or not a grid saves its state.
       */
      enabled?: boolean;
      /**
       * Specifies the delay between the last change of a grid state and the operation of saving this state in milliseconds.
       */
      savingTimeout?: number;
      /**
       * Specifies a unique key to be used for storing the grid state.
       */
      storageKey?: string;
      /**
       * Specifies the type of storage to be used for state storing.
       */
      type?: StateStoreType;
    };
    /**
     * Strings that can be changed or localized in the PivotGrid UI component.
     */
    texts?: {
      /**
       * The string to display as a Collapse All context menu item.
       */
      collapseAll?: string;
      /**
       * Specifies text displayed in a cell when its data is unavailable for some reason.
       */
      dataNotAvailable?: string;
      /**
       * The string to display as an Expand All context menu item.
       */
      expandAll?: string;
      /**
       * The string to display as an Export to Excel file context menu item.
       */
      exportToExcel?: string;
      /**
       * The string to display as a header of the Grand Total row and column.
       */
      grandTotal?: string;
      /**
       * Specifies the text displayed when a pivot grid does not contain any fields.
       */
      noData?: string;
      /**
       * The string to display as a Remove All Sorting context menu item.
       */
      removeAllSorting?: string;
      /**
       * The string to display as a Show Field Chooser context menu item.
       */
      showFieldChooser?: string;
      /**
       * The string to display as a Sort Column by Summary Value context menu item.
       */
      sortColumnBySummary?: string;
      /**
       * The string to display as a Sort Row by Summary Value context menu item.
       */
      sortRowBySummary?: string;
      /**
       * The string to display as a header of the Total row and column.
       */
      total?: string;
    };
    /**
     * Specifies whether long text in header items should be wrapped.
     */
    wordWrapEnabled?: boolean;
}
/**
 * The PivotGrid is a UI component that allows you to display and analyze multi-dimensional data from a local storage or an OLAP cube.
 */
export default class dxPivotGrid extends Widget<dxPivotGridOptions> {
    /**
     * Binds a Chart to the PivotGrid.
     */
    bindChart(chart: string | DxElement | any, integrationOptions: { inverted?: boolean; dataFieldsDisplayMode?: string; putDataFieldsInto?: string; alternateDataFields?: boolean; processCell?: Function; customizeChart?: Function; customizeSeries?: Function }): Function & null;
    /**
     * Gets the PivotGridDataSource instance.
     */
    getDataSource(): PivotGridDataSource;
    /**
     * Gets the Popup instance of the field chooser window.
     */
    getFieldChooserPopup(): dxPopup;
    /**
     * Updates the UI component to the size of its content.
     */
    updateDimensions(): void;
}

export type Cell = dxPivotGridPivotGridCell;

/**
 * @deprecated Use Cell instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPivotGridPivotGridCell {
    /**
     * The cell&apos;s column path. Available for data area cells only.
     */
    columnPath?: Array<string | number | Date>;
    /**
     * The type of the column to which the cell belongs. Available for data area cells only.
     */
    columnType?: 'D' | 'T' | 'GT';
    /**
     * The data field&apos;s index. Available for data area cells only.
     */
    dataIndex?: number;
    /**
     * Indicates whether the cell is expanded. Available for row or column area cells only.
     */
    expanded?: boolean;
    /**
     * The path to the row/column cell. Available for row or column area cells only.
     */
    path?: Array<string | number | Date>;
    /**
     * The cell&apos;s row path. Available for data area cells only.
     */
    rowPath?: Array<string | number | Date>;
    /**
     * The type of the row to which the cell belongs. Available for data area cells only.
     */
    rowType?: 'D' | 'T' | 'GT';
    /**
     * The text displayed in the cell.
     */
    text?: string;
    /**
     * The cell&apos;s type. Available for row or column area cells only.
     */
    type?: 'D' | 'T' | 'GT';
    /**
     * The cell&apos;s value.
     */
    value?: any;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPivotGridSummaryCell = SummaryCell;

export type Properties = dxPivotGridOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxPivotGridOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onCellClick' | 'onCellPrepared' | 'onContextMenuPreparing' | 'onExporting'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxPivotGridOptions.onContentReady
 * @type_function_param1 e:{ui/pivot_grid:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxPivotGridOptions.onDisposing
 * @type_function_param1 e:{ui/pivot_grid:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxPivotGridOptions.onInitialized
 * @type_function_param1 e:{ui/pivot_grid:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxPivotGridOptions.onOptionChanged
 * @type_function_param1 e:{ui/pivot_grid:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
