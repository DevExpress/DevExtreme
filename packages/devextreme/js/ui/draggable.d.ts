import DOMComponent, {
    DOMComponentOptions,
} from '../core/dom_component';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    DragDirection,
} from '../common';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import dxSortable from './sortable';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface DraggableBaseOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * Enables automatic scrolling while dragging an item beyond the viewport.
     */
    autoScroll?: boolean;
    /**
     * Specifies a DOM element that limits the dragging area.
     */
    boundary?: string | UserDefinedElement | undefined;
    /**
     * Specifies a custom container in which the draggable item should be rendered.
     */
    container?: string | UserDefinedElement | undefined;
    /**
     * Specifies the cursor offset from the dragged item.
     */
    cursorOffset?: string | {
      /**
       * Specifies the horizontal cursor offset from the dragged item in pixels.
       */
      x?: number;
      /**
       * Specifies the vertical cursor offset from the dragged item in pixels.
       */
      y?: number;
    };
    /**
     * A container for custom data.
     */
    data?: any | undefined;
    /**
     * Specifies the directions in which an item can be dragged.
     */
    dragDirection?: DragDirection;
    /**
     * Allows you to group several UI components, so that users can drag and drop items between them.
     */
    group?: string | undefined;
    /**
     * Specifies a CSS selector (ID or class) that should act as the drag handle(s) for the item(s).
     */
    handle?: string;
    /**
     * Specifies the distance in pixels from the edge of viewport at which scrolling should start. Applies only if autoScroll is true.
     */
    scrollSensitivity?: number;
    /**
     * Specifies the scrolling speed when dragging an item beyond the viewport. Applies only if autoScroll is true.
     */
    scrollSpeed?: number;
}
/**
                                                                   * 
                                                                   * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
                                                                   */
                                                                  export interface DraggableBase { }

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxDraggable>;

/**
 * The type of the dragEnd event handler&apos;s argument.
 */
export type DragEndEvent = Cancelable & NativeEventInfo<dxDraggable, PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * 
     */
    readonly itemData?: any;
    /**
     * 
     */
    readonly itemElement?: DxElement;
    /**
     * 
     */
    readonly fromComponent: dxSortable | dxDraggable;
    /**
     * 
     */
    readonly toComponent: dxSortable | dxDraggable;
    /**
     * 
     */
    readonly fromData?: any;
    /**
     * 
     */
    readonly toData?: any;
};

/**
 * The type of the dragMove event handler&apos;s argument.
 */
export type DragMoveEvent = Cancelable & NativeEventInfo<dxDraggable, PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * 
     */
    readonly itemData?: any;
    /**
     * 
     */
    readonly itemElement?: DxElement;
    /**
     * 
     */
    readonly fromComponent: dxSortable | dxDraggable;
    /**
     * 
     */
    readonly toComponent: dxSortable | dxDraggable;
    /**
     * 
     */
    readonly fromData?: any;
    /**
     * 
     */
    readonly toData?: any;
};

/**
 * The type of the dragStart event handler&apos;s argument.
 */
export type DragStartEvent = Cancelable & NativeEventInfo<dxDraggable, PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * 
     */
    itemData?: any;
    /**
     * 
     */
    readonly itemElement?: DxElement;
    /**
     * 
     */
    readonly fromData?: any;
};

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxDraggable>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxDraggable> & ChangedOptionInfo;

export type DragTemplateData = {
    readonly itemData?: any;
    readonly itemElement: DxElement;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDraggableOptions extends DraggableBaseOptions<dxDraggable> {
    /**
     * Allows a user to drag clones of items instead of actual items.
     */
    clone?: boolean;
    /**
     * Specifies custom markup to be shown instead of the item being dragged.
     */
    dragTemplate?: template | ((dragInfo: DragTemplateData, containerElement: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * A function that is called when a drag gesture is finished.
     */
    onDragEnd?: ((e: DragEndEvent) => void);
    /**
     * A function that is called every time a draggable item is moved.
     */
    onDragMove?: ((e: DragMoveEvent) => void);
    /**
     * A function that is called when a drag gesture is initialized.
     */
    onDragStart?: ((e: DragStartEvent) => void);
}
/**
 * Draggable is a user interface utility that allows UI component elements to be dragged and dropped.
 */
export default class dxDraggable extends DOMComponent<dxDraggableOptions> implements DraggableBase { }

export type Properties = dxDraggableOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxDraggableOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onDrop'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onDragEnd' | 'onDragMove' | 'onDragStart'>;

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
