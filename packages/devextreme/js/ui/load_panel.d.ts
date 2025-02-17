import {
    UserDefinedElement,
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    AnimationConfig,
    PositionConfig,
} from '../common/core/animation';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions,
} from './overlay';

import {
    PositionAlignment,
} from '../common';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxLoadPanel>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxLoadPanel>;

/**
 * The type of the hiding event handler&apos;s argument.
 */
export type HidingEvent = Cancelable & EventInfo<dxLoadPanel>;

/**
 * The type of the hidden event handler&apos;s argument.
 */
export type HiddenEvent = EventInfo<dxLoadPanel>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxLoadPanel>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxLoadPanel> & ChangedOptionInfo;

/**
 * The type of the showing event handler&apos;s argument.
 */
export type ShowingEvent = Cancelable & EventInfo<dxLoadPanel>;

/**
 * The type of the shown event handler&apos;s argument.
 */
export type ShownEvent = EventInfo<dxLoadPanel>;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxLoadPanelOptions extends dxOverlayOptions<dxLoadPanel> {
    /**
     * Configures UI component visibility animations. This object contains two fields: show and hide.
     */
    animation?: dxLoadPanelAnimation;
    /**
     * Specifies the UI component&apos;s container.
     */
    container?: string | UserDefinedElement | undefined;
    /**
     * The delay in milliseconds after which the load panel is displayed.
     */
    delay?: number;
    /**
     * Specifies whether or not the UI component can be focused.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * A URL pointing to an image to be used as a load indicator.
     */
    indicatorSrc?: string;
    /**
     * Specifies the maximum height the UI component can reach while resizing.
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * Specifies the maximum width the UI component can reach while resizing.
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * Specifies the text displayed in the load panel. Ignored in the Material Design theme.
     */
    message?: string;
    /**
     * Positions the UI component.
     */
    position?: PositionAlignment | PositionConfig | Function;
    /**
     * Specifies the shading color. Applies only if shading is enabled.
     */
    shadingColor?: string;
    /**
     * A Boolean value specifying whether or not to show a load indicator.
     */
    showIndicator?: boolean;
    /**
     * A Boolean value specifying whether or not to show the pane behind the load indicator.
     */
    showPane?: boolean;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * Configures UI component visibility animations. This object contains two fields: show and hide.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxLoadPanelAnimation extends dxOverlayAnimation {
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
 * The LoadPanel is an overlay UI component notifying the viewer that loading is in progress.
 */
export default class dxLoadPanel extends dxOverlay<dxLoadPanelOptions> { }

export type Properties = dxLoadPanelOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxLoadPanelOptions;

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
