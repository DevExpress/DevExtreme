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
    TEvent,
    Cancelable,
    ComponentEvent,
    ComponentNativeEvent,
    ComponentInitializedEvent,
    ChangedOptionInfo
} from '../events/index';

import dxDraggable, {
    DraggableBase,
    DraggableBaseOptions
} from './draggable';

/** @public */
export interface AddEvent {
    readonly component: dxSortable;
    readonly element: TElement;
    readonly model?: any;
    readonly event: TEvent;
    readonly itemData?: any;
    readonly itemElement: TElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
}

/** @public */
export type DisposingEvent = ComponentEvent<dxSortable>;

/** @public */
export type DragChangeEvent = Cancelable & ComponentNativeEvent<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: TElement;
    readonly fromIndex?: number;
    readonly toIndex?: number;
    readonly fromComponent?: dxSortable | dxDraggable;
    readonly toComponent?: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem?: boolean;
}

/** @public */
export type DragEndEvent = Cancelable & ComponentNativeEvent<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: TElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
}

/** @public */
export type DragMoveEvent = Cancelable & ComponentNativeEvent<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: TElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
}

/** @public */
export type DragStartEvent = Cancelable & ComponentNativeEvent<dxSortable> & {
    itemData?: any;
    readonly itemElement: TElement;
    readonly fromIndex: number;
    readonly fromData?: any;
}

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxSortable>;

/** @public */
export type OptionChangedEvent = ComponentEvent<dxSortable> & ChangedOptionInfo;

/** @public */
export type RemoveEvent = ComponentNativeEvent<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: TElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
}

/** @public */
export type ReorderEvent = ComponentNativeEvent<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: TElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
    promise?: TPromise<void>;
}

/** @public */
export interface DragTemplateData {
    readonly itemData?: any;
    readonly itemElement: TElement;
    readonly fromIndex: number;
}

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
    dragTemplate?: template | ((dragInfo: DragTemplateData, containerElement: TElement) => string | TElement);
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
     * @default null
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
    onAdd?: ((e: AddEvent) => void);
    /**
     * @docid
     * @default null
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
    onDragChange?: ((e: DragChangeEvent) => void);
    /**
     * @docid
     * @default null
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
    onDragEnd?: ((e: DragEndEvent) => void);
    /**
     * @docid
     * @default null
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
    onDragMove?: ((e: DragMoveEvent) => void);
    /**
     * @docid
     * @default null
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
    onDragStart?: ((e: DragStartEvent) => void);
    /**
     * @docid
     * @default null
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
    onRemove?: ((e: RemoveEvent) => void);
    /**
     * @docid
     * @default null
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
    onReorder?: ((e: ReorderEvent) => void);
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
