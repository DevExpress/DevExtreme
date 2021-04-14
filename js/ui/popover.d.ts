import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    TEvent,
    Cancelable,
    ComponentEvent,
    ComponentInitializedEvent,
    ChangedOptionInfo
} from '../events/index';

import dxPopup, {
    dxPopupAnimation,
    dxPopupOptions,
    TitleRenderedInfo
} from './popup';

/** @public */
export type ContentReadyEvent = ComponentEvent<dxPopover>;

/** @public */
export type DisposingEvent = ComponentEvent<dxPopover>;

/** @public */
export type HidingEvent = ComponentEvent<dxPopover> & Cancelable;

/** @public */
export type HiddenEvent = ComponentEvent<dxPopover>;

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxPopover>;

/** @public */
export type OptionChangedEvent = ComponentEvent<dxPopover> & ChangedOptionInfo;

/** @public */
export type ShowingEvent = ComponentEvent<dxPopover>;

/** @public */
export type ShownEvent = ComponentEvent<dxPopover>;

/** @public */
export type TitleRenderedEvent = ComponentEvent<dxPopup> & TitleRenderedInfo;

export interface dxPopoverOptions<T = dxPopover> extends dxPopupOptions<T> {
    /**
     * @docid
     * @default { show: { type: "fade", from: 0, to: 1 }, hide: { type: "fade", to: 0 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    animation?: dxPopoverAnimation;
    /**
     * @docid
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: TEvent) => boolean);
    /**
     * @docid
     * @default "auto"
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideEvent?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      delay?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      name?: string
    } | string;
    /**
     * @docid
     * @type Enums.Position|positionConfig
     * @default 'bottom'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top' | positionConfig;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showEvent?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      delay?: number,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      name?: string
    } | string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid
     * @default Window
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    target?: string | TElement;
    /**
     * @docid
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
 * @docid
 * @inherits dxPopup
 * @hasTranscludedContent
 * @module ui/popover
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxPopover extends dxPopup {
    constructor(element: TElement, options?: dxPopoverOptions)
    show(): TPromise<boolean>;
    /**
     * @docid
     * @publicName show(target)
     * @param1 target:string|Element|jQuery
     * @return Promise<boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(target: string | TElement): TPromise<boolean>;
}

export type Options = dxPopoverOptions;

/** @deprecated use Options instead */
export type IOptions = dxPopoverOptions;
