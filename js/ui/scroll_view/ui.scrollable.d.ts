import DOMComponent, {
    DOMComponentOptions
} from '../../core/dom_component';

import {
    TElement
} from '../../core/element';

import {
    TPromise
} from '../../core/utils/deferred';

import {
    NativeEventInfo
} from '../../events/index';

export interface ScrollEventInfo<T = dxScrollable> extends NativeEventInfo<T> {
    readonly scrollOffset?: any;
    readonly reachedLeft?: boolean;
    readonly reachedRight?: boolean;
    readonly reachedTop?: boolean;
    readonly reachedBottom?: boolean;
}

export interface dxScrollableOptions<T = dxScrollable> extends DOMComponentOptions<T> {
    /**
     * @docid
     * @default false [for](desktop)
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    bounceEnabled?: boolean;
    /**
     * @docid
     * @type Enums.ScrollDirection
     * @default "vertical"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    direction?: 'both' | 'horizontal' | 'vertical';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 scrollOffset:object
     * @type_function_param1_field6 reachedLeft:boolean
     * @type_function_param1_field7 reachedRight:boolean
     * @type_function_param1_field8 reachedTop:boolean
     * @type_function_param1_field9 reachedBottom:boolean
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onScroll?: ((e: ScrollEventInfo<T>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 scrollOffset:object
     * @type_function_param1_field6 reachedLeft:boolean
     * @type_function_param1_field7 reachedRight:boolean
     * @type_function_param1_field8 reachedTop:boolean
     * @type_function_param1_field9 reachedBottom:boolean
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUpdated?: ((e: ScrollEventInfo<T>) => void);
    /**
     * @docid
     * @default false [for](non-touch_devices)
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByThumb?: boolean;
    /**
     * @docid
     * @default 'onHover' [for](desktop)
     * @type string
     * @acceptValues 'onScroll'|'onHover'|'always'|'never'
     * @default 'onScroll'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
    /**
     * @docid
     * @default false [for](desktop except Mac)
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useNative?: boolean;
}
/**
 * @docid
 * @inherits DOMComponent
 * @namespace DevExpress.ui
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxScrollable extends DOMComponent {
    constructor(element: TElement, options?: dxScrollableOptions)
    /**
     * @docid
     * @publicName clientHeight()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clientHeight(): number;
    /**
     * @docid
     * @publicName clientWidth()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clientWidth(): number;
    /**
     * @docid
     * @publicName content()
     * @return dxElement
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    content(): TElement;
    /**
     * @docid
     * @publicName scrollBy(distance)
     * @param1 distance:numeric|object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollBy(distance: number | any): void;
    /**
     * @docid
     * @publicName scrollHeight()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollHeight(): number;
    /**
     * @docid
     * @publicName scrollLeft()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollLeft(): number;
    /**
     * @docid
     * @publicName scrollOffset()
     * @return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollOffset(): any;
    /**
     * @docid
     * @publicName scrollTo(targetLocation)
     * @param1 targetLocation:numeric|object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTo(targetLocation: number | any): void;
    /**
     * @docid
     * @publicName scrollToElement(element)
     * @param1 element:Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToElement(element: TElement): void;
    /**
     * @docid
     * @publicName scrollTop()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTop(): number;
    /**
     * @docid
     * @publicName scrollWidth()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollWidth(): number;
    /**
     * @docid
     * @publicName update()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    update(): TPromise<void>;
}
