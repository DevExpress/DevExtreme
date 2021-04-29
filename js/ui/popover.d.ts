import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import dxPopup, {
    dxPopupAnimation,
    dxPopupOptions,
    TitleRenderedInfo
} from './popup';

/** @public */
export type ContentReadyEvent = EventInfo<dxPopover>;

/** @public */
export type DisposingEvent = EventInfo<dxPopover>;

/** @public */
export type HidingEvent = Cancelable & EventInfo<dxPopover>;

/** @public */
export type HiddenEvent = EventInfo<dxPopover>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxPopover>;

/** @public */
export type OptionChangedEvent = EventInfo<dxPopover> & ChangedOptionInfo;

/** @public */
export type ShowingEvent = EventInfo<dxPopover>;

/** @public */
export type ShownEvent = EventInfo<dxPopover>;

/** @public */
export type TitleRenderedEvent = EventInfo<dxPopup> & TitleRenderedInfo;

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
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
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
    target?: string | UserDefinedElement;
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
    constructor(element: UserDefinedElement, options?: dxPopoverOptions)
    show(): DxPromise<boolean>;
    /**
     * @docid
     * @publicName show(target)
     * @param1 target:string|Element|jQuery
     * @return Promise<boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(target: string | UserDefinedElement): DxPromise<boolean>;
}

/** @public */
export type Properties = dxPopoverOptions;

/** @deprecated use Properties instead */
export type Options = dxPopoverOptions;

/** @deprecated use Properties instead */
export type IOptions = dxPopoverOptions;
