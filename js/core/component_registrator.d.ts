import DOMComponent from './dom_component';
import { UserDefinedElement } from './element';

type IComponentFactory<TComponent> = {
    new(): TComponent;
    getInstance(element: UserDefinedElement): TComponent;
}

/**
 * @docid
 * @publicName registerComponent(name, componentClass)
 * @param1 name:string
 * @param2 componentClass:object
 * @module core/component_registrator
 * @namespace DevExpress
 * @hidden
 */
export default function registerComponent<TComponent>(name: string, componentClass: IComponentFactory<TComponent>): void;

/**
 * @docid
 * @publicName registerComponent(name, namespace, componentClass)
 * @param1 name:string
 * @param2 namespace:object
 * @param3 componentClass:object
 * @module core/component_registrator
 * @namespace DevExpress
 * @hidden
 */
export default function registerComponent<TComponent>(name: string, namespace: { [key:string]: IComponentFactory<DOMComponent> }, componentClass: IComponentFactory<TComponent>): void;
