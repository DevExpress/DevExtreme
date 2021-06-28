import {
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import Store from '../../data/abstract_store';

import {
    EventInfo,
    NativeEventInfo,
    ItemInfo
} from '../../events/index';

import Widget, {
    WidgetOptions
} from '../widget/ui.widget';

export interface SelectionChangedInfo<T = any> {
    readonly addedItems: Array<T>;
    readonly removedItems: Array<T>;
}

/** @namespace DevExpress.ui */
export interface CollectionWidgetOptions<TComponent> extends WidgetOptions<TComponent> {
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string | CollectionWidgetItem> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default 750
     * @public
     */
    itemHoldTimeout?: number;
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @fires CollectionWidgetOptions.onOptionChanged
     * @public
     */
    items?: Array<string | CollectionWidgetItem | any>;
    /**
     * @docid
     * @default null
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @default "No data to display"
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemClick?: ((e: NativeEventInfo<TComponent> & ItemInfo) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemContextMenu?: ((e: NativeEventInfo<TComponent> & ItemInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemHold?: ((e: NativeEventInfo<TComponent> & ItemInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemRendered?: ((e: NativeEventInfo<TComponent> & ItemInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 addedItems:array<any>
     * @type_function_param1_field5 removedItems:array<any>
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onSelectionChanged?: ((e: EventInfo<TComponent> & SelectionChangedInfo) => void);
    /**
     * @docid
     * @default -1
     * @fires CollectionWidgetOptions.onSelectionChanged
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @default null
     * @fires CollectionWidgetOptions.onSelectionChanged
     * @ref
     * @public
     */
    selectedItem?: any;
    /**
     * @docid
     * @fires CollectionWidgetOptions.onSelectionChanged
     * @public
     */
    selectedItemKeys?: Array<any>;
    /**
     * @docid
     * @fires CollectionWidgetOptions.onSelectionChanged
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
 * @namespace DevExpress.ui
 */
export default class CollectionWidget<TProperties> extends Widget<TProperties> {
    getDataSource(): DataSource;
}


/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface CollectionWidgetItem {
    /**
     * @docid
     * @default false
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @public
     */
    html?: string;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    template?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
}
