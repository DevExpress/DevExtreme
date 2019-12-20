import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    JQueryPromise
} from '../common';

import {
    event
} from '../events';

import dxPopup, {
    dxPopupAnimation,
    dxPopupOptions
} from './popup';

export interface dxPopoverOptions<T = dxPopover> extends dxPopupOptions<T> {
    /**
     * @docid dxPopoverOptions.animation
     * @type object
     * @default { show: { type: "fade", from: 0, to: 1 }, hide: { type: "fade", to: 0 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: dxPopoverAnimation;
    /**
     * @docid dxPopoverOptions.closeOnOutsideClick
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: event) => boolean);
    /**
     * @docid dxPopoverOptions.height
     * @type number|string|function
     * @default "auto"
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxPopoverOptions.hideEvent
     * @type Object|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideEvent?: { delay?: number, name?: string } | string;
    /**
     * @docid dxPopoverOptions.position
     * @type Enums.Position|positionConfig
     * @default 'bottom'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top' | positionConfig;
    /**
     * @docid dxPopoverOptions.shading
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid dxPopoverOptions.showEvent
     * @type Object|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showEvent?: { delay?: number, name?: string } | string;
    /**
     * @docid dxPopoverOptions.showTitle
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid dxPopoverOptions.target
     * @type string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    target?: string | Element | JQuery;
    /**
     * @docid dxPopoverOptions.width
     * @type number|string|function
     * @default "auto"
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string | (() => number | string);
}
export interface dxPopoverAnimation extends dxPopupAnimation {
    /**
     * @docid dxPopoverOptions.animation.hide
     * @type animationConfig
     * @default { type: "fade", to: 0 }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxPopoverOptions.animation.show
     * @type animationConfig
     * @default { type: "fade", from: 0, to: 1 }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show?: animationConfig;
}
/**
 * @docid dxPopover
 * @inherits dxPopup
 * @hasTranscludedContent
 * @module ui/popover
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxPopover extends dxPopup {
    constructor(element: Element, options?: dxPopoverOptions)
    constructor(element: JQuery, options?: dxPopoverOptions)
    show(): Promise<boolean> & JQueryPromise<boolean>;
    /**
     * @docid dxPopoverMethods.show
     * @publicName show(target)
     * @param1 target:string|Node|jQuery
     * @return Promise<boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(target: string | Element | JQuery): Promise<boolean> & JQueryPromise<boolean>;
}

declare global {
interface JQuery {
    dxPopover(): JQuery;
    dxPopover(options: "instance"): dxPopover;
    dxPopover(options: string): any;
    dxPopover(options: string, ...params: any[]): any;
    dxPopover(options: dxPopoverOptions): JQuery;
}
}
export type Options = dxPopoverOptions;

/** @deprecated use Options instead */
export type IOptions = dxPopoverOptions;