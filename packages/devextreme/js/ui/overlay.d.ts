import {
    AnimationConfig,
} from '../common/core/animation';

import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    Cancelable,
    EventInfo,
} from '../common/core/events';

import { DxEvent } from '../events';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxOverlayOptions<TComponent> extends WidgetOptions<TComponent> {
    /**
     * Configures UI component visibility animations. This object contains two fields: show and hide.
     */
    animation?: dxOverlayAnimation;
    /**
     * Specifies whether to close the UI component if a user clicks outside it.
     * @deprecated Use the hideOnOutsideClick option instead.
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * Specifies a custom template for the UI component content.
     */
    contentTemplate?: template | ((contentElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether to render the UI component&apos;s content when it is displayed. If false, the content is rendered immediately.
     */
    deferRendering?: boolean;
    /**
     * Specifies the global attributes to be attached to the UI component&apos;s container element.
     * @deprecated 
     */
    elementAttr?: any;
    /**
     * Specifies whether to hide the UI component if a user clicks outside it.
     */
    hideOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * Specifies whether to hide the widget when users scroll one of its parent elements.
     */
    hideOnParentScroll?: boolean;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * Specifies the maximum height the UI component can reach while resizing.
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * Specifies the maximum width the UI component can reach while resizing.
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * Specifies the minimum height the UI component can reach while resizing.
     */
    minHeight?: number | string | (() => number | string);
    /**
     * Specifies the minimum width the UI component can reach while resizing.
     */
    minWidth?: number | string | (() => number | string);
    /**
     * A function that is executed after the UI component is hidden.
     */
    onHidden?: ((e: EventInfo<TComponent>) => void);
    /**
     * A function that is executed before the UI component is hidden.
     */
    onHiding?: ((e: Cancelable & EventInfo<TComponent>) => void);
    /**
     * A function that is executed before the UI component is displayed.
     */
    onShowing?: ((e: Cancelable & EventInfo<TComponent>) => void);
    /**
     * A function that is executed after the UI component is displayed.
     */
    onShown?: ((e: EventInfo<TComponent>) => void);
    /**
     * Positions the UI component.
     */
    position?: any;
    /**
     * Specifies whether to shade the background when the UI component is active.
     */
    shading?: boolean;
    /**
     * Specifies the shading color. Applies only if shading is enabled.
     */
    shadingColor?: string;
    /**
     * A Boolean value specifying whether or not the UI component is visible.
     */
    visible?: boolean;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
    /**
     * Specifies the global attributes for the UI component&apos;s wrapper element.
     */
    wrapperAttr?: any;
}
/**
 * Configures UI component visibility animations. This object contains two fields: show and hide.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxOverlayAnimation {
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
 * The Overlay UI component represents a window overlaying the current view. It displays data located within the HTML element representing the UI component.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class dxOverlay<TProperties> extends Widget<TProperties> {
    /**
     * Gets the UI component&apos;s content.
     */
    content(): DxElement;
    /**
     * Hides the UI component.
     */
    hide(): DxPromise<boolean>;
    /**
     * Recalculates the UI component&apos;s size and position without rerendering.
     */
    repaint(): void;
    /**
     * Shows the UI component.
     */
    show(): DxPromise<boolean>;
    /**
     * Shows or hides the UI component depending on the argument.
     */
    toggle(showing: boolean): DxPromise<boolean>;
}

/**
 * Specifies the base z-index for all overlay UI components.
 */
export function baseZIndex(zIndex: number): void;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
interface OverlayInstance extends dxOverlay<Properties> { }

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Properties = dxOverlayOptions<OverlayInstance>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = Properties;
