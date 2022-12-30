import { ComponentWrapper as BaseComponentWrapper } from '@devextreme/interim';

export class ComponentWrapper extends BaseComponentWrapper {
  _createTemplateComponent(...args) {
    const template = super._createTemplateComponent(...args);

    return template
      ? (data, index) => template({ data, index })
      : undefined;
  }
}
