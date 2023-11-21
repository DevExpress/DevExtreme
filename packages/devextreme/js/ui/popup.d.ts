import {
    AnimationConfig,
} from '../animation/fx';

import {
    PositionConfig,
} from '../animation/position';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    Item as dxToolbarItem,
} from './toolbar';

import {
    PositionAlignment,
    ToolbarItemLocation,
    ToolbarItemComponent,
} from '../common';

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
    /** @docid */
    readonly titleElement: DxElement;
}

/** @public */
export type ToolbarLocation = 'bottom' | 'top';

/**
 * @docid _ui_popup_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
*/
export type ContentReadyEvent = EventInfo<dxPopup>;

/**
 * @docid _ui_popup_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
*/
export type DisposingEvent = EventInfo<dxPopup>;

/**
 * @docid _ui_popup_HidingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
*/
export type HidingEvent = Cancelable & EventInfo<dxPopup>;

/**
 * @docid _ui_popup_HiddenEvent
 * @public
 * @type object
 * @inherits EventInfo
*/
export type HiddenEvent = EventInfo<dxPopup>;

/**
 * @docid _ui_popup_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
*/
export type InitializedEvent = InitializedEventInfo<dxPopup>;

/**
 * @docid _ui_popup_ShownEvent
 * @public
 * @type object
 * @inherits EventInfo
*/
export type ShownEvent = EventInfo<dxPopup>;

/**
 * @docid _ui_popup_ResizeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ResizeInfo
*/
export type ResizeEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @docid _ui_popup_ResizeStartEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ResizeInfo
*/
export type ResizeStartEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @docid _ui_popup_ResizeEndEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ResizeInfo
*/
export type ResizeEndEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

/**
 * @docid _ui_popup_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
*/
export type OptionChangedEvent = EventInfo<dxPopup> & ChangedOptionInfo;

/**
 * @docid _ui_popup_ShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
*/
export type ShowingEvent = Cancelable & EventInfo<dxPopup>;

/**
 * @docid _ui_popup_TitleRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,TitleRenderedInfo
*/
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
    container?: string | UserDefinedElement;
    /**
     * @docid
     * @default undefined
     * @public
     */
    dragAndResizeArea?: string | UserDefinedElement;
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
     * @type_function_param1 e:{ui/popup:ResizeEvent}
     * @action
     * @public
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/popup:ResizeEndEvent}
     * @action
     * @public
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/popup:ResizeStartEvent}
     * @action
     * @public
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/popup:TitleRenderedEvent}
     * @action
     * @public
     */
    onTitleRendered?: ((e: TitleRenderedEvent) => void);
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

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onResize' | 'onResizeEnd' | 'onResizeStart' | 'onTitleRendered'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxPopupOptions.onContentReady
 * @type_function_param1 e:{ui/popup:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxPopupOptions.onDisposing
 * @type_function_param1 e:{ui/popup:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxPopupOptions.onHidden
 * @type_function_param1 e:{ui/popup:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @docid dxPopupOptions.onHiding
 * @type_function_param1 e:{ui/popup:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @docid dxPopupOptions.onInitialized
 * @type_function_param1 e:{ui/popup:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxPopupOptions.onOptionChanged
 * @type_function_param1 e:{ui/popup:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxPopupOptions.onShowing
 * @type_function_param1 e:{ui/popup:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @docid dxPopupOptions.onShown
 * @type_function_param1 e:{ui/popup:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
};
///#ENDDEBUG
