import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

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
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxAccordion<TItem, TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxAccordion<TItem, TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxAccordion<TItem, TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxAccordion<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxAccordion<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemHold event handler&apos;s argument.
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxAccordion<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxAccordion<TItem, TKey>> & ItemInfo<TItem>;

/**
 * The type of the itemTitleClick event handler&apos;s argument.
 */
export type ItemTitleClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxAccordion<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxAccordion<TItem, TKey>> & ChangedOptionInfo;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxAccordion<TItem, TKey>> & SelectionChangeInfo<TItem>;

/**
 * 
 * @deprecated 
 */
export interface dxAccordionOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<dxAccordion<TItem, TKey>, TItem, TKey> {
    /**
     * A number specifying the time in milliseconds spent on the animation of the expanding or collapsing of a panel.
     */
    animationDuration?: number;
    /**
     * Specifies whether all items can be collapsed or whether at least one item must always be expanded.
     */
    collapsible?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * Specifies whether to render the panel&apos;s content when it is displayed. If false, the content is rendered immediately.
     */
    deferRendering?: boolean;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string) | undefined;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies a custom template for items.
     */
    itemTemplate?: template | ((itemData: TItem, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies a custom template for item titles.
     */
    itemTitleTemplate?: template | ((itemData: TItem, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<TItem>;
    /**
     * Specifies whether the UI component can expand several items or only a single item at once.
     */
    multiple?: boolean;
    /**
     * A function that is executed when an accordion item&apos;s title is clicked or tapped.
     */
    onItemTitleClick?: ((e: ItemTitleClickEvent<TItem, TKey>) => void) | string;
    /**
     * Specifies whether to repaint only those elements whose data changed.
     */
    repaintChangesOnly?: boolean;
    /**
     * The index number of the currently expanded item.
     */
    selectedIndex?: number;
}
/**
 * The Accordion UI component contains several panels displayed one under another. These panels can be collapsed or expanded by an end user, which makes this UI component very useful for presenting information in a limited amount of space.
 */
export default class dxAccordion<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<dxAccordionOptions<TItem, TKey>, TItem, TKey> {
    /**
     * Collapses an item with a specific index.
     */
    collapseItem(index: number): DxPromise<void>;
    /**
     * Expands an item with a specific index.
     */
    expandItem(index: number): DxPromise<void>;
    /**
     * Updates the dimensions of the UI component contents.
     */
    updateDimensions(): DxPromise<void>;
}

export type Item = dxAccordionItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxAccordionItem extends CollectionWidgetItem {
    /**
     * Specifies the icon to be displayed in the panel&apos;s title.
     */
    icon?: string;
    /**
     * Specifies text displayed for the UI component item title.
     */
    title?: string;
    /**
     * Specifies a template that should be used to render the title for this item only.
     */
    titleTemplate?: template | (() => string | UserDefinedElement);
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
    ItemTitleClickEvent: ItemTitleClickEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
};

export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxAccordionOptions<TItem, TKey>;

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
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onItemTitleClick'>;

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
