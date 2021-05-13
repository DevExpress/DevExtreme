import Component from '../../../component';

export default class BaseComponent extends Component {
  // eslint-disable-next-line class-methods-use-this
  getDefaultTemplateNames(): string[] {
    return ['defaultTemplateName1', 'defaultTemplateName2'];
  }
}
