import { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

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

export type Distribution = 'center' | 'end' | 'space-around' | 'space-between' | 'start';
export type CrosswiseDistribution = 'center' | 'end' | 'start' | 'stretch';
export type BoxDirection = 'col' | 'row';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxBox<TItem, TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxBox<TItem, TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = InitializedEventInfo<dxBox<TItem, TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxBox<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxBox<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemHold event handler&apos;s argument.
 */
export type ItemHoldEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxBox<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxBox<TItem, TKey>> & ItemInfo<TItem>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxBox<TItem, TKey>> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 */
export interface dxBoxOptions<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidgetOptions<dxBox<TItem, TKey>, TItem, TKey> {
    /**
     * Specifies how UI component items are aligned along the main direction.
     */
    align?: Distribution;
    /**
     * Specifies how UI component items are aligned cross-wise.
     */
    crossAlign?: CrosswiseDistribution;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * Specifies the direction of item positioning in the UI component.
     */
    direction?: BoxDirection;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<TItem>;
}
/**
 * The Box UI component allows you to arrange various elements within it. Separate and adaptive, the Box UI component acts as a building block for the layout.
 */
export default class dxBox<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidget<dxBoxOptions<TItem, TKey>, TItem, TKey> { }

export type Item<TKey = any> = dxBoxItem<TKey>;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxBoxItem<TKey = any> extends CollectionWidgetItem {
    /**
     * Specifies the base size of an item element along the main direction.
     */
    baseSize?: number | string;
    /**
     * Holds a Box configuration object for the item.
     */
    box?: dxBoxOptions<any, TKey> | undefined;
    /**
     * Specifies the ratio value used to count the item element size along the main direction.
     */
    ratio?: number;
    /**
     * A factor that defines how much an item shrinks relative to the rest of the items in the container.
     */
    shrink?: number;
}

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

export type Properties<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = dxBoxOptions<TItem, TKey>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = Properties<TItem, TKey>;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered' | 'onSelectionChanging' | 'onSelectionChanged'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxBoxOptions.onContentReady
 * @type_function_param1 e:{ui/box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxBoxOptions.onDisposing
 * @type_function_param1 e:{ui/box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxBoxOptions.onInitialized
 * @type_function_param1 e:{ui/box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxBoxOptions.onItemClick
 * @type_function_param1 e:{ui/box:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxBoxOptions.onItemContextMenu
 * @type_function_param1 e:{ui/box:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxBoxOptions.onItemHold
 * @type_function_param1 e:{ui/box:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @docid dxBoxOptions.onItemRendered
 * @type_function_param1 e:{ui/box:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
