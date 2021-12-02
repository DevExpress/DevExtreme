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

import dxOverlay, {
    dxOverlayAnimation,
    dxOverlayOptions,
} from './overlay';

import {
    ResizeInfo,
} from './resizable';

export interface TitleRenderedInfo {
    readonly titleElement: DxElement;
}

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
     * @default { show: { type: 'slide', duration: 400, from: { position: { my: 'top', at: 'bottom', of: window } }, to: { position: { my: 'center', at: 'center', of: window } } }, hide: { type: 'slide', duration: 400, from: { position: { my: 'center', at: 'center', of: window } }, to: { position: { my: 'top', at: 'bottom', of: window } } }} &for(iOS)
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
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @public
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @public
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 width:number
     * @type_function_param1_field6 height:number
     * @action
     * @public
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 titleElement:DxElement
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onTitleRendered?: ((e: EventInfo<TComponent> & TitleRenderedInfo) => void);
    /**
     * @docid
     * @type Enums.PositionAlignment|PositionConfig|function
     * @public
     */
    position?: 'bottom' | 'center' | 'left' | 'left bottom' | 'left top' | 'right' | 'right bottom' | 'right top' | 'top' | PositionConfig | Function;
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
     * @type Array<Object>
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
/** @namespace DevExpress.ui */
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
 * @public
 * @namespace DevExpress.ui.dxPopup
 */
export type ToolbarItem = dxPopupToolbarItem;

/**
 * @deprecated Use ToolbarItem instead
 * @namespace DevExpress.ui
 */
export interface dxPopupToolbarItem {
    /**
     * @docid dxPopupOptions.toolbarItems.disabled
     * @default false
     * @public
     */
    disabled?: boolean;
    /**
     * @docid dxPopupOptions.toolbarItems.html
     * @public
     */
    html?: string;
    /**
     * @docid dxPopupOptions.toolbarItems.location
     * @type Enums.ToolbarItemLocation
     * @default 'center'
     * @public
     */
    location?: 'after' | 'before' | 'center';
    /**
     * @docid dxPopupOptions.toolbarItems.options
     * @public
     */
    options?: any;
    /**
     * @docid dxPopupOptions.toolbarItems.template
     * @public
     */
    template?: template;
    /**
     * @docid dxPopupOptions.toolbarItems.text
     * @public
     */
    text?: string;
    /**
     * @docid dxPopupOptions.toolbarItems.toolbar
     * @type Enums.Toolbar
     * @default 'top'
     * @public
     */
    toolbar?: 'bottom' | 'top';
    /**
     * @docid dxPopupOptions.toolbarItems.visible
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxPopupOptions.toolbarItems.widget
     * @type Enums.ToolbarItemWidget
     * @public
     */
    widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
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
