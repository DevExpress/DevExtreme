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

import dxTabs, {
    Item as dxTabsItem,
    dxTabsBaseOptions,
} from './tabs';

type ItemLike = string | Item | any;

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxNavBar<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxNavBar<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = Item, TKey = any> = InitializedEventInfo<dxNavBar<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxNavBar<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxNavBar<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxNavBar<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxNavBar<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxNavBar<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxNavBar<TItem, TKey>> & SelectionChangedInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxNavBarOptions<
    TItem extends ItemLike = Item,
    TKey = any,
> extends dxTabsBaseOptions<dxNavBar<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @public
     */
    scrollByContent?: boolean;
}
/**
 * @docid
 * @inherits dxTabs
 * @namespace DevExpress.ui
 * @deprecated dxTabs
 * @public
 */
export default class dxNavBar<
    TItem extends ItemLike = Item,
    TKey = any,
> extends dxTabs<dxNavBarOptions<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxNavBar
 */
export type Item = dxNavBarItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxNavBarItem extends dxTabsItem {
    /**
     * @docid
     * @public
     */
    badge?: string;
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
};

/** @public */
export type Properties<
    TItem extends ItemLike = Item,
    TKey = any,
> = dxNavBarOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = Item,
    TKey = any,
> = Properties<TItem, TKey>;
