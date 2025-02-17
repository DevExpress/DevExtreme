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

export type ToastType = 'custom' | 'error' | 'info' | 'success' | 'warning';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxToast>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxToast>;

/**
 * The type of the hiding event handler&apos;s argument.
 */
export type HidingEvent = Cancelable & EventInfo<dxToast>;

/**
 * The type of the hidden event handler&apos;s argument.
 */
export type HiddenEvent = EventInfo<dxToast>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxToast>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxToast> & ChangedOptionInfo;

/**
 * The type of the showing event handler&apos;s argument.
 */
export type ShowingEvent = Cancelable & EventInfo<dxToast>;

/**
 * The type of the shown event handler&apos;s argument.
 */
export type ShownEvent = EventInfo<dxToast>;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxToastOptions extends dxOverlayOptions<dxToast> {
    /**
     * Configures UI component visibility animations. This object contains two fields: show and hide.
     */
    animation?: dxToastAnimation;
    /**
     * A Boolean value specifying whether or not the toast is closed if a user clicks it.
     */
    closeOnClick?: boolean;
    /**
     * Specifies whether to close the UI component if a user clicks outside it.
     * @deprecated Use the hideOnOutsideClick option instead.
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * A Boolean value specifying whether or not the toast is closed if a user swipes it out of the screen boundaries.
     */
    closeOnSwipe?: boolean;
    /**
     * The time span in milliseconds during which the Toast UI component is visible.
     */
    displayTime?: number;
    /**
     * Specifies whether to hide the UI component if a user clicks outside it.
     */
    hideOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * Specifies the maximum width the UI component can reach while resizing.
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * The Toast message text.
     */
    message?: string;
    /**
     * Specifies the minimum width the UI component can reach while resizing.
     */
    minWidth?: number | string | (() => number | string);
    /**
     * Positions the UI component.
     */
    position?: PositionConfig | string;
    /**
     * Specifies whether to shade the background when the UI component is active.
     */
    shading?: boolean;
    /**
     * Specifies the Toast UI component type.
     */
    type?: ToastType;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxToastAnimation extends dxOverlayAnimation {
    /**
     * An object that defines the animation properties used when the UI component is being hidden.
     */
    hide?: AnimationConfig;
    /**
     * An object that defines the animation properties used when the UI component is being shown.
     */
    show?: AnimationConfig;
}
/**
 * The Toast is a UI component that provides pop-up notifications.
 */
export default class dxToast extends dxOverlay<dxToastOptions> { }

export type Properties = dxToastOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxToastOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed when the UI component is rendered and each time the component is repainted.
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function that is executed after the UI component is hidden.
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * A function that is executed before the UI component is hidden.
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * A function that is executed before the UI component is displayed.
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * A function that is executed after the UI component is displayed.
 */
onShown?: ((e: ShownEvent) => void);
};
///#ENDDEBUG
