import Class from '@js/core/class';

// @ts-expect-error dxClass inheritance issue
// eslint-disable-next-line @typescript-eslint/ban-types
class DefaultAdapter extends (Class.inherit({}) as new() => {}) {
  editor?: any;

  validator?: any;

  validationRequestsCallbacks!: any[];

  ctor(editor, validator) {
    this.editor = editor;
    this.validator = validator;
    this.validationRequestsCallbacks = [];
    const handler = (args) => {
      this.validationRequestsCallbacks.forEach((item) => item(args));
    };
    editor.validationRequest.add(handler);
    editor.on('disposing', () => {
      editor.validationRequest.remove(handler);
    });
  }

  getValue() {
    return this.editor.option('value');
  }

  getCurrentValidationError() {
    return this.editor.option('validationError');
  }

  bypass(): boolean | undefined {
    return this.editor.option('disabled');
  }

  applyValidationResults(params): void {
    this.editor.option({
      validationErrors: params.brokenRules,
      validationStatus: params.status,
    });
  }

  reset(): void {
    this.editor.clear();
  }

  focus(): void {
    this.editor.focus();
  }
}

export default DefaultAdapter;
