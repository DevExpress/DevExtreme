import { DeepPartial } from '../core';
import {
    DataType,
    DragHighlight,
    HorizontalAlignment,
 Mode, ScrollbarMode, SelectAllMode, SingleMultipleOrNone, SortOrder, template, ValidationRule,
} from '../common';
import { Format } from '../common/core/localization';
import { UserDefinedElement, DxElement } from '../core/element';
import {
 ColumnChooser, ColumnCustomizeTextArg, ColumnHeaderFilter, DataChange, DataErrorOccurredInfo, FilterPanel, FilterType, HeaderFilter, Pager, SearchPanel, SelectionColumnDisplayMode, Sorting,
} from '../common/grids';
import DataSource, { DataSourceLike } from '../data/data_source';
import Widget, { WidgetOptions } from './widget/ui.widget';
import {
    Cancelable,
    ChangedOptionInfo,
    EventInfo,
    NativeEventInfo,
    PointerInteractionEvent,
} from '../events';
import { dxToolbarItem, ToolbarItemLocation } from './toolbar';
import { dxLoadPanelOptions } from './load_panel';
import dxScrollable from './scroll_view/ui.scrollable';
import {
    Properties as PopupProperties,
  } from './popup';
import {
    Properties as FormProperties, SimpleItem,
  } from './form';
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

/** @public */
export type PredefinedToolbarItem = 'columnChooserButton' | 'searchPanel' | 'addCardButton' | 'selectAllButton' | 'clearSelectionButton';

/**
 * @namespace DevExpress.ui
 * @deprecated Use ToolbarItem instead
 */
export type dxCardViewToolbarItem = ToolbarItem;

/**
 * @docid dxCardViewToolbarItem
 * @inherits dxToolbarItem
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type ToolbarItem = dxToolbarItem & {
    /**
     * @docid dxCardViewToolbarItem.name
     * @public
     */
    name?: PredefinedToolbarItem | string;
    /**
     * @docid dxCardViewToolbarItem.location
     * @default 'after'
     * @public
     */
    location?: ToolbarItemLocation;
};

/**
 * @namespace DevExpress.ui
 * @deprecated Use Toolbar instead
 */
export type dxCardViewToolbar = Toolbar;

/**
 * @docid dxCardViewToolbar
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type Toolbar = {
    /**
     * @docid dxCardViewToolbar.items
     * @type Array<Enums.PredefinedToolbarItem,dxCardViewToolbarItem>
     * @public
     */
    items?: Array<PredefinedToolbarItem | ToolbarItem>;
    /**
     * @docid dxCardViewToolbar.visible
     * @default undefined
     * @public
     */
    visible?: boolean | undefined;
    /**
     * @docid dxCardViewToolbar.disabled
     * @default false
     * @public
     */
    disabled?: boolean;
    /**
     * @docid dxCardViewToolbar.multiline
     * @default false
     * @public
     */
    multiline?: boolean;
};

// #endregion

// #region ColumnsController

/**
 * @deprecated Use FieldInfo instead
 * @namespace DevExpress.ui
 */
export type dxCardViewFieldInfo = FieldInfo;

