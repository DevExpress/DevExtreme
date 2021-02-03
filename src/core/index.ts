import * as VueType from "vue";
const Vue = VueType.default || VueType;

import { DxComponent } from "./component";
import { DxConfiguration } from "./configuration-component";
import { DxExtensionComponent } from "./extension-component";

export function createComponent(config: any): any {
    config.extends = DxComponent();
    return Vue.extend(config);
}

export function createConfigurationComponent(config: any): any {
    config.extends = DxConfiguration();
    return Vue.extend(config);
}

export function createExtensionComponent(config: any): any {
    config.extends = DxExtensionComponent();
    return Vue.extend(config);
}
