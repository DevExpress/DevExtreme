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
    SelectionChangeInfo,
    SelectionChangingEventBase,
} from './collection/ui.collection_widget.base';

import {
    Orientation,
    SingleOrMultiple,
    TabsIconPosition,
    TabsStyle,
} from '../common';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ItemLike = string | Item | any;

export {
    SingleOrMultiple,
    Orientation,
    TabsIconPosition,
    TabsStyle,
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxTabs<TItem, TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabs<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabs<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemHold event handler&apos;s argument.
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabs<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>> & ItemInfo<TItem>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>> & ChangedOptionInfo;

/**
 * The type of the selectionChanging event handler&apos;s argument.
 */
export type SelectionChangingEvent<TItem extends ItemLike = any, TKey = any> = SelectionChangingEventBase<dxTabs<TItem, TKey>>;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>> & SelectionChangeInfo<TItem>;

/**
 * 
 * @deprecated 
 */
export interface dxTabsOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends Properties<TItem, TKey> {}

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTabsBaseOptions<
    TComponent extends dxTabs<TItem, TKey> = dxTabs<any, any>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies icon position relative to the text inside the tab.
     */
    iconPosition?: TabsIconPosition;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<TItem>;
    /**
     * Specifies component orientation.
     */
    orientation?: Orientation;
    /**
     * Specifies whether to repaint only those elements whose data changed.
     */
    repaintChangesOnly?: boolean;
    /**
     * Specifies whether or not an end user can scroll tabs by swiping.
     */
    scrollByContent?: boolean;
    /**
     * Specifies whether or not an end user can scroll tabs.
     */
    scrollingEnabled?: boolean;
    /**
     * Specifies whether the UI component enables an end user to select only a single item or multiple items.
     */
    selectionMode?: SingleOrMultiple;
    /**
     * Specifies whether navigation buttons should be available when tabs exceed the UI component&apos;s width.
     */
    showNavButtons?: boolean;
    /**
     * Specifies the styling mode for the active tab.
     */
    stylingMode?: TabsStyle;
}

/**
 * The Tabs component is a tab strip used to switch between pages or views. This UI component is included in the TabPanel UI component, but you can use Tabs separately as well.
 */
export default class dxTabs<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<Properties<TItem, TKey>, TItem, TKey> { }

export type Item = dxTabsItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTabsItem extends CollectionWidgetItem {
    /**
     * Specifies a badge text for the tab.
     */
    badge?: string;
    /**
     * Specifies the icon to be displayed on the tab.
     */
    icon?: string;
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
    SelectionChangingEvent: SelectionChangingEvent<TItem, TKey>;
};

export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxTabsBaseOptions<dxTabs<TItem, TKey>, TItem, TKey>;

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

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTabsOptions.onContentReady
 * @type_function_param1 e:{ui/tabs:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxTabsOptions.onDisposing
 * @type_function_param1 e:{ui/tabs:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTabsOptions.onInitialized
 * @type_function_param1 e:{ui/tabs:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTabsOptions.onItemClick
 * @type_function_param1 e:{ui/tabs:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxTabsOptions.onItemContextMenu
 * @type_function_param1 e:{ui/tabs:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxTabsOptions.onItemHold
 * @type_function_param1 e:{ui/tabs:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @docid dxTabsOptions.onItemRendered
 * @type_function_param1 e:{ui/tabs:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxTabsOptions.onOptionChanged
 * @type_function_param1 e:{ui/tabs:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxTabsOptions.onSelectionChanging
 * @type_function_param1 e:{ui/tabs:SelectionChangingEvent}
 */
onSelectionChanging?: ((e: SelectionChangingEvent) => void);
/**
 * @docid dxTabsOptions.onSelectionChanged
 * @type_function_param1 e:{ui/tabs:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
///#ENDDEBUG
