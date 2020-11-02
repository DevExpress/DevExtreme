import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxToolbarOptions extends CollectionWidgetOptions<dxToolbar> {
    /**
     * @docid
     * @type string|Array<string,dxToolbarItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxToolbarItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Array<string, dxToolbarItem, object>
     * @fires dxToolbarOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxToolbarItem | any>;
    /**
     * @docid
     * @type template|function
     * @default "menuItem"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @deprecated
     * @type number|string|function
     * @default undefined
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/toolbar
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxToolbar extends CollectionWidget {
    constructor(element: Element, options?: dxToolbarOptions)
    constructor(element: JQuery, options?: dxToolbarOptions)
}


/**
* @docid
* @inherits CollectionWidgetItem
* @type object
*/
export interface dxToolbarItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @type Enums.ToolbarItemLocateInMenuMode
     * @default 'never'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    locateInMenu?: 'always' | 'auto' | 'never';
    /**
     * @docid
     * @type Enums.ToolbarItemLocation
     * @default 'center'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before' | 'center';
    /**
     * @docid
     * @type template|function
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuItemTemplate?: template | (() => string | Element | JQuery);
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    options?: any;
    /**
     * @docid
     * @type Enums.ToolbarItemShowTextMode
     * @default 'always'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showText?: 'always' | 'inMenu';
    /**
     * @docid
     * @type Enums.ToolbarItemWidget
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
}

declare global {
interface JQuery {
    dxToolbar(): JQuery;
    dxToolbar(options: "instance"): dxToolbar;
    dxToolbar(options: string): any;
    dxToolbar(options: string, ...params: any[]): any;
    dxToolbar(options: dxToolbarOptions): JQuery;
}
}
export type Options = dxToolbarOptions;

/** @deprecated use Options instead */
export type IOptions = dxToolbarOptions;
