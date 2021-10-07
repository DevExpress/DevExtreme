import DataSource, {
    DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

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

/** @public */
export type ContentReadyEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxTileView<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxTileView<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends string | Item<any> | any = any, TKey = any> = InitializedEventInfo<dxTileView<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxTileView<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxTileView<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxTileView<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxTileView<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxTileView<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTileViewOptions<
    TItem extends string | Item<any> | any = any,
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
    dataSource?: string | Array<TItem> | Store<TItem, string | Array<string>, TKey> | DataSource<TItem, string | Array<string>, TKey> | DataSourceOptions<TItem, TItem, TItem, string | Array<string>, TKey>;
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
     * @default false
     * @public
     */
    showScrollbar?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTileView<
    TItem extends string | Item<any> | any = any,
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
export type Item<TItem extends Item<any> | any = any> = dxTileViewItem<TItem>;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxTileViewItem<TItem extends dxTileViewItem<any> | any = any> extends CollectionWidgetItem<TItem> {
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
    TItem extends string | Item<any> | any = any,
    TKey = any,
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
    TItem extends string | Item<any> | any = any,
    TKey = any,
> = dxTileViewOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends string | Item<any> | any = any,
    TKey = any,
> = Properties<TItem, TKey>;

/** @deprecated use Properties instead */
export type IOptions<
    TItem extends string | Item<any> | any = any,
    TKey = any,
> = Properties<TItem, TKey>;
