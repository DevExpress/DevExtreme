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
export type ContentReadyEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends string | Item<any> | any = any, TKey = any> = InitializedEventInfo<dxResponsiveBox<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxResponsiveBoxOptions<
  TItem extends string | Item<any> | any = any,
  TKey = any,
  > extends CollectionWidgetOptions<dxResponsiveBox<TItem, TKey>, TItem, TKey> {
  /**
   * @docid
   * @public
   */
  cols?: Array<{
    /**
     * @docid
     * @type number | Enums.Mode
     * @default 0
     */
    baseSize?: number | 'auto';
    /**
     * @docid
     * @default 1
     */
    ratio?: number;
    /**
     * @docid
     * @default undefined
     */
    screen?: string;
    /**
     * @docid
     * @default 1
     */
    shrink?: number;
  }>;
  /**
   * @docid
   * @type string | Array<string | dxResponsiveBoxItem | any> | Store | DataSource | DataSourceOptions
   * @default null
   * @public
   */
  dataSource?: string | Array<TItem> | Store<TItem, string | Array<string>, TKey> | DataSource<TItem, string | Array<string>, TKey> | DataSourceOptions<TItem, TItem, TItem, string | Array<string>, TKey>;
  /**
   * @docid
   * @default '100%'
   * @public
   */
  height?: number | string | (() => number | string);
  /**
   * @docid
   * @type Array<string | dxResponsiveBoxItem | any>
   * @fires dxResponsiveBoxOptions.onOptionChanged
   * @public
   */
  items?: Array<TItem>;
  /**
   * @docid
   * @public
   */
  rows?: Array<{
    /**
     * @docid
     * @type number | Enums.Mode
     * @default 0
     */
    baseSize?: number | 'auto';
    /**
     * @docid
     * @default 1
     */
    ratio?: number;
    /**
     * @docid
     * @default undefined
     */
    screen?: string;
    /**
     * @docid
     * @default 1
     */
    shrink?: number;
  }>;
  /**
   * @docid
   * @default null
   * @public
   */
  screenByWidth?: Function;
  /**
   * @docid
   * @default ""
   * @public
   */
  singleColumnScreen?: string;
  /**
   * @docid
   * @default '100%'
   * @public
   */
  width?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxResponsiveBox<
  TItem extends string | dxResponsiveBoxItem<any> | any = any,
  TKey = any,
  > extends CollectionWidget<dxResponsiveBoxOptions<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxResponsiveBox
 */
export type Item<TItem extends Item<any> | any = any> = dxResponsiveBoxItem<TItem>;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxResponsiveBoxItem<TItem extends dxResponsiveBoxItem<any> | any = any> extends CollectionWidgetItem<TItem> {
  /**
   * @docid
   * @public
   */
  location?: {
    /**
     * @docid
     */
    col?: number;
    /**
     * @docid
     * @default undefined
     */
    colspan?: number;
    /**
     * @docid
     */
    row?: number;
    /**
     * @docid
     * @default undefined
     */
    rowspan?: number;
    /**
     * @docid
     * @default undefined
     */
    screen?: string;
  } | Array<{ col?: number; colspan?: number; row?: number; rowspan?: number; screen?: string }>;
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
  > = dxResponsiveBoxOptions<TItem, TKey>;

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
