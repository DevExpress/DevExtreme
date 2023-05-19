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
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxPopup, {
    dxPopupAnimation,
    dxPopupOptions,
    TitleRenderedInfo,
} from './popup';

import {
    Position,
} from '../common';

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
 * @docid
 */
export interface dxPopoverOptions<TComponent> extends dxPopupOptions<TComponent> {
    /**
     * @docid
     * @public
     * @type object
     */
    animation?: dxPopoverAnimation;
    /**
     * @docid
     * @deprecated dxPopoverOptions.hideOnOutsideClick
     * @type_function_param1 event:event
     * @default true
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
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
     * @type boolean | function
     * @type_function_param1 event:event
     * @default true
     * @public
     */
    hideOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @default true
     * @public
     */
    hideOnParentScroll?: boolean;
    /**
     * @docid
     * @default { my: 'top center', at: 'bottom center', collision: 'fit flip' }
     * @public
     */
    position?: Position | PositionConfig;
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
}
/**
 * @docid
 * @namespace DevExpress.ui
 */
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

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onResize' | 'onResizeEnd' | 'onResizeStart'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxPopoverOptions.onContentReady
 * @type_function_param1 e:{ui/popover:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxPopoverOptions.onDisposing
 * @type_function_param1 e:{ui/popover:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxPopoverOptions.onHidden
 * @type_function_param1 e:{ui/popover:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @skip
 * @docid dxPopoverOptions.onHiding
 * @type_function_param1 e:{ui/popover:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @skip
 * @docid dxPopoverOptions.onInitialized
 * @type_function_param1 e:{ui/popover:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxPopoverOptions.onOptionChanged
 * @type_function_param1 e:{ui/popover:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxPopoverOptions.onShowing
 * @type_function_param1 e:{ui/popover:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @skip
 * @docid dxPopoverOptions.onShown
 * @type_function_param1 e:{ui/popover:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
/**
 * @skip
 * @docid dxPopoverOptions.onTitleRendered
 * @type_function_param1 e:{ui/popover:TitleRenderedEvent}
 */
onTitleRendered?: ((e: TitleRenderedEvent) => void);
};
