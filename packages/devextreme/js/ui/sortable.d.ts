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
 * @docid _ui_sortable_AddEvent
 * @public
 * @type object
 */
export interface AddEvent {
    /** @docid _ui_sortable_AddEvent.component */
    readonly component: dxSortable;
    /** @docid _ui_sortable_AddEvent.element */
    readonly element: DxElement;
    /**
     * @docid _ui_sortable_AddEvent.model
     * @hidden
     */
    readonly model?: any;
    /**
     * @docid _ui_sortable_AddEvent.event
     * @type event
     */
    readonly event: DxEvent<PointerEvent | MouseEvent | TouchEvent>;
    /** @docid _ui_sortable_AddEvent.itemData */
    readonly itemData?: any;
    /** @docid _ui_sortable_AddEvent.itemElement */
    readonly itemElement: DxElement;
    /** @docid _ui_sortable_AddEvent.fromIndex */
    readonly fromIndex: number;
    /** @docid _ui_sortable_AddEvent.toIndex */
    readonly toIndex: number;
    /** @docid _ui_sortable_AddEvent.fromComponent */
    readonly fromComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_AddEvent.toComponent */
    readonly toComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_AddEvent.fromData */
    readonly fromData?: any;
    /** @docid _ui_sortable_AddEvent.toData */
    readonly toData?: any;
    /** @docid _ui_sortable_AddEvent.dropInsideItem */
    readonly dropInsideItem: boolean;
}

/**
 * @docid _ui_sortable_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxSortable>;

/**
 * @docid _ui_sortable_DragChangeEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type DragChangeEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /** @docid _ui_sortable_DragChangeEvent.itemData */
    readonly itemData?: any;
    /** @docid _ui_sortable_DragChangeEvent.itemElement */
    readonly itemElement: DxElement;
    /** @docid _ui_sortable_DragChangeEvent.fromIndex */
    readonly fromIndex?: number;
    /** @docid _ui_sortable_DragChangeEvent.toIndex */
    readonly toIndex?: number;
    /** @docid _ui_sortable_DragChangeEvent.fromComponent */
    readonly fromComponent?: dxSortable | dxDraggable;
    /** @docid _ui_sortable_DragChangeEvent.toComponent */
    readonly toComponent?: dxSortable | dxDraggable;
    /** @docid _ui_sortable_DragChangeEvent.fromData */
    readonly fromData?: any;
    /** @docid _ui_sortable_DragChangeEvent.toData */
    readonly toData?: any;
    /** @docid _ui_sortable_DragChangeEvent.dropInsideItem */
    readonly dropInsideItem?: boolean;
};

/**
 * @docid _ui_sortable_DragEndEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type DragEndEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /** @docid _ui_sortable_DragEndEvent.itemData */
    readonly itemData?: any;
    /** @docid _ui_sortable_DragEndEvent.itemElement */
    readonly itemElement: DxElement;
    /** @docid _ui_sortable_DragEndEvent.fromIndex */
    readonly fromIndex: number;
    /** @docid _ui_sortable_DragEndEvent.toIndex */
    readonly toIndex: number;
    /** @docid _ui_sortable_DragEndEvent.fromComponent */
    readonly fromComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_DragEndEvent.toComponent */
    readonly toComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_DragEndEvent.fromData */
    readonly fromData?: any;
    /** @docid _ui_sortable_DragEndEvent.toData */
    readonly toData?: any;
    /** @docid _ui_sortable_DragEndEvent.dropInsideItem */
    readonly dropInsideItem: boolean;
};

/**
 * @docid _ui_sortable_DragMoveEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type DragMoveEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /** @docid _ui_sortable_DragMoveEvent.itemData */
    readonly itemData?: any;
    /** @docid _ui_sortable_DragMoveEvent.itemElement */
    readonly itemElement: DxElement;
    /** @docid _ui_sortable_DragMoveEvent.fromIndex */
    readonly fromIndex: number;
    /** @docid _ui_sortable_DragMoveEvent.toIndex */
    readonly toIndex: number;
    /** @docid _ui_sortable_DragMoveEvent.fromComponent */
    readonly fromComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_DragMoveEvent.toComponent */
    readonly toComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_DragMoveEvent.fromData */
    readonly fromData?: any;
    /** @docid _ui_sortable_DragMoveEvent.toData */
    readonly toData?: any;
    /** @docid _ui_sortable_DragMoveEvent.dropInsideItem */
    readonly dropInsideItem: boolean;
};

