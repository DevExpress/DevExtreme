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
 * @docid _ui_load_panel_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxLoadPanel>;

/**
 * @docid _ui_load_panel_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxLoadPanel>;

/**
 * @docid _ui_load_panel_HidingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type HidingEvent = Cancelable & EventInfo<dxLoadPanel>;

/**
 * @docid _ui_load_panel_HiddenEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type HiddenEvent = EventInfo<dxLoadPanel>;

/**
 * @docid _ui_load_panel_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxLoadPanel>;

/**
 * @docid _ui_load_panel_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxLoadPanel> & ChangedOptionInfo;

/**
 * @docid _ui_load_panel_ShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ShowingEvent = Cancelable & EventInfo<dxLoadPanel>;

/**
 * @docid _ui_load_panel_ShownEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ShownEvent = EventInfo<dxLoadPanel>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxLoadPanelOptions extends dxOverlayOptions<dxLoadPanel> {
    /**
     * @docid
     * @default null
     * @public
     * @type object
     */
    animation?: dxLoadPanelAnimation;
    /**
     * @docid
     * @default undefined
     * @public
     */
    container?: string | UserDefinedElement | undefined;
    /**
     * @docid
     * @default 0
     * @public
     */
    delay?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default 90
     * @default 60 &for(Material)
     * @default 'auto' &for(Fluent)
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default ""
     * @public
     */
    indicatorSrc?: string;
    /**
     * @docid
     * @default 60 &for(Material)
     * @public
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * @docid
     * @default 60 &for(Material)
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default "Loading ..."
     * @default "" &for(Material)
     * @public
     */
    message?: string;
    /**
     * @docid
     * @public
     */
    position?: PositionAlignment | PositionConfig | Function;
    /**
     * @docid
     * @default 'transparent'
     * @default '' &for(Android|iOS)
     * @public
     */
    shadingColor?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    showIndicator?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showPane?: boolean;
    /**
     * @docid
     * @default 222
     * @default 60 &for(Material)
     * @default 'auto' &for(Fluent)
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxLoadPanelAnimation extends dxOverlayAnimation {
    /**
     * @docid dxLoadPanelOptions.animation.hide
     * @default null
     * @public
     */
    hide?: AnimationConfig;
    /**
     * @docid dxLoadPanelOptions.animation.show
     * @default null
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
export default class dxLoadPanel extends dxOverlay<dxLoadPanelOptions> { }

/** @public */
export type Properties = dxLoadPanelOptions;

/** @deprecated use Properties instead */
export type Options = dxLoadPanelOptions;

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
 * @docid dxLoadPanelOptions.onContentReady
 * @type_function_param1 e:{ui/load_panel:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxLoadPanelOptions.onDisposing
 * @type_function_param1 e:{ui/load_panel:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxLoadPanelOptions.onHidden
 * @type_function_param1 e:{ui/load_panel:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @docid dxLoadPanelOptions.onHiding
 * @type_function_param1 e:{ui/load_panel:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @docid dxLoadPanelOptions.onInitialized
 * @type_function_param1 e:{ui/load_panel:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxLoadPanelOptions.onOptionChanged
 * @type_function_param1 e:{ui/load_panel:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxLoadPanelOptions.onShowing
 * @type_function_param1 e:{ui/load_panel:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @docid dxLoadPanelOptions.onShown
 * @type_function_param1 e:{ui/load_panel:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
};
///#ENDDEBUG
