import {
    AnimationConfig,
} from '../animation/fx';

import {
    DxElement,
} from '../core/element';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/**
 * @docid _ui_defer_rendering_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxDeferRendering>;

/**
 * @docid _ui_defer_rendering_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxDeferRendering>;

/**
 * @docid _ui_defer_rendering_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxDeferRendering>;

/**
 * @docid _ui_defer_rendering_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxDeferRendering> & ChangedOptionInfo;

/**
 * @docid _ui_defer_rendering_RenderedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type RenderedEvent = EventInfo<dxDeferRendering>;

/**
 * @docid _ui_defer_rendering_ShownEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ShownEvent = EventInfo<dxDeferRendering>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxDeferRenderingOptions extends WidgetOptions<dxDeferRendering> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    animation?: AnimationConfig;
    /**
     * @docid
     * @default null
     * @action
     * @public
     */
    onRendered?: ((e: { component?: dxDeferRendering; element?: DxElement; model?: any }) => void);
    /**
     * @docid
     * @default null
     * @action
     * @public
     */
    onShown?: ((e: { component?: dxDeferRendering; element?: DxElement; model?: any }) => void);
    /**
     * @docid
     * @type DxPromise|bool
     * @default undefined
     * @public
     */
    renderWhen?: PromiseLike<void> | boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showLoadIndicator?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    staggerItemSelector?: string;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDeferRendering extends Widget<dxDeferRenderingOptions> { }

/** @public */
export type Properties = dxDeferRenderingOptions;

/** @deprecated use Properties instead */
export type Options = dxDeferRenderingOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onRendered' | 'onShown'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxDeferRenderingOptions.onContentReady
 * @type_function_param1 e:{ui/defer_rendering:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxDeferRenderingOptions.onDisposing
 * @type_function_param1 e:{ui/defer_rendering:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxDeferRenderingOptions.onInitialized
 * @type_function_param1 e:{ui/defer_rendering:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxDeferRenderingOptions.onOptionChanged
 * @type_function_param1 e:{ui/defer_rendering:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
