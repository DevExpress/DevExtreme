import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import dxSortable from './sortable';

/**
 * @namespace DevExpress.ui
 */
export interface DraggableBaseOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoScroll?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    boundary?: string | UserDefinedElement;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    container?: string | UserDefinedElement;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cursorOffset?: string | {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 0
       */
      x?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default 0
       */
      y?: number
    };
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    data?: any;
    /**
     * @docid
     * @type Enums.DragDirection
     * @default "both"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dragDirection?: 'both' | 'horizontal' | 'vertical';
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    group?: string;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    handle?: string;
    /**
     * @docid
     * @default 60
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollSensitivity?: number;
    /**
     * @docid
     * @default 30
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollSpeed?: number;
}
/**
 * @docid
 * @inherits DOMComponent
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 */
export interface DraggableBase { }

/** @public */
export type DisposingEvent = EventInfo<dxDraggable>;

/** @public */
export type DragEndEvent = Cancelable & NativeEventInfo<dxDraggable> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
}

/** @public */
export type DragMoveEvent = Cancelable & NativeEventInfo<dxDraggable> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
}

/** @public */
export type DragStartEvent = Cancelable & NativeEventInfo<dxDraggable> & {
    itemData?: any;
    readonly itemElement?: DxElement;
    readonly fromData?: any;
}

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDraggable>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDraggable> & ChangedOptionInfo;


/** @public */
export type DragTemplateData = {
    readonly itemData?: any;
    readonly itemElement: DxElement;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxDraggableOptions extends DraggableBaseOptions<dxDraggable> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clone?: boolean;
    /**
     * @docid
     * @type_function_param1 dragInfo:object
     * @type_function_param1_field1 itemData:any
     * @type_function_param1_field2 itemElement:DxElement
     * @type_function_param2 containerElement:DxElement
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dragTemplate?: template | ((dragInfo: DragTemplateData, containerElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDraggable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:DxElement
     * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 fromData:any
     * @type_function_param1_field11 toData:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragEnd?: ((e: DragEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDraggable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:DxElement
     * @type_function_param1_field8 fromComponent:dxSortable|dxDraggable
     * @type_function_param1_field9 toComponent:dxSortable|dxDraggable
     * @type_function_param1_field10 fromData:any
     * @type_function_param1_field11 toData:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragMove?: ((e: DragMoveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxDraggable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field6 itemData:any
     * @type_function_param1_field7 itemElement:DxElement
     * @type_function_param1_field8 fromData:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDragStart?: ((e: DragStartEvent) => void);
}
/**
 * @docid
 * @inherits DraggableBase
 * @hasTranscludedContent
 * @module ui/draggable
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDraggable extends DOMComponent<dxDraggableOptions> implements DraggableBase { }

/** @public */
export type Properties = dxDraggableOptions;

/** @deprecated use Properties instead */
export type Options = dxDraggableOptions;

/** @deprecated use Properties instead */
export type IOptions = dxDraggableOptions;
