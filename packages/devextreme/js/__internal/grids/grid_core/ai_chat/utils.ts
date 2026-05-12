import type { Message } from '@js/ui/chat';

import { MessageStatus } from '../ai_assistant/const';
import { CLASSES } from './const';
import type { CommandResults } from './types';

export const getMessageStateClass = (status: MessageStatus): string => {
  switch (status) {
    case 'success':
      return CLASSES.messageSuccess;
    case 'failure':
      return CLASSES.messageError;
    case 'pending':
    default:
      return CLASSES.messagePending;
  }
};

export const hasCommandErrors = (
  commands: CommandResults | undefined,
): boolean => !!commands?.some(({ status }) => status === MessageStatus.Failure);

export const getMessageIconName = (message: Message): string => {
  if (message.status === MessageStatus.Failure || hasCommandErrors(message.commands)) {
    return 'errorcircle';
  }

  if (message.status === MessageStatus.Success) {
    return 'checkmarkcirclefilled';
  }

  return 'sparkle';
};

export const findMessageById = (
  items: Message[] | undefined,
  id: Message['id'],
): Message | undefined => items?.find((item) => item.id === id);

export const needToShowRegenerateButton = (message: Message): boolean => {
  const isError = message.status === MessageStatus.Failure;

  if (isError) {
    return true;
  }

  return hasCommandErrors(message.commands);
};
