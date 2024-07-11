import registerComponent from '../../../core/component_registrator';
import BaseComponent from '../../component_wrapper/common/component';
import { ResponsiveBox as ResponsiveBoxComponent } from './responsive_box';

export default class ResponsiveBox extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: ['screenByWidth'],
    };
  }

  get _viewComponent() {
    return ResponsiveBoxComponent;
  }
}

registerComponent('dxResponsiveBox', ResponsiveBox);
