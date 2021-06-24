import Component from '../../../../component';

export default class NonTemplatedTestComponent extends Component {
  _useTemplates(): boolean {
    return false;
  }
}
