import registerComponent from '../../../core/component_registrator';
import BaseComponent from '../../component_wrapper/common/component';
import { Form as FormComponent } from './form';

export default class Form extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: ['scrollingEnabled', 'useNativeScrolling', 'screenByWidth'],
    };
  }

  get _viewComponent() {
    return FormComponent;
  }
}

registerComponent('dxForm', Form);
