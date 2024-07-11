import registerComponent from '../../../../core/component_registrator';
import EditorWrapperComponent from '../../../component_wrapper/editors/editor';
import { Editor as EditorComponent, defaultOptions } from './editor';

export default class Editor extends EditorWrapperComponent {
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

  _getActionConfigs() {
    return {
      onFocusIn: {},
      onClick: {},
    };
  }

  get _propsInfo() {
    return {
      twoWay: [['value', 'defaultValue', 'valueChange']],
      allowNull: ['validationError', 'validationErrors'],
      elements: [],
      templates: [],
      props: [
        'readOnly',
        'name',
        'validationError',
        'validationErrors',
        'validationMessageMode',
        'validationMessagePosition',
        'validationStatus',
        'isValid',
        'isDirty',
        'inputAttr',
        'onFocusIn',
        'defaultValue',
        'valueChange',
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
        'aria',
        'classes',
        'value',
      ],
    };
  }

  get _viewComponent() {
    return EditorComponent;
  }
}

registerComponent('dxEditor', Editor);
Editor.defaultOptions = defaultOptions;