/**
 * @docid dxCardViewFieldInfo
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type FieldInfo = {
    /**
     * @public
     * @docid dxCardViewFieldInfo.value
     * @type object
     */
    value: any;
    /**
     * @public
     * @docid dxCardViewFieldInfo.displayValue
     * @type object
     */
    displayValue: any;
    /**
     * @public
     * @docid dxCardViewFieldInfo.text
     */
    text: string;
    /**
     * @public
     * @docid dxCardViewFieldInfo.column
     */
    column: Column;
    /**
     * @public
     * @docid dxCardViewFieldInfo.index
     */
    index: number;
    /**
     * @public
     * @docid dxCardViewFieldInfo.card
     */
    card: CardInfo;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type CardInfo<TCardData = unknown, TKey = unknown> = {
    /**
     * @public
     * @docid
     */
    index: number;
    /**
     * @public
     * @docid
     */
    columns: Column[];
    /**
     * @public
     * @docid
     * @type Array<dxCardViewFieldInfo>
     */
    fields: FieldInfo[];
    /**
     * @public
     * @docid
     * @type any
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
    isSelected?: boolean;
    /**
     * @public
     * @docid
     */
    values: any[];
};

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type ColumnProperties<TCardData = unknown, TKey = unknown> = {
    /**
     * @docid
     * @public
     */
    alignment?: HorizontalAlignment | undefined;
    /**
     * @docid
     * @default true
     * @public
     */
    allowEditing?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    allowFiltering?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    allowHeaderFiltering?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    allowHiding?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    allowReordering?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    allowSearch?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    allowSorting?: boolean;
    /**
     * @docid
     * @type_function_param1 cardData:object
     * @public
     */
    calculateFieldValue?: ((this: Column, cardData: TCardData) => any);
    /**
     * @docid
     * @type_function_param1 cardData:object
     * @public
     */
    calculateDisplayValue?: ((this: Column, cardData: TCardData) => any);
    /**
     * @docid
     * @public
     */
    calculateFilterExpression?: ((this: Column, filterValue: any, selectedFilterOperation: string | null, target: string) => string | Array<any> | Function);
    /**
     * @docid
     * @type_function_param1 cardData:object
     * @public
     */
    calculateSortValue?: string | ((this: Column, cardData: TCardData) => any);
    /**
     * @docid
     * @public
     */
    caption?: string | undefined;
    /**
     * @docid
     * @public
     */
    customizeText?: ((this: Column, fieldInfo: ColumnCustomizeTextArg) => string);
    /**
     * @docid
     * @public
     */
    dataField?: string | undefined;
    /**
     * @docid
     * @public
     */
    dataType?: DataType | undefined;
    /**
     * @docid
     * @public
     */
    editorOptions?: any;
    /**
     * @docid
     * @default "false"
     * @public
     */
    falseText?: string;
    /**
     * @docid
     * @default "include"
     * @public
     */
    filterType?: FilterType;
    /**
     * @docid
     * @default undefined
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    filterValue?: any | undefined;
    /**
     * @docid
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    filterValues?: Array<any>;
    /**
     * @docid
     * @type dxFormSimpleItem
     * @public
     */
    formItem?: SimpleItem;
    /**
     * @docid
     * @default ""
     * @public
     */
    format?: Format;
    /**
     * @docid
     * @public
     */
    headerFilter?: ColumnHeaderFilter | undefined;
    /**
     * @docid
     * @public
     */
    name?: string | undefined;
    /**
     * @docid
     * @public
     * @type_function_param1 newData:object
     * @type_function_param3 currentCardData:object
     * @type_function_return void|Promise<void>
     */
    setFieldValue?: ((this: Column, newData: DeepPartial<TCardData>, value: any, currentCardData: TCardData) => void | PromiseLike<void>);
    /**
     * @docid
     * @default true
     * @public
     */
    showInColumnChooser?: boolean;
    /**
     * @docid
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    sortIndex?: number | undefined;
    /**
     * @docid
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    sortOrder?: SortOrder | undefined;
    /**
     * @docid
     * @public
     */
    sortingMethod?: ((this: Column, value1: any, value2: any) => number) | undefined;
    /**
     * @docid
     * @default "true"
     * @public
     */
    trueText?: string;
    /**
     * @docid
     * @type Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>
     * @public
     */
    validationRules?: Array<ValidationRule>;
    /**
     * @docid
     * @default true
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @fires dxCardViewOptions.onOptionChanged
     * @public
     */
    visibleIndex?: number | undefined;
    /**
     * @public
     * @docid
     */
    fieldTemplate?: template | ((data: FieldTemplateData, container: DxElement) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    fieldCaptionTemplate?: template | ((data: FieldTemplateData, container: DxElement) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    fieldValueTemplate?: template | ((data: FieldTemplateData, container: DxElement) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    headerItemTemplate?: template | ((data: ColumnTemplateData<TCardData, TKey>, container: DxElement) => string | UserDefinedElement);
    /**
     * @public
     * @docid
     */
    headerItemCssClass?: string;
};

/**
 * @docid
 * @public
 * @type object
 * @namespace DevExpress.ui.dxCardView
 */
export type Column<TCardData = unknown, TKey = unknown> = ColumnProperties<TCardData, TKey> & {
    /**
     * @public
    */
    defaultCalculateFilterExpression: NonNullable<ColumnProperties['calculateFilterExpression']>;
    /**
     * @public
    */
    defaultSetFieldValue: NonNullable<ColumnProperties['setFieldValue']>;
    /**
     * @public
    */
    defaultCalculateFieldValue: NonNullable<ColumnProperties['calculateFieldValue']>;
};

// #endregion

// #region HeaderPanel

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type HeaderPanel<TCardData = unknown, TKey = unknown> = {
    /**
     * @docid
     * @public
     */
    dragging?: {
        /**
         * @docid
         * @default "push"
         * @public
         */
        dropFeedbackMode?: DragHighlight;
        /**
         * @docid
         * @default 30
         * @public
         */
        scrollSpeed?: number;
        /**
         * @docid
         * @default 60
         * @public
         */
        scrollSensitivity?: number;
        /**
         * @docid
         * @default null
         * @public
         */
        onDragChange?: ((e: any) => void);
        /**
         * @docid
         * @default null
         * @public
         */
        onDragEnd?: ((e: any) => void);
        /**
         * @docid
         * @default null
         * @public
         */
        onDragMove?: ((e: any) => void);
        /**
         * @docid
         * @default null
         * @public
         */
        onDragStart?: ((e: any) => void);
        /**
         * @docid
         * @default null
         * @public
         */
        onRemove?: ((e: any) => void);
        /**
         * @docid
         * @default null
         * @public
         */
        onReorder?: ((e: any) => void);
    };
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
    itemTemplate?: template | ((data: ColumnTemplateData<TCardData, TKey>, container: DxElement) => string | UserDefinedElement);
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
 * @hidden
 */
type WithCardInfo = {
    /** @docid */
    readonly card: CardInfo;
    /** @docid */
    readonly cardElement: DxElement;
};

/**
 * @docid
 * @hidden
 */
type WithFieldCaptionInfo = {
    /**
     * @docid
     * @type dxCardViewFieldInfo
     */
    readonly field: FieldInfo;
    /** @docid */
    readonly fieldCaptionElement: DxElement;
};

/**
 * @docid
 * @hidden
 */
type WithFieldValueInfo = {
    /**
     * @docid
     * @type dxCardViewFieldInfo
     */
    readonly field: FieldInfo;
    /** @docid */
    readonly fieldValueElement: DxElement;
};

/**
 * @docid _ui_card_view_CardClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,WithCardInfo
 */
export type CardClickEvent = NativeEventInfo<dxCardView, PointerInteractionEvent> & WithCardInfo;

/**
 * @docid _ui_card_view_CardDblClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,WithCardInfo
 */
export type CardDblClickEvent = NativeEventInfo<dxCardView, PointerInteractionEvent> & WithCardInfo;

/**
 * @docid _ui_card_view_CardPreparedEvent
 * @public
 * @type object
 * @inherits EventInfo,WithCardInfo
*/
export type CardPreparedEvent = EventInfo<dxCardView> & WithCardInfo;

/**
 * @docid _ui_card_view_FieldCaptionClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,WithFieldCaptionInfo
 */
export type FieldCaptionClickEvent = NativeEventInfo<dxCardView, PointerInteractionEvent> & WithFieldCaptionInfo;

/**
 * @docid _ui_card_view_FieldCaptionDblClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,WithFieldCaptionInfo
 */
export type FieldCaptionDblClickEvent = NativeEventInfo<dxCardView, PointerInteractionEvent> & WithFieldCaptionInfo;

/**
 * @docid _ui_card_view_FieldValuePreparedEvent
 * @public
 * @type object
 * @inherits EventInfo,WithFieldValueInfo
 */
export type FieldValuePreparedEvent = EventInfo<dxCardView> & WithFieldValueInfo;

/**
 * @docid _ui_card_view_FieldValueClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,WithFieldValueInfo
 */
export type FieldValueClickEvent = NativeEventInfo<dxCardView, PointerInteractionEvent> & WithFieldValueInfo;

/**
 * @docid _ui_card_view_FieldValueDblClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,WithFieldValueInfo
 */
export type FieldValueDblClickEvent = NativeEventInfo<dxCardView, PointerInteractionEvent> & WithFieldValueInfo;

/**
 * @docid _ui_card_view_FieldCaptionPreparedEvent
 * @public
 * @type object
 * @inherits EventInfo,WithFieldCaptionInfo
 */
export type FieldCaptionPreparedEvent = EventInfo<dxCardView> & WithFieldCaptionInfo;

/**
 * @docid _ui_card_view_CardHoverChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,WithCardInfo
 */
export type CardHoverChangedEvent = EventInfo<dxCardView> & WithCardInfo & {
    /** @docid _ui_card_view_CardHoverChangedEvent.eventType */
    eventType: string;
};

/**
 * @docid
 * @public
 */
export type FieldTemplateData = {
    /**
     * @docid
     * @type dxCardViewFieldInfo
     */
    field: FieldInfo;
};

/**
 * @docid
 * @public
 */
export type CardTemplateData = {
  /**
   * @docid
   * @public
   */
    card: CardInfo;
};

/**
 * @docid
 * @public
 */
export type ColumnTemplateData<TCardData = unknown, TKey = unknown> = {
  /**
   * @docid
   * @public
   */
    column: Column<TCardData, TKey>;
};

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type CardCover<TCardData = unknown> = {
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
    template?: template | ((data: CardTemplateData, container: DxElement) => string | UserDefinedElement);
};

/** @public */
export type CardHeaderPredefinedItem = 'selectionCheckBox' | 'updateButton' | 'deleteButton';

/**
 * @docid
 * @inherits dxToolbarItem
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type CardHeaderItem = dxToolbarItem & {
    /**
     * @docid
     * @public
     */
    name?: CardHeaderPredefinedItem | string;
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
export type CardHeader = {
    /**
     * @docid
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @public
     */
    items?: Array<CardHeaderPredefinedItem | CardHeaderItem>;
    /**
     * @docid
     * @public
     */
    template?: template | ((data: CardTemplateData) => string | UserDefinedElement);
};

// #endregion

// #region Editing

// Conflicts with recently introduced chat.d.ts Editing after merge
// Use a computed / parent-based docids until agreement
// Specified docid similar to other grids

/**
 * @docid
 * @public
 * @namespace DevExpress.ui.dxCardView
 */
export type EditingTexts = {
  /**
   * @docid
   * @default "Add a card"
   * @public
   */
  addCard?: string;
  /**
   * @docid
   * @default "Are you sure you want to delete this record?"
   * @public
   */
  confirmDeleteMessage?: string;
  /**
   * @docid
   * @default ""
   * @public
   */
  confirmDeleteTitle?: string;
  /**
   * @docid
   * @default "Delete"
   * @public
   */
  deleteCard?: string;
  /**
   * @docid
   * @default "Edit"
   * @public
   */
  editCard?: string;
  /**
   * @docid
   * @default "Save"
   * @public
   */
  saveCard?: string;
};

/**
 * @namespace DevExpress.ui
 * @deprecated Use Editing instead
 */
export type dxCardViewEditing<TCardData=unknown, TKey=unknown> = Editing<TCardData, TKey>;

/**
 * @docid dxCardViewEditing
 * @public
 */
export type Editing<TCardData=unknown, TKey=unknown> = {
    /**
     * @docid dxCardViewEditing.allowAdding
     * @public
     * @default false
     */
    allowAdding?: boolean;
    /**
     * @docid dxCardViewEditing.allowDeleting
     * @public
     * @default false
     */
    allowDeleting?: boolean;
    /**
     * @docid dxCardViewEditing.allowUpdating
     * @public
     * @default false
     */
    allowUpdating?: boolean;
    /**
     * @docid dxCardViewEditing.changes
     * @public
     * @default []
     */
    changes?: DataChange<TCardData, TKey>[];
    /**
     * @docid dxCardViewEditing.confirmDelete
     * @public
     * @default true
     */
    confirmDelete?: boolean;
    /**
     * @docid dxCardViewEditing.editCardKey
     * @public
     * @type any
     * @default null
     */
    editCardKey?: TKey | null;
    /**
     * @docid dxCardViewEditing.form
     * @public
     * @type dxFormOptions
     */
    form?: FormProperties;
    /**
     * @docid dxCardViewEditing.popup
     * @public
     * @type dxPopupOptions
     */
    popup?: PopupProperties;
    /**
     * @docid dxCardViewEditing.texts
     * @public
     */
    texts?: EditingTexts;
};

/**
 * @docid _ui_card_view_EditCanceledEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type EditCanceledEvent = EventInfo<dxCardView> & {
    /**
     * @docid _ui_card_view_EditCanceledEvent.changes
     */
    changes: DataChange[];
};

/**
 * @docid _ui_card_view_EditCancelingEvent
 * @public
 * @type object
 * @inherits EventInfo,Cancelable
 */
export type EditCancelingEvent = EventInfo<dxCardView> & Cancelable & {
    /**
     * @docid _ui_card_view_EditCancelingEvent.changes
     */
    changes: DataChange[];
};

/**
 * @docid _ui_card_view_EditingStartEvent
 * @public
 * @type object
 * @inherits EventInfo,Cancelable
 */
export type EditingStartEvent<TCardData = unknown, TKey = unknown> = EventInfo<dxCardView> & Cancelable & {
    /**
     * @docid _ui_card_view_EditingStartEvent.data
     * @type object
     * @public
     */
    data: TCardData;
    /**
     * @docid _ui_card_view_EditingStartEvent.key
     * @public
     * @type any
     */
    key: TKey;
};

/**
 * @docid _ui_card_view_InitNewCardEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type InitNewCardEvent<TCardData = unknown> = EventInfo<dxCardView> & {
    /**
     * @docid _ui_card_view_InitNewCardEvent.data
     * @public
     * @type object
     */
    data: DeepPartial<TCardData>;
    /**
     * @docid _ui_card_view_InitNewCardEvent.promise
     * @type Promise<void>
     * @public
     */
    promise?: PromiseLike<void>;
};

/**
 * @docid _ui_card_view_CardInsertedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type CardInsertedEvent<TCardData = unknown> = EventInfo<dxCardView> & {
    /**
     * @docid _ui_card_view_CardInsertedEvent.data
     * @public
     * @type object
     */
    data: DeepPartial<TCardData>;
};

/**
 * @docid _ui_card_view_CardInsertingEvent
 * @public
 * @type object
 * @inherits EventInfo,Cancelable
 */
export type CardInsertingEvent<TCardData = unknown> = EventInfo<dxCardView> & Cancelable & {
    /**
     * @docid _ui_card_view_CardInsertingEvent.data
     * @public
     * @type object
     */
    data: DeepPartial<TCardData>;
};

/**
 * @docid _ui_card_view_CardRemovedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type CardRemovedEvent<TCardData = unknown, TKey = unknown> = EventInfo<dxCardView> & {
    /**
     * @docid _ui_card_view_CardRemovedEvent.data
     * @public
     */
    data: TCardData;
    /**
     * @docid _ui_card_view_CardRemovedEvent.key
     * @public
     * @type any
     */
    key: TKey;
};

