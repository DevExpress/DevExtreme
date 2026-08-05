import type {
  ValidationResultInternal,
  ValidationRuleInternal,
} from '@ts/ui/validation_engine';
import type Validator from '@ts/ui/validator';

export interface ValidationRequestArgs {
  value?: unknown;
}

export type ValidationRequestHandler = (args?: ValidationRequestArgs) => void;

export interface ValidationTargetEditorOptions {
  value?: unknown;
  validationError?: ValidationRuleInternal | null;
  disabled?: boolean;
  rtlEnabled?: boolean;
}

interface ValidationTargetEditorOption {
  (): ValidationTargetEditorOptions;
  (name: string, value: unknown): void;
  (options: Record<string, unknown>): void;
}

/**
 * Structural description of a validation target: it is either an Editor or an R1
 * wrapper around one (see check_box/editor_base/wrapper.ts).
 */
export interface ValidationTargetEditor {
  validationRequest: {
    add: (handler: ValidationRequestHandler) => void;
    remove: (handler: ValidationRequestHandler) => void;
  };
  option: ValidationTargetEditorOption;
  on: (eventName: 'disposing', handler: () => void) => void;
  clear: () => void;
  focus: () => void;
  isInitialized: () => boolean;
  setAria: (name: string, value: unknown) => void;
}

class DefaultAdapter {
  editor: ValidationTargetEditor;

  validator: Validator;

  validationRequestsCallbacks: ValidationRequestHandler[];

  constructor(editor: ValidationTargetEditor, validator: Validator) {
    this.editor = editor;
    this.validator = validator;
    this.validationRequestsCallbacks = [];
    const handler = (args?: ValidationRequestArgs): void => {
      this.validationRequestsCallbacks.forEach((item) => item(args));
    };
    editor.validationRequest.add(handler);
    editor.on('disposing', () => {
      editor.validationRequest.remove(handler);
    });
  }

  getValue(): unknown {
    const { value } = this.editor.option();
    return value;
  }

  getCurrentValidationError(): ValidationRuleInternal | null | undefined {
    const { validationError } = this.editor.option();
    return validationError;
  }

  bypass(): boolean | undefined {
    const { disabled } = this.editor.option();
    return disabled;
  }

  applyValidationResults(params: ValidationResultInternal): void {
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
