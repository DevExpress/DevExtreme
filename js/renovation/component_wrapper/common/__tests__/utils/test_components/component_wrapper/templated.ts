import Component from '../../../../component';

export default class TemplatedTestComponent extends Component {
  // eslint-disable-next-line class-methods-use-this
  get _templatesInfo(): Record<string, string> {
    return {
      template: 'defaultTemplateName1',
      indexedTemplate: 'defaultTemplateName2',
      elementTemplate: 'defaultTemplateName3',
    };
  }
}
