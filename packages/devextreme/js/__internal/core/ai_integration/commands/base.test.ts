import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { AIProvider, RequestCallbacks } from '@js/common/ai-integration';
import { BaseCommand } from '@ts/core/ai_integration/commands/base';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

jest.mock('@ts/core/ai_integration/templates/index', () => ({
  metaTemplates: {},
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

class TestCommand extends BaseCommand<TestCommandParams, string> {
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
  let promptManager = null as unknown as PromptManager;
  let requestManager = null as unknown as RequestManager;
  let command = null as unknown as TestCommand;

  const params: TestCommandParams = { first: 'first', second: 'second' };

  beforeEach(() => {
    const provider: AIProvider = new Provider();

    requestManager = new RequestManager(provider);
    promptManager = new PromptManager();

    command = new TestCommand(promptManager, requestManager);
  });

  describe('constructor', () => {
    it('should store PromptManager and RequestManager instances', () => {
      // @ts-expect-error Access to protected property for a test
      expect(command.promptManager).toBe(promptManager);
      // @ts-expect-error Access to protected property for a test
      expect(command.requestManager).toBe(requestManager);
    });
  });

  describe('getBuildPromptOptions', () => {
    it('should return { applyMetaTemplates: true } by default', () => {
      // @ts-expect-error Access to protected property for a test
      const result = command.getBuildPromptOptions();

      expect(result).toEqual({ applyMetaTemplates: true });
    });
  });

  describe('execute', () => {
    it('getTemplateName should return the name of the corresponding template', () => {
      const spy = jest.spyOn(command, 'getTemplateName');

      command.execute(params, {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveReturnedWith('test-template-name');
    });

    it('buildPromptData should receive and returns correct data', () => {
      const spy = jest.spyOn(command, 'buildPromptData');

      command.execute(params, {});

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(params);
      expect(spy).toHaveReturnedWith({
        system: { first: params.first },
        user: { second: params.second },
      });
    });

    it('parseResult should receive correct value and return expected result', async () => {
      const spy = jest.spyOn(command, 'parseResult');

      command.execute(params, {});

      await new Promise(process.nextTick);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('AI response', params);
      expect(spy).toHaveReturnedWith('Parsed result: AI response');
    });

    it('callbacks should be called a specified number of times', async () => {
      const callbacks: RequestCallbacks<unknown> = {
        onComplete: jest.fn(),
        onError: jest.fn(),
        onChunk: jest.fn(),
      };

      command.execute(params, callbacks);

      await new Promise(process.nextTick);

      expect(callbacks.onComplete).toHaveBeenCalledTimes(1);
      expect(callbacks.onError).toHaveBeenCalledTimes(0);
      expect(callbacks.onChunk).toHaveBeenCalledTimes(2);
    });

    it('onComplete should be called with parseResult output', async () => {
      const callbacks: RequestCallbacks<unknown> = { onComplete: jest.fn() };

      command.execute(params, callbacks);

      await new Promise(process.nextTick);

      expect(callbacks.onComplete).toHaveBeenCalledWith('Parsed result: AI response');
    });

    describe('if request fails', () => {
      it('should call onError ', async () => {
        const originalSendRequest = requestManager.sendRequest;

        requestManager.sendRequest = (_, callbacks) => {
          callbacks.onError?.(new Error('Test error'));

          return (): void => {};
        };

        try {
          const callbacks: RequestCallbacks<unknown> = {
            onError: jest.fn(),
            onComplete: jest.fn(),
          };

          command.execute(params, callbacks);

          await new Promise(process.nextTick);

          expect(callbacks.onError).toHaveBeenCalledTimes(1);
          expect(callbacks.onError).toHaveBeenCalledWith(new Error('Test error'));
          expect(callbacks.onComplete).toHaveBeenCalledTimes(0);
        } finally {
          requestManager.sendRequest = originalSendRequest;
        }
      });
    });

    it('should call onChunk for each chunk and onComplete a specified number of times with expected params', () => {
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

        command.execute(params, { onChunk, onComplete });

        expect(onChunk).toHaveBeenCalledTimes(2);
        expect(onChunk).toHaveBeenNthCalledWith(1, 'first');
        expect(onChunk).toHaveBeenNthCalledWith(2, 'second');
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(onComplete).toHaveBeenNthCalledWith(1, 'Parsed result: first second');
      } finally {
        requestManager.sendRequest = originalSendRequest;
      }
    });

    it('should execute with undefined params without errors', async () => {
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');
      const onError = jest.fn();

      expect(command.execute(undefined as unknown as TestCommandParams, { onError })).not.toThrow();

      await new Promise(process.nextTick);

      expect(onError).toHaveBeenCalledTimes(0);
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('should execute with partial callbacks without errors', async () => {
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');
      const callbacks = { onChunk: jest.fn() };

      expect(command.execute(params, callbacks)).not.toThrow();

      await new Promise(process.nextTick);

      expect(callbacks.onChunk).toHaveBeenCalledTimes(2);
      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('should execute with undefined callbacks without errors', () => {
      const sendRequestSpy = jest.spyOn(requestManager, 'sendRequest');

      expect(command.execute(
        params,
        (undefined as unknown as RequestCallbacks<unknown>),
      )).not.toThrow();

      expect(sendRequestSpy).toHaveBeenCalledTimes(1);
    });
  });
});
