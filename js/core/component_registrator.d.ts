import Component from "./component";

/**
 * @docid
 * @publicName registerComponent(name, componentClass)
 * @param1 name:string
 * @param2 componentClass:object
 * @module core/component_registrator
 * @namespace DevExpress
 * @hidden
 * @prevFileNamespace DevExpress.core
 */
export default function registerComponent(name: string, componentClass: Component): void;

/**
 * @docid
 * @publicName registerComponent(name, namespace, componentClass)
 * @param1 name:string
 * @param2 namespace:object
 * @param3 componentClass:object
 * @module core/component_registrator
 * @namespace DevExpress
 * @hidden
 * @prevFileNamespace DevExpress.core
 */
export default function registerComponent(name: string, namespace: { [key:string]: Component }, componentClass: Component): void;
