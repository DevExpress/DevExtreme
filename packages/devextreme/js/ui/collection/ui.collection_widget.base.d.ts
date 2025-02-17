import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
} from '../../common';

import DataSource, { DataSourceLike } from '../../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    ItemInfo,
    AsyncCancelable,
} from '../../common/core/events';

import Widget, {
    WidgetOptions,
} from '../widget/ui.widget';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ItemLike = string | CollectionWidgetItem | any;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type SelectionChangingEventBase<TComponent> = AsyncCancelable & EventInfo<TComponent> & SelectionChangeInfo;

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface SelectionChangeInfo<TItem extends ItemLike = any> {
    /**
     * 
     */
    readonly addedItems: Array<TItem>;
    /**
     * 
     */
    readonly removedItems: Array<TItem>;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface CollectionWidgetOptions<
    TComponent extends CollectionWidget<any, TItem, TKey> | any,
    TItem extends ItemLike = any,
    TKey = any,
> extends WidgetOptions<TComponent> {
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * The time period in milliseconds before the onItemHold event is raised.
     */
    itemHoldTimeout?: number;
    /**
     * Specifies a custom template for items.
     */
    itemTemplate?: template | ((itemData: TItem, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<TItem>;
    /**
     * Specifies the key property that provides key values to access data items. Each key value must be unique.
     */
    keyExpr?: string | Function;
    /**
     * Specifies the text or HTML markup displayed by the UI component if the item collection is empty.
     */
    noDataText?: string;
    /**
     * A function that is executed when a collection item is clicked or tapped.
     */
    onItemClick?: ((e: NativeEventInfo<TComponent, MouseEvent | PointerEvent> & ItemInfo<TItem>) => void) | string;
    /**
     * A function that is executed when a collection item is right-clicked or pressed.
     */
    onItemContextMenu?: ((e: NativeEventInfo<TComponent, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>) => void);
    /**
     * A function that is executed when a collection item has been held for a specified period.
     */
    onItemHold?: ((e: NativeEventInfo<TComponent, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>) => void);
    /**
     * A function that is executed after a collection item is rendered.
     */
    onItemRendered?: ((e: EventInfo<TComponent> & ItemInfo<TItem>) => void);
    /**
     * A function that is called before selection changes.
     */
    onSelectionChanging?: ((e: SelectionChangingEventBase<TComponent>) => void);
    /**
     * A function that is called after selection changes.
     */
    onSelectionChanged?: ((e: EventInfo<TComponent> & SelectionChangeInfo<TItem>) => void);
    /**
     * The index of the currently selected UI component item.
     */
    selectedIndex?: number;
    /**
     * The selected item object.
     */
    selectedItem?: TItem;
    /**
     * Specifies an array of currently selected item keys.
     */
    selectedItemKeys?: Array<TKey>;
    /**
     * An array of currently selected item objects.
     */
    selectedItems?: Array<TItem>;
}
/**
 * The base class for UI components containing an item collection.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class CollectionWidget<
    TProperties extends CollectionWidgetOptions<any, TItem, TKey>,
    TItem extends ItemLike = any,
    TKey = any,
> extends Widget<TProperties> {
    getDataSource(): DataSource<TItem, TKey>;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface CollectionWidgetItem {
    /**
     * Specifies whether the UI component item responds to user interaction.
     */
    disabled?: boolean;
    /**
     * Specifies the HTML markup to be inserted into the item element.
     */
    html?: string;
    /**
     * Specifies a template that should be used to render this item only.
     */
    template?: template | ((itemData: this, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies text displayed for the UI component item.
     */
    text?: string;
    /**
     * Specifies whether or not a UI component item must be displayed.
     */
    visible?: boolean;
}