/**
 * @docid _ui_sortable_DragStartEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type DragStartEvent = Cancelable & NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /** @docid _ui_sortable_DragStartEvent.itemData */
    itemData?: any;
    /** @docid _ui_sortable_DragStartEvent.itemElement */
    readonly itemElement: DxElement;
    /** @docid _ui_sortable_DragStartEvent.fromIndex */
    readonly fromIndex: number;
    /** @docid _ui_sortable_DragStartEvent.fromData */
    readonly fromData?: any;
};

/**
 * @docid _ui_sortable_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxSortable>;

/**
 * @docid _ui_sortable_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxSortable> & ChangedOptionInfo;

/**
 * @docid _ui_sortable_RemoveEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type RemoveEvent = NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /** @docid _ui_sortable_RemoveEvent.itemData */
    readonly itemData?: any;
    /** @docid _ui_sortable_RemoveEvent.itemElement */
    readonly itemElement: DxElement;
    /** @docid _ui_sortable_RemoveEvent.fromIndex */
    readonly fromIndex: number;
    /** @docid _ui_sortable_RemoveEvent.toIndex */
    readonly toIndex: number;
    /** @docid _ui_sortable_RemoveEvent.fromComponent */
    readonly fromComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_RemoveEvent.toComponent */
    readonly toComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_RemoveEvent.fromData */
    readonly fromData?: any;
    /** @docid _ui_sortable_RemoveEvent.toData */
    readonly toData?: any;
};

/**
 * @docid _ui_sortable_ReorderEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ReorderEvent = NativeEventInfo<dxSortable, PointerEvent | MouseEvent | TouchEvent> & {
    /** @docid _ui_sortable_ReorderEvent.itemData */
    readonly itemData?: any;
    /** @docid _ui_sortable_ReorderEvent.itemElement */
    readonly itemElement: DxElement;
    /** @docid _ui_sortable_ReorderEvent.fromIndex */
    readonly fromIndex: number;
    /** @docid _ui_sortable_ReorderEvent.toIndex */
    readonly toIndex: number;
    /** @docid _ui_sortable_ReorderEvent.fromComponent */
    readonly fromComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_ReorderEvent.toComponent */
    readonly toComponent: dxSortable | dxDraggable;
    /** @docid _ui_sortable_ReorderEvent.fromData */
    readonly fromData?: any;
    /** @docid _ui_sortable_ReorderEvent.toData */
    readonly toData?: any;
    /** @docid _ui_sortable_ReorderEvent.dropInsideItem */
    readonly dropInsideItem: boolean;
    /**
     * @docid _ui_sortable_ReorderEvent.promise
     * @type Promise<void>
     */
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
    dragTemplate?: template | ((dragInfo: DragTemplateData, containerElement: DxElement) => string | UserDefinedElement) | undefined;
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
     * @type_function_param1 e:{ui/sortable:AddEvent}
     * @action
     * @public
     */
    onAdd?: ((e: AddEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/sortable:DragChangeEvent}
     * @action
     * @public
     */
    onDragChange?: ((e: DragChangeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/sortable:DragEndEvent}
     * @action
     * @public
     */
    onDragEnd?: ((e: DragEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/sortable:DragMoveEvent}
     * @action
     * @public
     */
    onDragMove?: ((e: DragMoveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/sortable:DragStartEvent}
     * @action
     * @public
     */
    onDragStart?: ((e: DragStartEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/sortable:RemoveEvent}
     * @action
     * @public
     */
    onRemove?: ((e: RemoveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/sortable:ReorderEvent}
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
