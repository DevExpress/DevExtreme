import type { Message } from '@js/ui/chat';

import { AI_ASSISTANT_AUTHOR_ID, MessageStatus } from '../ai_assistant/const';
import { CLASSES } from './const';
import type { CommandResults } from './types';

export const isAIChatMessage = (
  message: Message,
): boolean => message.author?.id === AI_ASSISTANT_AUTHOR_ID;

export const getMessageStateClass = (status: MessageStatus): string => {
  switch (status) {
    case 'success':
      return CLASSES.messageSuccess;
    case 'error':
      return CLASSES.messageError;
    case 'pending':
    default:
      return CLASSES.messagePending;
  }
};

export const hasCommandErrors = (
  commands: CommandResults,
): boolean => !!commands?.some(({ status }) => status === MessageStatus.Error);

export const getMessageIconName = (message: Message): string => {
  if (message.status === MessageStatus.Error || hasCommandErrors(message.commands)) {
    return 'errorcircle';
  }

  if (message.status === MessageStatus.Success) {
    return 'checkmarkcirclefilled';
  }

  return 'sparkle';
};

export const needToShowRegenerateButton = (message: Message): boolean => {
  const isError = message.status === MessageStatus.Error;

  if (isError) {
    return true;
  }

  return hasCommandErrors(message.commands);
};
