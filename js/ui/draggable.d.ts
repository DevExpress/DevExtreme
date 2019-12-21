import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    event
} from '../events';

import dxSortable from './sortable';

export interface DraggableBaseOptions<T = DraggableBase & DOMComponent> extends DOMComponentOptions<T> {
    /**
     * @docid DraggableBaseOptions.autoScroll
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoScroll?: boolean;
    /**
     * @docid DraggableBaseOptions.boundary
     * @type string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    boundary?: string | Element | JQuery;
    /**
     * @docid DraggableBaseOptions.container
     * @type string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    container?: string | Element | JQuery;
    /**
     * @docid DraggableBaseOptions.cursorOffset
     * @type string|object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cursorOffset?: string | { x?: number, y?: number };
    /**
     * @docid DraggableBaseOptions.data
     * @type any
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    data?: any;
    /**
     * @docid DraggableBaseOptions.dragDirection
     * @type Enums.DragDirection
     * @default "both"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dragDirection?: 'both' | 'horizontal' | 'vertical';
    /**
     * @docid DraggableBaseOptions.group
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    group?: string;
    /**
     * @docid DraggableBaseOptions.handle
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    handle?: string;
    /**
     * @docid DraggableBaseOptions.scrollSensitivity
     * @type number
     * @default 60
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollSensitivity?: number;
    /**
     * @docid DraggableBaseOptions.scrollSpeed
     * @type number
     * @default 30
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollSpeed?: number;
}
/**
 * @docid DraggableBase
 * @inherits DOMComponent
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export interface DraggableBase { }

export interface dxDraggableOptions extends DraggableBaseOptions<dxDraggable> {
    /**
     * @docid dxDraggableOptions.clone
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clone?: boolean;
    /**
     * @docid dxDraggableOptions.dragTemplate
     * @type template|function
     * @type_function_param1 dragInfo:object
     * @type_function_param1_field1 itemData:any
     * @type_function_param1_field2 itemElement:dxElement
     * @type_function_param2 containerElement:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dragTemplate?: template | ((dragInfo: { itemData?: any, itemElement?: dxElement }, containerElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxDraggableOptions.onDragEnd
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:dxElement
     * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 fromData:any
     * @type_function_param1_field11 toData:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragEnd?: ((e: { component?: dxDraggable, element?: dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
    /**
     * @docid dxDraggableOptions.onDragMove
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:dxElement
     * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 fromData:any
     * @type_function_param1_field11 toData:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragMove?: ((e: { component?: dxDraggable, element?: dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
    /**
     * @docid dxDraggableOptions.onDragStart
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:dxElement
     * @type_function_param1_field8 fromData:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragStart?: ((e: { component?: dxDraggable, element?: dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromData?: any }) => any);
}
/**
 * @docid dxDraggable
 * @inherits DraggableBase
 * @hasTranscludedContent
 * @module ui/draggable
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxDraggable extends DOMComponent implements DraggableBase {
    constructor(element: Element, options?: dxDraggableOptions)
    constructor(element: JQuery, options?: dxDraggableOptions)
}

declare global {
interface JQuery {
    dxDraggable(): JQuery;
    dxDraggable(options: "instance"): dxDraggable;
    dxDraggable(options: string): any;
    dxDraggable(options: string, ...params: any[]): any;
    dxDraggable(options: dxDraggableOptions): JQuery;
}
}
export type Options = dxDraggableOptions;

/** @deprecated use Options instead */
export type IOptions = dxDraggableOptions;