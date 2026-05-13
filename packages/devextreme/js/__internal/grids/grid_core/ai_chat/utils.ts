import type { Message } from '@js/ui/chat';

import { MessageStatus } from '../ai_assistant/const';
import type { CommandStatus } from '../ai_assistant/types';
import {
  ABORTED_ITEM_EMOJI, CLASSES, ERROR_ITEM_EMOJI, SUCCESS_ITEM_EMOJI,
} from './const';
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

export const hasAbortedCommands = (
  commands: CommandResults | undefined,
): boolean => !!commands?.some(({ status }) => status === 'aborted');

export const getMessageIconName = (message: Message): string => {
  if (message.status === MessageStatus.Failure
    || hasCommandErrors(message.commands)
    || hasAbortedCommands(message.commands)) {
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

  return hasCommandErrors(message.commands) || hasAbortedCommands(message.commands);
};

export const getCommandItemStyle = (status: CommandStatus): {
  stateClass: string;
  emoji: string;
} => {
  switch (status) {
    case 'failure':
      return { stateClass: CLASSES.actionListItemError, emoji: ERROR_ITEM_EMOJI };
    case 'aborted':
      return { stateClass: CLASSES.actionListItemAborted, emoji: ABORTED_ITEM_EMOJI };
    case 'success':
    default:
      return { stateClass: CLASSES.actionListItemSuccess, emoji: SUCCESS_ITEM_EMOJI };
  }
};

export const needToRenderCommandList = (
  message: Message,
): boolean => message.status === MessageStatus.Success
    || hasCommandErrors(message.commands)
    || hasAbortedCommands(message.commands);
