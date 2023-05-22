import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetOptions,
    ItemLike,
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent<
    TItem extends ItemLike = any,
    TKey = any,
> = EventInfo<dxValidationSummary<TItem, TKey>>;

/** @public */
export type DisposingEvent<
    TItem extends ItemLike = any,
    TKey = any,
> = EventInfo<dxValidationSummary<TItem, TKey>>;

/** @public */
export type InitializedEvent<
    TItem extends ItemLike = any,
    TKey = any,
> = InitializedEventInfo<dxValidationSummary<TItem, TKey>>;

/** @public */
export type ItemClickEvent<
    TItem extends ItemLike = any,
    TKey = any,
> = NativeEventInfo<dxValidationSummary<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<
    TItem extends ItemLike = any,
    TKey = any,
> = EventInfo<dxValidationSummary<TItem, TKey>> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxValidationSummaryOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<dxValidationSummary<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @ref
     * @public
     */
    validationGroup?: string;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxValidationSummary<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<dxValidationSummaryOptions<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @publicName refreshValidationGroup()
     * @public
     */
    refreshValidationGroup(): void;
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
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
};

/** @public */
export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxValidationSummaryOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = any,
    TKey = any,
> = Properties<TItem, TKey>;

///#DEBUG
type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemContextMenu' | 'onItemDeleted' | 'onItemDeleting' | 'onItemHold' | 'onItemRendered' | 'onItemReordered' | 'onItemSelect' | 'onSelectionChanged'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxValidationSummaryOptions.onContentReady
 * @type_function_param1 e:{ui/validation_summary:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxValidationSummaryOptions.onDisposing
 * @type_function_param1 e:{ui/validation_summary:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxValidationSummaryOptions.onInitialized
 * @type_function_param1 e:{ui/validation_summary:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxValidationSummaryOptions.onItemClick
 * @type_function_param1 e:{ui/validation_summary:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxValidationSummaryOptions.onOptionChanged
 * @type_function_param1 e:{ui/validation_summary:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
