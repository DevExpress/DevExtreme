import type { Message } from '@js/ui/chat';
import { MessageStatus } from '@ts/grids/grid_core/ai_assistant/const';
import type { CommandStatus } from '@ts/grids/grid_core/ai_assistant/types';

import {
  ABORTED_ITEM_EMOJI, CLASSES, ERROR_ITEM_EMOJI, SUCCESS_ITEM_EMOJI,
} from './const';

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

export const getMessageIconName = (message: Message): string => {
  switch (message.status) {
    case MessageStatus.Failure:
      return 'errorcircle';
    case MessageStatus.Success:
      return 'checkmarkcirclefilled';
    case MessageStatus.Pending:
    default:
      return 'sparkle';
  }
};

export const findMessageById = (
  items: Message[] | undefined,
  id: Message['id'],
): Message | undefined => items?.find((item) => item.id === id);

export const needToShowRegenerateButton = (message: Message): boolean => {
  const isError = message.status === MessageStatus.Failure;

  return isError && !message.commands?.length;
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
): boolean => !!message.commands?.length;
