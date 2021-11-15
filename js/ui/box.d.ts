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

type ItemLike<TKey> = string | Item<TKey> | any;

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
     * @type Enums.BoxAlign
     * @default 'start'
     * @public
     */
    align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
    /**
     * @docid
     * @type Enums.BoxCrossAlign
     * @default 'start'
     * @public
     */
    crossAlign?: 'center' | 'end' | 'start' | 'stretch';
    /**
     * @docid
     * @type string | Array<string | dxBoxItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey>;
    /**
     * @docid
     * @type Enums.BoxDirection
     * @default 'row'
     * @public
     */
    direction?: 'col' | 'row';
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
     * @type number | Enums.Mode
     * @default 0
     * @public
     */
    baseSize?: number | 'auto';
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
