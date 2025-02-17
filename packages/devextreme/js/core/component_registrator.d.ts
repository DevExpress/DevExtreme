import DOMComponent from './dom_component';
import { UserDefinedElement } from './element';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ComponentFactory<TComponent> = {
    new(element: UserDefinedElement, options?: Record<string, unknown>): TComponent;
    getInstance(element: UserDefinedElement): TComponent;
};

/**
 * Registers a new component in the DevExpress.ui namespace.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
declare function registerComponent<TComponent>(name: string, componentClass: ComponentFactory<TComponent>): void;

/**
 * Registers a new component in the specified namespace.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
declare function registerComponent<TComponent>(name: string, namespace: { [key: string]: ComponentFactory<DOMComponent> }, componentClass: ComponentFactory<TComponent>): void;

export default registerComponent;
