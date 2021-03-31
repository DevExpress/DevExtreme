import '../../jquery_augmentation';

import DOMComponent, {
    DOMComponentOptions
} from '../../core/dom_component';

import {
    dxElement
} from '../../core/element';

import {
    event
} from '../../events/index';

export interface dxScrollableOptions<T = dxScrollable> extends DOMComponentOptions<T> {
    /**
     * @docid dxScrollableOptions.bounceEnabled
     * @default false [for](desktop)
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    bounceEnabled?: boolean;
    /**
     * @docid dxScrollableOptions.direction
     * @type Enums.ScrollDirection
     * @default "vertical"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    direction?: 'both' | 'horizontal' | 'vertical';
    /**
     * @docid dxScrollableOptions.disabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid dxScrollableOptions.onScroll
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 scrollOffset:object
     * @type_function_param1_field7 reachedLeft:boolean
     * @type_function_param1_field8 reachedRight:boolean
     * @type_function_param1_field9 reachedTop:boolean
     * @type_function_param1_field10 reachedBottom:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onScroll?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
    /**
     * @docid dxScrollableOptions.onUpdated
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 scrollOffset:object
     * @type_function_param1_field7 reachedLeft:boolean
     * @type_function_param1_field8 reachedRight:boolean
     * @type_function_param1_field9 reachedTop:boolean
     * @type_function_param1_field10 reachedBottom:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUpdated?: ((e: { component?: T, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
    /**
     * @docid dxScrollableOptions.scrollByContent
     * @default false [for](non-touch_devices)
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid dxScrollableOptions.scrollByThumb
     * @default true [for](desktop)
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByThumb?: boolean;
    /**
     * @docid dxScrollableOptions.showScrollbar
     * @default 'onHover' [for](desktop)
     * @type string
     * @acceptValues 'onScroll'|'onHover'|'always'|'never'
     * @default 'onScroll'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
    /**
     * @docid dxScrollableOptions.useNative
     * @default false [for](desktop except Mac)
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useNative?: boolean;
}
/**
 * @docid dxScrollable
 * @type object
 * @inherits DOMComponent
 * @namespace DevExpress.ui
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxScrollable extends DOMComponent {
    constructor(element: Element, options?: dxScrollableOptions)
    constructor(element: JQuery, options?: dxScrollableOptions)
    /**
     * @docid dxScrollablemethods.clientHeight
     * @publicName clientHeight()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clientHeight(): number;
    /**
     * @docid dxScrollablemethods.clientWidth
     * @publicName clientWidth()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clientWidth(): number;
    /**
     * @docid dxScrollablemethods.content
     * @publicName content()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): dxElement;
    /**
     * @docid dxScrollablemethods.scrollBy
     * @publicName scrollBy(distance)
     * @param1 distance:numeric|object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollBy(distance: number | any): void;
    /**
     * @docid dxScrollablemethods.scrollHeight
     * @publicName scrollHeight()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollHeight(): number;
    /**
     * @docid dxScrollablemethods.scrollLeft
     * @publicName scrollLeft()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollLeft(): number;
    /**
     * @docid dxScrollablemethods.scrollOffset
     * @publicName scrollOffset()
     * @return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollOffset(): any;
    /**
     * @docid dxScrollablemethods.scrollTo
     * @publicName scrollTo(targetLocation)
     * @param1 targetLocation:numeric|object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTo(targetLocation: number | any): void;
    /**
     * @docid dxScrollablemethods.scrollToElement
     * @publicName scrollToElement(element)
     * @param1 element:Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToElement(element: Element | JQuery): void;
    /**
     * @docid dxScrollablemethods.scrollTop
     * @publicName scrollTop()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTop(): number;
    /**
     * @docid dxScrollablemethods.scrollWidth
     * @publicName scrollWidth()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollWidth(): number;
    /**
     * @docid dxScrollablemethods.update
     * @publicName update()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    update(): Promise<void> & JQueryPromise<void>;
}
