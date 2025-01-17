import Editor from '@js/ui/editor/editor';
import type ValidationMessage from '@js/ui/validation_message';
import type { Properties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

declare class ExtendedEditor<TProperties extends Properties> extends Widget<TProperties> {
  public _validationMessage?: ValidationMessage;

  _saveValueChangeEvent(e: unknown): void;

  _renderValidationState(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedEditor: typeof ExtendedEditor = Editor as any;

export default TypedEditor;
