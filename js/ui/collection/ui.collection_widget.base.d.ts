import '../../jquery_augmentation';

import {
    dxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import Store from '../../data/abstract_store';

import {
    event
} from '../../events/index';

import Widget, {
    WidgetOptions
} from '../widget/ui.widget';

export interface CollectionWidgetOptions<T = CollectionWidget> extends WidgetOptions<T> {
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | CollectionWidgetItem> | Store | DataSource | DataSourceOptions;
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
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
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
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: { component?: T, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number, event?: event }) => any) | string;
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemContextMenu?: ((e: { component?: T, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number, event?: event }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemHold?: ((e: { component?: T, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number, event?: event }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemRendered?: ((e: { component?: T, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 addedItems:array<any>
     * @type_function_param1_field5 removedItems:array<any>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: T, element?: dxElement, model?: any, addedItems?: Array<any>, removedItems?: Array<any> }) => any);
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
    constructor(element: Element, options?: CollectionWidgetOptions)
    constructor(element: JQuery, options?: CollectionWidgetOptions)
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
    template?: template | (() => string | Element | JQuery);
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
