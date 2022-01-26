/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line import/named
import { dxElementWrapper } from '../../core/renderer';
import ValidationEngine from '../../ui/validation_engine';
import Component from './common/component';
import type { Button } from '../ui/button';
import { Option } from './common/types';
import { getImageSourceType } from '../../core/utils/icon';

export default class ButtonWrapper extends Component {
  _clickAction!: (...args) => unknown;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get _validationGroupConfig(): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ValidationEngine.getGroupConfig(this._findGroup());
  }

  getDefaultTemplateNames(): string[] {
    return ['content'];
  }

  getSupportedKeyNames(): string[] {
    return ['space', 'enter'];
  }

  getProps(): Record<string, unknown> {
    const props = super.getProps();

    props.onClick = ({ event }): void => {
      this._clickAction({ event, validationGroup: this._validationGroupConfig });
    };

    const iconType = getImageSourceType(props.icon);
    if (iconType === 'svg') {
      props.iconTemplate = this._createTemplateComponent(() => props.icon);
    }

    return props;
  }

  get _templatesInfo(): Record<string, string> {
    return { template: 'content' };
  }

  _toggleActiveState(_: HTMLElement, value: boolean): void {
    const button = this.viewRef as Button;
    value ? button.activate() : button.deactivate();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getSubmitAction(): any {
    let needValidate = true;
    let validationStatus = 'valid';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this as any)._createAction(({ event, submitInput }) => {
      if (needValidate) {
        const validationGroup = this._validationGroupConfig;

        if (validationGroup !== undefined && validationGroup !== '') {
          const validationResult = validationGroup.validate();

          validationStatus = validationResult.status;

          if (validationResult.status === 'pending') {
            needValidate = false;
            this.option('disabled', true);

            validationResult.complete.then(({ status }) => {
              this.option('disabled', false);

              validationStatus = status;
              validationStatus === 'valid' && submitInput.click();
              needValidate = true;
            });
          }
        }
      }

      validationStatus !== 'valid' && event.preventDefault();
      event.stopPropagation();
    });
  }

  _initializeComponent(): void {
    super._initializeComponent();
    this._addAction('onSubmit', this._getSubmitAction());
    this._clickAction = this._createClickAction();
  }

  _initMarkup(): void {
    super._initMarkup();

    const $content = (this.$element() as unknown as dxElementWrapper).find('.dx-button-content');
    const $template = $content.children().filter('.dx-template-wrapper');
    const $input = $content.children().filter('.dx-button-submit-input');

    if ($template.length) {
      $template.addClass('dx-button-content');
      $template.append($input);
      $content.replaceWith($template);
    }
  }

  _patchOptionValues(options: Record<string, unknown>): Record<string, unknown> {
    return super._patchOptionValues({ ...options, templateData: options._templateData });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _findGroup(): any {
    const $element = this.$element();
    const validationGroup = this.option('validationGroup');
    return validationGroup !== undefined && validationGroup !== ''
      ? validationGroup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (ValidationEngine as any).findGroup($element, (this as any)._modelByElement($element));
  }

  _createClickAction(): (...args) => unknown {
    return this._createActionByOption('onClick', {
      excludeValidators: ['readOnly'],
    });
  }

  _optionChanged(option: Option): void {
    switch (option.name) {
      case 'onClick':
        this._clickAction = this._createClickAction();
        break;
      default:
        break;
    }

    super._optionChanged(option);
  }
}
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
