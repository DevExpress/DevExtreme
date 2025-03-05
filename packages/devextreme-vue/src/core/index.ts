import { initDxComponent } from './component';
import { initDxConfiguration } from './configuration-component';
import { initDxExtensionComponent } from './extension-component';
import { setVModel } from './vue-helper';

export function prepareComponentConfig(config) {
  config.extends = initDxComponent();

  if (config.model) {
    setVModel(config);
  }
}

export function prepareConfigurationComponentConfig(config: any): void {
  config.extends = initDxConfiguration();
}

export function prepareExtensionComponentConfig(config: any): void {
  config.extends = initDxExtensionComponent();
}
