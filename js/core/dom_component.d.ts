import {
    Component,
    ComponentOptions,
} from './component';

import {
    Device,
} from './devices';

import {
    UserDefinedElement,
    DxElement,
} from './element';

import {
    ChangedOptionInfo,
    EventInfo,
    InitializedEventInfo,
} from '../events/index';

import { TemplateManager } from './template_manager';
import { FunctionTemplate } from './templates/function_template';

type OptionChangedEventInfo<T> = EventInfo<T> & ChangedOptionInfo;

/** @namespace DevExpress */
export interface DOMComponentOptions<T = DOMComponent> extends ComponentOptions<
    EventInfo<T>,
    InitializedEventInfo<T>,
    OptionChangedEventInfo<T>
> {
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
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @action
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:<DOMComponent>
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @default null
     * @public
     */
    onDisposing?: ((e: EventInfo<T>) => void);
    /**
     * @docid
     * @action
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:<DOMComponent>
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 name:string
     * @type_function_param1_field5 fullName:string
     * @type_function_param1_field6 value:any
     * @default null
     * @public
     */
    onOptionChanged?: ((e: OptionChangedEventInfo<T>) => void);
    /**
     * @docid
     * @default false
     * @public
     */
    rtlEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    width?: number | string | (() => number | string);
}
/**
 * @docid
 * @section uiWidgets
 * @inherits Component
 * @namespace DevExpress
 * @hidden
 */
/* eslint-disable no-underscore-dangle */
export default class DOMComponent extends Component {
    _templateManager: TemplateManager;

    constructor(element: UserDefinedElement, options?: DOMComponentOptions);

    /**
     * @docid
     * @static
     * @section uiWidgets
     * @publicName getInstance(element)
     * @param1 element:Element|JQuery
     * @public
     */
    static getInstance(element: UserDefinedElement): DOMComponent;

    /**
     * @docid
     * @static
     * @section uiWidgets
     * @publicName defaultOptions(rule)
     * @param1_field2 options:Object
     * @public
     */
    static defaultOptions(rule: { device?: Device | Array<Device> | Function; options?: any }): void;

    /**
     * @docid
     * @publicName dispose()
     * @public
     */
    dispose(): void;
    /**
     * @docid
     * @publicName element()
     * @public
     */
    element(): DxElement;

    $element(): UserDefinedElement;
    _getTemplate(template: unknown): FunctionTemplate;
    _invalidate(): void;
    _refresh(): void;
}
 /* eslint-enable no-underscore-dangle */

export type Options = DOMComponentOptions;
export type IOptions = DOMComponentOptions;
