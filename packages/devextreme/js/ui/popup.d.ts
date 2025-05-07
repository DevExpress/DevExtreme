import {
    AnimationConfig,
    PositionConfig,
} from '../common/core/animation';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    PositionAlignment,
    ToolbarItemLocation,
    ToolbarItemComponent,
} from '../common';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    Item as dxToolbarItem,
} from './toolbar';

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions,
} from './overlay';

import {
    ResizeInfo,
} from './resizable';

export {
    PositionAlignment,
    ToolbarItemLocation,
    ToolbarItemComponent as ToolbarItemWidget,
};

/**
 * @docid
 * @hidden
 */
export interface TitleRenderedInfo {
    readonly titleElement: DxElement;
}

/** @public */
export type ToolbarLocation = 'bottom' | 'top';

/** @public */
export type ContentReadyEvent = EventInfo<dxPopup>;

/** @public */
export type DisposingEvent = EventInfo<dxPopup>;

/** @public */
export type HidingEvent = Cancelable & EventInfo<dxPopup>;

/** @public */
export type HiddenEvent = EventInfo<dxPopup>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxPopup>;

/** @public */
export type ShownEvent = EventInfo<dxPopup>;

/** @public */
export type ResizeEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

/** @public */
export type ResizeStartEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

/** @public */
export type ResizeEndEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxPopup> & ChangedOptionInfo;

/** @public */
export type ShowingEvent = Cancelable & EventInfo<dxPopup>;

/** @public */
export type TitleRenderedEvent = EventInfo<dxPopup> & TitleRenderedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxPopupOptions<TComponent> extends dxOverlayOptions<TComponent> {
    /**
     * @docid
     * @public
     * @type object
     */
    animation?: dxPopupAnimation;
    /**
     * @docid
     * @default undefined
     * @public
     */
    container?: string | UserDefinedElement | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    dragAndResizeArea?: string | UserDefinedElement | undefined;
    /**
     * @docid
     * @default false
     * @default true &for(desktop)
     * @public
     */
    dragEnabled?: boolean;
     /**
     * @docid
     * @default false
     * @public
     */
    dragOutsideBoundary?: boolean;
    /**
     * @docid
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    fullScreen?: boolean;
    /**
     * @docid
     * @fires dxPopupOptions.onResize
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onTitleRendered?: ((e: EventInfo<TComponent> & TitleRenderedInfo) => void);
    /**
     * @docid
     * @public
     */
    position?: PositionAlignment | PositionConfig | Function;
    /**
     * @docid
     * @default true
     * @public
     */
    enableBodyScroll?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    resizeEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    restorePosition?: boolean;
    /**
     * @docid
     * @default false
     * @default true &for(desktop)
     * @default false &for(Material)
     * @public
     */
    showCloseButton?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showTitle?: boolean;
    /**
     * @docid
     * @default ""
     * @public
     */
    title?: string;
    /**
     * @docid
     * @default "title"
     * @type_function_return string|Element|jQuery
     * @public
     */
    titleTemplate?: template | ((titleElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @type Array<dxPopupToolbarItem>
     * @public
     */
    toolbarItems?: Array<ToolbarItem>;
    /**
     * @docid
     * @fires dxPopupOptions.onResize
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @namespace DevExpress.ui
 */
export interface dxPopupAnimation extends dxOverlayAnimation {
    /**
     * @docid dxPopupOptions.animation.hide
     * @default { type: 'slide', duration: 400, from: { position: { my: 'center', at: 'center', of: window } }, to: { position: { my: 'top', at: 'bottom', of: window } }} &for(iOS)
     * @public
     */
    hide?: AnimationConfig;
    /**
     * @docid dxPopupOptions.animation.show
     * @default { type: 'slide', duration: 400, from: { position: { my: 'top', at: 'bottom', of: window } }, to: { position: { my: 'center', at: 'center', of: window } }} &for(iOS)
     * @public
     */
    show?: AnimationConfig;
}

/**
 * @deprecated Use ToolbarItem instead
 * @namespace DevExpress.ui.dxPopup
 */
export type dxPopupToolbarItem = ToolbarItem;

/**
 * @public
 * @docid dxPopupToolbarItem
 * @inherits dxToolbarItem
 * @namespace DevExpress.ui.dxPopup
 */
export interface ToolbarItem extends dxToolbarItem {
    /**
     * @docid dxPopupToolbarItem.toolbar
     * @default 'top'
     * @public
     */
    toolbar?: ToolbarLocation;
}

/**
 * @docid
 * @inherits dxOverlay
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxPopup<TProperties = Properties> extends dxOverlay<TProperties> {}

interface PopupInstance extends dxPopup<Properties> { }

/** @public */
export type Properties = dxPopupOptions<PopupInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;
