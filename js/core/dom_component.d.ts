import Component, {
    ComponentOptions
} from './component';

import {
    Device
} from './devices';

import {
    dxElement
} from './element';

export interface DOMComponentOptions<T = DOMComponent> extends ComponentOptions<T> {
    /**
     * @docid DOMComponentOptions.bindingOptions
     * @type object
     * @default {}
     * @prevFileNamespace DevExpress.integration
     * @public
     */
    bindingOptions?: any;
    /**
     * @docid DOMComponentOptions.elementAttr
     * @type object
     * @default {}
     * @prevFileNamespace DevExpress.core
     * @public
     */
    elementAttr?: any;
    /**
     * @docid DOMComponentOptions.height
     * @type number|string|function
     * @default undefined
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.core
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid DOMComponentOptions.onDisposing
     * @action
     * @extends Action
     * @prevFileNamespace DevExpress.core
     * @public
     */
    onDisposing?: ((e: { component?: T, element?: dxElement, model?: any }) => any);
    /**
     * @docid DOMComponentOptions.onOptionChanged
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field4 name:string
     * @type_function_param1_field5 fullName:string
     * @type_function_param1_field6 value:any
     * @action
     * @extends Action
     * @prevFileNamespace DevExpress.core
     * @public
     */
    onOptionChanged?: ((e: { component?: T, element?: dxElement, model?: any, name?: string, fullName?: string, value?: any }) => any);
    /**
     * @docid DOMComponentOptions.rtlEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid DOMComponentOptions.width
     * @type number|string|function
     * @default undefined
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.core
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid DOMComponent
 * @section uiWidgets
 * @type object
 * @inherits Component
 * @namespace DevExpress
 * @module core/dom_component
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.core
 */
export default class DOMComponent extends Component {
    constructor(element: Element | JQuery, options?: DOMComponentOptions);
    /**
     * @docid DOMComponentMethods.defaultOptions
     * @static
     * @section uiWidgets
     * @publicName defaultOptions(rule)
     * @param1 rule:Object
     * @param1_field1 device:Device|Array<Device>|function
     * @param1_field2 options:Object
     * @prevFileNamespace DevExpress.core
     * @public
     */
    static defaultOptions(rule: { device?: Device | Array<Device> | Function, options?: any }): void;
    /**
     * @docid DOMComponentMethods.dispose
     * @publicName dispose()
     * @prevFileNamespace DevExpress.core
     * @public
     */
    dispose(): void;
    /**
     * @docid DOMComponentMethods.element
     * @publicName element()
     * @return dxElement
     * @prevFileNamespace DevExpress.core
     * @public
     */
    element(): dxElement;
    /**
     * @docid DOMComponentMethods.getInstance
     * @static
     * @section uiWidgets
     * @publicName getInstance(element)
     * @param1 element:Node|JQuery
     * @return DOMComponent
     * @prevFileNamespace DevExpress.core
     * @public
     */
    static getInstance(element: Element | JQuery): DOMComponent;
}

export type Options = DOMComponentOptions;

/** @deprecated use Options instead */
export type IOptions = DOMComponentOptions;