import Editor from './editor_base/wrapper';
export default class CheckBox extends Editor {
  _useTemplates() {
    return false;
  }
  _isFocused() {
    const focusTarget = this.$element()[0];
    return focusTarget.classList.contains('dx-state-focused');
  }
  getSupportedKeyNames() {
    return ['space'];
  }
  getProps() {
    const props = super.getProps();
    if (props.value !== null) {
      props.value = Boolean(props.value);
    }
    return props;
  }
}
