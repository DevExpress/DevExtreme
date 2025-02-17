import {
    AnimationConfig,
    PositionConfig,
} from '../common/core/animation';

import {
    UserDefinedElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import { DxEvent } from '../events';

import dxPopup, {
    dxPopupAnimation,
    dxPopupOptions,
    TitleRenderedInfo,
} from './popup';

import {
    Position,
} from '../common';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxPopover>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxPopover>;

/**
 * The type of the hiding event handler&apos;s argument.
 */
export type HidingEvent = Cancelable & EventInfo<dxPopover>;

/**
 * The type of the hidden event handler&apos;s argument.
 */
export type HiddenEvent = EventInfo<dxPopover>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxPopover>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxPopover> & ChangedOptionInfo;

/**
 * The type of the showing event handler&apos;s argument.
 */
export type ShowingEvent = Cancelable & EventInfo<dxPopover>;

/**
 * The type of the shown event handler&apos;s argument.
 */
export type ShownEvent = EventInfo<dxPopover>;

/**
 * The type of the titleRendered event handler&apos;s argument.
 */
export type TitleRenderedEvent = EventInfo<dxPopover> & TitleRenderedInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPopoverOptions<TComponent> extends dxPopupOptions<TComponent> {
    /**
     * Configures UI component visibility animations. This object contains two fields: show and hide.
     */
    animation?: dxPopoverAnimation;
    /**
     * Specifies whether to close the UI component if a user clicks outside the popover window or outside the target element.
     * @deprecated Use the hideOnOutsideClick option instead.
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * Specifies properties of popover hiding. Ignored if the shading property is set to true.
     */
    hideEvent?: {
      /**
       * The delay in milliseconds after which the UI component is hidden.
       */
      delay?: number | undefined;
      /**
       * Specifies the event names on which the UI component is hidden.
       */
      name?: string | undefined;
    } | string | undefined;
    /**
     * Specifies whether to hide the UI component if a user clicks outside the popover window or outside the target element.
     */
    hideOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * Specifies whether to hide the widget when users scroll one of its parent elements.
     */
    hideOnParentScroll?: boolean;
    /**
     * An object defining UI component positioning properties.
     */
    position?: Position | PositionConfig;
    /**
     * Specifies whether to shade the background when the UI component is active.
     */
    shading?: boolean;
    /**
     * Specifies properties for displaying the UI component.
     */
    showEvent?: {
      /**
       * The delay in milliseconds after which the UI component is displayed.
       */
      delay?: number | undefined;
      /**
       * Specifies the event names on which the UI component is shown.
       */
      name?: string | undefined;
    } | string | undefined;
    /**
     * A Boolean value specifying whether or not to display the title in the overlay window.
     */
    showTitle?: boolean;
    /**
     * Specifies the element against which to position the widget.
     */
    target?: string | UserDefinedElement | undefined;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * Configures UI component visibility animations. This object contains two fields: show and hide.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPopoverAnimation extends dxPopupAnimation {
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
 * The Popover is a UI component that shows notifications within a box with an arrow pointing to a specified UI element.
 */
export default class dxPopover<TProperties = Properties> extends dxPopup<TProperties> {
    show(): DxPromise<boolean>;
    /**
     * Shows the UI component for a target element.
     */
    show(target: string | UserDefinedElement): DxPromise<boolean>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
interface PopoverInstance extends dxPopover<Properties> { }

export type Properties = dxPopoverOptions<PopoverInstance>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = Properties;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onResize' | 'onResizeEnd' | 'onResizeStart'>;

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
/**
 * A function that is executed when the UI component&apos;s title is rendered.
 */
onTitleRendered?: ((e: TitleRenderedEvent) => void);
};
///#ENDDEBUG
