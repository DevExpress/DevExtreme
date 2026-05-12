import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as ChatProperties } from '@js/ui/chat';
import type { Properties as PopupProperties } from '@js/ui/popup';

import type { AIMessage, CommandResult, CommandResults } from '../ai_assistant/types';
import type { CreateComponent } from '../m_types';

export type { CommandResult, CommandResults };

export interface AIChatOptions {
  container: dxElementWrapper;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createComponent: CreateComponent<any>;
  popupOptions?: PopupProperties;
  chatOptions?: ChatProperties;
  onChatCleared?: () => void;
  onClosed?: () => void;
  onRegenerate?: (aiMessage: AIMessage) => void;
}
