import {
    AnimationConfig,
    PositionConfig,
} from '../common/core/animation';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import { DxEvent } from '../events';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions,
} from './overlay';

/** @public */
export type ToastType = 'custom' | 'error' | 'info' | 'success' | 'warning';

/**
 * @docid _ui_toast_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxToast>;

/**
 * @docid _ui_toast_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxToast>;

/**
 * @docid _ui_toast_HidingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type HidingEvent = Cancelable & EventInfo<dxToast>;

/**
 * @docid _ui_toast_HiddenEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type HiddenEvent = EventInfo<dxToast>;

/**
 * @docid _ui_toast_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxToast>;

/**
 * @docid _ui_toast_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxToast> & ChangedOptionInfo;

/**
 * @docid _ui_toast_ShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ShowingEvent = Cancelable & EventInfo<dxToast>;

/**
 * @docid _ui_toast_ShownEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ShownEvent = EventInfo<dxToast>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxToastOptions extends dxOverlayOptions<dxToast> {
    /**
     * @docid
     * @public
     * @type object
     */
    animation?: dxToastAnimation;
    /**
     * @docid
     * @default false
     * @public
     */
    closeOnClick?: boolean;
    /**
     * @docid
     * @deprecated dxToastOptions.hideOnOutsideClick
     * @type_function_param1 event:event
     * @default true &for(Android)
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @default true
     * @public
     */
    closeOnSwipe?: boolean;
    /**
     * @docid
     * @default 2000
     * @default 4000 &for(Material)
     * @default 4000 &for(Fluent)
     * @public
     */
    displayTime?: number;
    /**
     * @docid
     * @type boolean | function
     * @type_function_param1 event:event
     * @default true &for(Android)
     * @public
     */
    hideOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @default 'auto'
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default 568 &for(Material)
     * @default 568 &for(Fluent)
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default ""
     * @public
     */
    message?: string;
    /**
     * @docid
     * @default 344 &for(Material)
     * @default 344 &for(Fluent)
     * @public
     */
    minWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default "bottom center"
     * @default { at: 'bottom left', my: 'bottom left', offset: '20 -20'} &for(Android)
     * @default { at: 'bottom center', my: 'bottom center', offset: '0 0' } &for(phones_on_Android)
     * @public
     */
    position?: PositionConfig | string;
    /**
     * @docid
     * @default false
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @default 'info'
     * @public
     */
    type?: ToastType;
    /**
     * @docid
     * @default '80vw'
     * @default 'auto' &for(Android)
     * @default '100vw' &for(phones_on_Android)
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxToastAnimation extends dxOverlayAnimation {
    /**
     * @docid dxToastOptions.animation.hide
     * @default { type: "fade", duration: 400, to: 0 }
     * @public
     */
    hide?: AnimationConfig;
    /**
     * @docid dxToastOptions.animation.show
     * @default { type: "fade", duration: 400, from: 0, to: 1 }
     * @public
     */
    show?: AnimationConfig;
}
/**
 * @docid
 * @inherits dxOverlay
 * @namespace DevExpress.ui
 * @public
 */
export default class dxToast extends dxOverlay<dxToastOptions> { }

/** @public */
export type Properties = dxToastOptions;

/** @deprecated use Properties instead */
export type Options = dxToastOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxToastOptions.onContentReady
 * @type_function_param1 e:{ui/toast:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxToastOptions.onDisposing
 * @type_function_param1 e:{ui/toast:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxToastOptions.onHidden
 * @type_function_param1 e:{ui/toast:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @docid dxToastOptions.onHiding
 * @type_function_param1 e:{ui/toast:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @docid dxToastOptions.onInitialized
 * @type_function_param1 e:{ui/toast:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxToastOptions.onOptionChanged
 * @type_function_param1 e:{ui/toast:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxToastOptions.onShowing
 * @type_function_param1 e:{ui/toast:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @docid dxToastOptions.onShown
 * @type_function_param1 e:{ui/toast:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
};
///#ENDDEBUG
