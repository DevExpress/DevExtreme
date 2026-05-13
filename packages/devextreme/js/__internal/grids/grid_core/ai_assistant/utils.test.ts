import {
  describe, expect, it,
} from '@jest/globals';

import {
  hasAbortedCommands,
  hasCommandErrors,
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
