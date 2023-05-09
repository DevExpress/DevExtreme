import CollectionWidget, {
    CollectionWidgetOptions,
    ItemLike,
} from '../collection/ui.collection_widget.base';

/**
 * @namespace DevExpress.ui
 * @docid
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
    disabledExpr?: string | Function;
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
    itemsExpr?: string | Function;
    /**
     * @docid
     * @default 'id'
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @default 'selected'
     * @public
     */
    selectedExpr?: string | Function;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @hidden
 * @namespace DevExpress.ui
 */
export default class HierarchicalCollectionWidget<
    TProperties extends HierarchicalCollectionWidgetOptions<any, TItem, TKey>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<TProperties, TItem, TKey> { }
