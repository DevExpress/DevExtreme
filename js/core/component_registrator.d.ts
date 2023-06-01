import DOMComponent from './dom_component';
import { UserDefinedElement } from './element';

type ComponentFactory<TComponent> = {
    new(element: UserDefinedElement, options?: Record<string, unknown>): TComponent;
    getInstance(element: UserDefinedElement): TComponent;
};

/**
 * @docid
 * @publicName registerComponent(name, componentClass)
 * @param2 componentClass:object
 * @namespace DevExpress
 * @hidden
 */
declare function registerComponent<TComponent>(name: string, componentClass: ComponentFactory<TComponent>): void;

/**
 * @docid
 * @publicName registerComponent(name, namespace, componentClass)
 * @param3 componentClass:object
 * @namespace DevExpress
 * @hidden
 */
declare function registerComponent<TComponent>(name: string, namespace: { [key: string]: ComponentFactory<DOMComponent> }, componentClass: ComponentFactory<TComponent>): void;

export default registerComponent;
