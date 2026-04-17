import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  AIProvider,
  RequestCallbacks,
} from '@js/common/ai-integration';
import {
  ChangeStyleCommand,
  ChangeToneCommand,
  ExecuteCommand,
  ExecuteGridAssistantCommand,
  ExpandCommand,
  ProofreadCommand,
  ShortenCommand,
  SummarizeCommand,
  TranslateCommand,
} from '@ts/core/ai_integration/commands';
import { AIIntegration, CommandNames } from '@ts/core/ai_integration/core/ai_integration';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';
import { Provider } from '@ts/core/ai_integration/test_utils/provider_mock';

const COMMANDS = {
  [CommandNames.ChangeStyle]: {
    command: ChangeStyleCommand,
    params: { text: 'text to style change' },
    params2: { text: 'text to style change 2' },
  },
  [CommandNames.ChangeTone]: {
    command: ChangeToneCommand,
    params: { text: 'text to tone change' },
    params2: { text: 'text to tone change 2' },
  },
  [CommandNames.Execute]: {
    command: ExecuteCommand,
    params: { text: 'text to execution' },
    params2: { text: 'text to execution 2' },
  },
  [CommandNames.Expand]: {
    command: ExpandCommand,
    params: { text: 'text to expansion' },
    params2: { text: 'text to expansion 2' },
  },
  [CommandNames.Proofread]: {
    command: ProofreadCommand,
    params: { text: 'text to proofreading' },
    params2: { text: 'text to proofreading 2' },
  },
  [CommandNames.Shorten]: {
    command: ShortenCommand,
    params: { text: 'text to shorten' },
    params2: { text: 'text to shorten 2' },
  },
  [CommandNames.Summarize]: {
    command: SummarizeCommand,
    params: { text: 'text to summarizing' },
    params2: { text: 'text to summarizing 2' },
  },
  [CommandNames.Translate]: {
    command: TranslateCommand,
    params: { text: 'text for translation', lang: 'French' },
    params2: { text: 'text for translation 2', lang: 'Spanish' },
  },
  [CommandNames.ExecuteGridAssistant]: {
    command: ExecuteGridAssistantCommand,
    params: {
      text: 'sort by name',
      context: { columns: [] },
      responseSchema: { type: 'object', properties: {} },
    },
    params2: {
      text: 'filter by id',
      context: { columns: [] },
      responseSchema: { type: 'object', properties: {} },
    },
  },
};

describe('AIIntegration', () => {
  let provider = null as unknown as AIProvider;
  let ai = null as unknown as AIIntegration;

  beforeEach(() => {
    provider = new Provider();
    ai = new AIIntegration(provider);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create and store PromptManager and RequestManager', () => {
      // @ts-expect-error Access to protected property for a test
      expect(ai.promptManager).toBeInstanceOf(PromptManager);
      // @ts-expect-error Access to protected property for a test
      expect(ai.requestManager).toBeInstanceOf(RequestManager);
    });

    it('should pass lang option to PromptManager', () => {
      const aiWithLang = new AIIntegration(provider, { lang: 'de-DE' });

      // @ts-expect-error Access to protected property for a test
      expect(aiWithLang.promptManager.lang).toBe('de-DE');
    });
  });

  Object.keys(COMMANDS).forEach((commandName: string) => {
    describe(commandName, () => {
      const { command, params, params2 } = COMMANDS[commandName];

      it(`should call executeCommand with ${commandName} command once with expected params`, () => {
        const callbacks: RequestCallbacks<unknown> = {
          onComplete: () => {},
          onChunk: () => {},
          onError: () => {},
        };

        const executeSpy = jest.spyOn(command.prototype, 'execute');

        ai[commandName](params, callbacks);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith(params, callbacks);
      });

      it('should return the abort function received from the command', () => {
        const abort = (): void => {};

        jest
          // @ts-expect-error Access to protected property for a test
          .spyOn(ai.requestManager, 'sendRequest')
          .mockImplementation(() => abort);

        const abortRequest = ai[commandName](params, {});

        expect(abortRequest).toBe(abort);
      });

      it(`should reuse the same command instance for multiple ${commandName} calls`, () => {
        const callbacks: RequestCallbacks<unknown> = {};
        const executeSpy = jest.spyOn(command.prototype, 'execute');

        ai[commandName](params, callbacks);

        // @ts-expect-error Access to protected property for a test
        const commandsMap = ai.commands;
        const commandInstance = commandsMap.get(commandName as CommandNames);

        expect(commandsMap.size).toBe(1);
        expect(commandInstance).toBeInstanceOf(command);

        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(executeSpy).toHaveBeenCalledWith(params, callbacks);

        ai[commandName](params2, callbacks);

        expect(commandsMap.size).toBe(1);
        expect(commandsMap.get(commandName as CommandNames)).toBe(commandInstance);

        expect(executeSpy).toHaveBeenCalledTimes(2);
        expect(executeSpy).toHaveBeenLastCalledWith(params2, callbacks);
      });
    });
  });
});
