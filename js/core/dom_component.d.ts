import {
    Component,
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

/** @namespace DevExpress */
export interface DOMComponentOptions<T = DOMComponent> extends ComponentOptions<T> {
    /**
     * @docid
     * @default {}
     * @public
     */
    bindingOptions?: any;
    /**
     * @docid
     * @default {}
     * @public
     */
    elementAttr?: any;
    /**
     * @docid
     * @default undefined
     * @type_function_return number|string
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @action
     * @default null
     * @public
     */
    onDisposing?: ((e: { component?: T, element?: DxElement, model?: any }) => void);
    /**
     * @docid
     * @action
     * @default null
     * @public
     */
    onOptionChanged?: ((e: { component?: T, element?: DxElement, model?: any, name?: string, fullName?: string, value?: any }) => void);
    /**
     * @docid
     * @default false
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @type_function_return number|string
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
 */
export default class DOMComponent extends Component {
    constructor(element: UserDefinedElement, options?: DOMComponentOptions);
    /**
     * @docid
     * @static
     * @section uiWidgets
     * @publicName defaultOptions(rule)
     * @param1 rule:Object
     * @param1_field1 device:Device|Array<Device>|function
     * @param1_field2 options:Object
     * @public
     */
    static defaultOptions(rule: { device?: Device | Array<Device> | Function, options?: any }): void;
    /**
     * @docid
     * @publicName dispose()
     * @public
     */
    dispose(): void;
    /**
     * @docid
     * @publicName element()
     * @return DxElement
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
     * @public
     */
    static getInstance(element: UserDefinedElement): DOMComponent;

    $element(): UserDefinedElement;
    _getTemplate(template: unknown): FunctionTemplate;
    _invalidate(): void;
    _refresh(): void;
    _templateManager: TemplateManager;
}

export type Options = DOMComponentOptions;
export type IOptions = DOMComponentOptions;
