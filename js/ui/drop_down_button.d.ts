import {
    ElementIntake,
    THTMLElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    TEvent,
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
    readonly itemElement: THTMLElement;
};

/** @public */
export type OptionChangedEvent = EventInfo<dxDropDownButton> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = NativeEventInfo<dxDropDownButton> & {
    readonly item: any;
    readonly previousItem: any;
}

export interface dxDropDownButtonOptions extends WidgetOptions<dxDropDownButton> {
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxDropDownButtonItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default 'this'
     * @type_function_param1 itemData:object
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayExpr?: string | ((itemData: any) => string);
    /**
     * @docid
     * @default "content"
     * @type_function_param1 data:Array<string,number,Object>|DataSource
     * @type_function_param2 contentElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownContentTemplate?: template | ((data: Array<string | number | any> | DataSource, contentElement: THTMLElement) => string | ElementIntake);
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownOptions?: dxPopupOptions;
    /**
     * @docid
     * @default true
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
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
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
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: THTMLElement) => string | ElementIntake);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxDropDownButtonItem | any>;
    /**
     * @docid
     * @default 'this'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string;
    /**
     * @docid
     * @default 'No data to display'
     * @prevFileNamespace DevExpress.ui
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
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onButtonClick?: ((e: ButtonClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:object
     * @type_function_param1_field6 itemElement:dxElement
     * @type_function_param1_field1 component:dxDropDownButton
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
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
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void) | string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    opened?: boolean;
    /**
     * @docid
     * @default null
     * @readonly
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItem?: string | number | any;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItemKey?: string | number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showArrowIcon?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    splitButton?: boolean;
    /**
     * @docid
     * @type Enums.ButtonStylingMode
     * @default 'outlined'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useSelectMode?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    wrapItemText?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useItemTextAsTitle?: boolean;
}
/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @module ui/drop_down_button
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxDropDownButton extends Widget {
    constructor(element: ElementIntake, options?: dxDropDownButtonOptions)
    /**
     * @docid
     * @publicName close()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    close(): TPromise<void>;
    getDataSource(): DataSource;
    /**
     * @docid
     * @publicName open()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    open(): TPromise<void>;
    /**
     * @docid
     * @publicName toggle()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(): TPromise<void>;
    /**
     * @docid
     * @publicName toggle(visibility)
     * @param1 visibility:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(visibility: boolean): TPromise<void>;
}

/**
 * @docid
 * @inherits dxListItem
 * @type object
 */
export interface dxDropDownButtonItem extends dxListItem {
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDropDownButton
     * @type_function_param1_field2 element:dxElement
     * @type_function_param1_field3 model:object
     * @type_function_param1_field4 event:event
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: { component?: dxDropDownButton, element?: THTMLElement, model?: any, event?: TEvent }) => void) | string;
}

/** @public */
export type Options = dxDropDownButtonOptions;

/** @deprecated use Options instead */
export type IOptions = dxDropDownButtonOptions;
