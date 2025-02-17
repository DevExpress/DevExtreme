import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    ToolbarItemLocation,
    ToolbarItemComponent,
} from '../common';

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

type ItemLike = string | Item | any;

export type LocateInMenuMode = 'always' | 'auto' | 'never';
export type ShowTextMode = 'always' | 'inMenu';

export {
    ToolbarItemLocation,
    ToolbarItemComponent as ToolbarItemWidget,
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxToolbar<TItem, TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxToolbar<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxToolbar<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemHold event handler&apos;s argument.
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxToolbar<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>> & ItemInfo<TItem>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxToolbar<TItem, TKey>> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 */
export interface dxToolbarOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<dxToolbar<TItem, TKey>, TItem, TKey> {
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<TItem>;
    /**
     * Specifies whether or not the Toolbar arranges items into multiple lines when their combined width exceeds the Toolbar width.
     */
    multiline?: boolean;
    /**
     * Specifies a custom template for menu items.
     */
    menuItemTemplate?: template | ((itemData: TItem, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
}
/**
 * The Toolbar is a UI component containing items that usually manage screen content. Those items can be plain text or UI components.
 */
export default class dxToolbar<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<dxToolbarOptions<TItem, TKey>, TItem, TKey> { }

export type Item = dxToolbarItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxToolbarItem extends CollectionWidgetItem {
    /**
     * Specifies a CSS class to be applied to the item.
     */
    cssClass?: string | undefined;
    /**
     * Specifies when to display an item in the toolbar&apos;s overflow menu.
     */
    locateInMenu?: LocateInMenuMode;
    /**
     * Specifies a location for the item on the toolbar.
     */
    location?: ToolbarItemLocation;
    /**
     * Specifies a template that should be used to render a menu item.
     */
    menuItemTemplate?: template | (() => string | UserDefinedElement);
    /**
     * Configures the DevExtreme UI component used as a toolbar item.
     */
    options?: any;
    /**
     * Specifies when to display the text for the UI component item.
     */
    showText?: ShowTextMode;
    /**
     * A UI component that presents a toolbar item. To configure it, use the options object.
     */
    widget?: ToolbarItemComponent;
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
> = dxToolbarOptions<TItem, TKey>;

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
 * @docid dxToolbarOptions.onContentReady
 * @type_function_param1 e:{ui/toolbar:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxToolbarOptions.onDisposing
 * @type_function_param1 e:{ui/toolbar:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxToolbarOptions.onInitialized
 * @type_function_param1 e:{ui/toolbar:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxToolbarOptions.onItemClick
 * @type_function_param1 e:{ui/toolbar:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxToolbarOptions.onItemContextMenu
 * @type_function_param1 e:{ui/toolbar:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxToolbarOptions.onItemHold
 * @type_function_param1 e:{ui/toolbar:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @docid dxToolbarOptions.onItemRendered
 * @type_function_param1 e:{ui/toolbar:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxToolbarOptions.onOptionChanged
 * @type_function_param1 e:{ui/toolbar:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
