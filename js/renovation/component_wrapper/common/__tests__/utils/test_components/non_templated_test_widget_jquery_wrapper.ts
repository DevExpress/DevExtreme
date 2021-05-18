import Component from '../../../component';

export default class BaseComponent extends Component {
  // eslint-disable-next-line no-underscore-dangle, class-methods-use-this
  _useTemplates(): boolean {
    return false;
  }
}
