import { isObject } from '@js/core/utils/type';
import type { Message } from '@js/ui/chat';

import { AI_ASSISTANT_AUTHOR_ID, MessageStatus } from './const';
import type { AIMessage, CommandResults } from './types';

export const isAIMessage = (
  message: Message,
): message is AIMessage => message.author?.id === AI_ASSISTANT_AUTHOR_ID;

export const isEnabledOption = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.enabled')
  || (optionName === 'aiAssistant' && isObject(value) && 'enabled' in value);

export const isTitleOption = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.title')
  || (optionName === 'aiAssistant' && isObject(value) && 'title' in value);

export const isPopupOptions = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.popup')
  || (optionName === 'aiAssistant' && isObject(value) && 'popup' in value);

export const isChatOptions = (optionName: string, value: unknown): boolean => optionName.startsWith('aiAssistant.chat')
  || (optionName === 'aiAssistant' && isObject(value) && 'chat' in value);

export const hasCommandErrors = (
  commands: CommandResults | undefined,
): boolean => !!commands?.some(({ status }) => status === 'failure');

export const hasAbortedCommands = (
  commands: CommandResults | undefined,
): boolean => !!commands?.some(({ status }) => status === 'aborted');

export const getMessageStatus = (commands: CommandResults): MessageStatus => {
  if (hasCommandErrors(commands) || hasAbortedCommands(commands)) {
    return MessageStatus.Failure;
  }

  return MessageStatus.Success;
};
