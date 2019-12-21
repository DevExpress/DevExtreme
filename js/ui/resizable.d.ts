import {
    JQueryEventObject
} from '../common';

import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events';

export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
    /**
     * @docid dxResizableOptions.handles
     * @type Enums.ResizeHandle | string
     * @default "all"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    handles?: 'bottom' | 'left' | 'right' | 'top' | 'all' | string;
    /**
     * @docid dxResizableOptions.height
     * @fires dxResizableOptions.onResize
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxResizableOptions.maxHeight
     * @type number
     * @default Infinity
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number;
    /**
     * @docid dxResizableOptions.maxWidth
     * @type number
     * @default Infinity
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number;
    /**
     * @docid dxResizableOptions.minHeight
     * @type number
     * @default 30
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minHeight?: number;
    /**
     * @docid dxResizableOptions.minWidth
     * @type number
     * @default 30
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number;
    /**
     * @docid dxResizableOptions.onResize
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 width:number
     * @type_function_param1_field7 height:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResize?: ((e: { component?: dxResizable, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, width?: number, height?: number }) => any);
    /**
     * @docid dxResizableOptions.onResizeEnd
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 width:number
     * @type_function_param1_field7 height:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeEnd?: ((e: { component?: dxResizable, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, width?: number, height?: number }) => any);
    /**
     * @docid dxResizableOptions.onResizeStart
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 width:number
     * @type_function_param1_field7 height:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeStart?: ((e: { component?: dxResizable, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, width?: number, height?: number }) => any);
    /**
     * @docid dxResizableOptions.width
     * @fires dxResizableOptions.onResize
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid dxResizable
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