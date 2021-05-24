import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    DxEvent,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    dxListItem
} from './list';

import {
    dxPopupOptions
} from './popup';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type ButtonClickEvent = NativeEventInfo<dxDropDownButton> & {
    readonly selectedItem?: any;
}

/** @public */
export type ContentReadyEvent = EventInfo<dxDropDownButton>;

/** @public */
export type DisposingEvent = EventInfo<dxDropDownButton>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDropDownButton>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxDropDownButton> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
};

/** @public */
export type OptionChangedEvent = EventInfo<dxDropDownButton> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = NativeEventInfo<dxDropDownButton> & {
    readonly item: any;
    readonly previousItem: any;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxDropDownButtonOptions extends WidgetOptions<dxDropDownButton> {
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<dxDropDownButtonItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default 'this'
     * @type_function_param1 itemData:object
     * @type_function_return string
     * @public
     */
    displayExpr?: string | ((itemData: any) => string);
    /**
     * @docid
     * @default "content"
     * @type_function_param1 data:Array<string,number,Object>|DataSource
     * @type_function_param2 contentElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    dropDownContentTemplate?: template | ((data: Array<string | number | any> | DataSource, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default {}
     * @public
     */
    dropDownOptions?: dxPopupOptions;
    /**
     * @docid
     * @default true
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
     * @default undefined
     * @public
     */
    icon?: string;
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
     * @default null
     * @public
     */
    items?: Array<dxDropDownButtonItem | any>;
    /**
     * @docid
     * @default 'this'
     * @public
     */
    keyExpr?: string;
    /**
     * @docid
     * @default 'No data to display'
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 selectedItem:object
     * @type_function_param1_field1 component:dxDropDownButton
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onButtonClick?: ((e: ButtonClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:object
     * @type_function_param1_field6 itemElement:DxElement
     * @type_function_param1_field1 component:dxDropDownButton
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 item:object
     * @type_function_param1_field5 previousItem:object
     * @type_function_param1_field1 component:dxDropDownButton
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void) | string;
    /**
     * @docid
     * @default false
     * @public
     */
    opened?: boolean;
    /**
     * @docid
     * @default null
     * @readonly
     * @public
     */
    selectedItem?: string | number | any;
    /**
     * @docid
     * @default null
     * @public
     */
    selectedItemKey?: string | number;
    /**
     * @docid
     * @default true
     * @public
     */
    showArrowIcon?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    splitButton?: boolean;
    /**
     * @docid
     * @type Enums.ButtonStylingMode
     * @default 'outlined'
     * @public
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
    /**
     * @docid
     * @default ""
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    useSelectMode?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    wrapItemText?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    useItemTextAsTitle?: boolean;
}
/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @module ui/drop_down_button
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDropDownButton extends Widget {
    constructor(element: UserDefinedElement, options?: dxDropDownButtonOptions)
    /**
     * @docid
     * @publicName close()
     * @return Promise<void>
     * @public
     */
    close(): DxPromise<void>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName open()
     * @return Promise<void>
     * @public
     */
    open(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggle()
     * @return Promise<void>
     * @public
     */
    toggle(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggle(visibility)
     * @param1 visibility:boolean
     * @return Promise<void>
     * @public
     */
    toggle(visibility: boolean): DxPromise<void>;
}

/**
 * @docid
 * @inherits dxListItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxDropDownButtonItem extends dxListItem {
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDropDownButton
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:object
     * @type_function_param1_field4 event:event
     * @public
     */
    onClick?: ((e: { component?: dxDropDownButton, element?: DxElement, model?: any, event?: DxEvent }) => void) | string;
}

/** @public */
export type Properties = dxDropDownButtonOptions;

/** @deprecated use Properties instead */
export type Options = dxDropDownButtonOptions;

/** @deprecated use Properties instead */
export type IOptions = dxDropDownButtonOptions;
