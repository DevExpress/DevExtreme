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

export type ItemLike = string | CollectionWidgetItem | any;

export type SelectionChangingEventBase<TComponent> = AsyncCancelable & EventInfo<TComponent> & SelectionChangeInfo;

/**
 * @docid
 * @hidden
 */
export interface SelectionChangeInfo<TItem extends ItemLike = any> {
    /** @docid */
    readonly addedItems: Array<TItem>;
    /** @docid */
    readonly removedItems: Array<TItem>;
}

/**
 * @namespace DevExpress.ui
 * @docid
 * @type object
 */
export interface CollectionWidgetOptions<
    TComponent extends CollectionWidget<any, TItem, TKey> | any,
    TItem extends ItemLike = any,
    TKey = any,
> extends WidgetOptions<TComponent> {
    /**
     * @docid
     * @default null
     * @type Store|DataSource|DataSourceOptions|string|Array<string | CollectionWidgetItem>|null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
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
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field itemData:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onItemClick?: ((e: NativeEventInfo<TComponent, MouseEvent | PointerEvent> & ItemInfo<TItem>) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field itemData:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onItemContextMenu?: ((e: NativeEventInfo<TComponent, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field itemData:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onItemHold?: ((e: NativeEventInfo<TComponent, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field itemData:object
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onItemRendered?: ((e: EventInfo<TComponent> & ItemInfo<TItem>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field cancel:boolean|Promise<boolean>
     * @type_function_param1_field addedItems:array<any>
     * @type_function_param1_field removedItems:array<any>
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onSelectionChanging?: ((e: SelectionChangingEventBase<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field addedItems:array<any>
     * @type_function_param1_field removedItems:array<any>
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onSelectionChanged?: ((e: EventInfo<TComponent> & SelectionChangeInfo<TItem>) => void);
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
 * @options CollectionWidgetOptions
 */
export default class CollectionWidget<
    TProperties extends CollectionWidgetOptions<any, TItem, TKey>,
    TItem extends ItemLike = any,
    TKey = any,
> extends Widget<TProperties> {
    getDataSource(): DataSource<TItem, TKey>;
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
    template?: template | ((itemData: this, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
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
