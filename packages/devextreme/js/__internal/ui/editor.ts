import Editor from '@js/ui/editor/editor';
import type ValidationMessage from '@js/ui/validation_message';

import Widget from './widget';

// interface AriaOptions {
//   role: string;
//   // eslint-disable-next-line spellcheck/spell-checker
//   roledescription: string;
//   label: string;
// }

declare class ExtendedEditor<TProperties> extends Widget<TProperties> {
  public _validationMessage?: ValidationMessage;

  _saveValueChangeEvent(e: unknown): void;

  _renderValidationState(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedEditor: typeof ExtendedEditor = Editor as any;

export default TypedEditor;
