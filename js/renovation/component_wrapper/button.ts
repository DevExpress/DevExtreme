/* eslint-disable */
import ValidationEngine from '../../ui/validation_engine';
import Component from './common/component';
import { Button } from '../ui/button';

export default class ButtonWrapper extends Component {
  _init() {
    super._init();
    this.defaultKeyHandlers = {
        enter: (e, opts) => (this.viewRef as Button).onWidgetKeyDown(opts),
        space: (e, opts) => (this.viewRef as Button).onWidgetKeyDown(opts),
    }
    this._addAction('onSubmit', this._getSubmitAction());
  }

  _initMarkup() {
    super._initMarkup();

    const $content = (this.$element() as any).find('.dx-button-content');
    const $template = $content.children().filter('.dx-template-wrapper')

    if ($template.length) {
      $template.addClass('dx-button-content');
      $content.replaceWith($template);
    }
  }

  getProps() {
    const props = super.getProps();
    props.validationGroup = this._validationGroupConfig;
    return props;
  }

  getDefaultTemplateNames() {
    return ['content'];
  }

  _patchOptionValues(options) {
    options.templateData = options._templateData;
    return super._patchOptionValues(options);
  }

  _getSubmitAction() {
    let needValidate = true;
    let validationStatus = 'valid';

    return (this as any)._createAction(({ event, submitInput }) => {
      if (needValidate) {
        const validationGroup = this._validationGroupConfig;

        if (validationGroup) {
          const { status, complete } = validationGroup.validate();

          validationStatus = status;

          if (status === 'pending') {
            needValidate = false;
            this.option('disabled', true);

            complete.then(({ status }) => {
              needValidate = true;
              this.option('disabled', false);

              validationStatus = status;
              validationStatus === 'valid' && submitInput.click();
            });
          }
        }
      }

      validationStatus !== 'valid' && event.preventDefault();
      event.stopPropagation();
    });
  }

  get _validationGroupConfig() {
    return ValidationEngine.getGroupConfig(this._findGroup());
  }

  _findGroup() {
    const $element = this.$element();
    return this.option('validationGroup') || (ValidationEngine as any).findGroup($element, (this as any)._modelByElement($element));
  }
}
