import {
    JQueryEventObject
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

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

export interface dxDropDownMenuOptions extends WidgetOptions<dxDropDownMenu> {
    /**
     * @docid dxDropDownMenuOptions.activeStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid dxDropDownMenuOptions.buttonIcon
     * @type string
     * @default "overflow"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttonIcon?: string;
    /**
     * @docid dxDropDownMenuOptions.buttonText
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttonText?: string;
    /**
     * @docid dxDropDownMenuOptions.dataSource
     * @type string|Array<Object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<any> | DataSource | DataSourceOptions;
    /**
     * @docid dxDropDownMenuOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxDropDownMenuOptions.itemTemplate
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
     * @docid dxDropDownMenuOptions.items
     * @type Array<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<any>;
    /**
     * @docid dxDropDownMenuOptions.onButtonClick
     * @type function(e)|string
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onButtonClick?: ((e: { component?: dxDropDownMenu, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event }) => any) | string;
    /**
     * @docid dxDropDownMenuOptions.onItemClick
     * @type function(e)|string
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
    onItemClick?: ((e: { component?: dxDropDownMenu, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number, event?: event }) => any) | string;
    /**
     * @docid dxDropDownMenuOptions.opened
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    opened?: boolean;
    /**
     * @docid dxDropDownMenuOptions.popupHeight
     * @type number|string|function
     * @default auto
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    popupHeight?: number | string | Function;
    /**
     * @docid dxDropDownMenuOptions.popupWidth
     * @type number|string|function
     * @default auto
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    popupWidth?: number | string | Function;
    /**
     * @docid dxDropDownMenuOptions.usePopover
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    usePopover?: boolean;
}
/**
 * @docid dxDropDownMenu
 * @inherits Widget
 * @module ui/drop_down_menu
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxDropDownMenu extends Widget {
    constructor(element: Element, options?: dxDropDownMenuOptions)
    constructor(element: JQuery, options?: dxDropDownMenuOptions)
    /**
     * @docid dxDropDownMenuMethods.close
     * @publicName close()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    close(): void;
    /**
     * @docid dxDropDownMenuMethods.open
     * @publicName open()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    open(): void;
}