/**
 * @docid _ui_card_view_CardRemovingEvent
 * @public
 * @type object
 * @inherits EventInfo,Cancelable
 */
export type CardRemovingEvent<TCardData = unknown, TKey = unknown> = EventInfo<dxCardView> & Cancelable & {
    /**
     * @docid _ui_card_view_CardRemovingEvent.data
     * @public
     */
    data: TCardData;
    /**
     * @docid _ui_card_view_CardRemovingEvent.key
     * @public
     * @type any
     */
    key: TKey;
};

/**
 * @docid _ui_card_view_CardUpdatedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type CardUpdatedEvent<TCardData = unknown, TKey = unknown> = EventInfo<dxCardView> & {
    /**
     * @docid _ui_card_view_CardUpdatedEvent.data
     * @public
     */
    data: TCardData;
    /**
     * @docid _ui_card_view_CardUpdatedEvent.key
     * @public
     * @type any
     */
    key: TKey;
};

/**
 * @docid _ui_card_view_CardUpdatingEvent
 * @public
 * @type object
 * @inherits EventInfo,Cancelable
 */
export type CardUpdatingEvent<TCardData = unknown, TKey = unknown> = EventInfo<dxCardView> & Cancelable & {
    /**
     * @docid _ui_card_view_CardUpdatingEvent.key
     * @public
     * @type any
     */
    key: TKey;
    /**
     * @docid _ui_card_view_CardUpdatingEvent.oldData
     * @public
     */
    oldData: TCardData;
    /**
     * @docid _ui_card_view_CardUpdatingEvent.newData
     * @public
     * @type object
     */
    newData: DeepPartial<TCardData>;
};

