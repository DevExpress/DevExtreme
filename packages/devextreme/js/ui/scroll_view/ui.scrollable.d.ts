import DOMComponent, {
    DOMComponentOptions,
} from '../../core/dom_component';

import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    DxPromise,
} from '../../core/utils/deferred';

import {
    NativeEventInfo,
} from '../../common/core/events';

import {
    ScrollDirection,
} from '../../common';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ScrollEventInfo<T> extends NativeEventInfo<T, WheelEvent | MouseEvent | Event> {
    /**
     * 
     */
    readonly scrollOffset?: any;
    /**
     * 
     */
    readonly reachedLeft?: boolean;
    /**
     * 
     */
    readonly reachedRight?: boolean;
    /**
     * 
     */
    readonly reachedTop?: boolean;
    /**
     * 
     */
    readonly reachedBottom?: boolean;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxScrollableOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * A Boolean value specifying whether to enable or disable the bounce-back effect.
     */
    bounceEnabled?: boolean;
    /**
     * A string value specifying the available scrolling directions.
     */
    direction?: ScrollDirection;
    /**
     * Specifies whether the UI component responds to user interaction.
     */
    disabled?: boolean;
    /**
     * A function that is executed on each scroll gesture.
     */
    onScroll?: ((e: ScrollEventInfo<TComponent>) => void);
    /**
     * A function that is executed each time the UI component is updated.
     */
    onUpdated?: ((e: ScrollEventInfo<TComponent>) => void);
    /**
     * A Boolean value specifying whether or not an end user can scroll the UI component content swiping it up or down. Applies only if useNative is false
     */
    scrollByContent?: boolean;
    /**
     * Specifies whether a user can scroll the content with the scrollbar. Applies only if useNative is false.
     */
    scrollByThumb?: boolean;
    /**
     * Specifies when the UI component shows the scrollbar.
     */
    showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
    /**
     * Indicates whether to use native or simulated scrolling.
     */
    useNative?: boolean;
}
/**
 * A UI component used to display scrollable content.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class dxScrollable<TProperties = Properties> extends DOMComponent<TProperties> {
    /**
     * Gets the UI component&apos;s height.
     */
    clientHeight(): number;
    /**
     * Gets the UI component&apos;s width.
     */
    clientWidth(): number;
    /**
     * Gets the UI component&apos;s content.
     */
    content(): DxElement;
    /**
     * Scrolls the content by a specific distance.
     */
    scrollBy(distance: number | any): void;
    /**
     * Gets the scrollable content&apos;s height in pixels.
     */
    scrollHeight(): number;
    /**
     * Gets the left scroll offset.
     */
    scrollLeft(): number;
    /**
     * Gets the scroll offset.
     */
    scrollOffset(): any;
    /**
     * Scrolls the content to a specific position.
     */
    scrollTo(targetLocation: number | any): void;
    /**
     * Scrolls content to an element.
     */
    scrollToElement(element: UserDefinedElement): void;
    /**
     * Gets the top scroll offset.
     */
    scrollTop(): number;
    /**
     * Gets the scrollable content&apos;s width in pixels.
     */
    scrollWidth(): number;
    /**
     * Updates the scrollable contents&apos; dimensions.
     */
    update(): DxPromise<void>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
interface ScrollableInstance extends dxScrollable<Properties> { }

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Properties = dxScrollableOptions<ScrollableInstance>;
