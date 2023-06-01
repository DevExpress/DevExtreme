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

type ItemLike = string | Item | any;

export {
  Mode,
};

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
 * @docid
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
       * @default 0
       */
      baseSize?: number | Mode;
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
       * @default 0
       */
      baseSize?: number | Mode;
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

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered' | 'onSelectionChanged'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxResponsiveBoxOptions.onContentReady
 * @type_function_param1 e:{ui/responsive_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxResponsiveBoxOptions.onDisposing
 * @type_function_param1 e:{ui/responsive_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxResponsiveBoxOptions.onInitialized
 * @type_function_param1 e:{ui/responsive_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxResponsiveBoxOptions.onItemClick
 * @type_function_param1 e:{ui/responsive_box:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxResponsiveBoxOptions.onItemContextMenu
 * @type_function_param1 e:{ui/responsive_box:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @skip
 * @docid dxResponsiveBoxOptions.onItemHold
 * @type_function_param1 e:{ui/responsive_box:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @skip
 * @docid dxResponsiveBoxOptions.onItemRendered
 * @type_function_param1 e:{ui/responsive_box:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @skip
 * @docid dxResponsiveBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/responsive_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
