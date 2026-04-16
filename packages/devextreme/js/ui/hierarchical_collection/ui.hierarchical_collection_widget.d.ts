import CollectionWidget, {
    CollectionWidgetOptions,
    ItemLike,
} from '../collection/ui.collection_widget.base';

/**
 * @namespace DevExpress.ui
 * @docid
 * @type object
 * @hidden
 */
export interface HierarchicalCollectionWidgetOptions<
    TComponent extends HierarchicalCollectionWidget<any, TItem, TKey>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
    /**
     * @docid
     * @default 'disabled'
     * @public
     */
    disabledExpr?: string | ((item: TItem) => TKey);
    /**
     * @docid
     * @default 'text'
     * @type_function_param1 item:object
     * @public
     */
    displayExpr?: string | ((item: TItem) => string);
    /**
     * @docid
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default 'items'
     * @public
     */
    itemsExpr?: string | ((item: TItem, value?: any) => TKey);
    /**
     * @docid
     * @default 'id'
     * @public
     */
    keyExpr?: string | ((item: TItem) => TKey);
    /**
     * @docid
     * @default 'selected'
     * @public
     */
    selectedExpr?: string | ((item: TItem) => TKey);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @hidden
 * @namespace DevExpress.ui
 * @options HierarchicalCollectionWidgetOptions
 */
export default class HierarchicalCollectionWidget<
    TProperties extends HierarchicalCollectionWidgetOptions<any, TItem, TKey>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<TProperties, TItem, TKey> { }
