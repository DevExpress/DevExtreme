import registerComponent from '../../../core/component_registrator';
import BaseComponent from '../../component_wrapper/common/component';
import { Widget as WidgetComponent } from './widget';

export default class Widget extends BaseComponent {
  getProps() {
    const props = super.getProps();
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  }

  focus(): void | undefined {
    return this.viewRef?.focus(...arguments);
  }
  blur(): void | undefined {
    return this.viewRef?.blur(...arguments);
  }
  activate(): void | undefined {
    return this.viewRef?.activate(...arguments);
  }
  deactivate(): void | undefined {
    return this.viewRef?.deactivate(...arguments);
  }

  _getActionConfigs() {
    return {
      onActive: {},
      onDimensionChanged: {},
      onInactive: {},
      onVisibilityChange: {},
      onFocusIn: {},
      onFocusOut: {},
      onHoverStart: {},
      onHoverEnd: {},
      onRootElementRendered: {},
      onClick: {},
    };
  }

  get _propsInfo() {
    return {
      twoWay: [],
      allowNull: [],
      elements: [],
      templates: [],
      props: [
        '_feedbackHideTimeout',
        '_feedbackShowTimeout',
        'activeStateUnit',
        'cssText',
        'aria',
        'classes',
        'name',
        'addWidgetClass',
        'onActive',
        'onDimensionChanged',
        'onInactive',
        'onVisibilityChange',
        'onFocusIn',
        'onFocusOut',
        'onHoverStart',
        'onHoverEnd',
        'onRootElementRendered',
        'className',
        'accessKey',
        'activeStateEnabled',
        'disabled',
        'focusStateEnabled',
        'height',
        'hint',
        'hoverStateEnabled',
        'onClick',
        'onKeyDown',
        'rtlEnabled',
        'tabIndex',
        'visible',
        'width',
      ],
    };
  }

  get _viewComponent() {
    return WidgetComponent;
  }
}

registerComponent('dxWidget', Widget);
