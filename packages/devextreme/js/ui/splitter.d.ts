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
 * @docid _ui_splitter_ResizeInfo
 * @hidden
 */
export interface ResizeInfo {
    /** @docid _ui_splitter_ResizeInfo.handleElement */
    readonly handleElement?: DxElement;
}

type ItemLike<TKey> = string | Item<TKey> | any;

export {
    Mode,
};

/**
 * @docid _ui_splitter_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>>;

/**
 * @docid _ui_splitter_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>>;

/**
 * @docid _ui_splitter_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = InitializedEventInfo<dxSplitter<TItem, TKey>>;

/**
 * @docid _ui_splitter_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_splitter_ItemContextMenuEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemContextMenuEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_splitter_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ItemInfo
 */
export type ItemRenderedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>> & ItemInfo<TItem>;

/**
 * @docid _ui_splitter_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = EventInfo<dxSplitter<TItem, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_splitter_ResizeEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo,_ui_splitter_ResizeInfo
 */
export type ResizeEvent<TKey = any> = Cancelable & NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @docid _ui_splitter_ResizeStartEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo,_ui_splitter_ResizeInfo
 */
export type ResizeStartEvent<TKey = any> = Cancelable & NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @docid _ui_splitter_ResizeEndEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,_ui_splitter_ResizeInfo
 */
export type ResizeEndEvent<TKey = any> = NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @docid _ui_splitter_ItemCollapsedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemCollapsedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ItemInfo<TKey>;

/**
 * @docid _ui_splitter_ItemExpandedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemExpandedEvent<TItem extends ItemLike<TKey> = any, TKey = any> = NativeEventInfo<dxSplitter<TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & ItemInfo<TKey>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxSplitterOptions<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidgetOptions<dxSplitter<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @type string | Array<dxSplitterItem> | Store | DataSource | DataSourceOptions | null
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
     * @type Array<dxSplitterItem>
     * @fires dxSplitterOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default true
     * @public
     */
    allowKeyboardNavigation?: boolean;
    /**
     * @docid
     * @default 8
     * @public
     */
    separatorSize?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/splitter:ResizeEvent}
     * @action
     * @public
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/splitter:ResizeEndEvent}
     * @action
     * @public
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/splitter:ResizeStartEvent}
     * @action
     * @public
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/splitter:ItemExpandedEvent}
     * @action
     * @public
     */
    onItemExpanded?: ((e: ItemExpandedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/splitter:ItemCollapsedEvent}
     * @action
     * @public
     */
    onItemCollapsed?: ((e: ItemCollapsedEvent) => void);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSplitter<
    TItem extends ItemLike<TKey> = any,
    TKey = any,
> extends CollectionWidget<Properties<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxSplitter
 */
export type Item<TKey = any> = dxSplitterItem<TKey>;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxSplitterItem<TKey = any> extends CollectionWidgetItem {
    /**
     * @docid
     * @default undefined
     * @public
     * @type dxSplitterOptions | undefined
     */
    splitter?: Properties<any, TKey> | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    size?: number | string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxSize?: number | string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    minSize?: number | string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    collapsedSize?: number | string | undefined;
    /**
     * @docid
     * @default false
     * @public
     */
    collapsed?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    collapsible?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    resizable?: boolean;
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
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
};

/** @public */
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
