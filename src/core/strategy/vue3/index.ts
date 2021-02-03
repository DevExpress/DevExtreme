import { defineComponent, DefineComponent } from "vue";
import { initDxComponent } from "../../component";
import { initDxConfiguration } from "../../configuration-component";
import { initDxExtensionComponent } from "../../extension-component";

export function createComponent(config: any): DefineComponent {
    config.extends = initDxComponent();
    return defineComponent(config);
}

export function createConfigurationComponent(config: any): DefineComponent {
    config.extends = initDxConfiguration();
    return defineComponent(config);
}

export function createExtensionComponent(config: any): DefineComponent {
    config.extends = initDxExtensionComponent();
    return defineComponent(config);
}
