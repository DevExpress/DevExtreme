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

type ItemLike = string | Item | any;

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxTileView<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxTileView<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = Item, TKey = any> = InitializedEventInfo<dxTileView<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxTileView<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxTileView<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxTileView<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxTileView<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxTileView<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxTileViewOptions<
    TItem extends ItemLike = Item,
    TKey = any,
> extends CollectionWidgetOptions<dxTileView<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default 100
     * @public
     */
    baseItemHeight?: number;
    /**
     * @docid
     * @default 100
     * @public
     */
    baseItemWidth?: number;
    /**
     * @docid
     * @type string | Array<string | dxTileViewItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey>;
    /**
     * @docid
     * @type Enums.Orientation
     * @default 'horizontal'
     * @public
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default 500
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default 20
     * @public
     */
    itemMargin?: number;
    /**
     * @docid
     * @type Array<string | dxTileViewItem | any>
     * @fires dxTileViewOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default 'never'
     * @default 'onScroll' &for(Mac|Android|iOS)
     * @public
     */
    showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTileView<
    TItem extends ItemLike = Item,
    TKey = any,
> extends CollectionWidget<dxTileViewOptions<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @publicName scrollPosition()
     * @return numeric
     * @public
     */
    scrollPosition(): number;
}

/**
 * @public
 * @namespace DevExpress.ui.dxTileView
 */
export type Item = dxTileViewItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxTileViewItem extends CollectionWidgetItem {
    /**
     * @docid
     * @default 1
     * @public
     */
    heightRatio?: number;
    /**
     * @docid
     * @default 1
     * @public
     */
    widthRatio?: number;
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
    TItem extends ItemLike = Item,
    TKey = any,
> = dxTileViewOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = Item,
    TKey = any,
> = Properties<TItem, TKey>;
