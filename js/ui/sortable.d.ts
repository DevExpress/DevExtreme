import DOMComponent from '../core/dom_component';

import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import dxDraggable, {
    DraggableBase,
    DraggableBaseOptions
} from './draggable';

/** @public */
export interface AddEvent {
    readonly component: dxSortable;
    readonly element: DxElement;
    readonly model?: any;
    readonly event: DxEvent;
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
}

/** @public */
export type DisposingEvent = EventInfo<dxSortable>;

/** @public */
export type DragChangeEvent = Cancelable & NativeEventInfo<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex?: number;
    readonly toIndex?: number;
    readonly fromComponent?: dxSortable | dxDraggable;
    readonly toComponent?: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem?: boolean;
}

/** @public */
export type DragEndEvent = Cancelable & NativeEventInfo<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
}

/** @public */
export type DragMoveEvent = Cancelable & NativeEventInfo<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
}

/** @public */
export type DragStartEvent = Cancelable & NativeEventInfo<dxSortable> & {
    itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly fromData?: any;
}

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSortable>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSortable> & ChangedOptionInfo;

/** @public */
export type RemoveEvent = NativeEventInfo<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
}

/** @public */
export type ReorderEvent = NativeEventInfo<dxSortable> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
    promise?: PromiseLike<void>;
}

/** @public */
export interface DragTemplateData {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxSortableOptions extends DraggableBaseOptions<dxSortable> {
    /**
     * @docid
     * @default false
     * @public
     */
    allowDropInsideItem?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    allowReordering?: boolean;
    /**
     * @docid
     * @type_function_param1 dragInfo:object
     * @type_function_param1_field1 itemData:any
     * @type_function_param1_field2 itemElement:DxElement
     * @type_function_param1_field3 fromIndex:number
     * @type_function_param2 containerElement:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    dragTemplate?: template | ((dragInfo: DragTemplateData, containerElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @type Enums.DropFeedbackMode
     * @default "push"
     * @public
     */
    dropFeedbackMode?: 'push' | 'indicate';
    /**
     * @docid
     * @default "> *"
     * @public
     */
    filter?: string;
    /**
     * @docid
     * @type Enums.Orientation
     * @default "vertical"
     * @public
     */
    itemOrientation?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @default false
     * @public
     */
    moveItemOnDrop?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSortable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:any
     * @type_function_param1_field6 itemElement:DxElement
     * @type_function_param1_field7 fromIndex:number
     * @type_function_param1_field8 toIndex:number
     * @type_function_param1_field9 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 fromData:any
     * @type_function_param1_field12 toData:any
     * @type_function_param1_field13 dropInsideItem:boolean
     * @action
     * @public
     */
    onAdd?: ((e: AddEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSortable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:DxElement
     * @type_function_param1_field8 fromIndex:number
     * @type_function_param1_field9 toIndex:number
     * @type_function_param1_field10 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field12 fromData:any
     * @type_function_param1_field13 toData:any
     * @type_function_param1_field14 dropInsideItem:boolean
     * @action
     * @public
     */
    onDragChange?: ((e: DragChangeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSortable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:DxElement
     * @type_function_param1_field8 fromIndex:number
     * @type_function_param1_field9 toIndex:number
     * @type_function_param1_field10 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field12 fromData:any
     * @type_function_param1_field13 toData:any
     * @type_function_param1_field14 dropInsideItem:boolean
     * @action
     * @public
     */
    onDragEnd?: ((e: DragEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSortable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:DxElement
     * @type_function_param1_field8 fromIndex:number
     * @type_function_param1_field9 toIndex:number
     * @type_function_param1_field10 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field12 fromData:any
     * @type_function_param1_field13 toData:any
     * @type_function_param1_field14 dropInsideItem:boolean
     * @action
     * @public
     */
    onDragMove?: ((e: DragMoveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1_field1 component:dxSortable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:DxElement
     * @type_function_param1_field8 fromIndex:number
     * @type_function_param1_field9 fromData:any
     * @action
     * @public
     */
    onDragStart?: ((e: DragStartEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSortable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:any
     * @type_function_param1_field6 itemElement:DxElement
     * @type_function_param1_field7 fromIndex:number
     * @type_function_param1_field8 toIndex:number
     * @type_function_param1_field9 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 fromData:any
     * @type_function_param1_field12 toData:any
     * @action
     * @public
     */
    onRemove?: ((e: RemoveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxSortable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:any
     * @type_function_param1_field6 itemElement:DxElement
     * @type_function_param1_field7 fromIndex:number
     * @type_function_param1_field8 toIndex:number
     * @type_function_param1_field9 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field11 fromData:any
     * @type_function_param1_field12 toData:any
     * @type_function_param1_field13 dropInsideItem:boolean
     * @type_function_param1_field14 promise:Promise<void>
     * @action
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSortable extends DOMComponent<dxSortableOptions> implements DraggableBase {
    /**
     * @docid
     * @publicName update()
     * @public
     */
    update(): void;
}

/** @public */
export type Properties = dxSortableOptions;

/** @deprecated use Properties instead */
export type Options = dxSortableOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSortableOptions;
