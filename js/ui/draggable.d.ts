import DOMComponent, {
    DOMComponentOptions,
} from '../core/dom_component';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxSortable from './sortable';

import {
    DragDirection,
} from '../common';

/**
 * @namespace DevExpress.ui
 * @docid
 * @type object
 */
export interface DraggableBaseOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * @docid
     * @default true
     * @public
     */
    autoScroll?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    boundary?: string | UserDefinedElement;
    /**
     * @docid
     * @default undefined
     * @public
     */
    container?: string | UserDefinedElement;
    /**
     * @docid
     * @public
     */
    cursorOffset?: string | {
      /**
       * @docid
       * @default 0
       */
      x?: number;
      /**
       * @docid
       * @default 0
       */
      y?: number;
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    data?: any;
    /**
     * @docid
     * @default "both"
     * @public
     */
    dragDirection?: DragDirection;
    /**
     * @docid
     * @default undefined
     * @public
     */
    group?: string;
    /**
     * @docid
     * @default ""
     * @public
     */
    handle?: string;
    /**
     * @docid
     * @default 60
     * @public
     */
    scrollSensitivity?: number;
    /**
     * @docid
     * @default 30
     * @public
     */
    scrollSpeed?: number;
}
/**
 * @docid
 * @inherits DOMComponent
 * @hidden
 * @namespace DevExpress.ui
 * @options DraggableBaseOptions
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DraggableBase { }

/** @public */
export type DisposingEvent = EventInfo<dxDraggable>;

/** @public */
export type DragEndEvent = Cancelable & NativeEventInfo<dxDraggable, PointerEvent | MouseEvent | TouchEvent> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
};

/** @public */
export type DragMoveEvent = Cancelable & NativeEventInfo<dxDraggable, PointerEvent | MouseEvent | TouchEvent> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly fromComponent: dxSortable | dxDraggable;
    readonly toComponent: dxSortable | dxDraggable;
    readonly fromData?: any;
    readonly toData?: any;
};

/** @public */
export type DragStartEvent = Cancelable & NativeEventInfo<dxDraggable, PointerEvent | MouseEvent | TouchEvent> & {
    itemData?: any;
    readonly itemElement?: DxElement;
    readonly fromData?: any;
};

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDraggable>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDraggable> & ChangedOptionInfo;

/** @public */
export type DragTemplateData = {
    readonly itemData?: any;
    readonly itemElement: DxElement;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxDraggableOptions extends DraggableBaseOptions<dxDraggable> {
    /**
     * @docid
     * @default false
     * @public
     */
    clone?: boolean;
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
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDraggable
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onDragEnd?: ((e: DragEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDraggable
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onDragMove?: ((e: DragMoveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDraggable
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onDragStart?: ((e: DragStartEvent) => void);
}
/**
 * @docid
 * @inherits DraggableBase
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDraggable extends DOMComponent<dxDraggableOptions> implements DraggableBase { }

/** @public */
export type Properties = dxDraggableOptions;

/** @deprecated use Properties instead */
export type Options = dxDraggableOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onDrop'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxDraggableOptions.onDisposing
 * @type_function_param1 e:{ui/draggable:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxDraggableOptions.onDragEnd
 * @type_function_param1 e:{ui/draggable:DragEndEvent}
 */
onDragEnd?: ((e: DragEndEvent) => void);
/**
 * @skip
 * @docid dxDraggableOptions.onDragMove
 * @type_function_param1 e:{ui/draggable:DragMoveEvent}
 */
onDragMove?: ((e: DragMoveEvent) => void);
/**
 * @skip
 * @docid dxDraggableOptions.onDragStart
 * @type_function_param1 e:{ui/draggable:DragStartEvent}
 */
onDragStart?: ((e: DragStartEvent) => void);
/**
 * @skip
 * @docid dxDraggableOptions.onInitialized
 * @type_function_param1 e:{ui/draggable:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxDraggableOptions.onOptionChanged
 * @type_function_param1 e:{ui/draggable:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
