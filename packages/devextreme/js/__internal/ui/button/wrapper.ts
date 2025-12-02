import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import { getImageSourceType } from '@js/core/utils/icon';
import type { ClickEvent } from '@js/ui/button';
import ValidationEngine from '@js/ui/validation_engine';
import { ComponentWrapper } from '@ts/core/r1/component_wrapper';
import type { Option } from '@ts/core/r1/types';
import type { ActionConfig } from '@ts/core/widget/component';

import type { ButtonProps } from './button';
import { Button as ButtonComponent, buttonComponentProps, defaultOptions } from './button';

// STYLE button

export default class Button extends ComponentWrapper {
  _clickAction!: (event?: Record<string, unknown>) => void;

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
  get _validationGroupConfig() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ValidationEngine.getGroupConfig(this._findGroup());
  }

  getDefaultTemplateNames(): string[] {
    return ['content'];
  }

  getSupportedKeyNames(): string[] {
    return ['space', 'enter'];
  }

  getProps(): ButtonProps {
    const props = super.getProps() as unknown as ButtonProps;

    props.onClick = ({ event }: ClickEvent): void => {
      this._clickAction({ event, validationGroup: this._validationGroupConfig });
    };

    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown as Function) as ButtonProps['onKeyDown'];

    const iconType = getImageSourceType(props.icon);
    if (iconType === 'svg') {
      props.iconTemplate = this._createTemplateComponent(() => props.icon);
    }

    return props;
  }

  get viewRef(): ButtonComponent | undefined {
    return super.viewRef as ButtonComponent | undefined;
  }

  get _templatesInfo(): Record<string, string> {
    return { template: 'content' };
  }

  _toggleActiveState(_: HTMLElement, value: boolean): void {
    if (value) {
      this.viewRef?.activate();
    } else {
      this.viewRef?.deactivate();
    }
  }

  _getSubmitAction(): (e) => void {
    let needValidate = true;
    let validationStatus = 'valid';

    // @ts-expect-error badly typed base class
    return this._createAction(({ event, submitInput }) => {
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

              if (validationStatus === 'valid') {
                submitInput.click();
              }

              needValidate = true;
            });
          }
        }
      }

      if (validationStatus !== 'valid') {
        event.preventDefault();
      }
      event.stopPropagation();
    }) as (e) => void;
  }

  _initializeComponent(): void {
    super._initializeComponent();
    this._addAction('onSubmit', this._getSubmitAction());
    this._clickAction = this._createClickAction();
  }

  _initMarkup(): void {
    super._initMarkup();

    const $content = (this.$element() as unknown as dxElementWrapper).find('.dx-button-content').first();
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
      // @ts-expect-error badly typed base class and ValidationEngine
      : ValidationEngine.findGroup($element, this._modelByElement($element));
  }

  _createClickAction(): (event?: Record<string, unknown>) => void {
    // @ts-expect-error badly typed base class
    return this._createActionByOption('onClick', {
      excludeValidators: ['readOnly'],
    }) as (event?: Record<string, unknown>) => void;
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

  focus(): void {
    this.viewRef?.focus();
  }

  activate(): void {
    this.viewRef?.activate();
  }

  deactivate(): void {
    this.viewRef?.deactivate();
  }

  _getActionConfigs(): Record<string, ActionConfig> {
    return {
      onClick: {
        excludeValidators: ['readOnly'],
      },
      onSubmit: {},
    };
  }

  get _propsInfo(): {
    allowNull: string[];
    twoWay: [string, string, string][];
    elements: string[];
    templates: string[];
    props: string[];
  } {
    return {
      twoWay: [],
      allowNull: [],
      elements: ['onSubmit'],
      templates: ['template', 'iconTemplate'],
      props: buttonComponentProps,
    };
  }

  // @ts-expect-error types error in R1
  get _viewComponent(): typeof ButtonComponent {
    return ButtonComponent;
  }
}
registerComponent('dxButton', Button);

// @ts-expect-error types error in R1
Button.defaultOptions = defaultOptions;
