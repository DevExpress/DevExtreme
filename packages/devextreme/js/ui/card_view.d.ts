import { template } from '../common';
import { UserDefinedElement } from '../core/element';
import {
 ColumnBase, DataErrorOccurredInfo, Pager, ScrollingBase,
} from '../common/grids';
import { DataSourceLike } from '../data/data_source';
import Widget, { WidgetOptions } from './widget/ui.widget';
import { EventInfo } from '../events';
import { dxToolbarItem, ToolbarItemLocation } from './toolbar';
import { dxSortableOptions } from './sortable';
import { dxLoadPanelOptions } from './load_panel';

// #region DataController

/**
 * @docid
 * @namespace DevExpress.ui.dxCardView
 */
interface Paging {
    /**
     * @docid
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @default 0
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    pageIndex?: number;
    /**
     * @docid
     * @default 6
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    pageSize?: number;
}

/**
 * @docid
 * @namespace DevExpress.ui.dxCardView
 */
interface RemoteOperations {
    /**
     * @docid
     * @default false
     */
    filtering?: boolean;
    /**
     * @docid
     * @default false
     */
    paging?: boolean;
    /**
     * @docid
     * @default false
     */
    sorting?: boolean;
    /**
     * @docid
     * @default false
     */
    summary?: boolean;
}

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export type DataControllerOptions<TRowData = unknown, TKey = unknown> = {
    /**
     * @docid
     * @default undefined
     * @type string | Array<any> | Store | DataSource | DataSourceOptions
     * @public
     */
    dataSource?: DataSourceLike<TRowData, TKey>;
    /**
     * @docid
     * @public
     */
    paging?: Paging;
    /**
     * @docid
     * @default undefined
     * @public
     */
    keyExpr?: string | string[];
    /**
     * @docid
     * @default undefined
     * @action
     * @public
     */
    onDataErrorOccurred?: (args: DataErrorOccurredInfo & EventInfo<dxCardView>) => void;
    /**
     * @docid
     * @default "auto"
     * @public
     */
    remoteOperations?: RemoteOperations | boolean | 'auto';
};

// #endregion

// #region Pager

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export type PagerOptions = {
    /**
     * @docid
     * @public
     */
    pager?: Pager;
};

// #endregion

// #region Toolbar

export type PredefinedToolbarItem = 'columnChooserButton' | 'searchPanel' | 'addCardButton';

/**
 * @docid
 * @inherits dxToolbarItem
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type ToolbarItem = dxToolbarItem & {
    /**
     * @docid
     * @public
     */
    name?: PredefinedToolbarItem | string;
    /**
     * @docid
     * @default 'after'
     * @public
     */
    location?: ToolbarItemLocation;
  };

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export type ToolbarOptions = {
    /**
     * @docid
     * @public
     */
    toolbar?: {
        /**
         * @docid
         * @public
         */
        items?: Array<PredefinedToolbarItem | ToolbarItem>;
        /**
         * @default undefined
         * @public
         */
        visible?: boolean | undefined;
        /**
         * @default false
         * @public
         */
        disabled?: boolean;
    };
};

// #endregion

// #region ColumnsController

/**
 * @public
 * @docid
 * @namespace DevExpress.ui.dxCardView
 */
export interface Cell {
    /**
     * @public
     * @docid
     */
    value: unknown;
    /**
     * @public
     * @docid
     */
    displayValue: unknown;
    /**
     * @public
     * @docid
     */
    text: string;
    /**
     * @public
     * @docid
     */
    column: Column;
}

/**
 * @public
 * @docid
 * @namespace DevExpress.ui.dxCardView
 */
export interface DataRow<TRowData = unknown, TKey = unknown> {
    /**
     * @public
     * @docid
     */
    cells: Cell[];
    /**
     * @public
     * @docid
     */
    key: TKey;
    /**
     * @public
     * @docid
     */
    data: TRowData;
}

type InheritedColumnProps =
  | 'alignment'
  | 'dataType'
  | 'visible'
  | 'visibleIndex'
  | 'allowReordering'
  | 'allowHiding'
  | 'trueText'
  | 'falseText'
  | 'caption'
  | 'dataField'
  | 'sortOrder'
  | 'sortIndex'
  | 'name'
  | 'calculateCellValue'
  | 'calculateDisplayValue'
  | 'customizeText'
  ;

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 * @type object
 */
