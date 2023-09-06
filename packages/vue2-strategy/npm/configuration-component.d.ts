import IVue, { VueConstructor } from "vue";
import Configuration, { ExpectedChild } from "./configuration";
interface IConfigurationOwner {
    $_expectedChildren: Record<string, ExpectedChild>;
}
interface IConfigurationComponent extends IConfigurationOwner {
    $_optionName: string;
    $_isCollectionItem: boolean;
    $_predefinedProps: Record<string, any>;
}
interface IConfigurable extends IConfigurationOwner {
    $_config: Configuration;
    $_innerChanges: any;
}
interface IComponentInfo {
    optionPath: string;
    isCollection: boolean;
    removed?: boolean;
}
declare function getConfig(vueInstance: Pick<IVue, "$vnode">): Configuration | undefined;
declare function getInnerChanges(vueInstance: Pick<IVue, "$vnode">): any;
declare function initOptionChangedFunc(config: any, vueInstance: Pick<IVue, "$vnode" | "$props" | "$emit">, innerChanges: any): void;
declare const DxConfiguration: () => VueConstructor;
export { DxConfiguration, IComponentInfo, IConfigurable, IConfigurationComponent, initOptionChangedFunc, getConfig, getInnerChanges };
