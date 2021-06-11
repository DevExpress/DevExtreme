// eslint-disable-next-line import/named
import { dxElementWrapper } from '../../core/renderer';
import ValidationEngine from '../../ui/validation_engine';
import Component from './common/component';
import type { Button } from '../ui/button';
import { isDefined } from '../../core/utils/type'

export default class ButtonWrapper extends Component {
  get _validationGroupConfig(): any {
    return ValidationEngine.getGroupConfig(this._findGroup());
  }

  getDefaultTemplateNames(): string[] {
    return ['content'];
  }

  getProps(): Record<string, unknown> {
    const props = super.getProps();
    props.validationGroup = this._validationGroupConfig;
    return props;
  }

  get _templatesInfo(): Record<string, string> {
    return { template: 'content' };
  }

  _toggleActiveState(_: HTMLElement, value: boolean): void {
    const button = this.viewRef as Button;
    value ? button.activate() : button.deactivate();
  }

  _getSubmitAction(): any {
    let needValidate = true;
    let validationStatus = 'valid';

    return (this as any)._createAction(({ event, submitInput }) => {
      if (needValidate) {
        const validationGroup = this._validationGroupConfig;

        if (isDefined(validationGroup)) {
          const { status, complete } = validationGroup.validate();

          validationStatus = status;

          if (status === 'pending') {
            needValidate = false;
            this.option('disabled', true);

            complete.then(() => {
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

  _init(): void {
    super._init();
    this.defaultKeyHandlers = {
      enter: (_, opts): Event | undefined => (this.viewRef as Button).onWidgetKeyDown(opts),
      space: (_, opts): Event | undefined => (this.viewRef as Button).onWidgetKeyDown(opts),
    };
    this._addAction('onSubmit', this._getSubmitAction());
  }

  _initMarkup(): void {
    super._initMarkup();

    const $content = (this.$element() as unknown as dxElementWrapper).find('.dx-button-content');
    const $template = $content.children().filter('.dx-template-wrapper');

    if ($template.length) {
      $template.addClass('dx-button-content');
      $content.replaceWith($template);
    }
  }

  _patchOptionValues(options: Record<string, unknown>): Record<string, unknown> {
    return super._patchOptionValues({ ...options, templateData: options._templateData });
  }

  _findGroup(): any {
    const $element = this.$element();
    return Boolean(this.option('validationGroup')) || (ValidationEngine as any).findGroup($element, (this as any)._modelByElement($element));
  }
}
