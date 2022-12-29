import { ComponentWrapper as BaseComponentWrapper } from '@devextreme/interim';

export class ComponentWrapper extends BaseComponentWrapper {

  _buildTemplateArgs(data, index, template) {
    return super._buildTemplateArgs({ data }, index, template);
  }

}
