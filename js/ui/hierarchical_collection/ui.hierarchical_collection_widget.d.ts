import CollectionWidget, {
    CollectionWidgetOptions
} from '../collection/ui.collection_widget.base';

/** @namespace DevExpress.ui */
export interface HierarchicalCollectionWidgetOptions<TComponent> extends CollectionWidgetOptions<TComponent> {
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
     * @type_function_return string
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid
     * @default true [for](desktop)
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
 * @module ui/hierarchical_collection/ui.hierarchical_collection_widget
 * @export default
 * @hidden
 * @namespace DevExpress.ui
 */
export default class HierarchicalCollectionWidget<TProperties> extends CollectionWidget<TProperties> { }
