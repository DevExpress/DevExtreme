import Editor from './editor';

export default class CheckBox extends Editor {
  // eslint-disable-next-line class-methods-use-this
  _useTemplates(): boolean {
    return false;
  }

  _isFocused(): boolean {
    const focusTarget: Element = this.$element()[0];

    return focusTarget.classList.contains('dx-state-focused');
  }

  getSupportedKeyNames(): string[] {
    return ['space'];
  }

  getProps(): Record<string, unknown> {
    const props = super.getProps();

    if (props.value !== null) {
      // NOTE: we want CheckBox to be checked if any non-nullable data is passed to value property
      props.value = Boolean(props.value);
    }

    return props;
  }
}
