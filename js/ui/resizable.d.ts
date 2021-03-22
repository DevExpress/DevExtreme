import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

import {
    TElement
} from '../core/element';

import {
    TEvent
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
     * @type_function_return number|string
     * @fires dxResizableOptions.onResize
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default Infinity
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number;
    /**
     * @docid
     * @default Infinity
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number;
    /**
     * @docid
     * @default 30
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minHeight?: number;
    /**
     * @docid
     * @default 30
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minWidth?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResize?: ((e: { component?: dxResizable, element?: TElement, model?: any, event?: TEvent, width?: number, height?: number }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeEnd?: ((e: { component?: dxResizable, element?: TElement, model?: any, event?: TEvent, width?: number, height?: number }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeStart?: ((e: { component?: dxResizable, element?: TElement, model?: any, event?: TEvent, width?: number, height?: number }) => void);
    /**
     * @docid
     * @type_function_return number|string
     * @fires dxResizableOptions.onResize
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
    constructor(element: TElement, options?: dxResizableOptions)
}

export type Options = dxResizableOptions;

/** @deprecated use Options instead */
export type IOptions = dxResizableOptions;
