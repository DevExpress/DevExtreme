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
    ToolbarItemLocation,
    ToolbarItemComponent,
} from '../common';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

type ItemLike = string | Item | any;

/** @public */
export type LocateInMenuMode = 'always' | 'auto' | 'never';
/** @public */
export type ShowTextMode = 'always' | 'inMenu';

export {
    ToolbarItemLocation,
    ToolbarItemComponent as ToolbarItemWidget,
};

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxToolbar<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxToolbar<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxToolbar<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxToolbar<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxToolbarOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<dxToolbar<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @type string | Array<string | dxToolbarItem | any> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * @docid
     * @type Array<string | dxToolbarItem | any>
     * @fires dxToolbarOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default false
     * @public
     */
    multiline?: boolean;
    /**
     * @docid
     * @default "menuItem"
     * @type_function_param1 itemData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuItemTemplate?: template | ((itemData: TItem, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxToolbar<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<dxToolbarOptions<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxToolbar
 * */
export type Item = dxToolbarItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxToolbarItem extends CollectionWidgetItem {
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @default 'never'
     * @public
     */
    locateInMenu?: LocateInMenuMode;
    /**
     * @docid
     * @default 'center'
     * @public
     */
    location?: ToolbarItemLocation;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    menuItemTemplate?: template | (() => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    options?: any;
    /**
     * @docid
     * @default 'always'
     * @public
     */
    showText?: ShowTextMode;
    /**
     * @docid
     * @public
     */
    widget?: ToolbarItemComponent;
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
};

/** @public */
export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxToolbarOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = any,
    TKey = any,
> = Properties<TItem, TKey>;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered' | 'onSelectionChanged'>;

type Events = CheckedEvents<FilterOutHidden<Properties>, Required<{
/**
 * @skip
 * @docid dxToolbarOptions.onContentReady
 * @type_function_param1 e:{ui/toolbar:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxToolbarOptions.onDisposing
 * @type_function_param1 e:{ui/toolbar:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxToolbarOptions.onInitialized
 * @type_function_param1 e:{ui/toolbar:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxToolbarOptions.onItemClick
 * @type_function_param1 e:{ui/toolbar:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxToolbarOptions.onItemContextMenu
 * @type_function_param1 e:{ui/toolbar:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @skip
 * @docid dxToolbarOptions.onItemHold
 * @type_function_param1 e:{ui/toolbar:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @skip
 * @docid dxToolbarOptions.onItemRendered
 * @type_function_param1 e:{ui/toolbar:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @skip
 * @docid dxToolbarOptions.onOptionChanged
 * @type_function_param1 e:{ui/toolbar:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
}>>;
