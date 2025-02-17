import CollectionWidget, {
    CollectionWidgetOptions,
    ItemLike,
} from '../collection/ui.collection_widget.base';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface HierarchicalCollectionWidgetOptions<
    TComponent extends HierarchicalCollectionWidget<any, TItem, TKey>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
    /**
     * Specifies the name of the data source item field whose value defines whether or not the corresponding UI component item is disabled.
     */
    disabledExpr?: string | Function;
    /**
     * Specifies the data field whose values should be displayed.
     */
    displayExpr?: string | ((item: TItem) => string);
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies which data field contains nested items.
     */
    itemsExpr?: string | Function;
    /**
     * Specifies which data field provides keys for TreeView items.
     */
    keyExpr?: string | Function;
    /**
     * Specifies the name of the data source item field whose value defines whether or not the corresponding UI component items is selected.
     */
    selectedExpr?: string | Function;
}
/**
 * The base class for UI components containing an item collection.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class HierarchicalCollectionWidget<
    TProperties extends HierarchicalCollectionWidgetOptions<any, TItem, TKey>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<TProperties, TItem, TKey> { }
