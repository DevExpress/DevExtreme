import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as PopupProperties } from '@js/ui/popup';
import type { Properties as TextAreaProperties } from '@js/ui/text_area';

import type { CreateComponent } from '../../m_types';

export interface AiPromptEditorOptions {
  container: dxElementWrapper;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createComponent: CreateComponent<any>;
  onSubmit?: () => void;
  onCancel?: () => void;
  onRefresh?: () => void;
  popupOptions?: PopupProperties;
  editorOptions?: TextAreaProperties;
}
