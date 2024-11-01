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
 * @docid
 * @hidden
 * @type object
 * @inherits NativeEventInfo
 */
export interface ScrollEventInfo<T> extends NativeEventInfo<T, WheelEvent | MouseEvent | Event> {
    /** @docid */
    readonly scrollOffset?: any;
    /** @docid */
    readonly reachedLeft?: boolean;
    /** @docid */
    readonly reachedRight?: boolean;
    /** @docid */
    readonly reachedTop?: boolean;
    /** @docid */
    readonly reachedBottom?: boolean;
}

/**
 * @namespace DevExpress.ui
 * @docid
 * @hidden
 */
export interface dxScrollableOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * @docid
     * @default false &for(desktop)
     * @default true
     * @public
     */
    bounceEnabled?: boolean;
    /**
     * @docid
     * @default "vertical"
     * @public
     */
    direction?: ScrollDirection;
    /**
     * @docid
     * @default false
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/scroll_view/ui.scrollable:ScrollEventInfo}
     * @action
     * @public
     */
    onScroll?: ((e: ScrollEventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/scroll_view/ui.scrollable:ScrollEventInfo}
     * @action
     * @public
     */
    onUpdated?: ((e: ScrollEventInfo<TComponent>) => void);
    /**
     * @docid
     * @default false &for(non-touch_devices)
     * @default true
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default true &for(desktop)
     * @default false
     * @public
     */
    scrollByThumb?: boolean;
    /**
     * @docid
     * @default 'onHover' &for(desktop)
     * @default 'onScroll'
     * @public
     */
    showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
    /**
     * @docid
     * @default false &for(desktop except Mac)
     * @default true
     * @public
     */
    useNative?: boolean;
}
/**
 * @docid
 * @inherits DOMComponent
 * @namespace DevExpress.ui
 * @hidden
 */
export default class dxScrollable<TProperties = Properties> extends DOMComponent<TProperties> {
    /**
     * @docid
     * @publicName clientHeight()
     * @return numeric
     * @public
     */
    clientHeight(): number;
    /**
     * @docid
     * @publicName clientWidth()
     * @return numeric
     * @public
     */
    clientWidth(): number;
    /**
     * @docid
     * @publicName content()
     * @public
     */
    content(): DxElement;
    /**
     * @docid
     * @publicName scrollBy(distance)
     * @param1 distance:numeric|object
     * @public
     */
    scrollBy(distance: number | any): void;
    /**
     * @docid
     * @publicName scrollHeight()
     * @return numeric
     * @public
     */
    scrollHeight(): number;
    /**
     * @docid
     * @publicName scrollLeft()
     * @return numeric
     * @public
     */
    scrollLeft(): number;
    /**
     * @docid
     * @publicName scrollOffset()
     * @return object
     * @public
     */
    scrollOffset(): any;
    /**
     * @docid
     * @publicName scrollTo(targetLocation)
     * @param1 targetLocation:numeric|object
     * @public
     */
    scrollTo(targetLocation: number | any): void;
    /**
     * @docid
     * @publicName scrollToElement(element)
     * @param1 element:Element|jQuery
     * @public
     */
    scrollToElement(element: UserDefinedElement): void;
    /**
     * @docid
     * @publicName scrollTop()
     * @return numeric
     * @public
     */
    scrollTop(): number;
    /**
     * @docid
     * @publicName scrollWidth()
     * @return numeric
     * @public
     */
    scrollWidth(): number;
    /**
     * @docid
     * @publicName update()
     * @return Promise<void>
     * @public
     */
    update(): DxPromise<void>;
}

interface ScrollableInstance extends dxScrollable<Properties> { }

type Properties = dxScrollableOptions<ScrollableInstance>;
