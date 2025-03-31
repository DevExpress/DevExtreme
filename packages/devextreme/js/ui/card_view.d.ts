import { Mode, template } from '../common';
import { DxElement, UserDefinedElement } from '../core/element';
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
export type DataControllerConfiguration<TRowData = unknown, TKey = unknown> = {
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
     * @default "auto"
     * @public
     */
    remoteOperations?: RemoteOperations | boolean | Mode;
};

// #endregion

// #region Pager

/**
 * @docid
 * @hidden
 * @namespace DevExpress.ui.dxCardView
 */
export type PagerConfiguration = {
    /**
     * @docid
     * @public
     */
    pager?: Pager;
};

// #endregion

// #region ContextMenu

/** @public */
export type ContextMenuTarget = 'toolbar' | 'headerPanel' | 'content';

/**
 * @docid _ui_card_view_ContextMenuPreparingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContextMenuPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxCardView> & {
  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.items
   * @type Array<Object>
   */
  items?: Array<any>;

  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.target
   */
  readonly target: ContextMenuTarget;

  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.targetElement
   */
  readonly targetElement: DxElement;

  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.columnIndex
   */
  readonly columnIndex?: number;

  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.column
   */
  readonly column?: Column<TRowData, TKey>;

  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.cardIndex
   */
  readonly cardIndex?: number;

  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.card
   */
  readonly card?: DataRow<TRowData, TKey>;
};

export type ContextMenuOptions<TRowData = unknown, TKey = unknown> = {
    /**
     * @docid
     * @default undefined
     * @action
     * @public
     */
    onContextMenuPreparing?: (args: ContextMenuPreparingEvent<TRowData, TKey>) => void;
};

// #end region

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
export type ToolbarConfiguration = {
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
     * @type object
     */
    value: unknown;
    /**
     * @public
     * @docid
     * @type object
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
    /**
     * @public
     * @docid
     */
    index: number;
    /**
     * @public
     * @docid
     */
    isSelected: boolean;
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
 * @type object
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
export type ColumnsControllerConfiguration<TRowData = unknown, TKey = unknown> = {
    /**
     * @public
     * @docid
     */
    columns?: (ColumnProperties<TRowData, TKey> | string)[];
};

// #endregion

// #region HeaderPanel

/**
 * @docid
 */
type HeaderPanel<TRowData = unknown, TKey = unknown> = {
    /**
     * @docid
     * @public
     * @type object
     */
    dragging?: Pick<dxSortableOptions, 'dropFeedbackMode' | 'scrollSpeed' | 'scrollSensitivity' | 'onDragChange' | 'onDragEnd' | 'onDragMove' | 'onDragStart' | 'onRemove' | 'onReorder'>;
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
export type HeaderPanelConfiguration<TRowData = unknown, TKey = unknown> = {
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
 * @type object
 */
export interface BaseContentViewConfiguration {
    /**
     * @docid
     * @public
     * @type object
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
 * @type object
 */
export interface ContentViewConfiguration<TRowData = unknown> extends BaseContentViewConfiguration {
    /**
     * @docid
     * @public
     */
    cardsPerRow?: number | Mode;
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
 * @inherits DataControllerConfiguration,PagerConfiguration,ToolbarConfiguration,ColumnsControllerConfiguration,HeaderPanelConfiguration,ContentViewConfiguration
 */
export interface dxCardViewOptions<TRowData = unknown, TKey = unknown> extends WidgetOptions<dxCardView>,
DataControllerConfiguration<TRowData, TKey>,
PagerConfiguration,
ColumnsControllerConfiguration<TRowData, TKey>,
HeaderPanelConfiguration<TRowData, TKey>,
ContentViewConfiguration<TRowData>,
ToolbarConfiguration {
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onDataErrorOccurred?: (e: EventInfo<dxCardView> & DataErrorOccurredInfo) => void;
}

/** @public */
export type Properties<TRowData = unknown, TKey = unknown> = dxCardViewOptions<TRowData, TKey>;

/**
* @docid
* @inherits Widget
* @namespace DevExpress.ui
* @public
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class dxCardView<TRowData = unknown, TKey = unknown> extends Widget<Properties> {

}

export type ExplicitTypes<TRowData = unknown, TKey = unknown> = {
    Properties: Properties<TRowData, TKey>;
};
