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

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type Events = CheckedEvents<FilterOutHidden<Properties>, Required<{
/**
 * @skip
 * @docid dxPopupOptions.onContentReady
 * @type_function_param1 e:{ui/popup:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onDisposing
 * @type_function_param1 e:{ui/popup:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onHidden
 * @type_function_param1 e:{ui/popup:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onHiding
 * @type_function_param1 e:{ui/popup:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onInitialized
 * @type_function_param1 e:{ui/popup:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onOptionChanged
 * @type_function_param1 e:{ui/popup:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onResize
 * @type_function_param1 e:{ui/popup:ResizeEvent}
 */
onResize?: ((e: ResizeEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onResizeEnd
 * @type_function_param1 e:{ui/popup:ResizeEndEvent}
 */
onResizeEnd?: ((e: ResizeEndEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onResizeStart
 * @type_function_param1 e:{ui/popup:ResizeStartEvent}
 */
onResizeStart?: ((e: ResizeStartEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onShowing
 * @type_function_param1 e:{ui/popup:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onShown
 * @type_function_param1 e:{ui/popup:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
/**
 * @skip
 * @docid dxPopupOptions.onTitleRendered
 * @type_function_param1 e:{ui/popup:TitleRenderedEvent}
 */
onTitleRendered?: ((e: TitleRenderedEvent) => void);
}>>;