export type ColumnProperties<TRowData = unknown, TKey = unknown> = Pick<ColumnBase<TRowData>, InheritedColumnProps> & {
    /**
     * @public
     * @docid
     */
    fieldTemplate?: template | ((dataRow: DataRow<TRowData, TKey>) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    fieldCaptionTemplate?: template | ((dataRow: DataRow<TRowData, TKey>) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    fieldValueTemplate?: template | ((dataRow: DataRow<TRowData, TKey>) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    headerItemTemplate?: template | ((column: Column<TRowData, TKey>) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    headerItemCssClass?: string;
};

type RequiredColumnProps = 'alignment' | 'dataType' | 'visible' | 'visibleIndex' | 'allowReordering' | 'allowHiding' | 'trueText' | 'falseText' | 'caption';

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type Column<TRowData = unknown, TKey = unknown> =
    Pick<Required<ColumnProperties<TRowData, TKey>>, RequiredColumnProps>
    & Omit<ColumnProperties, RequiredColumnProps>;

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export type ColumnsControllerOptions<TRowData = unknown, TKey = unknown> = {
    /**
     * @public
     * @docid
     */
    columns?: (ColumnProperties<TRowData, TKey> | string)[];
};

// #endregion

// #region HeaderPanel

type SortableProperties = 'dropFeedbackMode' | 'scrollSpeed' | 'scrollSensitivity' | 'onDragChange' | 'onDragEnd' | 'onDragMove' | 'onDragStart' | 'onRemove' | 'onReorder';

export type HeaderPanelDraggingOptions = Pick<dxSortableOptions, SortableProperties>;

/**
 * @docid
 */
type HeaderPanel<TRowData = unknown, TKey = unknown> = {
    // /**
    //  * @docid
    //  * @public
    //  */
    // dragging?: HeaderPanelDraggingOptions;
    /**
     * @docid
     * @public
     * @default true
     */
    visible?: boolean;
    /**
     * @docid
     * @public
     */
    itemTemplate?: template | ((e: { column: Column<TRowData, TKey> }) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    itemCssClass?: string;
};

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export type HeaderPanelOptions<TRowData = unknown, TKey = unknown> = {
    /**
     * @docid
     */
    headerPanel?: HeaderPanel<TRowData, TKey>;
};

// #endregion

// #region ContentView

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export interface BaseContentViewOptions {
    /**
     * @docid
     * @public
     */
    scrolling?: Pick<ScrollingBase, 'scrollByContent' | 'scrollByThumb' | 'showScrollbar' | 'useNative'>;
    /**
     * @docid
     * @public
     * @default true
     */
    errorRowEnabled?: boolean;
    /**
     * @docid
     * @public
     */
    loadPanel?: dxLoadPanelOptions;
    /**
     * @docid
     * @public
     * @default "No data"
     */
    noDataText?: string;
    /**
     * @docid
     * @public
     */
    noDataTemplate?: template | ((e: { text: string }) => string | UserDefinedElement);
}

/**
 * @docid
 * @namespace DevExpress.ui.dxCardView
 */
interface CardCover<TRowData = unknown> {
    /**
     * @docid
     * @public
     */
    imageExpr: string | ((data: TRowData) => string);
    /**
     * @docid
     * @public
     */
    altExpr: string | ((data: TRowData) => string);
}

/**
 * @docid
 * @namespace DevExpress.ui.dxCardView
 */
interface CardHeader<TRowData = unknown> {
    /**
     * @docid
     * @public
     */
    captionExpr?: string | ((data: TRowData) => string);
    /**
     * @docid
     * @public
     */
    visible?: boolean;
}

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export interface ContentViewOptions<TRowData = unknown> extends BaseContentViewOptions {
    /**
     * @docid
     * @public
     */
    cardsPerRow?: number | 'auto';
    /**
     * @docid
     * @public
     */
    cardMinWidth?: number;
    /**
     * @docid
     * @public
     */
    cardMaxWidth?: number;
    /**
     * @docid
     * @public
     */
    cardCover?: CardCover<TRowData>;
    /**
     * @docid
     * @public
     */
    cardTemplate?: template | ((row: DataRow) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    cardHeader?: CardHeader<TRowData>;
}

// #endregion

/**
 * @namespace DevExpress.ui
 * @public
 * @docid
 * @deprecated use Properties instead
 * @inherits DataControllerOptions,PagerOptions,ToolbarOptions,ColumnsControllerOptions,HeaderPanelOptions,ContentViewOptions
 */
export interface dxCardViewOptions<TRowData = unknown, TKey = unknown> extends WidgetOptions<dxCardView>,
DataControllerOptions<TRowData, TKey>,
PagerOptions,
ColumnsControllerOptions<TRowData, TKey>,
HeaderPanelOptions<TRowData, TKey>,
ContentViewOptions<TRowData>,
ToolbarOptions {

}

/** @public */
export type Properties<TRowData = unknown, TKey = unknown> = dxCardViewOptions<TRowData, TKey>;

/**
* @docid
* @inherits Widget
* @namespace DevExpress.ui
* @public
*/
export default class dxCardView<TRowData = unknown, TKey = unknown> extends Widget<Properties> {

}

export type ExplicitTypes<TRowData = unknown, TKey = unknown> = {
    Properties: Properties<TRowData, TKey>;
};
