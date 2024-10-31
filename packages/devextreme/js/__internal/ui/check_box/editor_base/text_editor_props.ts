import { current, isMaterial } from '@js/ui/themes';
import type { EventCallback } from '@ts/core/r1/event_callback';

export interface TextEditorProps {
  inputAttr?: unknown;

  maxLength?: string | number | null;

  spellCheck?: boolean;

  valueChangeEvent?: string;

  stylingMode?: 'outlined' | 'underlined' | 'filled';

  // overrides
  value?: string;

  defaultValue: string;

  valueChange?: EventCallback<string>;
}

export const defaultTextEditorProps: TextEditorProps = {
  maxLength: null,
  spellCheck: false,
  valueChangeEvent: 'change',
  stylingMode: isMaterial(current()) ? 'filled' : 'outlined',
  defaultValue: '',
};
