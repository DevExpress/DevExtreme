import DOMComponent from '../core/dom_component';

import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    TPromise
} from '../core/utils/deferred';

import {
    TEvent
} from '../events/index';

import dxDraggable, {
    DraggableBase,
    DraggableBaseOptions
} from './draggable';

export interface dxSortableOptions extends DraggableBaseOptions<dxSortable> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowDropInsideItem?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowReordering?: boolean;
    /**
     * @docid
     * @type_function_param1 dragInfo:object
     * @type_function_param1_field1 itemData:any
     * @type_function_param1_field2 itemElement:dxElement
     * @type_function_param1_field3 fromIndex:number
     * @type_function_param2 containerElement:dxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dragTemplate?: template | ((dragInfo: { itemData?: any, itemElement?: TElement, fromIndex?: number }, containerElement: TElement) => string | TElement);
    /**
     * @docid
     * @type Enums.DropFeedbackMode
     * @default "push"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropFeedbackMode?: 'push' | 'indicate';
    /**
     * @docid
     * @default "> *"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filter?: string;
    /**
     * @docid
     * @type Enums.Orientation
     * @default "vertical"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemOrientation?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    moveItemOnDrop?: boolean;
    /**
     * @docid
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
    onAdd?: ((e: { component?: dxSortable, element?: TElement, model?: any, event?: TEvent, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
    /**
     * @docid
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
    onDragChange?: ((e: { component?: dxSortable, element?: TElement, model?: any, event?: TEvent, cancel?: boolean, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
    /**
     * @docid
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
    onDragEnd?: ((e: { component?: dxSortable, element?: TElement, model?: any, event?: TEvent, cancel?: boolean, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
    /**
     * @docid
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
    onDragMove?: ((e: { component?: dxSortable, element?: TElement, model?: any, event?: TEvent, cancel?: boolean, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean }) => any);
    /**
     * @docid
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
    onDragStart?: ((e: { component?: dxSortable, element?: TElement, model?: any, event?: TEvent, cancel?: boolean, itemData?: any, itemElement?: TElement, fromIndex?: number, fromData?: any }) => any);
    /**
     * @docid
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
    onRemove?: ((e: { component?: dxSortable, element?: TElement, model?: any, event?: TEvent, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any }) => any);
    /**
     * @docid
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
     * @type_function_param1_field14 promise:Promise<void>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onReorder?: ((e: { component?: dxSortable, element?: TElement, model?: any, event?: TEvent, itemData?: any, itemElement?: TElement, fromIndex?: number, toIndex?: number, fromComponent?: dxSortable | dxDraggable, toComponent?: dxSortable | dxDraggable, fromData?: any, toData?: any, dropInsideItem?: boolean, promise?: TPromise<void> }) => any);
}
/**
 * @docid
 * @inherits DraggableBase
 * @hasTranscludedContent
 * @module ui/sortable
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSortable extends DOMComponent implements DraggableBase {
    constructor(element: TElement, options?: dxSortableOptions)
    /**
     * @docid
     * @publicName update()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    update(): void;
}

export type Options = dxSortableOptions;

/** @deprecated use Options instead */
export type IOptions = dxSortableOptions;
