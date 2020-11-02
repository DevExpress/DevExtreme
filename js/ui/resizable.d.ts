import '../jquery_augmentation';

import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events/index';

export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
    /**
     * @docid
     * @type Enums.ResizeHandle | string
     * @default "all"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    handles?: 'bottom' | 'left' | 'right' | 'top' | 'all' | string;
    /**
     * @docid
     * @fires dxResizableOptions.onResize
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @type number
     * @default Infinity
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number;
    /**
     * @docid
     * @type number
     * @default Infinity
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number;
    /**
     * @docid
     * @type number
     * @default 30
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minHeight?: number;
    /**
     * @docid
     * @type number
     * @default 30
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number;
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResize?: ((e: { component?: dxResizable, element?: dxElement, model?: any, event?: event, width?: number, height?: number }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeEnd?: ((e: { component?: dxResizable, element?: dxElement, model?: any, event?: event, width?: number, height?: number }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeStart?: ((e: { component?: dxResizable, element?: dxElement, model?: any, event?: event, width?: number, height?: number }) => any);
    /**
     * @docid
     * @fires dxResizableOptions.onResize
     * @type number|string|function
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits DOMComponent
 * @hasTranscludedContent
 * @module ui/resizable
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxResizable extends DOMComponent {
    constructor(element: Element, options?: dxResizableOptions)
    constructor(element: JQuery, options?: dxResizableOptions)
}

declare global {
interface JQuery {
    dxResizable(): JQuery;
    dxResizable(options: "instance"): dxResizable;
    dxResizable(options: string): any;
    dxResizable(options: string, ...params: any[]): any;
    dxResizable(options: dxResizableOptions): JQuery;
}
}
export type Options = dxResizableOptions;

/** @deprecated use Options instead */
export type IOptions = dxResizableOptions;
