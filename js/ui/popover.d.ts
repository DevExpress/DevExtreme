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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxPopoverOptions<T = dxPopover> extends dxPopupOptions<T> {
    /**
     * @docid
     * @default { show: { type: "fade", from: 0, to: 1 }, hide: { type: "fade", to: 0 } }
     * @public
     * @type object
     */
    animation?: dxPopoverAnimation;
    /**
     * @docid
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @default true
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
    /**
     * @docid
     * @default "auto"
     * @type_function_return number|string
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default undefined
     * @public
     */
    hideEvent?: {
      /**
       * @docid
       * @default undefined
       */
      delay?: number,
      /**
       * @docid
       * @default undefined
       */
      name?: string
    } | string;
    /**
     * @docid
     * @type Enums.Position|positionConfig
     * @default 'bottom'
     * @public
     */
    position?: 'bottom' | 'left' | 'right' | 'top' | positionConfig;
    /**
     * @docid
     * @default false
     * @public
     */
    shading?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    showEvent?: {
      /**
       * @docid
       * @default undefined
       */
      delay?: number,
      /**
       * @docid
       * @default undefined
       */
      name?: string
    } | string;
    /**
     * @docid
     * @default false
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid
     * @default Window
     * @public
     */
    target?: string | UserDefinedElement;
    /**
     * @docid
     * @default "auto"
     * @type_function_return number|string
     * @public
     */
    width?: number | string | (() => number | string);
}
/** @namespace DevExpress.ui */
export interface dxPopoverAnimation extends dxPopupAnimation {
    /**
     * @docid dxPopoverOptions.animation.hide
     * @default { type: "fade", to: 0 }
     * @public
     */
    hide?: animationConfig;
    /**
     * @docid dxPopoverOptions.animation.show
     * @default { type: "fade", from: 0, to: 1 }
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
 * @namespace DevExpress.ui
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
