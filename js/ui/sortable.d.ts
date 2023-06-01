import DOMComponent from '../core/dom_component';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxDraggable, {
    DraggableBase,
    DraggableBaseOptions,
} from './draggable';

import {
    DragHighlight,
    Orientation,
} from '../common';

export {
    DragHighlight,
    Orientation,
};

/** @public */
export interface AddEvent {
    readonly component: dxSortable;
    readonly element: DxElement;
    readonly model?: any;
    readonly event: DxEvent<PointerEvent | MouseEvent | TouchEvent>;
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
export type DragChangeEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex?: number;
    readonly toIndex?: number;
    readonly fromComponent?: dxSortable | dxDraggable;
    readonly toComponent?: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem?: boolean;
};

/** @public */
export type DragEndEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
};

/** @public */
export type DragMoveEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
    readonly dropInsideItem: boolean;
};

/** @public */
export type DragStartEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly fromData?: any;
};

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSortable>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSortable> & ChangedOptionInfo;

/** @public */
export type RemoveEvent = NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
    readonly toIndex: number;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
};

/** @public */
export type ReorderEvent = NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
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
};

/** @public */
export interface DragTemplateData {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly fromIndex: number;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
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
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    dragTemplate?: template | ((dragInfo: DragTemplateData, containerElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default "push"
     * @public
     */
    dropFeedbackMode?: DragHighlight;
    /**
     * @docid
     * @default "> *"
     * @public
     */
    filter?: string;
    /**
     * @docid
     * @default "vertical"
     * @public
     */
    itemOrientation?: Orientation;
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
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onAdd?: ((e: AddEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSortable
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onDragChange?: ((e: DragChangeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSortable
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onDragEnd?: ((e: DragEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSortable
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onDragMove?: ((e: DragMoveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSortable
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onDragStart?: ((e: DragStartEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSortable
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onRemove?: ((e: RemoveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxSortable
     * @type_function_param1_field event:event
     * @type_function_param1_field promise:Promise<void>
     * @action
     * @public
     */
    onReorder?: ((e: ReorderEvent) => void);
}
/**
 * @docid
 * @inherits DraggableBase
 * @hasTranscludedContent
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

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onPlaceholderPrepared'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxSortableOptions.onAdd
 * @type_function_param1 e:{ui/sortable:AddEvent}
 */
onAdd?: ((e: AddEvent) => void);
/**
 * @skip
 * @docid dxSortableOptions.onDisposing
 * @type_function_param1 e:{ui/sortable:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxSortableOptions.onDragChange
 * @type_function_param1 e:{ui/sortable:DragChangeEvent}
 */
onDragChange?: ((e: DragChangeEvent) => void);
/**
 * @skip
 * @docid dxSortableOptions.onDragEnd
 * @type_function_param1 e:{ui/sortable:DragEndEvent}
 */
onDragEnd?: ((e: DragEndEvent) => void);
/**
 * @skip
 * @docid dxSortableOptions.onDragMove
 * @type_function_param1 e:{ui/sortable:DragMoveEvent}
 */
onDragMove?: ((e: DragMoveEvent) => void);
/**
 * @skip
 * @docid dxSortableOptions.onDragStart
 * @type_function_param1 e:{ui/sortable:DragStartEvent}
 */
onDragStart?: ((e: DragStartEvent) => void);
/**
 * @skip
 * @docid dxSortableOptions.onInitialized
 * @type_function_param1 e:{ui/sortable:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxSortableOptions.onOptionChanged
 * @type_function_param1 e:{ui/sortable:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxSortableOptions.onRemove
 * @type_function_param1 e:{ui/sortable:RemoveEvent}
 */
onRemove?: ((e: RemoveEvent) => void);
/**
 * @skip
 * @docid dxSortableOptions.onReorder
 * @type_function_param1 e:{ui/sortable:ReorderEvent}
 */
onReorder?: ((e: ReorderEvent) => void);
};
///#ENDDEBUG
