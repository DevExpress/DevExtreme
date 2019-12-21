import DOMComponent, {
    DOMComponentOptions
} from '../../core/dom_component';

import {
    dxElement
} from '../../core/element';

export interface WidgetOptions<T = Widget> extends DOMComponentOptions<T> {
    /**
     * @docid WidgetOptions.accessKey
     * @type string
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    accessKey?: string;
    /**
     * @docid WidgetOptions.activeStateEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid WidgetOptions.disabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid WidgetOptions.focusStateEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid WidgetOptions.hint
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hint?: string;
    /**
     * @docid WidgetOptions.hoverStateEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid WidgetOptions.onContentReady
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContentReady?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid WidgetOptions.tabIndex
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tabIndex?: number;
    /**
     * @docid WidgetOptions.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}
/**
 * @docid Widget
 * @type object
 * @inherits DOMComponent
 * @module ui/widget/ui.widget
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class Widget extends DOMComponent {
    constructor(element: Element, options?: WidgetOptions)
    constructor(element: JQuery, options?: WidgetOptions)
    /**
     * @docid WidgetMethods.focus
     * @publicName focus()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focus(): void;
    /**
     * @docid WidgetMethods.registerKeyHandler
     * @publicName registerKeyHandler(key, handler)
     * @param1 key:string
     * @param2 handler:function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    registerKeyHandler(key: string, handler: Function): void;
    /**
     * @docid WidgetMethods.repaint
     * @publicName repaint()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaint(): void;
}

/**
 * @const dxItem
 * @type object
 * @section uiWidgetMarkupComponents
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export var dxItem: any;

/**
 * @docid format
 * @type Enums.Format|string|function|Object
 * @type_function_param1 value:number|date
 * @type_function_return string
 * @default undefined
 * @section Common
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export type format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' | string | ((value: number | Date) => string) | { currency?: string, formatter?: ((value: number | Date) => string), parser?: ((value: string) => number | Date), precision?: number, type?: 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' };
