import Component from '../../../../component';

export default class TemplatedTestComponent extends Component {
  // eslint-disable-next-line class-methods-use-this
  getDefaultTemplateNames(): string[] {
    return ['defaultTemplateName1', 'defaultTemplateName2'];
  }
}
