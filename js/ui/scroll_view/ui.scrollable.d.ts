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
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid dxScrollableOptions.onScroll
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 scrollOffset:object
     * @type_function_param1_field6 reachedLeft:boolean
     * @type_function_param1_field7 reachedRight:boolean
     * @type_function_param1_field8 reachedTop:boolean
     * @type_function_param1_field9 reachedBottom:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onScroll?: ((e: { component?: T, element?: dxElement, model?: any, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
    /**
     * @docid dxScrollableOptions.onUpdated
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 scrollOffset:object
     * @type_function_param1_field6 reachedLeft:boolean
     * @type_function_param1_field7 reachedRight:boolean
     * @type_function_param1_field8 reachedTop:boolean
     * @type_function_param1_field9 reachedBottom:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUpdated?: ((e: { component?: T, element?: dxElement, model?: any, event?: event, scrollOffset?: any, reachedLeft?: boolean, reachedRight?: boolean, reachedTop?: boolean, reachedBottom?: boolean }) => any);
    /**
     * @docid dxScrollableOptions.scrollByContent
     * @default false [for](non-touch_devices)
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid dxScrollableOptions.scrollByThumb
     * @default true [for](desktop)
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
     * @default false [for](desktop)
     * @default true [for](Mac)
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useNative?: boolean;
}
/**
 * @docid dxScrollable
 * @inherits DOMComponent
 * @namespace DevExpress.ui
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxScrollable extends DOMComponent {
    constructor(element: Element, options?: dxScrollableOptions)
    constructor(element: JQuery, options?: dxScrollableOptions)
    /**
     * @docid dxScrollable.clientHeight
     * @publicName clientHeight()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clientHeight(): number;
    /**
     * @docid dxScrollable.clientWidth
     * @publicName clientWidth()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clientWidth(): number;
    /**
     * @docid dxScrollable.content
     * @publicName content()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): dxElement;
    /**
     * @docid dxScrollable.scrollBy
     * @publicName scrollBy(distance)
     * @param1 distance:numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollBy(distance: number): void;
    /**
     * @docid dxScrollable.scrollBy
     * @publicName scrollBy(distanceObject)
     * @param1 distanceObject:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollBy(distanceObject: any): void;
    /**
     * @docid dxScrollable.scrollHeight
     * @publicName scrollHeight()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollHeight(): number;
    /**
     * @docid dxScrollable.scrollLeft
     * @publicName scrollLeft()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollLeft(): number;
    /**
     * @docid dxScrollable.scrollOffset
     * @publicName scrollOffset()
     * @return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollOffset(): any;
    /**
     * @docid dxScrollable.scrollTo
     * @publicName scrollTo(targetLocation)
     * @param1 targetLocation:numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTo(targetLocation: number): void;
    /**
     * @docid dxScrollable.scrollTo
     * @publicName scrollTo(targetLocationObject)
     * @param1 targetLocation:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTo(targetLocation: any): void;
    /**
     * @docid dxScrollable.scrollToElement
     * @publicName scrollToElement(targetLocation)
     * @param1 element:Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToElement(element: Element | JQuery): void;
    /**
     * @docid dxScrollable.scrollTop
     * @publicName scrollTop()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTop(): number;
    /**
     * @docid dxScrollable.scrollWidth
     * @publicName scrollWidth()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollWidth(): number;
    /**
     * @docid dxScrollable.update
     * @publicName update()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    update(): Promise<void> & JQueryPromise<void>;
}
