import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxResponsiveBoxOptions extends CollectionWidgetOptions<dxResponsiveBox> {
    /**
     * @docid
     * @type Array<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cols?: Array<{
      /**
      * @docid
      * @type number | Enums.Mode
      * @default 0
      */
      baseSize?: number | 'auto',
      /**
      * @docid
      * @default 1
      */
      ratio?: number,
      /**
      * @docid
      * @default undefined
      */
      screen?: string,
      /**
      * @docid
      * @default 1
      */
      shrink?: number
    }>;
    /**
     * @docid
     * @type string|Array<string,dxResponsiveBoxItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxResponsiveBoxItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default '100%'
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type Array<string, dxResponsiveBoxItem, object>
     * @fires dxResponsiveBoxOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxResponsiveBoxItem | any>;
    /**
     * @docid
     * @type Array<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rows?: Array<{
      /**
      * @docid
      * @type number | Enums.Mode
      * @default 0
      */
      baseSize?: number | 'auto',
      /**
      * @docid
      * @default 1
      */
      ratio?: number,
      /**
      * @docid
      * @default undefined
      */
      screen?: string,
      /**
      * @docid
      * @default 1
      */
      shrink?: number
    }>;
    /**
     * @docid
     * @type function
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    screenByWidth?: Function;
    /**
     * @docid
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    singleColumnScreen?: string;
    /**
     * @docid
     * @default '100%'
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @type object
 * @inherits CollectionWidget
 * @module ui/responsive_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxResponsiveBox extends CollectionWidget {
    constructor(element: Element, options?: dxResponsiveBoxOptions)
    constructor(element: JQuery, options?: dxResponsiveBoxOptions)
}

/**
* @docid
* @inherits CollectionWidgetItem
* @type object
*/
export interface dxResponsiveBoxItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type Object|Array<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: {
      /**
      * @docid
      */
      col?: number,
      /**
      * @docid
      * @default undefined
      */
      colspan?: number,
      /**
      * @docid
      */
      row?: number,
      /**
      * @docid
      * @default undefined
      */
      rowspan?: number,
      /**
      * @docid
      * @default undefined
      */
      screen?: string
    } | Array<{ col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string }>;
}

declare global {
interface JQuery {
    dxResponsiveBox(): JQuery;
    dxResponsiveBox(options: "instance"): dxResponsiveBox;
    dxResponsiveBox(options: string): any;
    dxResponsiveBox(options: string, ...params: any[]): any;
    dxResponsiveBox(options: dxResponsiveBoxOptions): JQuery;
}
}
export type Options = dxResponsiveBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxResponsiveBoxOptions;
