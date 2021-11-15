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
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

export type ItemLike = string | Item | any;

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<TabsInstance<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<TabsInstance<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<TabsInstance<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<TabsInstance<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>> & SelectionChangedInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxTabsOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends Properties<TItem, TKey> {}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTabsBaseOptions<
    TComponent extends dxTabs<any, TItem, TKey> = dxTabs<any, any, any>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
    /**
     * @docid dxTabsOptions.dataSource
     * @type string | Array<string | dxTabsItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey>;
    /**
     * @docid dxTabsOptions.focusStateEnabled
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxTabsOptions.hoverStateEnabled
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxTabsOptions.items
     * @type Array<string | dxTabsItem | any>
     * @fires dxTabsOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid dxTabsOptions.repaintChangesOnly
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid dxTabsOptions.scrollByContent
     * @default true
     * @default false &for(desktop)
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid dxTabsOptions.scrollingEnabled
     * @default true
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid dxTabsOptions.selectionMode
     * @type Enums.NavSelectionMode
     * @default 'single'
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid dxTabsOptions.showNavButtons
     * @default true
     * @default false &for(mobile_devices)
     * @public
     */
    showNavButtons?: boolean;
}

/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTabs<
    TProperties extends dxTabsOptions<TItem, TKey> = dxTabsOptions<any, any>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<TProperties, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxTabs
 */
export type Item = dxTabsItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxTabsItem extends CollectionWidgetItem {
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

interface TabsInstance<TItem, TKey> extends dxTabs<Properties<TItem, TKey>, TItem, TKey> { }

/** @public */
export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxTabsBaseOptions<TabsInstance<TItem, TKey>, TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = any,
    TKey = any,
> = Properties<TItem, TKey>;
