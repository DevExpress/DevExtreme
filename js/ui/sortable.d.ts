import DOMComponent from '../core/dom_component';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    event
} from '../events';

import dxDraggable, {
    DraggableBase,
    DraggableBaseOptions
} from './draggable';

export interface dxSortableOptions extends DraggableBaseOptions<dxSortable> {
    /**
     * @docid dxSortableOptions.allowDropInsideItem
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowDropInsideItem?: boolean;
    /**
     * @docid dxSortableOptions.allowReordering
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowReordering?: boolean;
    /**
     * @docid dxSortableOptions.dragTemplate
     * @type template|function
     * @type_function_param1 dragInfo:object
     * @type_function_param1_field1 itemData:any
     * @type_function_param1_field2 itemElement:dxElement
     * @type_function_param1_field3 fromIndex:number
     * @type_function_param2 containerElement:dxElement
     * @type_function_return string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dragTemplate?: template | ((dragInfo: { itemData?: any, itemElement?: dxElement, fromIndex?: number }, containerElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSortableOptions.dropFeedbackMode
     * @type Enums.DropFeedbackMode
     * @default "push"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropFeedbackMode?: 'push' | 'indicate';
    /**
     * @docid dxSortableOptions.filter
     * @type string
     * @default "> *"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filter?: string;
    /**
     * @docid dxSortableOptions.itemOrientation
     * @type Enums.Orientation
     * @default "vertical"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemOrientation?: 'horizontal' | 'vertical';
    /**
     * @docid dxSortableOptions.moveItemOnDrop
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    moveItemOnDrop?: boolean;
    /**
     * @docid dxSortableOptions.onAdd
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:any
     * @type_function_param1_field6 itemElement:dxElement
     * @type_function_param1_field7 fromIndex:number
     * @type_function_param1_field8 toIndex:number
     * @type_function_param1_field9 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 fromData:any
     * @type_function_param1_field12 toData:any
     * @type_function_param1_field13 dropInsideItem:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onAdd?: ((e: { component?: dxSortable, element?: dxElement, model?: any, event?: event, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
    /**
     * @docid dxSortableOptions.onDragChange
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:dxElement
     * @type_function_param1_field8 fromIndex:number
     * @type_function_param1_field9 toIndex:number
     * @type_function_param1_field10 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field12 fromData:any
     * @type_function_param1_field13 toData:any
     * @type_function_param1_field14 dropInsideItem:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragChange?: ((e: { component?: dxSortable, element?: dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
    /**
     * @docid dxSortableOptions.onDragEnd
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:dxElement
     * @type_function_param1_field8 fromIndex:number
     * @type_function_param1_field9 toIndex:number
     * @type_function_param1_field10 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field12 fromData:any
     * @type_function_param1_field13 toData:any
     * @type_function_param1_field14 dropInsideItem:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragEnd?: ((e: { component?: dxSortable, element?: dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
    /**
     * @docid dxSortableOptions.onDragMove
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:dxElement
     * @type_function_param1_field8 fromIndex:number
     * @type_function_param1_field9 toIndex:number
     * @type_function_param1_field10 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field12 fromData:any
     * @type_function_param1_field13 toData:any
     * @type_function_param1_field14 dropInsideItem:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragMove?: ((e: { component?: dxSortable, element?: dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
    /**
     * @docid dxSortableOptions.onDragStart
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:dxElement
     * @type_function_param1_field8 fromIndex:number
     * @type_function_param1_field9 fromData:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragStart?: ((e: { component?: dxSortable, element?: dxElement, model?: any, event?: event, cancel?: boolean, itemData?: any, itemElement?: dxElement, fromIndex?: number, fromData?: any }) => any);
    /**
     * @docid dxSortableOptions.onRemove
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:any
     * @type_function_param1_field6 itemElement:dxElement
     * @type_function_param1_field7 fromIndex:number
     * @type_function_param1_field8 toIndex:number
     * @type_function_param1_field9 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 fromData:any
     * @type_function_param1_field12 toData:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRemove?: ((e: { component?: dxSortable, element?: dxElement, model?: any, event?: event, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
    /**
     * @docid dxSortableOptions.onReorder
     * @type function(e)
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:any
     * @type_function_param1_field6 itemElement:dxElement
     * @type_function_param1_field7 fromIndex:number
     * @type_function_param1_field8 toIndex:number
     * @type_function_param1_field9 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 fromData:any
     * @type_function_param1_field12 toData:any
     * @type_function_param1_field13 dropInsideItem:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onReorder?: ((e: { component?: dxSortable, element?: dxElement, model?: any, event?: event, itemData?: any, itemElement?: dxElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
}
/**
 * @docid dxSortable
 * @inherits DraggableBase
 * @hasTranscludedContent
 * @module ui/sortable
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSortable extends DOMComponent implements DraggableBase {
    constructor(element: Element, options?: dxSortableOptions)
    constructor(element: JQuery, options?: dxSortableOptions)
}

declare global {
interface JQuery {
    dxSortable(): JQuery;
    dxSortable(options: "instance"): dxSortable;
    dxSortable(options: string): any;
    dxSortable(options: string, ...params: any[]): any;
    dxSortable(options: dxSortableOptions): JQuery;
}
}
export type Options = dxSortableOptions;

/** @deprecated use Options instead */
export type IOptions = dxSortableOptions;