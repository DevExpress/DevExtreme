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

export type ResizeHandle = 'bottom' | 'left' | 'right' | 'top' | 'all';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ResizeInfo {
    /**
     * 
     */
    readonly width: number;
    /**
     * 
     */
    readonly height: number;
}

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxResizable>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxResizable>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxResizable> & ChangedOptionInfo;

/**
 * The type of the resize event handler&apos;s argument.
 */
export type ResizeEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * The type of the resizeStart event handler&apos;s argument.
 */
export type ResizeStartEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * The type of the resizeEnd event handler&apos;s argument.
 */
export type ResizeEndEvent = NativeEventInfo<dxResizable, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
    /**
     * Specifies the area within which users can resize the UI component.
     */
    area?: string | UserDefinedElement | undefined;
    /**
     * Specifies which borders of the UI component element are used as a handle.
     */
    handles?: ResizeHandle | string;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * Specifies whether to resize the UI component&apos;s content proportionally when you use corner handles.
     */
    keepAspectRatio?: boolean;
    /**
     * Specifies the upper height boundary for resizing.
     */
    maxHeight?: number;
    /**
     * Specifies the upper width boundary for resizing.
     */
    maxWidth?: number;
    /**
     * Specifies the lower height boundary for resizing.
     */
    minHeight?: number;
    /**
     * Specifies the lower width boundary for resizing.
     */
    minWidth?: number;
    /**
     * A function that is executed each time the UI component is resized by one pixel.
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * A function that is executed when resizing ends.
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * A function that is executed when resizing starts.
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * The Resizable UI component enables its content to be resizable in the UI.
 */
export default class dxResizable extends DOMComponent<dxResizableOptions> { }

export type Properties = dxResizableOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxResizableOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onResize' | 'onResizeEnd' | 'onResizeStart'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
