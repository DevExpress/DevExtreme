import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
} from '../../core/templates/template';

import DataSource, {
    Options as DataSourceOptions,
} from '../../data/data_source';

import Store from '../../data/abstract_store';

import {
    EventInfo,
    NativeEventInfo,
    ItemInfo,
} from '../../events/index';

import Widget, {
    WidgetOptions,
} from '../widget/ui.widget';

type ItemLike = string | CollectionWidgetItem<any> | any;

export interface SelectionChangedInfo<TItem extends ItemLike = any> {
    readonly addedItems: Array<TItem>;
    readonly removedItems: Array<TItem>;
}

/** @namespace DevExpress.ui */
export interface CollectionWidgetOptions<
    TComponent extends CollectionWidget<any, TItem, TKey> | any,
    TItem extends ItemLike = any,
    TKey = any,
> extends WidgetOptions<TComponent> {
    /**
     * @docid
     * @default null
     * @public
     * @type string | Array<string | CollectionWidgetItem | any> | Store | DataSource | DataSourceOptions
     */
    dataSource?: string | Array<TItem> | Store<TItem, string | Array<string>, TKey> | DataSource<TItem, string | Array<string>, TKey> | DataSourceOptions<TItem, TItem, TItem, string | Array<string>, TKey>;
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
     * @type_function_return string|Element|jQuery
     * @public
     */
    itemTemplate?: template | ((itemData: TItem, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @fires CollectionWidgetOptions.onOptionChanged
     * @type Array<string | CollectionWidgetItem | any>
     * @public
     */
    items?: Array<TItem>;
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
    onItemClick?: ((e: NativeEventInfo<TComponent> & ItemInfo<TItem>) => void) | string;
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
    onItemContextMenu?: ((e: NativeEventInfo<TComponent> & ItemInfo<TItem>) => void);
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
    onItemHold?: ((e: NativeEventInfo<TComponent> & ItemInfo<TItem>) => void);
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
    onItemRendered?: ((e: NativeEventInfo<TComponent> & ItemInfo<TItem>) => void);
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
    onSelectionChanged?: ((e: EventInfo<TComponent> & SelectionChangedInfo<TItem>) => void);
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
    selectedItem?: TItem;
    /**
     * @docid
     * @fires CollectionWidgetOptions.onSelectionChanged
     * @public
     */
    selectedItemKeys?: Array<TKey>;
    /**
     * @docid
     * @fires CollectionWidgetOptions.onSelectionChanged
     * @public
     */
    selectedItems?: Array<TItem>;
}
/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @hidden
 * @namespace DevExpress.ui
 */
export default class CollectionWidget<
    TProperties extends CollectionWidgetOptions<any, TItem, TKey>,
    TItem extends ItemLike = any,
    TKey = any,
> extends Widget<TProperties> {
    getDataSource(): DataSource<TItem, string | Array<string>, TKey>;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface CollectionWidgetItem<TItem extends CollectionWidgetItem<any> | any = any> {
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
    template?: template | ((itemData: TItem, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
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