/**
 * @docid _ui_card_view_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TCardData = unknown, TKey = unknown> = EventInfo<dxCardView<TCardData, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_card_view_SavedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SavedEvent = EventInfo<dxCardView> & {
    /**
     * @docid _ui_card_view_SavedEvent.changes
     * @public
     */
    changes: DataChange[];
};

/**
 * @docid _ui_card_view_SavingEvent
 * @public
 * @type object
 * @inherits EventInfo,Cancelable
 */
export type SavingEvent = EventInfo<dxCardView> & Cancelable & {
    /**
     * @docid _ui_card_view_SavingEvent.promise
     * @type Promise<void>
     * @public
     */
    promise?: PromiseLike<void>;
    /**
     * @docid _ui_card_view_SavingEvent.changes
     * @public
     */
    changes: DataChange[];
};

// #endregion

// #region Selection

/**
 * @public
 * @docid
 */
export type SelectionConfiguration = {
    /**
     * @public
     * @docid
     */
    allowSelectAll?: boolean;
    /**
     * @public
     * @docid
     */
    mode?: SingleMultipleOrNone;
    /**
     * @public
     * @docid
     */
    selectAllMode?: SelectAllMode;
    /**
     * @public
     * @docid
     */
    showCheckBoxesMode?: SelectionColumnDisplayMode;
};

