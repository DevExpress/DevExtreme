import { VueConstructor } from "vue";
interface IExtension {
    $_isExtension: boolean;
    attachTo(element: any): any;
}
interface IExtensionComponentNode {
    $_hasOwner: boolean;
}
declare const DxExtensionComponent: () => VueConstructor;
export { DxExtensionComponent, IExtension, IExtensionComponentNode };
