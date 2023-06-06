import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import {
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import dxMultiView, {
    Item as dxMultiViewItem,
    dxMultiViewBaseOptions,
} from './multi_view';

type ItemLike = string | Item | any;

/**
 * @docid
 * @hidden
 */
export interface TabPanelItemInfo<TItem extends ItemLike> {
    readonly itemData?: TItem;
    readonly itemElement?: DxElement;
}

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxTabPanel<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabPanel<TItem, TKey>> & SelectionChangedInfo<TItem>;

/** @public */
export type TitleClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & TabPanelItemInfo<TItem>;

/** @public */
export type TitleHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabPanel<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & TabPanelItemInfo<TItem>;

/** @public */
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
     * @default false &for(non-touch_devices)
     * @public
     */
    swipeEnabled?: boolean;
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
> extends dxMultiView<dxTabPanelOptions<TItem, TKey>, TItem, TKey> { }

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
 * @skip
 * @docid dxTabPanelOptions.onContentReady
 * @type_function_param1 e:{ui/tab_panel:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxTabPanelOptions.onDisposing
 * @type_function_param1 e:{ui/tab_panel:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxTabPanelOptions.onInitialized
 * @type_function_param1 e:{ui/tab_panel:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxTabPanelOptions.onItemClick
 * @type_function_param1 e:{ui/tab_panel:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxTabPanelOptions.onItemContextMenu
 * @type_function_param1 e:{ui/tab_panel:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @skip
 * @docid dxTabPanelOptions.onItemHold
 * @type_function_param1 e:{ui/tab_panel:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @skip
 * @docid dxTabPanelOptions.onItemRendered
 * @type_function_param1 e:{ui/tab_panel:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @skip
 * @docid dxTabPanelOptions.onOptionChanged
 * @type_function_param1 e:{ui/tab_panel:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxTabPanelOptions.onSelectionChanged
 * @type_function_param1 e:{ui/tab_panel:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
///#ENDDEBUG