/**
 * @docid _ui_card_view_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectionChangedEvent<TCardData = unknown, TKey = unknown> = EventInfo<dxCardView> & {
    /**
     * @docid _ui_card_view_SelectionChangedEvent.selectedCardsData
     * @public
     */
    selectedCardsData: Array<TCardData>;
    /**
     * @docid _ui_card_view_SelectionChangedEvent.selectedCardKeys
     * @public
     */
    selectedCardKeys: Array<TKey>;
    /**
     * @docid _ui_card_view_SelectionChangedEvent.currentSelectedCardKeys
     * @public
     */
    currentSelectedCardKeys: Array<TKey>;
    /**
     * @docid _ui_card_view_SelectionChangedEvent.currentDeselectedCardKeys
     * @public
     */
    currentDeselectedCardKeys: Array<TKey>;
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
export type ContextMenuPreparingEvent<TCardData = unknown> = EventInfo<dxCardView> & {
  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.items
   * @public
   */
  items?: any[];
  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.target
   * @public
   */
  readonly target: ContextMenuTarget;
  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.targetElement
   * @public
   */
  readonly targetElement: DxElement;
  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.columnIndex
   * @public
   */
  readonly columnIndex?: number;
  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.column
   * @public
   */
  readonly column?: Column;
  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.cardIndex
   * @public
   */
  readonly cardIndex?: number;
  /**
   * @docid _ui_card_view_ContextMenuPreparingEvent.card
   * @public
   */
  readonly card?: TCardData;
};

