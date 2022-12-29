import { ComponentWrapper as BaseComponentWrapper } from '@devextreme/interim';

export class ComponentWrapper extends BaseComponentWrapper {

  _buildTemplateArgs(data) {
    return super._buildTemplateArgs({ data });
  }

}
