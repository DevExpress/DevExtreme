import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import '../jquery_augmentation';

import {
    event
} from '../events/index';

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
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: event) => boolean);
    /**
     * @docid dxPopoverOptions.height
     * @default "auto"
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid dxPopoverOptions.hideEvent
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
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid dxPopoverOptions.showEvent
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showEvent?: { delay?: number, name?: string } | string;
    /**
     * @docid dxPopoverOptions.showTitle
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid dxPopoverOptions.target
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    target?: string | Element | JQuery;
    /**
     * @docid dxPopoverOptions.width
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
     * @default { type: "fade", to: 0 }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxPopoverOptions.animation.show
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
     * @docid dxPopover.show
     * @publicName show(target)
     * @param1 target:string|Element|jQuery
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
