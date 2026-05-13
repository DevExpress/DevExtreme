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
  hasAbortedCommands,
  hasCommandErrors,
  needToRenderCommandList,
  needToShowRegenerateButton,
} from './utils';

describe('hasCommandErrors', () => {
  it('should return true when commands contain failure status', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
      { status: 'failure' as const, message: 'Failed' },
    ];

    expect(hasCommandErrors(commands)).toBe(true);
  });

  it('should return false when all commands are successful', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
    ];

    expect(hasCommandErrors(commands)).toBe(false);
  });

  it('should return false when commands is undefined', () => {
    expect(hasCommandErrors(undefined)).toBe(false);
  });

  it('should return false when commands contain only aborted status', () => {
    const commands = [
      { status: 'aborted' as const, message: 'Aborted' },
    ];

    expect(hasCommandErrors(commands)).toBe(false);
  });
});

describe('hasAbortedCommands', () => {
  it('should return true when commands contain aborted status', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
      { status: 'aborted' as const, message: 'Aborted' },
    ];

    expect(hasAbortedCommands(commands)).toBe(true);
  });

  it('should return false when no commands are aborted', () => {
    const commands = [
      { status: 'success' as const, message: 'OK' },
      { status: 'failure' as const, message: 'Failed' },
    ];

    expect(hasAbortedCommands(commands)).toBe(false);
  });

  it('should return false when commands is undefined', () => {
    expect(hasAbortedCommands(undefined)).toBe(false);
  });
});

describe('getMessageIconName', () => {
  it('should return errorcircle when message status is failure', () => {
    const message = { status: MessageStatus.Failure } as Message;

    expect(getMessageIconName(message)).toBe('errorcircle');
  });

  it('should return errorcircle when commands contain errors', () => {
    const message = {
      status: MessageStatus.Success,
      commands: [{ status: 'failure', message: 'Failed' }],
    } as Message;

    expect(getMessageIconName(message)).toBe('errorcircle');
  });

  it('should return errorcircle when commands contain aborted items', () => {
    const message = {
      status: MessageStatus.Success,
      commands: [{ status: 'aborted', message: 'Aborted' }],
    } as Message;

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
  it('should return true when message status is failure', () => {
    const message = { status: MessageStatus.Failure } as Message;

    expect(needToShowRegenerateButton(message)).toBe(true);
  });

  it('should return true when commands contain errors', () => {
    const message = {
      status: MessageStatus.Success,
      commands: [{ status: 'failure', message: 'Failed' }],
    } as Message;

    expect(needToShowRegenerateButton(message)).toBe(true);
  });

  it('should return true when commands contain aborted items', () => {
    const message = {
      status: MessageStatus.Success,
      commands: [{ status: 'aborted', message: 'Aborted' }],
    } as Message;

    expect(needToShowRegenerateButton(message)).toBe(true);
  });

  it('should return false when message is successful without errors', () => {
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
  it('should return true when message status is success', () => {
    const message = { status: MessageStatus.Success } as Message;

    expect(needToRenderCommandList(message)).toBe(true);
  });

  it('should return true when commands contain errors', () => {
    const message = {
      status: MessageStatus.Failure,
      commands: [{ status: 'failure', message: 'Failed' }],
    } as Message;

    expect(needToRenderCommandList(message)).toBe(true);
  });

  it('should return true when commands contain aborted items', () => {
    const message = {
      status: MessageStatus.Failure,
      commands: [{ status: 'aborted', message: 'Aborted' }],
    } as Message;

    expect(needToRenderCommandList(message)).toBe(true);
  });

  it('should return false when message is pending without commands', () => {
    const message = { status: MessageStatus.Pending } as Message;

    expect(needToRenderCommandList(message)).toBe(false);
  });

  it('should return false when message is failure without commands', () => {
    const message = { status: MessageStatus.Failure } as Message;

    expect(needToRenderCommandList(message)).toBe(false);
  });
});
