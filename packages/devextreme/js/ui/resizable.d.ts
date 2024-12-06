import { UserDefinedElement } from '../core/element';
import DOMComponent, {
    DOMComponentOptions,
} from '../core/dom_component';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

/** @public */
export type ResizeHandle = 'bottom' | 'left' | 'right' | 'top' | 'all';

/**
 * @docid
 * @hidden
 */
export interface ResizeInfo {
    /** @docid */
    readonly width: number;
    /** @docid */
    readonly height: number;
}

/**
 * @docid _ui_resizable_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxResizable>;

/**
 * @docid _ui_resizable_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxResizable>;

/**
 * @docid _ui_resizable_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxResizable> & ChangedOptionInfo;

/**
 * @docid _ui_resizable_ResizeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ResizeInfo
 */
export type ResizeEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @docid _ui_resizable_ResizeStartEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ResizeInfo
 */
export type ResizeStartEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @docid _ui_resizable_ResizeEndEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ResizeInfo
 */
export type ResizeEndEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    area?: string | UserDefinedElement | undefined;
    /**
     * @docid
     * @default "all"
     * @public
     */
    handles?: ResizeHandle | string;
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
     * @type_function_param1 e:{ui/resizable:ResizeEvent}
     * @action
     * @public
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/resizable:ResizeEndEvent}
     * @action
     * @public
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/resizable:ResizeStartEvent}
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

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onResize' | 'onResizeEnd' | 'onResizeStart'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxResizableOptions.onDisposing
 * @type_function_param1 e:{ui/resizable:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxResizableOptions.onInitialized
 * @type_function_param1 e:{ui/resizable:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxResizableOptions.onOptionChanged
 * @type_function_param1 e:{ui/resizable:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
