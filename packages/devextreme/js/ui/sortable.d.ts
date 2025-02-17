import DOMComponent from '../core/dom_component';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    DragHighlight,
    Orientation,
} from '../common';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import { DxEvent } from '../events';

import dxDraggable, {
    DraggableBase,
    DraggableBaseOptions,
} from './draggable';

export {
    DragHighlight,
    Orientation,
};

/**
 * The type of the add event handler&apos;s argument.
 */
export interface AddEvent {
    /**
     * 
     */
    readonly component: dxSortable;
    /**
     * 
     */
    readonly element: DxElement;
    /**
     * 
     */
    readonly model?: any;
    /**
     * 
     */
    readonly event: DxEvent<PointerEvent | MouseEvent | TouchEvent>;
    /**
     * 
     */
    readonly itemData?: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly fromIndex: number;
    /**
     * 
     */
    readonly toIndex: number;
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
    /**
     * 
     */
    readonly dropInsideItem: boolean;
}

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxSortable>;

/**
 * The type of the dragChange event handler&apos;s argument.
 */
export type DragChangeEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * 
     */
    readonly itemData?: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly fromIndex?: number;
    /**
     * 
     */
    readonly toIndex?: number;
    /**
     * 
     */
    readonly fromComponent?: dxSortable | dxDraggable;
    /**
     * 
     */
    readonly toComponent?: dxSortable | dxDraggable;
    /**
     * 
     */
    readonly fromData?: any;
    /**
     * 
     */
    readonly toData?: any;
    /**
     * 
     */
    readonly dropInsideItem?: boolean;
};

/**
 * The type of the dragEnd event handler&apos;s argument.
 */
export type DragEndEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * 
     */
    readonly itemData?: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly fromIndex: number;
    /**
     * 
     */
    readonly toIndex: number;
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
    /**
     * 
     */
    readonly dropInsideItem: boolean;
};

/**
 * The type of the dragMove event handler&apos;s argument.
 */
export type DragMoveEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * 
     */
    readonly itemData?: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly fromIndex: number;
    /**
     * 
     */
    readonly toIndex: number;
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
    /**
     * 
     */
    readonly dropInsideItem: boolean;
};

/**
 * The type of the dragStart event handler&apos;s argument.
 */
export type DragStartEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * 
     */
    itemData?: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly fromIndex: number;
    /**
     * 
     */
    readonly fromData?: any;
};

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxSortable>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxSortable> & ChangedOptionInfo;

/**
 * The type of the remove event handler&apos;s argument.
 */
export type RemoveEvent = NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * 
     */
    readonly itemData?: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly fromIndex: number;
    /**
     * 
     */
    readonly toIndex: number;
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
 * The type of the reorder event handler&apos;s argument.
 */
export type ReorderEvent = NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /**
     * 
     */
    readonly itemData?: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly fromIndex: number;
    /**
     * 
     */
    readonly toIndex: number;
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
    /**
     * 
     */
    readonly dropInsideItem: boolean;
    /**
     * 
     */
    promise?: PromiseLike<void>;
};

export interface DragTemplateData {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
}

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxSortableOptions extends DraggableBaseOptions<dxSortable> {
    /**
     * Allows a user to drop an item inside another item.
     */
    allowDropInsideItem?: boolean;
    /**
     * Allows a user to reorder sortable items.
     */
    allowReordering?: boolean;
    /**
     * Specifies custom markup to be shown instead of the item being dragged.
     */
    dragTemplate?: template | ((dragInfo: DragTemplateData, containerElement: DxElement) => string | UserDefinedElement) | undefined;
    /**
     * Specifies how to highlight the item&apos;s drop position.
     */
    dropFeedbackMode?: DragHighlight;
    /**
     * Specifies a CSS selector for the items that can be dragged.
     */
    filter?: string;
    /**
     * Notifies the UI component of the items&apos; orientation.
     */
    itemOrientation?: Orientation;
    /**
     * Moves an element in the HTML markup when it is dropped.
     */
    moveItemOnDrop?: boolean;
    /**
     * A function that is called when a new item is added.
     */
    onAdd?: ((e: AddEvent) => void);
    /**
     * A function that is called when the dragged item&apos;s position in the list is changed.
     */
    onDragChange?: ((e: DragChangeEvent) => void);
    /**
     * A function that is called when the drag gesture is finished.
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
    /**
     * A function that is called when a draggable item is removed.
     */
    onRemove?: ((e: RemoveEvent) => void);
    /**
     * A function that is called when the draggable items are reordered.
     */
    onReorder?: ((e: ReorderEvent) => void);
}
/**
 * Sortable is a user interface utility that allows a UI component&apos;s items to be reordered via drag and drop gestures.
 */
export default class dxSortable extends DOMComponent<dxSortableOptions> implements DraggableBase {
    /**
     * Updates Sortable&apos;s dimensions. Call this method after items are added or their dimensions are changed during dragging.
     */
    update(): void;
}

export type Properties = dxSortableOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxSortableOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onPlaceholderPrepared'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onAdd' | 'onDragChange' | 'onDragEnd' | 'onDragMove' | 'onDragStart' | 'onRemove' | 'onReorder'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxSortableOptions.onDisposing
 * @type_function_param1 e:{ui/sortable:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxSortableOptions.onInitialized
 * @type_function_param1 e:{ui/sortable:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxSortableOptions.onOptionChanged
 * @type_function_param1 e:{ui/sortable:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
