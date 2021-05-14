import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions
} from './overlay';

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
export type ShowingEvent = EventInfo<dxLoadPanel>;

/** @public */
export type ShownEvent = EventInfo<dxLoadPanel>;

/** @deprecated use Properties instead */
export interface dxLoadPanelOptions extends dxOverlayOptions<dxLoadPanel> {
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    animation?: dxLoadPanelAnimation;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    container?: string | UserDefinedElement;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    delay?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @type_function_return number|string
     * @default 90
     * @default 60 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    indicatorSrc?: string;
    /**
     * @docid
     * @default 60 [for](Material)
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * @docid
     * @default 60 [for](Material)
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid
     * @default "Loading ..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @type Enums.PositionAlignment|positionConfig|function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
    /**
     * @docid
     * @default 'transparent'
     * @default '' [for](Android|iOS)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shadingColor?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showIndicator?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showPane?: boolean;
    /**
     * @docid
     * @default 222
     * @default 60 [for](Material)
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
export interface dxLoadPanelAnimation extends dxOverlayAnimation {
    /**
     * @docid dxLoadPanelOptions.animation.hide
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxLoadPanelOptions.animation.show
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show?: animationConfig;
}
/**
 * @docid
 * @inherits dxOverlay
 * @module ui/load_panel
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxLoadPanel extends dxOverlay {
    constructor(element: UserDefinedElement, options?: dxLoadPanelOptions)
}

/** @public */
export type Properties = dxLoadPanelOptions;

/** @deprecated use Properties instead */
export type Options = dxLoadPanelOptions;

/** @deprecated use Properties instead */
export type IOptions = dxLoadPanelOptions;
