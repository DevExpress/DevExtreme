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
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface TitleRenderedInfo {
    readonly titleElement: DxElement;
}

export type ToolbarLocation = 'bottom' | 'top';

export type ContentReadyEvent = EventInfo<dxPopup>;

export type DisposingEvent = EventInfo<dxPopup>;

export type HidingEvent = Cancelable & EventInfo<dxPopup>;

export type HiddenEvent = EventInfo<dxPopup>;

export type InitializedEvent = InitializedEventInfo<dxPopup>;

export type ShownEvent = EventInfo<dxPopup>;

export type ResizeEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

export type ResizeStartEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

export type ResizeEndEvent = NativeEventInfo<dxPopup, MouseEvent | TouchEvent> & ResizeInfo;

export type OptionChangedEvent = EventInfo<dxPopup> & ChangedOptionInfo;

export type ShowingEvent = Cancelable & EventInfo<dxPopup>;

export type TitleRenderedEvent = EventInfo<dxPopup> & TitleRenderedInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPopupOptions<TComponent> extends dxOverlayOptions<TComponent> {
    /**
     * Configures UI component visibility animations. This object contains two fields: show and hide.
     */
    animation?: dxPopupAnimation;
    /**
     * Specifies the container in which to render the UI component.
     */
    container?: string | UserDefinedElement | undefined;
    /**
     * Specifies an element with boundaries within which users can drag and resize the Popup. Ignored if the dragOutsideBoundary property is set to true.
     */
    dragAndResizeArea?: string | UserDefinedElement | undefined;
    /**
     * Specifies whether or not to allow a user to drag the popup window.
     */
    dragEnabled?: boolean;
     /**
     * Allows users to drag the Popup within the browser window or beyond the window&apos;s borders.
     */
    dragOutsideBoundary?: boolean;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether to display the Popup in full-screen mode.
     */
    fullScreen?: boolean;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * A function that is executed each time the UI component is resized by one pixel.
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * A function that is executed when resizing ends.
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * A function that is executed when resizing starts.
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * A function that is executed when the UI component&apos;s title is rendered.
     */
    onTitleRendered?: ((e: EventInfo<TComponent> & TitleRenderedInfo) => void);
    /**
     * Positions the UI component.
     */
    position?: PositionAlignment | PositionConfig | Function;
    /**
     * Specifies whether to enable page scrolling when the UI component is visible.
     */
    enableBodyScroll?: boolean;
    /**
     * Specifies whether or not an end user can resize the UI component.
     */
    resizeEnabled?: boolean;
    /**
     * Specifies whether to display the widget at the initial position when users reopen it.
     */
    restorePosition?: boolean;
    /**
     * Specifies whether or not the UI component displays the Close button.
     */
    showCloseButton?: boolean;
    /**
     * A Boolean value specifying whether or not to display the title in the popup window.
     */
    showTitle?: boolean;
    /**
     * The title in the overlay window.
     */
    title?: string;
    /**
     * Specifies a custom template for the UI component title. Does not apply if the title is defined.
     */
    titleTemplate?: template | ((titleElement: DxElement) => string | UserDefinedElement);
    /**
     * Configures toolbar items.
     */
    toolbarItems?: Array<ToolbarItem>;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxPopupAnimation extends dxOverlayAnimation {
    /**
     * An object that defines the animation properties used when the UI component is being hidden.
     */
    hide?: AnimationConfig;
    /**
     * An object that defines the animation properties used when the UI component is being shown.
     */
    show?: AnimationConfig;
}

/**
 * @deprecated Use ToolbarItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxPopupToolbarItem = ToolbarItem;

/**
 * 
 */
export interface ToolbarItem extends dxToolbarItem {
    /**
     * Specifies whether the item is displayed on a top or bottom toolbar.
     */
    toolbar?: ToolbarLocation;
}

/**
 * The Popup UI component is a pop-up window overlaying the current view.
 */
export default class dxPopup<TProperties = Properties> extends dxOverlay<TProperties> {}

interface PopupInstance extends dxPopup<Properties> { }

export type Properties = dxPopupOptions<PopupInstance>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = Properties;
