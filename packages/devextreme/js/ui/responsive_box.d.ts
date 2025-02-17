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

type ItemLike = string | Item | any;

export {
  Mode,
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxResponsiveBox<TItem, TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemHold event handler&apos;s argument.
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxResponsiveBox<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>> & ItemInfo<TItem>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxResponsiveBox<TItem, TKey>> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 */
export interface dxResponsiveBoxOptions<
  TItem extends ItemLike = any,
  TKey = any,
  > extends CollectionWidgetOptions<dxResponsiveBox<TItem, TKey>, TItem, TKey> {
    /**
     * Specifies the collection of columns for the grid used to position layout elements.
     */
    cols?: Array<{
      /**
       * The column&apos;s base width. Calculated automatically when the singleColumnScreen property arranges all elements in a single column.
       */
      baseSize?: number | string;
      /**
       * The column width ratio.
       */
      ratio?: number;
      /**
       * Decides on which screens the current column is rendered.
       */
      screen?: string | undefined;
      /**
       * A factor that defines how much a column width shrinks relative to the rest of the columns in the container.
       */
      shrink?: number;
    }>;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<TItem>;
    /**
     * Specifies the collection of rows for the grid used to position layout elements.
     */
    rows?: Array<{
      /**
       * The row&apos;s base height. Calculated automatically when the singleColumnScreen property arranges all elements in a single column.
       */
      baseSize?: number | string;
      /**
       * The row height ratio.
       */
      ratio?: number;
      /**
       * Decides on which screens the current row is rendered.
       */
      screen?: string | undefined;
      /**
       * A factor that defines how much a row height shrinks relative to the rest of the rows in the container.
       */
      shrink?: number;
    }>;
    /**
     * Specifies the function returning the size qualifier depending on the screen&apos;s width.
     */
    screenByWidth?: Function;
    /**
     * Specifies on which screens all layout elements should be arranged in a single column. Accepts a single or several size qualifiers separated by a space.
     */
    singleColumnScreen?: string;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * The ResponsiveBox UI component allows you to create an application or a website with a layout adapted to different screen sizes.
 */
export default class dxResponsiveBox<
  TItem extends ItemLike = any,
  TKey = any,
  > extends CollectionWidget<dxResponsiveBoxOptions<TItem, TKey>, TItem, TKey> { }

export type Item = dxResponsiveBoxItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxResponsiveBoxItem extends CollectionWidgetItem {
    /**
     * Specifies the item location and size against the UI component grid.
     */
    location?: {
      /**
       * Specifies which column the element should occupy. Accepts an index from the cols array.
       */
      col?: number;
      /**
       * Specifies how many columns the element should span.
       */
      colspan?: number | undefined;
      /**
       * Specifies which row the element should occupy. Accepts an index from the rows array.
       */
      row?: number;
      /**
       * Specifies how many rows the element should span.
       */
      rowspan?: number | undefined;
      /**
       * Decides on which screens the current location settings should be applied to the element.
       */
      screen?: string | undefined;
    } | Array<{ col?: number; colspan?: number; row?: number; rowspan?: number; screen?: string }>;
}

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

export type Properties<
  TItem extends ItemLike = any,
  TKey = any,
> = dxResponsiveBoxOptions<TItem, TKey>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options<
  TItem extends ItemLike = any,
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
 * @docid dxResponsiveBoxOptions.onContentReady
 * @type_function_param1 e:{ui/responsive_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxResponsiveBoxOptions.onDisposing
 * @type_function_param1 e:{ui/responsive_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxResponsiveBoxOptions.onInitialized
 * @type_function_param1 e:{ui/responsive_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxResponsiveBoxOptions.onItemClick
 * @type_function_param1 e:{ui/responsive_box:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxResponsiveBoxOptions.onItemContextMenu
 * @type_function_param1 e:{ui/responsive_box:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxResponsiveBoxOptions.onItemHold
 * @type_function_param1 e:{ui/responsive_box:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @docid dxResponsiveBoxOptions.onItemRendered
 * @type_function_param1 e:{ui/responsive_box:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxResponsiveBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/responsive_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
