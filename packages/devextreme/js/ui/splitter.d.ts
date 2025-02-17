/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSourceLike } from '../data/data_source';

import {
    Cancelable,
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
    DxElement,
} from '../core/element';

import {
    Mode,
    Orientation,
} from '../common';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ResizeInfo {
    /**
     * A resize handle element.
     */
    readonly handleElement?: DxElement;
}

type ItemLike<TKey> = string | Item<TKey> | any;

export {
    Mode,
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = InitializedEventInfo<dxSplitter<TItem, TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>> & ItemInfo<TItem>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>> & ChangedOptionInfo;

/**
 * The type of the resize event handler&apos;s argument.
 */
export type ResizeEvent<TKey = any> = Cancelable & NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ResizeInfo;

/**
 * The type of the resizeStart event handler&apos;s argument.
 */
export type ResizeStartEvent<TKey = any> = Cancelable & NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ResizeInfo;

/**
 * The type of the resizeEnd event handler&apos;s argument.
 */
export type ResizeEndEvent<TKey = any> = NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ResizeInfo;

/**
 * The type of the itemCollapsed event handler&apos;s argument.
 */
export type ItemCollapsedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ItemInfo<TKey>;

/**
 * The type of the itemExpanded event handler&apos;s argument.
 */
export type ItemExpandedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ItemInfo<TKey>;

/**
 * 
 * @deprecated 
 */
export interface dxSplitterOptions<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidgetOptions<dxSplitter<TItem, TKey>, TItem, TKey> {
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * Specifies item orientation (layout).
     */
    orientation?: Orientation;
    /**
     * An array of items (panes) displayed by the UI component.
     */
    items?: Array<TItem>;
    /**
     * Specifies whether to allow the Splitter to take focus and allow keyboard navigation.
     */
    allowKeyboardNavigation?: boolean;
    /**
     * Specifies the size of a separator bar in pixels.
     */
    separatorSize?: number;
    /**
     * A function that is executed each time an item (pane) is resized by one pixel.
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * A function that is called when resizing ends.
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * A function that is called when resizing starts.
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * A function that is executed after an item (pane) is expanded.
     */
    onItemExpanded?: ((e: ItemExpandedEvent) => void);
    /**
     * A function that is executed after an item (pane) is collapsed.
     */
    onItemCollapsed?: ((e: ItemCollapsedEvent) => void);
}
/**
 * Splitter is a UI component that allows you to divide a page or section into multiple adjustable panes.
 */
export default class dxSplitter<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidget<Properties<TItem, TKey>, TItem, TKey> { }

export type Item<TKey = any> = dxSplitterItem<TKey>;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSplitterItem<TKey = any> extends CollectionWidgetItem {
    /**
     * Specifies a splitter inside an item (pane).
     */
    splitter?: Properties<any, TKey> | undefined;
    /**
     * Specifies the initial size of an item (pane) in pixels or as a percentage. The size changes after any layout alteration.
     */
    size?: number | string | undefined;
    /**
     * Specifies the maximum size of an item (pane) in pixels or as a percentage.
     */
    maxSize?: number | string | undefined;
    /**
     * Specifies the minimum size of an item (pane) in pixels or as a percentage.
     */
    minSize?: number | string | undefined;
    /**
     * Specifies the size of a collapsible item (pane) when collapsed in pixels or as a percentage.
     */
    collapsedSize?: number | string | undefined;
    /**
     * Specifies whether an item (pane) is initially collapsed.
     */
    collapsed?: boolean;
    /**
     * Specifies whether an item (pane) is collapsible.
     */
    collapsible?: boolean;
    /**
     * Specifies whether an item (pane) is resizable.
     */
    resizable?: boolean;
}

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
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
};

export type Properties<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> = dxSplitterOptions<TItem, TKey>;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered' | 'onSelectionChanging' | 'onSelectionChanged' | 'onItemHold'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onResize' | 'onResizeEnd' | 'onResizeStart' | 'onItemExpanded' | 'onItemCollapsed'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxSplitterOptions.onContentReady
 * @type_function_param1 e:{ui/splitter:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxSplitterOptions.onDisposing
 * @type_function_param1 e:{ui/splitter:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxSplitterOptions.onInitialized
 * @type_function_param1 e:{ui/splitter:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxSplitterOptions.onItemClick
 * @type_function_param1 e:{ui/splitter:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxSplitterOptions.onItemContextMenu
 * @type_function_param1 e:{ui/splitter:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxSplitterOptions.onItemRendered
 * @type_function_param1 e:{ui/splitter:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxSplitterOptions.onOptionChanged
 * @type_function_param1 e:{ui/splitter:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
