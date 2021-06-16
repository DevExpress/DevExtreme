import DOMComponent, {
    DOMComponentOptions
} from '../../core/dom_component';

import {
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    DxPromise
} from '../../core/utils/deferred';

import {
    NativeEventInfo
} from '../../events/index';

export interface ScrollEventInfo<T> extends NativeEventInfo<T> {
    readonly scrollOffset?: any;
    readonly reachedLeft?: boolean;
    readonly reachedRight?: boolean;
    readonly reachedTop?: boolean;
    readonly reachedBottom?: boolean;
}

/** @namespace DevExpress.ui */
export interface dxScrollableOptions<TComponent> extends DOMComponentOptions<TComponent> {
    /**
     * @docid
     * @default false [for](desktop)
     * @default true
     * @public
     */
    bounceEnabled?: boolean;
    /**
     * @docid
     * @type Enums.ScrollDirection
     * @default "vertical"
     * @public
     */
    direction?: 'both' | 'horizontal' | 'vertical';
    /**
     * @docid
     * @default false
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
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onScroll?: ((e: ScrollEventInfo<TComponent>) => void);
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
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onUpdated?: ((e: ScrollEventInfo<TComponent>) => void);
    /**
     * @docid
     * @default false [for](non-touch_devices)
     * @default true
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @default false
     * @public
     */
    scrollByThumb?: boolean;
    /**
     * @docid
     * @default 'onHover' [for](desktop)
     * @type string
     * @acceptValues 'onScroll'|'onHover'|'always'|'never'
     * @default 'onScroll'
     * @public
     */
    showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
    /**
     * @docid
     * @default false [for](desktop except Mac)
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
     * @return DxElement
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

type Properties = dxScrollableOptions<dxScrollable<Properties>>;
