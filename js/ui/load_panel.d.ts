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

export interface dxLoadPanelOptions extends dxOverlayOptions<dxLoadPanel> {
    /**
     * @docid dxLoadPanelOptions.animation
     * @type object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: dxLoadPanelAnimation;
    /**
     * @docid dxLoadPanelOptions.container
     * @type string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    container?: string | Element | JQuery;
    /**
     * @docid dxLoadPanelOptions.delay
     * @type Number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    delay?: number;
    /**
     * @docid dxLoadPanelOptions.focusStateEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxLoadPanelOptions.height
     * @default 90
     * @default 60 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxLoadPanelOptions.indicatorSrc
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    indicatorSrc?: string;
    /**
     * @docid dxLoadPanelOptions.maxHeight
     * @default 60 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * @docid dxLoadPanelOptions.maxWidth
     * @default 60 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * @docid dxLoadPanelOptions.message
     * @type string
     * @default "Loading ..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid dxLoadPanelOptions.position
     * @type Enums.PositionAlignment|positionConfig|function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | positionConfig | Function;
    /**
     * @docid dxLoadPanelOptions.shadingColor
     * @default 'transparent'
     * @default '' [for](Android|iOS)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shadingColor?: string;
    /**
     * @docid dxLoadPanelOptions.showIndicator
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showIndicator?: boolean;
    /**
     * @docid dxLoadPanelOptions.showPane
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showPane?: boolean;
    /**
     * @docid dxLoadPanelOptions.width
     * @default 222
     * @default 60 [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
export interface dxLoadPanelAnimation extends dxOverlayAnimation {
    /**
     * @docid dxLoadPanelOptions.animation.hide
     * @type animationConfig
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxLoadPanelOptions.animation.show
     * @type animationConfig
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show?: animationConfig;
}
/**
 * @docid dxLoadPanel
 * @inherits dxOverlay
 * @module ui/load_panel
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxLoadPanel extends dxOverlay {
    constructor(element: Element, options?: dxLoadPanelOptions)
    constructor(element: JQuery, options?: dxLoadPanelOptions)
}

declare global {
interface JQuery {
    dxLoadPanel(): JQuery;
    dxLoadPanel(options: "instance"): dxLoadPanel;
    dxLoadPanel(options: string): any;
    dxLoadPanel(options: string, ...params: any[]): any;
    dxLoadPanel(options: dxLoadPanelOptions): JQuery;
}
}
export type Options = dxLoadPanelOptions;

/** @deprecated use Options instead */
export type IOptions = dxLoadPanelOptions;