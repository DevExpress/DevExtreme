import Editor from './editor_base/wrapper';

export default class CheckBox extends Editor {
  _useTemplates(): boolean {
    return false;
  }

  _isFocused(): boolean {
    const focusTarget = this.$element()[0];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return focusTarget.classList.contains('dx-state-focused');
  }

  getSupportedKeyNames(): string[] {
    return ['space'];
  }

  getProps(): Record<string, unknown> {
    const props = super.getProps();
    if (props.value !== null) {
      props.value = Boolean(props.value);
    }
    return props;
  }
}
