import { Mode, template } from '../common';
import { UserDefinedElement, DxElement } from '../core/element';
import {
 ColumnBase, ColumnChooser, DataErrorOccurredInfo, FilterPanel, HeaderFilter, Pager, ScrollingBase, SearchPanel, Sorting,
} from '../common/grids';
import { DataSourceLike } from '../data/data_source';
import Widget, { WidgetOptions } from './widget/ui.widget';
import { EventInfo, NativeEventInfo } from '../events';
import { dxToolbarItem, ToolbarItemLocation } from './toolbar';
import { dxSortableOptions } from './sortable';
import { dxLoadPanelOptions } from './load_panel';
import dxScrollable from './scroll_view/ui.scrollable';
import {
    Properties as PopupProperties,
  } from './popup';
import { dxFilterBuilderOptions } from './filter_builder';

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type Paging = {
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
};

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type RemoteOperations = {
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
    grouping?: boolean;
};

// #region Toolbar

export type PredefinedToolbarItem = 'columnChooserButton' | 'searchPanel' | 'addCardButton' | 'selectAllButton' | 'clearSelectionButton';

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
 * @public
 */
export type Toolbar = {
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
    /**
     * @default false
     * @public
     */
    multiline?: boolean;
};

// #endregion

// #region ColumnsController

/**
 * @public
 * @docid
 * @namespace DevExpress.ui.dxCardView
 */
