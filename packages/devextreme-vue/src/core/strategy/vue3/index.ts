import { defineComponent, DefineComponent } from "vue";
import { initDxComponent } from "../../component";
import { initDxConfiguration } from "../../configuration-component";
import { initDxExtensionComponent } from "../../extension-component";
import { setCompatOptions, setVModel } from "../../vue-helper";

export function createComponent(config: any): DefineComponent {
    config.extends = initDxComponent();
    setCompatOptions(config);
    if (config.model) {
        setVModel(config);
    }
    return defineComponent(config);
}

export function createConfigurationComponent(config: any): DefineComponent {
    config.extends = initDxConfiguration();
    setCompatOptions(config);
    return defineComponent(config);
}

export function createExtensionComponent(config: any): DefineComponent {
    config.extends = initDxExtensionComponent();
    setCompatOptions(config);
    return defineComponent(config);
}
