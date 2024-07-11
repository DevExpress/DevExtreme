import registerComponent from '../../core/component_registrator';
import BaseComponent from '../component_wrapper/button';
import { Button as ButtonComponent, defaultOptions } from './button';

export default class Button extends BaseComponent {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }

  focus(): void | undefined {
    return this.viewRef?.focus(...arguments);
  }
  activate(): void | undefined {
    return this.viewRef?.activate(...arguments);
  }
  deactivate(): void | undefined {
    return this.viewRef?.deactivate(...arguments);
  }

  _getActionConfigs() {
    return {
      onClick: { excludeValidators: ['readOnly'] },
      onSubmit: {},
    };
  }

  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: ['onSubmit'],
      templates: ['template', 'iconTemplate'],
      props: [
        'activeStateEnabled',
        'hoverStateEnabled',
        'icon',
        'iconPosition',
        'onClick',
        'onSubmit',
        'pressed',
        'stylingMode',
        'template',
        'iconTemplate',
        'text',
        'type',
        'useInkRipple',
        'useSubmitBehavior',
        'templateData',
        'className',
        'accessKey',
        'disabled',
        'focusStateEnabled',
        'height',
        'hint',
        'onKeyDown',
        'rtlEnabled',
        'tabIndex',
        'visible',
        'width',
      ],
    };
  }

  get _viewComponent() {
    return ButtonComponent;
  }
}

registerComponent('dxButton', Button);
Button.defaultOptions = defaultOptions;