export interface FieldInfoType { // TODO: rename to FieldInfo
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
export type CardInfo<TCardData = unknown, TKey = unknown> = { // TODO: sync to impl
    /**
     * @public
     * @docid
     */
    index: Column[];
    /**
     * @public
     * @docid
     */
    fields: FieldInfoType[];
    /**
     * @public
     * @docid
     */
    key: TKey;
    /**
     * @public
     * @docid
     */
    data: TCardData;
    /**
     * @public
     * @docid
     */
    isSelected: boolean;
    /**
     * @public
     * @type Array<any>
     * @docid
     */
    values: any[];
};

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
  | 'calculateCellValue' // TODO: move
  | 'calculateDisplayValue'
  | 'customizeText'
  ;

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 * @type object
 */
export type ColumnProperties<TCardData = unknown, TKey = unknown> = Pick<ColumnBase<TCardData>, InheritedColumnProps> & {
    /**
     * @public
     * @docid
     */
    fieldTemplate?: template | ((card: CardInfo<TCardData, TKey>) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    fieldCaptionTemplate?: template | ((card: CardInfo<TCardData, TKey>) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    fieldValueTemplate?: template | ((card: CardInfo<TCardData, TKey>) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    headerItemTemplate?: template | ((column: Column<TCardData, TKey>) => string | UserDefinedElement);
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
export type Column<TCardData = unknown, TKey = unknown> =
    Pick<Required<ColumnProperties<TCardData, TKey>>, RequiredColumnProps>
    & Omit<ColumnProperties, RequiredColumnProps>;

// #endregion

// #region HeaderPanel

/**
 * @docid
 * @public
 */
export type HeaderPanel<TCardData = unknown, TKey = unknown> = {
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
    itemTemplate?: template | ((e: { column: Column<TCardData, TKey> }) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    itemCssClass?: string;
};

// #endregion

// #region ContentView

/**
 * @docid
 */
type WithCardInfo = {
    /** @docid */
    readonly card: CardInfo;
    /** @docid */
    readonly cardElement: DxElement;
};

/**
 * @docid
 * @public
 * @type object
 * @inherits NativeEventInfo,WithCardInfo
 */
export type CardClickEvent = NativeEventInfo<dxCardView, PointerEvent | MouseEvent | TouchEvent> & WithCardInfo;

/**
 * @docid
 * @public
 * @type object
 * @inherits NativeEventInfo,WithCardInfo
 */
export type CardDblClickEvent = NativeEventInfo<dxCardView, PointerEvent | MouseEvent | TouchEvent> & WithCardInfo;

/**
 * @docid
 * @public
 * @type object
 * @inherits EventInfo,WithCardInfo
 */
export type CardHoverChangedEvent = EventInfo<dxCardView> & WithCardInfo;

/**
 * @docid
 * @public
 * @type object
 * @inherits EventInfo,WithCardInfo
 */
export type CardPreparedEvent = EventInfo<dxCardView> & WithCardInfo;

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type CardCover<TCardData = unknown> = { // TODO: sync with impl
    /**
     * @docid
     * @public
     */
    imageExpr: string | ((data: TCardData) => string);
    /**
     * @docid
     * @public
     */
    altExpr: string | ((data: TCardData) => string);
    /**
     * @docid
     * @public
     */
    maxHeight?: number;
    /**
     * @docid
     * @public
     */
    aspectRatio?: string;
    /**
     * @docid
     * @public
     */
    template?: template | ((card: CardInfo) => string | UserDefinedElement);
};

export type CardHeaderPredefinedToolbarItem = 'selectionCheckBox' | 'updateButton' | 'deleteButton';

/**
 * @docid
 * @inherits dxToolbarItem
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type CardHeaderToolbarItem = dxToolbarItem & {
    /**
     * @docid
     * @public
     */
    name?: CardHeaderPredefinedToolbarItem | string;
    /**
     * @docid
     * @default 'after'
     * @public
     */
    location?: ToolbarItemLocation;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type CardHeader = { // TODO: sync with impl
    /**
     * @docid
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @public
     */
    items?: Array<CardHeaderPredefinedToolbarItem | CardHeaderToolbarItem>;
    /**
     * @docid
     * @public
     */
    template?: template | ((card: CardInfo) => string | UserDefinedElement);
};

// #endregion

/**
 * @namespace DevExpress.ui
 * @public
 * @docid
 * @deprecated use Properties instead
 */
export interface dxCardViewOptions<TCardData = unknown, TKey = unknown> extends WidgetOptions<dxCardView> {

    // #region DataController

    /**
     * @docid
     * @default undefined
     * @type string | Array<any> | Store | DataSource | DataSourceOptions
     * @public
     */
    dataSource?: DataSourceLike<TCardData, TKey>;
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
    /**
     * @docid
     * @default undefined
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onDataErrorOccurred?: (e: EventInfo<dxCardView> & DataErrorOccurredInfo) => void;

    // #endregion

    // #region Pager

    /**
     * @docid
     * @public
     */
    pager?: Pager;

    // #endregion

    // #region ColumnsController

    /**
     * @public
     * @docid
     */
    columns?: (ColumnProperties<TCardData, TKey> | string)[];

    /**
     * @public
     * @docid
     * @default false
     */
    allowColumnReordering?: boolean;

    // #endregion

    // #region HeaderPanel

    /**
     * @docid
     */
    headerPanel?: HeaderPanel<TCardData, TKey>;

    // #endregion

    // #region ContentView

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
    wordWrapEnabled?: boolean;
    /**
     * @docid
     * @public
     */
    cardCover?: CardCover<TCardData>;
    /**
     * @docid
     * @public
     */
    cardTemplate?: template | ((card: CardInfo) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     * @action
     */
    onCardClick?: (e: CardClickEvent) => void; // TODO: sync with impl
    /**
     * @docid
     * @public
     * @action
     */
    onCardDblClick?: (e: CardDblClickEvent) => void; // TODO: sync with impl
    /**
     * @docid
     * @public
     * @action
     */
    onCardPrepared?: (e: CardPreparedEvent) => void; // TODO: sync with impl
    /**
     * @docid
     * @public
     * @action
     */
    onCardHoverChanged?: (e: CardHoverChangedEvent) => void; // TODO: sync with impl
    /**
     * @docid
     * @public
     */
    cardFooterTemplate?: template | ((card: CardInfo) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    cardHeader?: CardHeader;

    /**
     * @docid
     * @public
     */
    hoverStateEnabled?: boolean; // TODO: sync with impl

    // #endregion

    // #region Toolbar

    /**
     * @docid
     * @public
     */
    toolbar?: Toolbar;

    // #endregion

    sorting?: Sorting;

    /**
     * @docid
     * @type Filter expression
     * @default null
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    filterValue?: string | Array<any> | Function;
    /**
     * @docid
     * @public
     * @type object
     */
    filterBuilderPopup?: PopupProperties;
    /**
     * @docid
     * @public
     */
    filterBuilder?: dxFilterBuilderOptions;
    /**
     * @docid
     * @type object
     * @public
     */
    filterPanel?: FilterPanel<dxCardView>;
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
    searchPanel?: SearchPanel;
    /**
     * @docid
     * @type object
     * @public
     */
    headerFilter?: HeaderFilter;
}

/** @public */
export type Properties<TCardData = unknown, TKey = unknown> = dxCardViewOptions<TCardData, TKey>;

/**
* @docid
* @inherits Widget
* @namespace DevExpress.ui
* @public
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class dxCardView<TCardData = unknown, TKey = unknown> extends Widget<Properties> {
    /**
     * @docid
     * @publicName getCardElement(cardIndex)
     * @public
     */
    getCardElement(cardIndex: number): DxElement;
    /**
     * @docid
     * @publicName getVisibleCards()
     * @public
     */
    getVisibleCards(): CardInfo[];
    /**
     * @docid
     * @publicName getCardIndexByKey(key)
     * @public
     */
    getCardIndexByKey(key: TKey): number;
    /**
     * @docid
     * @publicName getKeyByCardIndex(cardIndex)
     * @public
     */
    getKeyByCardIndex(cardIndex: number): TKey;
    /**
     * @docid
     * @publicName getScrollable()
     * @public
     */
    getScrollable(): dxScrollable;
    /**
     * @docid
     * @publicName beginCustomLoading(text)
     * @public
    */
    beginCustomLoading(text?: string): void;
    /**
     * @docid
     * @publicName endCustomLoading()
     * @public
    */
    endCustomLoading(): void;
    /**
     * @docid
     * @publicName clearSorting()
     * @public
     */
    clearSorting(): void;
    /**
     * @docid
     * @publicName getCombinedFilter()
     * @public
     */
    getCombinedFilter(): any;
    /**
     * @docid
     * @publicName clearFilter()
     * @public
     */
    clearFilter(): void;
    /**
     * @docid
     * @publicName hideColumnChooser()
     * @public
     */
    hideColumnChooser(): void;
    /**
     * @docid
     * @publicName showColumnChooser()
     * @public
     */
    showColumnChooser(): void;
    /**
     * @docid
     * @publicName searchByText(text)
     * @public
     */
    searchByText(text: string): void;
}

export {
    Sorting,
    Pager,
    DataErrorOccurredInfo,
    PopupProperties,
    ColumnChooser,
    SearchPanel,
    HeaderFilter,
};

export type ExplicitTypes<TCardData = unknown, TKey = unknown> = {
    Properties: Properties<TCardData, TKey>;
};
