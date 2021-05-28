import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
    /**
     * @docid
     * @type Enums.ResizeHandle | string
     * @default "all"
     * @public
     */
    handles?: 'bottom' | 'left' | 'right' | 'top' | 'all' | string;
    /**
     * @docid
     * @type_function_return number|string
     * @fires dxResizableOptions.onResize
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default Infinity
     * @public
     */
    maxHeight?: number;
    /**
     * @docid
     * @default Infinity
     * @public
     */
    maxWidth?: number;
    /**
     * @docid
     * @default 30
     * @public
     */
    minHeight?: number;
    /**
     * @docid
     * @default 30
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
     * @public
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * @docid
     * @type_function_return number|string
     * @fires dxResizableOptions.onResize
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxResizable extends DOMComponent<dxResizableOptions> { }

/** @public */
export type Properties = dxResizableOptions;

/** @deprecated use Properties instead */
export type Options = dxResizableOptions;

/** @deprecated use Properties instead */
export type IOptions = dxResizableOptions;
