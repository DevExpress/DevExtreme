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
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxResponsiveBox<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxResponsiveBoxOptions<
  TItem extends ItemLike = any,
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
     * @type string | Array<string | dxResponsiveBoxItem | any> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
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
  TItem extends ItemLike = any,
  TKey = any,
  > extends CollectionWidget<dxResponsiveBoxOptions<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxResponsiveBox
 */
export type Item = dxResponsiveBoxItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxResponsiveBoxItem extends CollectionWidgetItem {
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
> = dxResponsiveBoxOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
  TItem extends ItemLike = any,
  TKey = any,
> = Properties<TItem, TKey>;
