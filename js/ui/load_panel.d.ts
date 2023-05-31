import {
    UserDefinedElement,
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    AnimationConfig,
} from '../animation/fx';

import {
    PositionConfig,
} from '../animation/position';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions,
} from './overlay';

import {
    PositionAlignment,
} from '../common';

/** @public */
export type ContentReadyEvent = EventInfo<dxLoadPanel>;

/** @public */
export type DisposingEvent = EventInfo<dxLoadPanel>;

/** @public */
export type HidingEvent = Cancelable & EventInfo<dxLoadPanel>;

/** @public */
export type HiddenEvent = EventInfo<dxLoadPanel>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxLoadPanel>;

/** @public */
export type OptionChangedEvent = EventInfo<dxLoadPanel> & ChangedOptionInfo;

/** @public */
export type ShowingEvent = Cancelable & EventInfo<dxLoadPanel>;

/** @public */
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
    container?: string | UserDefinedElement;
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
 * @skip
 * @docid dxLoadPanelOptions.onContentReady
 * @type_function_param1 e:{ui/load_panel:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxLoadPanelOptions.onDisposing
 * @type_function_param1 e:{ui/load_panel:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxLoadPanelOptions.onHidden
 * @type_function_param1 e:{ui/load_panel:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @skip
 * @docid dxLoadPanelOptions.onHiding
 * @type_function_param1 e:{ui/load_panel:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @skip
 * @docid dxLoadPanelOptions.onInitialized
 * @type_function_param1 e:{ui/load_panel:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxLoadPanelOptions.onOptionChanged
 * @type_function_param1 e:{ui/load_panel:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxLoadPanelOptions.onShowing
 * @type_function_param1 e:{ui/load_panel:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @skip
 * @docid dxLoadPanelOptions.onShown
 * @type_function_param1 e:{ui/load_panel:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
};
///#ENDDEBUG
