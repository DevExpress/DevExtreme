import {
    Component,
    ComponentOptions,
} from './component';

import {
    UserDefinedElement,
    DxElement,
    InternalElement,
} from './element';

import {
    ChangedOptionInfo,
    EventInfo,
    InitializedEventInfo,
} from '../common/core/events';

import { TemplateManager } from './template_manager';
import { FunctionTemplate } from './templates/function_template';
import { DefaultOptionsRule } from './options';

export type OptionChangedEventInfo<TComponent> = EventInfo<TComponent> & ChangedOptionInfo;

/* eslint-disable no-underscore-dangle */

/**
 * @namespace DevExpress
 * @docid
 * @hidden
 */
export interface DOMComponentOptions<TComponent> extends ComponentOptions<
    EventInfo<TComponent>,
    InitializedEventInfo<TComponent>,
    OptionChangedEventInfo<TComponent>
> {
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
     * @public
     */
    height?: number | string | (() => number | string) | undefined;
    /**
     * @docid
     * @action
     * @default null
     * @public
     */
    onDisposing?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @action
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:<DOMComponent>
     * @public
     */
    onOptionChanged?: ((e: OptionChangedEventInfo<TComponent>) => void);
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
    width?: number | string | (() => number | string) | undefined;
}
/**
 * @docid
 * @section uiWidgets
 * @inherits Component
 * @namespace DevExpress
 * @hidden
 */
export default class DOMComponent<TProperties = Properties> extends Component<TProperties> {
    _templateManager: TemplateManager;

    _cancelOptionChange?: string | boolean;

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
     * @param1_field device:Device|function
     * @param1_field options:Object
     * @public
     */
    static defaultOptions<TProperties = Properties>(rule: DefaultOptionsRule<TProperties>): void;

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

    $element(): InternalElement<Element>;
    _getTemplate(template: unknown): FunctionTemplate;
    _invalidate(): void;
    _refresh(): void;
    _notifyOptionChanged(fullName: string, value: unknown, previousValue: unknown): void;
    _createElement(element: HTMLElement): void;
    _validateOptions(options: TProperties): TProperties;
}

export type ComponentClass<TProperties> = {
    new(element: HTMLDivElement, options?: TProperties): DOMComponent<TProperties>;
    getInstance(widgetRef: HTMLDivElement): DOMComponent<TProperties>;
};

interface DOMComponentInstance extends DOMComponent<Properties> { }

type Properties = DOMComponentOptions<DOMComponentInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;
