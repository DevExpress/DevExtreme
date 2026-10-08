import {
  beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import consoleUtils from '@ts/core/utils/m_console';
import errorFactory from '@ts/core/utils/m_error';

jest.mock('@ts/core/utils/m_console', () => {
  const logger = {
    log: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn(),
  };

  return { __esModule: true, logger, default: { logger } };
});

const { logger } = consoleUtils;

const BASE_MESSAGES = {
  E0001: 'Message {0} and {1}.',
  E0002: 'Trailing dots...  ',
  W0003: 'Warning {0}',
  X0004: 'Other {0}',
};

describe('Error utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ERROR_MESSAGES', () => {
    it('should contain the base messages', () => {
      expect(errorFactory(BASE_MESSAGES).ERROR_MESSAGES).toEqual(BASE_MESSAGES);
    });

    it('should extend the passed errors object with the base messages', () => {
      const errors = { E0001: 'Overridden', E0100: 'Extra' };

      const { ERROR_MESSAGES } = errorFactory(BASE_MESSAGES, errors);

      expect(ERROR_MESSAGES).toBe(errors);
      expect(ERROR_MESSAGES).toEqual({ ...BASE_MESSAGES, E0100: 'Extra' });
    });

    it('should not share messages between factories', () => {
      const first = errorFactory({ E1: 'first {0}' });
      const second = errorFactory({ E1: 'second {0}' });

      expect(first.Error('E1', 'x').message).toContain('first x');
      expect(second.Error('E1', 'x').message).toContain('second x');
    });
  });

  describe('Error', () => {
    const { Error: makeError } = errorFactory(BASE_MESSAGES);

    it('should create an error with the formatted details and the link to the article', () => {
      const error = makeError('E0001', 'a', 'b');

      expect(error).toBeInstanceOf(Error);
      expect(error.__id).toBe('E0001');
      expect(error.__details).toBe('Message a and b');
      expect(error.url).toMatch(/^https:\/\/js\.devexpress\.com\/error\/\d+_\d+\/E0001$/);
      expect(error.message).toBe(
        `E0001 - Message a and b.\n\nFor additional information on this error message, see: ${error.url}`,
      );
    });

    it('should remove the trailing dots and spaces of the details', () => {
      expect(makeError('E0002').__details).toBe('Trailing dots');
    });

    it('should mention a warning for the ids that start with W', () => {
      expect(makeError('W0003', 'x').message).toContain('on this warning message');
      expect(makeError('X0004', 'x').message).toContain('on this error message');
    });

    it('should keep the placeholders without values and ignore the extra values', () => {
      expect(makeError('E0001').__details).toBe('Message {0} and {1}');
      expect(makeError('E0001', 'a', 'b', 'c').__details).toBe('Message a and b');
    });

    it('should insert the values without interpreting the replacement patterns', () => {
      expect(makeError('E0001', '$&', '$1').__details).toBe('Message $& and $1');
    });

    it('should be callable with new', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = new (makeError as any)('E0001', 'a', 'b') as Error & { __id: string };

      expect(error).toBeInstanceOf(Error);
      expect(error.__id).toBe('E0001');
      expect(error.message).toContain('Message a and b');
    });

    it('should not depend on the call context', () => {
      const { Error: detached } = errorFactory(BASE_MESSAGES);

      expect(detached('E0001', 'a', 'b').__details).toBe('Message a and b');
    });
  });

  describe('log', () => {
    const { Error: makeError, log } = errorFactory(BASE_MESSAGES);

    it('should log the message of an error id as an error', () => {
      log('E0001', 'a', 'b');

      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(makeError('E0001', 'a', 'b').message);
      expect(logger.warn).not.toHaveBeenCalled();
      expect(logger.log).not.toHaveBeenCalled();
    });

    it('should log the message of a warning id as a warning', () => {
      log('W0003', 'x');

      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith(makeError('W0003', 'x').message);
      expect(logger.error).not.toHaveBeenCalled();
      expect(logger.log).not.toHaveBeenCalled();
    });

    it('should log only the id when it is neither an error nor a warning id', () => {
      log('X0004', 'x');
      log('plain');

      expect(logger.log).toHaveBeenCalledTimes(2);
      expect(logger.log).toHaveBeenNthCalledWith(1, 'X0004');
      expect(logger.log).toHaveBeenNthCalledWith(2, 'plain');
      expect(logger.error).not.toHaveBeenCalled();
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('should require the id to consist of the letter and digits only', () => {
      log('E12x');
      log('E');
      log('W');
      log('W1 ');

      expect(logger.log).toHaveBeenCalledTimes(4);
    });

    it('should not depend on the call context', () => {
      const { log: detached } = errorFactory(BASE_MESSAGES);

      detached('E0001', 'a', 'b');

      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});
