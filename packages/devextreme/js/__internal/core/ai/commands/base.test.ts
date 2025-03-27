import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { Prompt, RequestCallbacks } from '@js/ai/ai';
import { BaseCommand } from '@ts/core/ai/commands/base';
import type { RequestManager } from '@ts/core/ai/core//request_manager';
import type { PromptData, PromptManager, PromptTemplateName } from '@ts/core/ai/core/prompt_manager';

interface TestCommandParams {
  first: string;
  second: string;
}

class TestCommand extends BaseCommand {
  getTemplateName(): PromptTemplateName {
    return 'test' as PromptTemplateName;
  }

  buildPromptData(params: TestCommandParams): PromptData {
    const data = {
      user: { first: params?.first },
      system: { second: params?.second },
    };

    return data;
  }

  parseResult(response: string): string {
    return `Parsed result: ${response}`;
  }
}

describe('BaseCommand', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let promptManager: PromptManager;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let requestManager: RequestManager;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let command: TestCommand;

  beforeEach(() => {
    promptManager = {
      buildPrompt: (): Prompt => ({
        system: 'systemMessage',
        user: 'userMessage',
      }),
    } as unknown as PromptManager;

    requestManager = {
      sendRequest: (_: Prompt, callbacks: RequestCallbacks) => {
        callbacks?.onComplete?.('AI response');

        return (): void => {};
      },
    } as unknown as RequestManager;

    command = new TestCommand(promptManager, requestManager);
  });

  describe('constructor', () => {
    it('stores PromptManager and RequestManager correctly', () => {
      // @ts-expect-error
      expect(command.promptManager).toBe(promptManager);
      // @ts-expect-error
      expect(command.requestManager).toBe(requestManager);
    });
  });

  describe('execute', () => {
    it('getTemplateName returns value correctly', () => {
      const spy = jest.spyOn(command, 'getTemplateName');

      command.execute({}, {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith('test');
    });

    it('buildPromptData receives and returns correct data', () => {
      const params: TestCommandParams = { first: 'first', second: 'second' };
      const spy = jest.spyOn(command, 'buildPromptData');

      command.execute(params, {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(params);
      expect(spy).toHaveReturnedWith({
        user: { first: params.first },
        system: { second: params.second },
      });
    });

    it('parseResult receives correct value and returns expected result', () => {
      const spy = jest.spyOn(command, 'parseResult');

      command.execute({}, {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('AI response');
      expect(spy).toHaveReturnedWith('Parsed result: AI response');
    });

    it('callbacks are called correctly', () => {
      const callbacks = {
        onComplete: jest.fn(),
        onError: jest.fn(),
        onChunk: jest.fn(),
      };

      command.execute({}, callbacks as RequestCallbacks);

      expect(callbacks.onComplete).toHaveBeenCalledTimes(1);
      expect(callbacks.onError).toHaveBeenCalledTimes(0);
      expect(callbacks.onChunk).toHaveBeenCalledTimes(0);
    });

    it('onComplete is called with parseResult output', () => {
      const callbacks = {
        onComplete: jest.fn(),
      };

      command.execute({}, callbacks as RequestCallbacks);

      expect(callbacks.onComplete).toHaveBeenCalledWith('Parsed result: AI response');
    });

    it('calls onError if request fails', () => {
      const originalSendRequest = requestManager.sendRequest;

      requestManager.sendRequest = (_, callbacks) => {
        callbacks.onError?.(new Error('Test error'));

        return (): void => {};
      };

      try {
        const callbacks = {
          onError: jest.fn(),
          onComplete: jest.fn(),
        };

        command.execute({}, callbacks as RequestCallbacks);

        expect(callbacks.onError).toHaveBeenCalledTimes(1);
        expect(callbacks.onError).toHaveBeenCalledWith(new Error('Test error'));
        expect(callbacks.onComplete).toHaveBeenCalledTimes(0);
      } finally {
        requestManager.sendRequest = originalSendRequest;
      }
    });

    it('calls onChunk for each chunk', () => {
      const originalSendRequest = requestManager.sendRequest;

      requestManager.sendRequest = (_, callbacks) => {
        callbacks.onChunk?.('first');
        callbacks.onChunk?.('second');
        callbacks.onComplete?.('first second');

        return (): void => {};
      };

      try {
        const onChunk = jest.fn();
        const onComplete = jest.fn();

        command.execute({}, { onChunk, onComplete });

        expect(onChunk).toHaveBeenCalledTimes(2);
        expect(onChunk).toHaveBeenNthCalledWith(1, 'first');
        expect(onChunk).toHaveBeenNthCalledWith(2, 'second');
        expect(onComplete).toHaveBeenCalledTimes(1);
      } finally {
        requestManager.sendRequest = originalSendRequest;
      }
    });

    it('executes with undefined params without errors', () => {
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');
      const onError = jest.fn();

      expect(command.execute(undefined, { onError })).not.toThrow();
      expect(onError).toHaveBeenCalledTimes(0);

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('executes with partial callbacks without errors', () => {
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');
      const callbacks = { onChunk: jest.fn() };

      expect(command.execute({ first: 'first', second: 'second' }, callbacks)).not.toThrow();

      expect(callbacks.onChunk).toHaveBeenCalledTimes(0);
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('executes with undefined callbacks without errors', () => {
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');

      expect(command.execute(
        { first: 'first', second: 'second' },
        (undefined as unknown as RequestCallbacks),
      )).not.toThrow();

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });
  });
});
