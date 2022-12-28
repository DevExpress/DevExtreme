import { ComponentWrapper as BaseComponentWrapper } from '@devextreme/interim';

export class ComponentWrapper extends BaseComponentWrapper {

  _buildTemplateArgs(data) {
    return { model: { data } };
  }

}
