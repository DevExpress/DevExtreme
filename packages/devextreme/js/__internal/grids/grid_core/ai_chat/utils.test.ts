import {
  describe, expect, it,
} from '@jest/globals';
import type { Message } from '@js/ui/chat';

import { MessageStatus } from '../ai_assistant/const';
import {
  ABORTED_ITEM_EMOJI, CLASSES, ERROR_ITEM_EMOJI, SUCCESS_ITEM_EMOJI,
} from './const';
import {
  getCommandItemStyle,
  getMessageIconName,
  needToRenderCommandList,
  needToShowRegenerateButton,
} from './utils';

describe('getMessageIconName', () => {
  it('should return errorcircle when message status is failure', () => {
    const message = { status: MessageStatus.Failure } as Message;

    expect(getMessageIconName(message)).toBe('errorcircle');
  });

  it('should return checkmarkcirclefilled when message status is success', () => {
    const message = { status: MessageStatus.Success } as Message;

    expect(getMessageIconName(message)).toBe('checkmarkcirclefilled');
  });

  it('should return sparkle when message status is pending', () => {
    const message = { status: MessageStatus.Pending } as Message;

    expect(getMessageIconName(message)).toBe('sparkle');
  });
});

describe('needToShowRegenerateButton', () => {
  it('should return true when message status is failure and has no commands', () => {
    const message = { status: MessageStatus.Failure } as Message;

    expect(needToShowRegenerateButton(message)).toBe(true);
  });

  it('should return false when message status is failure and has commands', () => {
    const message = {
      status: MessageStatus.Failure,
      commands: [{ status: 'failure', message: 'Failed' }],
    } as Message;

    expect(needToShowRegenerateButton(message)).toBe(false);
  });

  it('should return false when message is successful', () => {
    const message = {
      status: MessageStatus.Success,
      commands: [{ status: 'success', message: 'OK' }],
    } as Message;

    expect(needToShowRegenerateButton(message)).toBe(false);
  });
});

describe('getCommandItemStyle', () => {
  it('should return success class and emoji for success status', () => {
    const result = getCommandItemStyle('success');

    expect(result).toEqual({
      stateClass: CLASSES.actionListItemSuccess,
      emoji: SUCCESS_ITEM_EMOJI,
    });
  });

  it('should return error class and emoji for failure status', () => {
    const result = getCommandItemStyle('failure');

    expect(result).toEqual({
      stateClass: CLASSES.actionListItemError,
      emoji: ERROR_ITEM_EMOJI,
    });
  });

  it('should return aborted class and emoji for aborted status', () => {
    const result = getCommandItemStyle('aborted');

    expect(result).toEqual({
      stateClass: CLASSES.actionListItemAborted,
      emoji: ABORTED_ITEM_EMOJI,
    });
  });
});

describe('needToRenderCommandList', () => {
  it('should return true when message has commands', () => {
    const message = {
      status: MessageStatus.Success,
      commands: [{ status: 'success', message: 'OK' }],
    } as Message;

    expect(needToRenderCommandList(message)).toBe(true);
  });

  it('should return true when message has failed commands', () => {
    const message = {
      status: MessageStatus.Failure,
      commands: [{ status: 'failure', message: 'Failed' }],
    } as Message;

    expect(needToRenderCommandList(message)).toBe(true);
  });

  it('should return false when message has no commands', () => {
    const message = { status: MessageStatus.Success } as Message;

    expect(needToRenderCommandList(message)).toBe(false);
  });

  it('should return false when commands is empty array', () => {
    const message = {
      status: MessageStatus.Success,
      commands: [],
    } as unknown as Message;

    expect(needToRenderCommandList(message)).toBe(false);
  });
});
