import {
    AnimationConfig,
} from '../animation/fx';

import {
    PositionConfig,
} from '../animation/position';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions,
} from './overlay';

/** @public */
export type ToastType = 'custom' | 'error' | 'info' | 'success' | 'warning';

/** @public */
export type ContentReadyEvent = EventInfo<dxToast>;

/** @public */
export type DisposingEvent = EventInfo<dxToast>;

/** @public */
export type HidingEvent = Cancelable & EventInfo<dxToast>;

/** @public */
export type HiddenEvent = EventInfo<dxToast>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxToast>;

/** @public */
export type OptionChangedEvent = EventInfo<dxToast> & ChangedOptionInfo;

/** @public */
export type ShowingEvent = Cancelable & EventInfo<dxToast>;

/** @public */
export type ShownEvent = EventInfo<dxToast>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
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
