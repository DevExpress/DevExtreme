import {
    AnimationConfig,
} from '../animation/fx';

import {
    PositionConfig,
} from '../animation/position';

import {
    UserDefinedElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxPopup, {
    dxPopupAnimation,
    dxPopupOptions,
    TitleRenderedInfo,
} from './popup';

import {
    ResizeInfo,
} from './resizable';

/** @public */
export type ContentReadyEvent = EventInfo<dxPopover>;

/** @public */
export type DisposingEvent = EventInfo<dxPopover>;

/** @public */
export type HidingEvent = Cancelable & EventInfo<dxPopover>;

/** @public */
export type HiddenEvent = EventInfo<dxPopover>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxPopover>;

/** @hidden */
export type ResizeEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

/** @hidden */
export type ResizeStartEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

/** @hidden */
export type ResizeEndEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxPopover> & ChangedOptionInfo;

/** @public */
export type ShowingEvent = Cancelable & EventInfo<dxPopover>;

/** @public */
export type ShownEvent = EventInfo<dxPopover>;

/** @public */
export type TitleRenderedEvent = EventInfo<dxPopover> & TitleRenderedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxPopoverOptions<TComponent> extends dxPopupOptions<TComponent> {
    /**
     * @docid
     * @default { show: { type: "fade", from: 0, to: 1 }, hide: { type: "fade", to: 0 } }
     * @public
     * @type object
     */
    animation?: dxPopoverAnimation;
    /**
     * @docid
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @default true
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @hidden
     */
    dragAndResizeArea?: string | UserDefinedElement;
    /**
     * @docid
     * @default false
     * @hidden
     */
    dragEnabled?: boolean;
    /**
     * @docid
     * @hidden
     */
    dragOutsideBoundary?: boolean;
    /**
     * @docid
     * @default "auto"
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default undefined
     * @public
     */
    hideEvent?: {
      /**
       * @docid
       * @default undefined
       */
      delay?: number;
      /**
       * @docid
       * @default undefined
       */
      name?: string;
    } | string;

    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @hidden
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @hidden
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @hidden
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * @docid
     * @type Enums.Position|PositionConfig
     * @default { my: 'top center', at: 'bottom center', collision: 'fit flip' }
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top' | PositionConfig;
    /**
     * @docid
     * @hidden
     */
    resizeEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    showEvent?: {
      /**
       * @docid
       * @default undefined
       */
      delay?: number;
      /**
       * @docid
       * @default undefined
       */
      name?: string;
    } | string;
    /**
     * @docid
     * @default false
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    target?: string | UserDefinedElement;
    /**
     * @docid
     * @default "auto"
     * @public
     */
    width?: number | string | (() => number | string);
    /**
     * @docid
     * @default true
     * @public
     */
    hideOnParentScroll?: boolean;
}
/** @namespace DevExpress.ui */
export interface dxPopoverAnimation extends dxPopupAnimation {
    /**
     * @docid dxPopoverOptions.animation.hide
     * @default { type: "fade", to: 0 }
     * @public
     */
    hide?: AnimationConfig;
    /**
     * @docid dxPopoverOptions.animation.show
     * @default { type: "fade", from: 0, to: 1 }
     * @public
     */
    show?: AnimationConfig;
}
/**
 * @docid
 * @inherits dxPopup
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxPopover<TProperties = Properties> extends dxPopup<TProperties> {
    show(): DxPromise<boolean>;
    /**
     * @docid
     * @publicName show(target)
     * @param1 target:string|Element|jQuery
     * @return Promise<boolean>
     * @public
     */
    show(target: string | UserDefinedElement): DxPromise<boolean>;
}

interface PopoverInstance extends dxPopover<Properties> { }

/** @public */
export type Properties = dxPopoverOptions<PopoverInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;
