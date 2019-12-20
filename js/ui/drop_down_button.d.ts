import {
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events';

import {
    dxListItem
} from './list';

import {
    dxPopupOptions
} from './popup';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxDropDownButtonOptions extends WidgetOptions<dxDropDownButton> {
    /**
     * @docid dxDropDownButtonOptions.dataSource
     * @type string|Array<dxDropDownButtonItem, object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxDropDownButtonItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid dxDropDownButtonOptions.deferRendering
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid dxDropDownButtonOptions.displayExpr
     * @type string|function
     * @default 'this'
     * @type_function_param1 itemData:object
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayExpr?: string | ((itemData: any) => string);
    /**
     * @docid dxDropDownButtonOptions.dropDownContentTemplate
     * @type template|function
     * @default "content"
     * @type_function_param1 data:Array<string,number,Object>|DataSource
     * @type_function_param2 contentElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownContentTemplate?: template | ((data: Array<string | number | any> | DataSource, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxDropDownButtonOptions.dropDownOptions
     * @type dxPopupOptions
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownOptions?: dxPopupOptions;
    /**
     * @docid dxDropDownButtonOptions.focusStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxDropDownButtonOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxDropDownButtonOptions.icon
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxDropDownButtonOptions.itemTemplate
     * @type template|function
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxDropDownButtonOptions.items
     * @type Array<dxDropDownButtonItem, object>
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxDropDownButtonItem | any>;
    /**
     * @docid dxDropDownButtonOptions.keyExpr
     * @type string
     * @default 'this'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string;
    /**
     * @docid dxDropDownButtonOptions.noDataText
     * @type string
     * @default 'No data to display'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    noDataText?: string;
    /**
     * @docid dxDropDownButtonOptions.onButtonClick
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 selectedItem:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onButtonClick?: ((e: { component?: dxDropDownButton, element?: dxElement, model?: any, event?: event, selectedItem?: any }) => any) | string;
    /**
     * @docid dxDropDownButtonOptions.onItemClick
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:object
     * @type_function_param1_field6 itemElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: { component?: dxDropDownButton, element?: dxElement, model?: any, event?: event, itemData?: any, itemElement?: dxElement }) => any) | string;
    /**
     * @docid dxDropDownButtonOptions.onSelectionChanged
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 item:object
     * @type_function_param1_field5 previousItem:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxDropDownButton, element?: dxElement, model?: any, item?: any, previousItem?: any }) => any) | string;
    /**
     * @docid dxDropDownButtonOptions.opened
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    opened?: boolean;
    /**
     * @docid dxDropDownButtonOptions.selectedItem
     * @type string|integer|object
     * @default null
     * @readonly
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItem?: string | number | any;
    /**
     * @docid dxDropDownButtonOptions.selectedItemKey
     * @type string|integer
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItemKey?: string | number;
    /**
     * @docid dxDropDownButtonOptions.showArrowIcon
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showArrowIcon?: boolean;
    /**
     * @docid dxDropDownButtonOptions.splitButton
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    splitButton?: boolean;
    /**
     * @docid dxDropDownButtonOptions.stylingMode
     * @type Enums.ButtonStylingMode
     * @default 'outlined'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stylingMode?: 'text' | 'outlined' | 'contained';
    /**
     * @docid dxDropDownButtonOptions.text
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid dxDropDownButtonOptions.useSelectMode
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useSelectMode?: boolean;
    /**
     * @docid dxDropDownButtonOptions.wrapItemText
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    wrapItemText?: boolean;
}
/**
 * @docid dxDropDownButton
 * @inherits Widget, DataHelperMixin
 * @module ui/drop_down_button
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxDropDownButton extends Widget {
    constructor(element: Element, options?: dxDropDownButtonOptions)
    constructor(element: JQuery, options?: dxDropDownButtonOptions)
    /**
     * @docid dxDropDownButton.close
     * @publicName close()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    close(): Promise<void> & JQueryPromise<void>;
    getDataSource(): DataSource;
    /**
     * @docid dxDropDownButton.open
     * @publicName open()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    open(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxDropDownButton.toggle
     * @publicName toggle()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxDropDownButton.toggle
     * @publicName toggle(visibility)
     * @param1 visibility:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(visibility: boolean): Promise<void> & JQueryPromise<void>;
}

export interface dxDropDownButtonItem extends dxListItem {
}

declare global {
interface JQuery {
    dxDropDownButton(): JQuery;
    dxDropDownButton(options: "instance"): dxDropDownButton;
    dxDropDownButton(options: string): any;
    dxDropDownButton(options: string, ...params: any[]): any;
    dxDropDownButton(options: dxDropDownButtonOptions): JQuery;
}
}
export type Options = dxDropDownButtonOptions;

/** @deprecated use Options instead */
export type IOptions = dxDropDownButtonOptions;