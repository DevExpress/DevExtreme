import registerComponent from '../../../core/component_registrator';
import BaseComponent from '../../component_wrapper/common/component';
import { Box as BoxComponent } from './box';

export default class Box extends BaseComponent {
  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: ['direction', 'align', 'crossAlign'],
    };
  }

  get _viewComponent() {
    return BoxComponent;
  }
}

registerComponent('dxBox', Box);
