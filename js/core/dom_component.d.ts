import Component, {
    ComponentOptions
} from './component';

import {
    Device
} from './devices';

import {
    UserDefinedElement,
    DxElement
} from './element';

import { TemplateManager } from './template_manager';
import { FunctionTemplate } from './templates/function_template';

export interface DOMComponentOptions<TComponent> extends ComponentOptions<TComponent> {
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
     * @type_function_param1_field1 component:<DOMComponent>
     * @prevFileNamespace DevExpress.core
     * @public
     */
    onDisposing?: ((e: { component?: TComponent, element?: DxElement, model?: any }) => void);
    /**
     * @docid
     * @action
     * @default null
     * @type_function_param1_field1 component:<DOMComponent>
     * @prevFileNamespace DevExpress.core
     * @public
     */
    onOptionChanged?: ((e: { component?: TComponent, element?: DxElement, model?: any, name?: string, fullName?: string, value?: any }) => void);
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
export default class DOMComponent<TProperties = Properties> extends Component<TProperties> {
    constructor(element: UserDefinedElement, options?: TProperties);
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
     * @return DxElement
     * @prevFileNamespace DevExpress.core
     * @public
     */
    element(): DxElement;
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
    static getInstance(element: UserDefinedElement): DOMComponent<Properties>;

    $element(): UserDefinedElement;
    _getTemplate(template: unknown): FunctionTemplate;
    _invalidate(): void;
    _refresh(): void;
    _templateManager: TemplateManager;
}

type Properties = DOMComponentOptions<DOMComponent<Properties>>;

/** @deprecated use Properties instead */
export type Options = Properties;

/** @deprecated use Properties instead */
export type IOptions = Properties;
