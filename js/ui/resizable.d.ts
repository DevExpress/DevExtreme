import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

import {
    UserDefinedElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

export interface ResizeInfo {
    readonly width: number;
    readonly height: number;
    handles: {
        readonly left: boolean;
        readonly top: boolean;
        readonly right: boolean;
        readonly bottom: boolean;
    }
}

/** @public */
export type DisposingEvent = EventInfo<dxResizable>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxResizable>;

/** @public */
export type OptionChangedEvent = EventInfo<dxResizable> & ChangedOptionInfo;

/** @public */
export type ResizeEvent = NativeEventInfo<dxResizable> & ResizeInfo;

/** @public */
export type ResizeStartEvent = NativeEventInfo<dxResizable> & ResizeInfo;

/** @public */
export type ResizeEndEvent = NativeEventInfo<dxResizable> & ResizeInfo;

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
     * @type_function_param1_field1 component:dxResizable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @type_function_param1_field1 component:dxResizable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @type_function_param1_field1 component:dxResizable
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
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
    constructor(element: UserDefinedElement, options?: dxResizableOptions)
}

/** @public */
export type Options = dxResizableOptions;

/** @deprecated use Options instead */
export type IOptions = dxResizableOptions;
