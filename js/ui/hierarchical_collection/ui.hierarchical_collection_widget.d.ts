import CollectionWidget, {
    CollectionWidgetOptions
} from '../collection/ui.collection_widget.base';

export interface HierarchicalCollectionWidgetOptions<TComponent> extends CollectionWidgetOptions<TComponent> {
    /**
     * @docid
     * @default 'disabled'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabledExpr?: string | Function;
    /**
     * @docid
     * @default 'text'
     * @type_function_param1 item:object
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default 'items'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemsExpr?: string | Function;
    /**
     * @docid
     * @default 'id'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @default 'selected'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedExpr?: string | Function;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/hierarchical_collection/ui.hierarchical_collection_widget
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class HierarchicalCollectionWidget<TProperties> extends CollectionWidget<TProperties> { }
