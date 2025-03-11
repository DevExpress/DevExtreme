/* eslint-disable @typescript-eslint/no-unused-vars */
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
  SelectionChangeInfo,
  SelectionChangingEventBase,
} from './collection/ui.collection_widget.base';

import {
  Orientation,
} from '../common';

type ItemLike<TKey> = Item<TKey> | any;

/**
 * @docid _ui_stepper_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxStepper<TItem, TKey>>;

/**
 * @docid _ui_stepper_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = InitializedEventInfo<dxStepper<TItem, TKey>>;

/**
 * @docid _ui_stepper_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxStepper<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_stepper_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ItemInfo
 */
export type ItemRenderedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxStepper<TItem, TKey>> & ItemInfo<TItem>;

/**
 * @docid _ui_stepper_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxStepper<TItem, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_stepper_SelectionChangingEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo,SelectionChangeInfo
 */
export type SelectionChangingEvent<TItem extends ItemLike<TKey> = any, TKey = any> = SelectionChangingEventBase<dxStepper<TItem, TKey>>;

/**
 * @docid _ui_stepper_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangeInfo
 */
export type SelectionChangedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxStepper<TItem, TKey>> & SelectionChangeInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxStepperOptions<
  TItem extends ItemLike<TKey> = any,
  TKey = any,
> extends CollectionWidgetOptions<dxStepper<TItem, TKey>, TItem, TKey> {
  /**
   * @docid
   * @type string | Array<string | dxStepperItem | any> | Store | DataSource | DataSourceOptions | null
   * @default null
   * @public
   */
  dataSource?: DataSourceLike<TItem, TKey> | null;
  /**
   * @docid
   * @default 'horizontal'
   * @public
   */
  orientation?: Orientation;
  /**
   * @docid
   * @type Array<dxStepperItem | any>
   * @fires dxStepperOptions.onOptionChanged
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
export default class dxStepper<
  TItem extends ItemLike<TKey> = any,
  TKey = any,
> extends CollectionWidget<Properties<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxStepper
 */
export type Item<TKey = any> = dxStepperItem<TKey>;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxStepperItem<TKey = any> extends CollectionWidgetItem {
}

/** @public */
export type ExplicitTypes<
  TItem extends ItemLike<TKey>,
  TKey,
> = {
  Properties: Properties<TItem, TKey>;
  DisposingEvent: DisposingEvent<TItem, TKey>;
  InitializedEvent: InitializedEvent<TItem, TKey>;
  ItemClickEvent: ItemClickEvent<TItem, TKey>;
  ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
  OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
  SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
  SelectionChangingEvent: SelectionChangingEvent<TItem, TKey>;
};

/** @public */
export type Properties<
  TItem extends ItemLike<TKey> = any,
  TKey = any,
> = dxStepperOptions<TItem, TKey>;

/// #DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered' | 'onItemContextMenu' | 'onItemHold' | 'onContentReady'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
 * @hidden
 */
type Events = {
  /**
   * @docid dxStepperOptions.onDisposing
   * @type_function_param1 e:{ui/stepper:DisposingEvent}
   */
  onDisposing?: ((e: DisposingEvent) => void);
  /**
   * @docid dxStepperOptions.onInitialized
   * @type_function_param1 e:{ui/stepper:InitializedEvent}
   */
  onInitialized?: ((e: InitializedEvent) => void);
  /**
   * @docid dxStepperOptions.onItemClick
   * @type_function_param1 e:{ui/stepper:ItemClickEvent}
   */
  onItemClick?: ((e: ItemClickEvent) => void);
  /**
   * @docid dxStepperOptions.onItemRendered
   * @type_function_param1 e:{ui/stepper:ItemRenderedEvent}
   */
  onItemRendered?: ((e: ItemRenderedEvent) => void);
  /**
   * @docid dxStepperOptions.onOptionChanged
   * @type_function_param1 e:{ui/stepper:OptionChangedEvent}
   */
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  /**
   * @docid dxStepperOptions.onSelectionChanging
   * @type_function_param1 e:{ui/stepper:SelectionChangingEvent}
   */
  onSelectionChanging?: ((e: SelectionChangingEvent) => void);
  /**
   * @docid dxStepperOptions.onSelectionChanged
   * @type_function_param1 e:{ui/stepper:SelectionChangedEvent}
   */
  onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
/// #ENDDEBUG
