import {
    TElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import {
    BaseEvent,
    BaseNativeEvent
} from '../../events/index';

import Widget, {
    WidgetOptions,
    ContentReadyEvent
} from '../widget/ui.widget';

export { ContentReadyEvent }
export interface BaseItemEvent<T> extends BaseNativeEvent<T> {
    readonly itemData?: any,
    itemElement: TElement,
}
interface ItemEvent<T> extends BaseItemEvent<T> {
    readonly itemIndex: number
}
export interface ItemClickEvent<T> extends ItemEvent<T> {}
export interface ItemContextMenuEvent<T> extends ItemEvent<T> {}
export interface ItemHoldEvent<T> extends ItemEvent<T> {}
export interface ItemRenderedEvent<T> extends ItemEvent<T> {}

export interface SelectionChangedEvent<T> extends BaseEvent<T> {
    readonly addedItems: Array<any>,
    readonly removedItems: Array<any>
}

export interface CollectionWidgetOptions<T = CollectionWidget> extends WidgetOptions<T> {
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | CollectionWidgetItem> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default 750
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemHoldTimeout?: number;
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @fires CollectionWidgetOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | CollectionWidgetItem | any>;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @default "No data to display"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: ItemClickEvent<T>) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemHold?: ((e: ItemHoldEvent<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemRendered?: ((e: ItemRenderedEvent<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 addedItems:array<any>
     * @type_function_param1_field5 removedItems:array<any>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent<T>) => void);
    /**
     * @docid
     * @default -1
     * @fires CollectionWidgetOptions.onSelectionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @default null
     * @fires CollectionWidgetOptions.onSelectionChanged
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItem?: any;
    /**
     * @docid
     * @fires CollectionWidgetOptions.onSelectionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItemKeys?: Array<any>;
    /**
     * @docid
     * @fires CollectionWidgetOptions.onSelectionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItems?: Array<any>;
}
/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @module ui/collection/ui.collection_widget.base
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class CollectionWidget extends Widget {
    constructor(element: TElement, options?: CollectionWidgetOptions)
    getDataSource(): DataSource;
}


/**
 * @docid
 * @type object
 */
export interface CollectionWidgetItem {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    html?: string;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}
