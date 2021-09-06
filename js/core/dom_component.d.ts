import {
    Component,
    ComponentOptions,
} from './component';

import {
    UserDefinedElement,
    DxElement,
} from './element';

import { TemplateManager } from './template_manager';
import { FunctionTemplate } from './templates/function_template';
import { DefaultOptionsRule } from './options';

/* eslint-disable no-underscore-dangle */

/** @namespace DevExpress */
export interface DOMComponentOptions<TComponent> extends ComponentOptions<TComponent> {
    /**
     * @docid
     * @default {}
     * @public
     */
    bindingOptions?: { [key: string]: any };
    /**
     * @docid
     * @default {}
     * @public
     */
    elementAttr?: { [key: string]: any };
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
     * @type_function_param1_field1 component:<DOMComponent>
     * @public
     */
    onDisposing?: ((e: { component?: TComponent; element?: DxElement; model?: any }) => void);
    /**
     * @docid
     * @action
     * @default null
     * @type_function_param1_field1 component:<DOMComponent>
     * @public
     */
    onOptionChanged?: ((e: { component?: TComponent; element?: DxElement; model?: any; name?: string; fullName?: string; value?: any }) => void);
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
export default class DOMComponent<TProperties = Properties> extends Component<TProperties> {
    _templateManager: TemplateManager;

    _cancelOptionChange?: string;

    constructor(element: UserDefinedElement, options?: TProperties);

    /**
     * @docid
     * @static
     * @section uiWidgets
     * @publicName getInstance(element)
     * @param1 element:Element|JQuery
     * @return DOMComponent
     * @public
     */
    static getInstance(element: UserDefinedElement): DOMComponent<Properties>;

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
    static defaultOptions<TProperties = Properties>(rule: Partial<DefaultOptionsRule<TProperties>>): void;

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

    $element(): UserDefinedElement;
    _getTemplate(template: unknown): FunctionTemplate;
    _invalidate(): void;
    _refresh(): void;
    _notifyOptionChanged(fullName: string, value: unknown, previousValue: unknown): void;
}

export type ComponentClass<TProperties> = {
    new(element: HTMLDivElement, options?: TProperties): DOMComponent<TProperties>;
    getInstance(widgetRef: HTMLDivElement): DOMComponent<TProperties>;
};

interface DOMComponentInstance extends DOMComponent<Properties> { }

type Properties = DOMComponentOptions<DOMComponentInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;

/** @deprecated use Properties instead */
export type IOptions = Properties;