// #endregion

// #region KBN

/**
 * @docid _ui_card_view_FocusedCardChanged
 * @public
 * @type object
 * @inherits EventInfo,WithCardInfo
 */
export type FocusedCardChanged = EventInfo<dxCardView> & WithCardInfo;

// #endregion

/**
 * @namespace DevExpress.ui
 * @public
 * @docid
 * @deprecated use Properties instead
 */
export interface dxCardViewOptions<TCardData = unknown, TKey = unknown> extends Omit<WidgetOptions<dxCardView>, 'onOptionChanged'> {

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
    keyExpr?: string | string[]; // can be undefined because of default?
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
     */
    scrolling?: {
        /**
         * @docid
         * @default true
         * @default false &for(non-touch_devices)
         * @public
         */
        scrollByContent?: boolean;
        /**
         * @docid
         * @default false
         * @public
         */
        scrollByThumb?: boolean;
        /**
         * @docid
         * @default 'onHover' &for(desktop)
         * @default 'onScroll'
         * @public
         */
        showScrollbar?: ScrollbarMode;
        /**
         * @docid
         * @default "auto"
         * @public
         */
        useNative?: boolean | Mode;
    };
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
    noDataTemplate?: template | ((e: { text: string }, container: DxElement) => string | UserDefinedElement);
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
    cardTemplate?: template | ((data: CardTemplateData, container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    cardContentTemplate?: template | ((data: CardTemplateData, container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    fieldHintEnabled?: boolean;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardClickEvent}
     * @action
     */
    onCardClick?: (e: CardClickEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardDblClickEvent}
     * @action
     */
    onCardDblClick?: (e: CardDblClickEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardPreparedEvent}
     * @action
     */
    onCardPrepared?: (e: CardPreparedEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:FieldCaptionClickEvent}
     * @action
     */
    onFieldCaptionClick?: (e: FieldCaptionClickEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:FieldCaptionDblClickEvent}
     * @action
     */
    onFieldCaptionDblClick?: (e: FieldCaptionDblClickEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:FieldCaptionPreparedEvent}
     * @action
     */
    onFieldCaptionPrepared?: (e: FieldCaptionPreparedEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:FieldValueClickEvent}
     * @action
     */
    onFieldValueClick?: (e: FieldValueClickEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:FieldValueDblClickEvent}
     * @action
     */
    onFieldValueDblClick?: (e: FieldValueDblClickEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:FieldValuePreparedEvent}
     * @action
     */
    onFieldValuePrepared?: (e: FieldValuePreparedEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardHoverChangedEvent}
     * @action
     */
    onCardHoverChanged?: (e: CardHoverChangedEvent) => void;
    /**
     * @docid
     * @public
     */
    cardFooterTemplate?: template | ((data: CardTemplateData, container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    cardHeader?: CardHeader;

    /**
     * @docid
     * @public
     */
    hoverStateEnabled?: boolean;

    // #endregion

    // #region Toolbar

    /**
     * @docid
     * @type dxCardViewToolbar
     * @public
     */
    toolbar?: Toolbar;

    // #endregion

    /**
     * @docid
     * @public
     */
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
     * @type dxPopupOptions
     */
    filterBuilderPopup?: PopupProperties;
    /**
     * @docid
     * @public
     */
    filterBuilder?: dxFilterBuilderOptions;
    /**
     * @docid
     * @public
     */
    filterPanel?: FilterPanel<dxCardView>;
    /**
     * @docid
     * @public
     */
    columnChooser?: ColumnChooser;
    /**
     * @docid
     * @public
     */
    searchPanel?: SearchPanel;
    /**
     * @docid
     * @public
     */
    headerFilter?: HeaderFilter;

    // #region Editing

    /**
     * @docid
     * @type dxCardViewEditing
     * @public
     */
    editing?: Editing<TCardData, TKey>;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:EditCanceledEvent}
     * @action
     */
    onEditCanceled?: (e: EditCanceledEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:EditCancelingEvent}
     * @action
     */
    onEditCanceling?: (e: EditCancelingEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:EditingStartEvent}
     * @action
     */
    onEditingStart?: (e: EditingStartEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:InitNewCardEvent}
     * @action
     */
    onInitNewCard?: (e: InitNewCardEvent<TCardData>) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardInsertedEvent}
     * @action
     */
    onCardInserted?: (e: CardInsertedEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardInsertingEvent}
     * @action
     */
    onCardInserting?: (e: CardInsertingEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardRemovedEvent}
     * @action
     */
    onCardRemoved?: (e: CardRemovedEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardRemovingEvent}
     * @action
     */
    onCardRemoving?: (e: CardRemovingEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardUpdatedEvent}
     * @action
     */
    onCardUpdated?: (e: CardUpdatedEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:CardUpdatingEvent}
     * @action
     */
    onCardUpdating?: (e: CardUpdatingEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:OptionChangedEvent}
     * @action
     */
    onOptionChanged?: (e: OptionChangedEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:SavedEvent}
     * @action
     */
    onSaved?: (e: SavedEvent) => void;
    /**
     * @docid
     * @public
     * @type_function_param1 e:{ui/card_view:SavingEvent}
     * @action
     */
    onSaving?: (e: SavingEvent) => void;

    // #endregion

    // #region Selection

    /**
     * @docid
     * @fires dxCardViewOptions.onSelectionChanged
     * @public
     */
    selectedCardKeys?: Array<TKey>;
    /**
     * @docid
     * @public
     */
    selection?: SelectionConfiguration;
    /**
     * @docid
     * @type_function_param1 e:{ui/card_view:SelectionChangedEvent}
     * @action
     * @public
     */
    onSelectionChanged?: (e: SelectionChangedEvent) => void;

    // #endregion

    // #region KBN

    /**
     * @docid
     * @type_function_param1 e:{ui/card_view:FocusedCardChanged}
     * @action
     * @public
     */
    onFocusedCardChanged?: (e: FocusedCardChanged) => void;

    // #endregion

    /**
     * @docid
     * @type_function_param1 e:{ui/card_view:ContextMenuPreparingEvent}
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent<TCardData>) => void);
}

/**
* @docid
* @inherits Widget
* @namespace DevExpress.ui
* @public
*/
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

    // #region Editing

    /**
     * @docid
     * @publicName addCard()
     * @public
     */
    addCard(): void;
    /**
     * @docid
     * @publicName cancelEditData()
     * @public
     */
    cancelEditData(): void;
    /**
     * @docid
     * @publicName deleteCard(cardIndex)
     * @public
     */
    deleteCard(cardIndex: number): void;
    /**
     * @docid
     * @publicName editCard(cardIndex)
     * @public
     */
    editCard(cardIndex: number): void;
    /**
     * @docid
     * @publicName hasEditData()
     * @public
     */
    hasEditData(): void; // boolean?
    /**
     * @docid
     * @publicName saveEditData()
     * @public
     */
    saveEditData(): void;

    // #endregion

    // #region DataController

    /**
     * @docid
     * @publicName byKey()
     * @public
     */

    byKey(key: TKey): TCardData;
    /**
     * @docid
     * @publicName getDataSource()
     * @public
     */
    getDataSource(): DataSource<TCardData, TKey>;
    /**
     * @docid
     * @publicName keyOf(obj)
     * @public
     */
    keyOf(obj: TCardData): TKey;
    /**
     * @docid
     * @publicName pageCount()
     * @public
     */
    pageCount(): number;
    /**
     * @docid
     * @publicName pageIndex()
     * @public
     */
    pageIndex(): number;
    /**
     * @docid
     * @publicName pageIndex(value)
     * @public
     */
    pageIndex(value: number): void;
    /**
     * @docid
     * @publicName pageSize()
     * @public
     */
    pageSize(): number;
    /**
     * @docid
     * @publicName pageSize(value)
     * @public
     */
    pageSize(value: number): void;
    /**
     * @docid
     * @publicName totalCount()
     * @public
     */
    totalCount(): number;

    // #endregion

    // #region Selection

    /**
     * @docid
     * @publicName selectCards(keys, preserve)
     * @public
     */
    selectCards(keys: Array<TKey>, preserve: boolean): void;
    /**
     * @docid
     * @publicName deselectCards(keys)
     * @public
     */
    deselectCards(keys: Array<TKey>): void;
    /**
     * @docid
     * @publicName selectAll()
     * @public
     */
    selectAll(): void;
    /**
     * @docid
     * @publicName deselectAll()
     * @public
     */
    deselectAll(): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName getSelectedCardsData()
     * @public
     */
    getSelectedCardsData(): Array<TCardData>;
    /**
     * @docid
     * @publicName getSelectedCardKeys()
     * @public
     */
    getSelectedCardKeys(): Array<TKey>;
    /**
     * @docid
     * @publicName isCardSelected(key)
     * @public
     */
    isCardSelected(key: TKey): boolean;

    // #endregion
}

// usually imported / re-exports are right after heading imports,
// plus, some of these types are already exported with direct declarations

export {
    ScrollbarMode,
    DragHighlight,
    Sorting,
    Pager,
    DataErrorOccurredInfo,
    PopupProperties,
    FormProperties,
    ColumnChooser,
    SearchPanel,
    HeaderFilter,
};

/** @public */
export type ExplicitTypes<TCardData = unknown, TKey = unknown> = {
    Properties: Properties<TCardData, TKey>;
};

/** @public */
export type Properties<TCardData = unknown, TKey = unknown> = dxCardViewOptions<TCardData, TKey>;
