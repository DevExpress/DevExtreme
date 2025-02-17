import { DataSourceLike } from '../data/data_source';
import {
    DxPromise,
} from '../core/utils/deferred';

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
    SelectionChangeInfo,
} from './collection/ui.collection_widget.base';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type ItemLike = string | Item | any;

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxGallery<TItem, TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxGallery<TItem, TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxGallery<TItem, TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxGallery<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxGallery<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemHold event handler&apos;s argument.
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxGallery<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxGallery<TItem, TKey>> & ItemInfo<TItem>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxGallery<TItem, TKey>> & ChangedOptionInfo;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxGallery<TItem, TKey>> & SelectionChangeInfo<TItem>;

/**
 * 
 * @deprecated 
 */
export interface dxGalleryOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<dxGallery<TItem, TKey>, TItem, TKey> {
    /**
     * The time, in milliseconds, spent on slide animation.
     */
    animationDuration?: number;
    /**
     * Specifies whether or not to animate the displayed item change.
     */
    animationEnabled?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * A Boolean value specifying whether or not to allow users to switch between items by clicking an indicator.
     */
    indicatorEnabled?: boolean;
    /**
     * Specifies the width of an area used to display a single image.
     */
    initialItemWidth?: number | undefined;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<TItem>;
    /**
     * A Boolean value specifying whether or not to scroll back to the first item after the last item is swiped.
     */
    loop?: boolean;
    /**
     * Specifies the text or HTML markup displayed by the UI component if the item collection is empty.
     */
    noDataText?: string;
    /**
     * The index of the currently active gallery item.
     */
    selectedIndex?: number;
    /**
     * A Boolean value specifying whether or not to display an indicator that points to the selected gallery item.
     */
    showIndicator?: boolean;
    /**
     * A Boolean value that specifies the availability of the &apos;Forward&apos; and &apos;Back&apos; navigation buttons.
     */
    showNavButtons?: boolean;
    /**
     * The time interval in milliseconds, after which the gallery switches to the next item.
     */
    slideshowDelay?: number;
    /**
     * Specifies if the UI component stretches images to fit the total gallery width.
     */
    stretchImages?: boolean;
    /**
     * A Boolean value specifying whether or not to allow users to switch between items by swiping.
     */
    swipeEnabled?: boolean;
    /**
     * Specifies whether or not to display parts of previous and next images along the sides of the current image.
     */
    wrapAround?: boolean;
}
/**
 * The Gallery is a UI component that displays a collection of images in a carousel. The UI component is supplied with various navigation controls that allow a user to switch between images.
 */
export default class dxGallery<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<dxGalleryOptions<TItem, TKey>, TItem, TKey> {
    /**
     * Shows a specific image.
     */
    goToItem(itemIndex: number, animation: boolean): DxPromise<void>;
    /**
     * Shows the next image.
     */
    nextItem(animation: boolean): DxPromise<void>;
    /**
     * Shows the previous image.
     */
    prevItem(animation: boolean): DxPromise<void>;
}

export type Item = dxGalleryItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGalleryItem extends CollectionWidgetItem {
    /**
     * Specifies the text passed to the alt attribute of the image markup element.
     */
    imageAlt?: string;
    /**
     * Specifies the URL of the image displayed by the item.
     */
    imageSrc?: string;
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
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
};

export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxGalleryOptions<TItem, TKey>;

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

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered' | 'onSelectionChanging'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed when the UI component is rendered and each time the component is repainted.
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed when a collection item is clicked or tapped.
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * A function that is executed when a collection item is right-clicked or pressed.
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * A function that is executed when a collection item has been held for a specified period.
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * A function that is executed after a collection item is rendered.
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * A function that is executed when a collection item is selected or selection is canceled.
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
///#ENDDEBUG
