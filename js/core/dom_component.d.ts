import Component, {
    ComponentOptions
} from './component';

import {
    Device
} from './devices';

import {
    TElement
} from './element';

import { TemplateManager } from './template_manager';
import { FunctionTemplate } from './templates/function_template';

export interface DOMComponentOptions<T = DOMComponent> extends ComponentOptions<T> {
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.integration
     * @public
     */
    bindingOptions?: any;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.core
     * @public
     */
    elementAttr?: any;
    /**
     * @docid
     * @default undefined
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.core
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @action
     * @default null
     * @prevFileNamespace DevExpress.core
     * @public
     */
    onDisposing?: ((e: { component?: T, element?: TElement, model?: any }) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 name:string
     * @type_function_param1_field5 fullName:string
     * @type_function_param1_field6 value:any
     * @action
     * @default null
     * @prevFileNamespace DevExpress.core
     * @public
     */
    onOptionChanged?: ((e: { component?: T, element?: TElement, model?: any, name?: string, fullName?: string, value?: any }) => void);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.core
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.core
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @section uiWidgets
 * @inherits Component
 * @namespace DevExpress
 * @module core/dom_component
 * @export default
 * @hidden
 * @prevFileNamespace DevExpress.core
 */
export default class DOMComponent extends Component {
    constructor(element: TElement, options?: DOMComponentOptions);
    /**
     * @docid
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
     * @docid
     * @publicName dispose()
     * @prevFileNamespace DevExpress.core
     * @public
     */
    dispose(): void;
    /**
     * @docid
     * @publicName element()
     * @return dxElement
     * @prevFileNamespace DevExpress.core
     * @public
     */
    element(): TElement;
    /**
     * @docid
     * @static
     * @section uiWidgets
     * @publicName getInstance(element)
     * @param1 element:Element|JQuery
     * @return DOMComponent
     * @prevFileNamespace DevExpress.core
     * @public
     */
    static getInstance(element: TElement): DOMComponent;

    $element(): TElement;
    _getTemplate(template: unknown): FunctionTemplate;
    _invalidate(): void;
    _refresh(): void;
    _templateManager: TemplateManager;
}

export type Options = DOMComponentOptions;

/** @deprecated use Options instead */
export type IOptions = DOMComponentOptions;
