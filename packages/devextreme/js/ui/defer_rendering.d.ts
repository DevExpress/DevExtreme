import {
    AnimationConfig,
} from '../common/core/animation';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxDeferRendering>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxDeferRendering>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxDeferRendering>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxDeferRendering> & ChangedOptionInfo;

/**
 * The type of the rendered event handler&apos;s argument.
 */
export type RenderedEvent = EventInfo<dxDeferRendering>;

/**
 * The type of the shown event handler&apos;s argument.
 */
export type ShownEvent = EventInfo<dxDeferRendering>;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDeferRenderingOptions extends WidgetOptions<dxDeferRendering> {
    /**
     * Specifies the animation to be used to show the rendered content.
     */
    animation?: AnimationConfig | undefined;
    /**
     * A function that is executed when the content is rendered but not yet displayed.
     */
    onRendered?: ((e: RenderedEvent) => void);
    /**
     * A function that is executed when the content is displayed and animation is completed.
     */
    onShown?: ((e: ShownEvent) => void);
    /**
     * Specifies when the UI component content is rendered.
     */
    renderWhen?: PromiseLike<void> | boolean | undefined;
    /**
     * Indicates if a load indicator should be shown until the UI component&apos;s content is rendered.
     */
    showLoadIndicator?: boolean;
    /**
     * Specifies a jQuery selector of items that should be rendered using a staggered animation.
     */
    staggerItemSelector?: string | undefined;
}
/**
 * The DeferRendering is a UI component that waits for its content to be ready before rendering it. While the content is getting ready, the DeferRendering displays a loading indicator.
 */
export default class dxDeferRendering extends Widget<dxDeferRenderingOptions> { }

export type Properties = dxDeferRenderingOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxDeferRenderingOptions;

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
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onRendered' | 'onShown'>;

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
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
