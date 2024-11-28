import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    Position,
    TabsIconPosition,
    TabsStyle,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

import CollectionWidget, {
    SelectionChangeInfo,
    SelectionChangingEventBase,
} from './collection/ui.collection_widget.base';

import {
    Item as dxMultiViewItem,
    dxMultiViewBaseOptions,
} from './multi_view';

export {
    Position,
    TabsIconPosition,
    TabsStyle,
};

type ItemLike = string | Item | any;

/**
 * @docid
 * @hidden
 */
export interface TabPanelItemInfo<TItem extends ItemLike> {
    /**
     * @docid
     * @type object
     */
    readonly itemData?: TItem;
    /** @docid */
    readonly itemElement?: DxElement;
}

/**
 * @docid _ui_tab_panel_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>>;

/**
 * @docid _ui_tab_panel_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>>;

/**
 * @docid _ui_tab_panel_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxTabPanel<TItem, TKey>>;

/**
 * @docid _ui_tab_panel_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_tab_panel_ItemContextMenuEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_tab_panel_ItemHoldEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_tab_panel_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ItemInfo
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>> & ItemInfo<TItem>;

/**
 * @docid _ui_tab_panel_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_tab_panel_SelectionChangingEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo,SelectionChangeInfo
 */
export type SelectionChangingEvent<TItem extends ItemLike = any, TKey = any> = SelectionChangingEventBase<dxTabPanel<TItem, TKey>>;

/**
 * @docid _ui_tab_panel_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangeInfo
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>> & SelectionChangeInfo<TItem>;

/**
 * @docid _ui_tab_panel_TitleClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,TabPanelItemInfo
 */
export type TitleClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & TabPanelItemInfo<TItem>;

/**
 * @docid _ui_tab_panel_TitleHoldEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,TabPanelItemInfo
 */
export type TitleHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & TabPanelItemInfo<TItem>;

/**
 * @docid _ui_tab_panel_TitleRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,TabPanelItemInfo
 */
export type TitleRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>> & TabPanelItemInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxTabPanelOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends dxMultiViewBaseOptions<dxTabPanel<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @default false
     * @default true &for(Android|iOS)
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @type string | Array<string | dxTabPanelItem | any> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default "title"
     * @type_function_param1 itemData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    itemTitleTemplate?: template | ((itemData: TItem, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default 'start'
     * @default 'top' &for(Material)
     * @default 'top' &for(Fluent)
     * @public
     */
    iconPosition?: TabsIconPosition;
    /**
     * @docid
     * @type Array<string | dxTabPanelItem | any>
     * @fires dxTabPanelOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{ui/tab_panel:TitleClickEvent}
     * @action
     * @public
     */
    onTitleClick?: ((e: TitleClickEvent<TItem, TKey>) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tab_panel:TitleHoldEvent}
     * @action
     * @public
     */
    onTitleHold?: ((e: TitleHoldEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tab_panel:TitleRenderedEvent}
     * @action
     * @public
     */
    onTitleRendered?: ((e: TitleRenderedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showNavButtons?: boolean;
    /**
     * @docid
     * @default 'primary'
     * @default 'secondary' &for(Fluent)
     * @public
     */
    stylingMode?: TabsStyle;
    /**
     * @docid
     * @default false &for(non-touch_devices)
     * @public
     */
    swipeEnabled?: boolean;
    /**
     * @docid
     * @default 'top'
     * @public
     */
    tabsPosition?: Position;
}
/**
 * @docid
 * @inherits dxMultiView
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTabPanel<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<Properties<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxTabPanel
 */
export type Item = dxTabPanelItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxTabPanelItem extends dxMultiViewItem {
    /**
     * @docid
     * @public
     */
    badge?: string;
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    tabTemplate?: template | (() => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    title?: string;
}

/** @public */
export type ExplicitTypes<
    TItem extends ItemLike,
    TKey,
> = {
    Properties: Properties<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TItem, TKey>;
    ItemHoldEvent: ItemHoldEvent<TItem, TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
    SelectionChangingEvent: SelectionChangingEvent<TItem, TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
    TitleClickEvent: TitleClickEvent<TItem, TKey>;
    TitleHoldEvent: TitleHoldEvent<TItem, TKey>;
    TitleRenderedEvent: TitleRenderedEvent<TItem, TKey>;
};

/** @public */
export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxTabPanelOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = any,
    TKey = any,
> = Properties<TItem, TKey>;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onTitleClick' | 'onTitleHold' | 'onTitleRendered'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTabPanelOptions.onContentReady
 * @type_function_param1 e:{ui/tab_panel:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxTabPanelOptions.onDisposing
 * @type_function_param1 e:{ui/tab_panel:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTabPanelOptions.onInitialized
 * @type_function_param1 e:{ui/tab_panel:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTabPanelOptions.onItemClick
 * @type_function_param1 e:{ui/tab_panel:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxTabPanelOptions.onItemContextMenu
 * @type_function_param1 e:{ui/tab_panel:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxTabPanelOptions.onItemHold
 * @type_function_param1 e:{ui/tab_panel:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @docid dxTabPanelOptions.onItemRendered
 * @type_function_param1 e:{ui/tab_panel:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxTabPanelOptions.onOptionChanged
 * @type_function_param1 e:{ui/tab_panel:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxTabPanelOptions.onSelectionChanging
 * @type_function_param1 e:{ui/tab_panel:SelectionChangingEvent}
 * @action
 */
onSelectionChanging?: ((e: SelectionChangingEvent) => void);
/**
 * @docid dxTabPanelOptions.onSelectionChanged
 * @type_function_param1 e:{ui/tab_panel:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
///#ENDDEBUG
