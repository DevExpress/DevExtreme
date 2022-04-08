import { UserDefinedElement } from '../core/element';
import DOMComponent, {
    DOMComponentOptions,
} from '../core/dom_component';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

export interface ResizeInfo {
    readonly width: number;
    readonly height: number;
    handles: {
        readonly left: boolean;
        readonly top: boolean;
        readonly right: boolean;
        readonly bottom: boolean;
    };
}

/** @public */
export type DisposingEvent = EventInfo<dxResizable>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxResizable>;

/** @public */
export type OptionChangedEvent = EventInfo<dxResizable> & ChangedOptionInfo;

/** @public */
export type ResizeEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/** @public */
export type ResizeStartEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/** @public */
export type ResizeEndEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    area?: string | UserDefinedElement;
    /**
     * @docid
     * @type Enums.ResizeHandle | string
     * @default "all"
     * @public
     */
    handles?: 'bottom' | 'left' | 'right' | 'top' | 'all' | string;
    /**
     * @docid
     * @fires dxResizableOptions.onResize
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default true
     * @public
     */
    keepAspectRatio?: boolean;
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
     * @type_function_param1_field1 component:dxResizable
     * @action
     * @public
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:dxResizable
     * @action
     * @public
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:dxResizable
     * @action
     * @public
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * @docid
     * @fires dxResizableOptions.onResize
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @inherits DOMComponent
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxResizable extends DOMComponent<dxResizableOptions> { }

/** @public */
export type Properties = dxResizableOptions;

/** @deprecated use Properties instead */
export type Options = dxResizableOptions;
