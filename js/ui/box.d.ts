import { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
} from './collection/ui.collection_widget.base';

import {
    Mode,
} from '../common';

type ItemLike<TKey> = string | Item<TKey> | any;

export {
    Mode,
};

/** @public */
export type Distribution = 'center' | 'end' | 'space-around' | 'space-between' | 'start';
/** @public */
export type CrosswiseDistribution = 'center' | 'end' | 'start' | 'stretch';
/** @public */
export type BoxDirection = 'col' | 'row';

/** @public */
export type ContentReadyEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxBox<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxBox<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = InitializedEventInfo<dxBox<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxBox<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxBox<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxBox<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxBox<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxBox<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxBoxOptions<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidgetOptions<dxBox<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @default 'start'
     * @public
     */
    align?: Distribution;
    /**
     * @docid
     * @default 'start'
     * @public
     */
    crossAlign?: CrosswiseDistribution;
    /**
     * @docid
     * @type string | Array<string | dxBoxItem | any> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * @docid
     * @default 'row'
     * @public
     */
    direction?: BoxDirection;
    /**
     * @docid
     * @type Array<string | dxBoxItem | any>
     * @fires dxBoxOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxBox<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidget<dxBoxOptions<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxBox
 */
export type Item<TKey = any> = dxBoxItem<TKey>;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxBoxItem<TKey = any> extends CollectionWidgetItem {
    /**
     * @docid
     * @default 0
     * @public
     */
    baseSize?: number | Mode;
    /**
     * @docid
     * @default undefined
     * @public
     * @type dxBoxOptions
     */
    box?: dxBoxOptions<any, TKey>;
    /**
     * @docid
     * @default 0
     * @public
     */
    ratio?: number;
    /**
     * @docid
     * @default 1
     * @public
     */
    shrink?: number;
}

/** @public */
export type ExplicitTypes<
    TItem extends ItemLike<TKey>,
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
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = dxBoxOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = Properties<TItem, TKey>;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered' | 'onSelectionChanged'>;

type Events = CheckedEvents<FilterOutHidden<Properties>, Required<{
/**
 * @skip
 * @docid dxBoxOptions.onContentReady
 * @type_function_param1 e:{ui/box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxBoxOptions.onDisposing
 * @type_function_param1 e:{ui/box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxBoxOptions.onInitialized
 * @type_function_param1 e:{ui/box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxBoxOptions.onItemClick
 * @type_function_param1 e:{ui/box:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxBoxOptions.onItemContextMenu
 * @type_function_param1 e:{ui/box:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @skip
 * @docid dxBoxOptions.onItemHold
 * @type_function_param1 e:{ui/box:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @skip
 * @docid dxBoxOptions.onItemRendered
 * @type_function_param1 e:{ui/box:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @skip
 * @docid dxBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
}>>;
