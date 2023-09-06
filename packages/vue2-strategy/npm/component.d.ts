import IVue, { VueConstructor } from "vue";
import { IConfigurable } from "./configuration-component";
import { IEventBusHolder } from "./templates-discovering";
import { TemplatesManager } from "./templates-manager";
interface IWidgetComponent extends IConfigurable {
    $_instance: any;
    $_WidgetClass: any;
    $_pendingOptions: Record<string, any>;
    $_templatesManager: TemplatesManager;
}
interface IBaseComponent extends IVue, IWidgetComponent, IEventBusHolder {
    $_isExtension: boolean;
    $_applyConfigurationChanges: () => void;
    $_createWidget: (element: any) => void;
    $_getIntegrationOptions: () => void;
    $_getExtraIntegrationOptions: () => void;
    $_getWatchMethod: () => void;
    $_createEmitters: () => void;
    $_processChildren: () => void;
    $_getTemplates: () => object;
}
declare const BaseComponent: () => VueConstructor<IBaseComponent>;
declare const DxComponent: () => VueConstructor;
export { DxComponent, BaseComponent, IWidgetComponent };
