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

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type OptionChangedEventInfo<TComponent> = EventInfo<TComponent> & ChangedOptionInfo;

/* eslint-disable no-underscore-dangle */

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface DOMComponentOptions<TComponent> extends ComponentOptions<
    EventInfo<TComponent>,
    InitializedEventInfo<TComponent>,
    OptionChangedEventInfo<TComponent>
> {
    /**
     * 
     */
    bindingOptions?: { [key: string]: any };
    /**
     * Specifies the global attributes to be attached to the UI component&apos;s container element.
     */
    elementAttr?: { [key: string]: any };
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string) | undefined;
    /**
     * A function that is executed before the UI component is disposed of.
     */
    onDisposing?: ((e: EventInfo<TComponent>) => void);
    /**
     * A function that is executed after a UI component property is changed.
     */
    onOptionChanged?: ((e: OptionChangedEventInfo<TComponent>) => void);
    /**
     * Switches the UI component to a right-to-left representation.
     */
    rtlEnabled?: boolean;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string) | undefined;
}
/**
 * A base class for all components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class DOMComponent<TProperties = Properties> extends Component<TProperties> {
    _templateManager: TemplateManager;

    _cancelOptionChange?: string | boolean;

    constructor(element: UserDefinedElement, options?: TProperties);

    /**
     * Gets the instance of a UI component found using its DOM node.
     */
    static getInstance(element: UserDefinedElement): DOMComponent<Properties>;

    /**
     * Specifies the device-dependent default configuration properties for this component.
     */
    static defaultOptions<TProperties = Properties>(rule: DefaultOptionsRule<TProperties>): void;

    /**
     * Disposes of all the resources allocated to the widget instance.
     */
    dispose(): void;
    /**
     * Gets the root UI component element.
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

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ComponentClass<TProperties> = {
    new(element: HTMLDivElement, options?: TProperties): DOMComponent<TProperties>;
    getInstance(widgetRef: HTMLDivElement): DOMComponent<TProperties>;
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
interface DOMComponentInstance extends DOMComponent<Properties> { }

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Properties = DOMComponentOptions<DOMComponentInstance>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = Properties;
