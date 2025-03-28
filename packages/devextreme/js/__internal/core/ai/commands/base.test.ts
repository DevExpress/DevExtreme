import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { AIProvider, RequestCallbacks } from '@js/ai/ai';
import { BaseCommand } from '@ts/core/ai/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai/core/prompt_manager';
import { PromptManager } from '@ts/core/ai/core/prompt_manager';
import { RequestManager } from '@ts/core/ai/core/request_manager';
import { Provider } from '@ts/core/ai/test_utils/provider_mock';

jest.mock('@ts/core/ai/templates/index', () => ({
  templates: {
    'test-template-name': {
      system: 'System test template with {{first}}',
      user: 'User test template with {{second}}',
    },
  },
}));

interface TestCommandParams {
  first: string;
  second: string;
}

class TestCommand extends BaseCommand {
  getTemplateName(): PromptTemplateName {
    return 'test-template-name' as PromptTemplateName;
  }

  buildPromptData(params: TestCommandParams): PromptData {
    const data = {
      system: { first: params?.first },
      user: { second: params?.second },
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
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new TestCommand(promptManager, requestManager);
  });

  describe('constructor', () => {
    it('stores PromptManager and RequestManager correctly', () => {
      // @ts-expect-error Access to protected property for a test
      expect(command.promptManager).toBe(promptManager);
      // @ts-expect-error Access to protected property for a test
      expect(command.requestManager).toBe(requestManager);
    });
  });

  describe('execute', () => {
    it('getTemplateName returns value correctly', () => {
      const spy = jest.spyOn(command, 'getTemplateName');

      command.execute({}, {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith('test-template-name');
    });

    it('buildPromptData receives and returns correct data', () => {
      const params: TestCommandParams = { first: 'first', second: 'second' };
      const spy = jest.spyOn(command, 'buildPromptData');

      command.execute(params, {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(params);
      expect(spy).toHaveReturnedWith({
        system: { first: params.first },
        user: { second: params.second },
      });
    });

    it('parseResult receives correct value and returns expected result', async () => {
      const params: TestCommandParams = { first: 'first', second: 'second' };
      const spy = jest.spyOn(command, 'parseResult');

      command.execute(params, {});

      await new Promise(process.nextTick);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('AI response');
      expect(spy).toHaveReturnedWith('Parsed result: AI response');
    });

    it('callbacks are called correctly', async () => {
      const callbacks = {
        onComplete: jest.fn(),
        onError: jest.fn(),
        onChunk: jest.fn(),
      };

      command.execute({}, callbacks as RequestCallbacks);

      await new Promise(process.nextTick);

      expect(callbacks.onComplete).toHaveBeenCalledTimes(1);
      expect(callbacks.onError).toHaveBeenCalledTimes(0);
      expect(callbacks.onChunk).toHaveBeenCalledTimes(2);
    });

    it('onComplete is called with parseResult output', async () => {
      const callbacks = { onComplete: jest.fn() };

      command.execute({}, callbacks as RequestCallbacks);

      await new Promise(process.nextTick);

      expect(callbacks.onComplete).toHaveBeenCalledWith('Parsed result: AI response');
    });

    it('calls onError if request fails', async () => {
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

        await new Promise(process.nextTick);

        expect(callbacks.onError).toHaveBeenCalledTimes(1);
        expect(callbacks.onError).toHaveBeenCalledWith(new Error('Test error'));
        expect(callbacks.onComplete).toHaveBeenCalledTimes(0);
      } finally {
        requestManager.sendRequest = originalSendRequest;
      }
    });

    it('calls onChunk for each chunk and onComplete correctly', () => {
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
        expect(onComplete).toHaveBeenNthCalledWith(1, 'Parsed result: first second');
      } finally {
        requestManager.sendRequest = originalSendRequest;
      }
    });

    it('executes with undefined params without errors', async () => {
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');
      const onError = jest.fn();

      expect(command.execute(undefined, { onError })).not.toThrow();

      await new Promise(process.nextTick);

      expect(onError).toHaveBeenCalledTimes(0);
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('executes with partial callbacks without errors', async () => {
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');
      const callbacks = { onChunk: jest.fn() };

      expect(command.execute({ first: 'first', second: 'second' }, callbacks)).not.toThrow();

      await new Promise(process.nextTick);

      expect(callbacks.onChunk).toHaveBeenCalledTimes(2);
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
