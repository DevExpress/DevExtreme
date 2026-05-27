import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type {
  ExecuteGridAssistantCommandParams,
  ExecuteGridAssistantCommandResult,
  RequestCallbacks,
  Response as SendRequestResult,
} from '@js/common/ai-integration';
import type { Message } from '@js/ui/chat';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import CustomStore from '@ts/data/m_custom_store';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import { AIAssistantDataGridModel } from '@ts/grids/grid_core/__tests__/__mock__/model/ai_assistant';
import { MessageStatus } from '@ts/grids/grid_core/ai_assistant/const';
import { GridCommands } from '@ts/grids/grid_core/ai_assistant/grid_commands';
import type { AIMessage, CommandResult } from '@ts/grids/grid_core/ai_assistant/types';

interface MockAIIntegrationResult {
  aiIntegration: AIIntegration;
  getLastCallbacks: () => RequestCallbacks<ExecuteGridAssistantCommandResult>;
  getAbortSpy: () => jest.Mock;
}

const LOCAL_DATA = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
];

const DEFAULT_COLUMNS = [
  { dataField: 'id', caption: 'ID', dataType: 'number' as const },
  { dataField: 'name', caption: 'Name', dataType: 'string' as const },
];

const createMockAIIntegration = (): MockAIIntegrationResult => {
  let lastCallbacks: RequestCallbacks<ExecuteGridAssistantCommandResult> = {};
  const abortSpy = jest.fn();

  const aiIntegration = new AIIntegration({
    sendRequest(): SendRequestResult {
      return {
        promise: Promise.resolve('{}'),
        abort: jest.fn(),
      };
    },
  });

  aiIntegration.executeGridAssistant = jest.fn((
    _params: ExecuteGridAssistantCommandParams,
    callbacks: RequestCallbacks<ExecuteGridAssistantCommandResult>,
  ): (() => void) => {
    lastCallbacks = callbacks;
    return abortSpy;
  }) as typeof aiIntegration.executeGridAssistant;

  return {
    aiIntegration,
    getLastCallbacks: () => lastCallbacks,
    getAbortSpy: () => abortSpy,
  };
};

const createDataGridWithAi = async (
  overrides: Record<string, unknown> = {},
): Promise<{
  model: AIAssistantDataGridModel;
  getLastCallbacks: () => RequestCallbacks<ExecuteGridAssistantCommandResult>;
  getAbortSpy: () => jest.Mock;
}> => {
  const { aiIntegration, getLastCallbacks, getAbortSpy } = createMockAIIntegration();

  await createDataGrid({
    dataSource: LOCAL_DATA,
    columns: DEFAULT_COLUMNS,
    aiAssistant: { enabled: true, aiIntegration, title: 'AI Assistant' },
    ...overrides,
  });

  const model = new AIAssistantDataGridModel(
    document.getElementById('gridContainer') as HTMLElement,
  );

  return { model, getLastCallbacks, getAbortSpy };
};

const createDataGridWithAiAndPopup = async (
  overrides: Record<string, unknown> = {},
): Promise<{
  model: AIAssistantDataGridModel;
  getLastCallbacks: () => RequestCallbacks<ExecuteGridAssistantCommandResult>;
  getAbortSpy: () => jest.Mock;
}> => {
  const result = await createDataGridWithAi(overrides);
  const { model } = result;

  await model.togglePopup();
  jest.runAllTimers();

  return result;
};

describe('AI Assistant error handling', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let parseSpy: ReturnType<typeof jest.spyOn>;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let executeCommandsSpy: ReturnType<typeof jest.spyOn>;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let buildResponseSchemaSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    beforeTest();
    jest.spyOn(errors, 'log').mockImplementation(jest.fn());

    parseSpy = jest.spyOn(GridCommands.prototype, 'parse')
      .mockImplementation((actions) => actions);
    executeCommandsSpy = jest.spyOn(GridCommands.prototype, 'executeCommands')
      .mockResolvedValue([
        { status: 'success', message: 'Done' },
      ] as CommandResult[]);
    buildResponseSchemaSpy = jest.spyOn(GridCommands.prototype, 'buildResponseSchema')
      .mockReturnValue({ type: 'object' });
  });

  afterEach(() => {
    parseSpy.mockRestore();
    executeCommandsSpy.mockRestore();
    buildResponseSchemaSpy.mockRestore();
    afterTest();
  });

  describe('no aiIntegration configured', () => {
    it('should fail message and log E1068 when aiIntegration is missing', async () => {
      const { model } = await createDataGridWithAiAndPopup({
        aiAssistant: { enabled: true, title: 'AI Assistant' },
      });

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      const messages = await model.loadMessages();

      expect(messages).toHaveLength(1);
      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
      expect(errors.log).toHaveBeenCalledWith('E1068');
    });
  });

  describe('network / API error', () => {
    it('should render failure message with correct headerText and errorText', async () => {
      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      getLastCallbacks().onError?.(new Error('Network error'));
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          errorText: 'Invalid response from the AI service. Please try again.',
          text: MessageStatus.Failure,
        }),
      ]);

      const aiChat = model.getAiChatModel();
      expect(aiChat.getMessages().length).toBe(1);
      expect(aiChat.getMessageStatus(0)).toBe(MessageStatus.Failure);
      expect(aiChat.getErrorMessage(0).text())
        .toBe('Invalid response from the AI service. Please try again.');
    });
  });

  describe('invalid response', () => {
    it('should fail when response has no actions property', async () => {
      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      getLastCallbacks().onComplete?.({} as ExecuteGridAssistantCommandResult);
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
    });

    it('should fail when response has empty actions array', async () => {
      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      getLastCallbacks().onComplete?.({ actions: [] });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
    });

    it('should fail when response actions is not an array', async () => {
      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      getLastCallbacks().onComplete?.(
        { actions: 'invalid' } as unknown as ExecuteGridAssistantCommandResult,
      );
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
    });
  });

  describe('validation failure', () => {
    it('should fail when command parse returns null', async () => {
      parseSpy.mockReturnValue(null);

      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
    });
  });

  describe('execution already in progress', () => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let isExecutingSpy: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
      isExecutingSpy = jest.spyOn(GridCommands.prototype, 'isExecuting')
        .mockReturnValue(true);
    });

    afterEach(() => {
      isExecutingSpy.mockRestore();
    });

    it('should fail when commands are already executing', async () => {
      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Execution already in progress. Please wait.',
        }),
      ]);
    });
  });

  describe('schema build failure', () => {
    it('should fail when buildResponseSchema returns undefined', async () => {
      buildResponseSchemaSpy.mockReturnValue(undefined as never);

      const { model } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'An unexpected error occurred. Please try again.',
        }),
      ]);
    });
  });

  describe('request abort', () => {
    it('should fail message with abort text when request is aborted', async () => {
      const { model } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      model.getAiAssistantController().abortRequest();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          errorText: 'Request stopped.',
        }),
      ]);
    });

    it('should render abort message in the DOM', async () => {
      const { model } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      model.getAiAssistantController().abortRequest();
      await flushAsync();

      const aiChat = model.getAiChatModel();
      expect(aiChat.getMessages().length).toBe(1);
      expect(aiChat.getMessageStatus(0)).toBe(MessageStatus.Failure);
      expect(aiChat.getErrorMessage(0).text())
        .toBe('Request stopped.');
    });
  });

  describe('concurrent request rejection', () => {
    it('should reject second request while first is processing', async () => {
      const { model } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('First request');
      jest.runAllTimers();

      const message = {
        author: { id: 'user', name: 'User' },
        text: 'Second request',
        timestamp: new Date().toISOString(),
      } as Message;

      await expect(model.sendAiRequestRaw(message))
        .rejects.toThrow('Request already in progress. Please wait.');

      const messages = await model.loadMessages();

      expect(messages).toHaveLength(1);
    });
  });

  describe('request cancelled via onAIAssistantRequestCreating', () => {
    it('should fail message when cancel is set to true', async () => {
      const { model } = await createDataGridWithAiAndPopup({
        onAIAssistantRequestCreating: (e: { cancel: boolean }): void => {
          e.cancel = true;
        },
      });

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Request stopped.',
        }),
      ]);
    });
  });

  describe('partial command failure', () => {
    it('should set failure status when some commands fail', async () => {
      executeCommandsSpy.mockResolvedValue([
        { status: 'success', message: 'Sorted by Name' },
        { status: 'failure', message: 'Failed to filter' },
      ] as CommandResult[]);

      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort and filter');
      jest.runAllTimers();

      const actions = [
        { name: 'sorting', args: { column: 'Name' } },
        { name: 'filtering', args: { column: 'Age' } },
      ];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          commands: [
            { status: 'success', message: 'Sorted by Name' },
            { status: 'failure', message: 'Failed to filter' },
          ],
        }),
      ]);

      expect(model.getAiChatModel().getMessageStatus(0))
        .toBe(MessageStatus.Failure);
    });

    it('should set failure status when commands contain aborted items', async () => {
      executeCommandsSpy.mockResolvedValue([
        { status: 'success', message: 'Sorted by Name' },
        { status: 'aborted', message: 'Execution Interrupted' },
      ] as CommandResult[]);

      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort and group');
      jest.runAllTimers();

      const actions = [
        { name: 'sorting', args: { column: 'Name' } },
        { name: 'grouping', args: { column: 'Name' } },
      ];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          commands: [
            { status: 'success', message: 'Sorted by Name' },
            { status: 'aborted', message: 'Execution Interrupted' },
          ],
        }),
      ]);
    });
  });

  describe('successful response', () => {
    it('should set success status with correct headerText and commands', async () => {
      executeCommandsSpy.mockResolvedValue([
        { status: 'success', message: 'Sorted by Name ascending' },
      ] as CommandResult[]);

      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by Name');
      jest.runAllTimers();

      const actions = [{ name: 'sorting', args: { column: 'Name' } }];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Success,
          headerText: 'Sorting',
          commands: [{ status: 'success', message: 'Sorted by Name ascending' }],
        }),
      ]);

      const aiChat = model.getAiChatModel();
      expect(aiChat.getMessageStatus(0)).toBe(MessageStatus.Success);
      expect(aiChat.getActionList(0).text())
        .toBe('Sorted by Name ascending');
    });

    it('should format headerText with "and" for multiple command names', async () => {
      executeCommandsSpy.mockResolvedValue([
        { status: 'success', message: 'Sorted' },
        { status: 'success', message: 'Filtered' },
      ] as CommandResult[]);

      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort and filter');
      jest.runAllTimers();

      const actions = [
        { name: 'sorting', args: { column: 'Name' } },
        { name: 'filtering', args: { column: 'Age' } },
      ];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          headerText: 'Sorting and Filtering',
        }),
      ]);
    });
  });

  describe('delayed response', () => {
    it('should show pending status before response arrives', async () => {
      const { model } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      const messagesBefore = await model.loadMessages();

      expect(messagesBefore).toEqual([
        expect.objectContaining({
          status: MessageStatus.Pending,
          headerText: 'Request in progress',
        }),
      ]);

      expect(model.getAiChatModel().getMessageStatus(0))
        .toBe(MessageStatus.Pending);
    });

    it('should transition from pending to success after delayed response', async () => {
      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      let messages = await model.loadMessages();
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Pending,
      }));

      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sorting', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      messages = await model.loadMessages();
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Success,
      }));
    });

    it('should transition from pending to failure after delayed error', async () => {
      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      let messages = await model.loadMessages();
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Pending,
      }));

      getLastCallbacks().onError?.(new Error('Timeout'));
      await flushAsync();

      messages = await model.loadMessages();
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Failure,
      }));
    });
  });

  describe('chat closed during processing', () => {
    it('should abort request and show failure after closing chat with confirm', async () => {
      const { model } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      const aiChat = model.getAiChatModel();
      expect(aiChat.getMessages().length).toBe(1);
      expect(aiChat.getMessageStatus(0))
        .toBe(MessageStatus.Pending);

      await model.togglePopup().catch(() => {});
      jest.runAllTimers();
      await flushAsync();

      const confirmDialogSelector = '.dx-datagrid-ai-assistant-confirm-dialog';
      const yesButton = document.querySelectorAll(
        `${confirmDialogSelector} .dx-button`,
      )[1] as HTMLElement;
      yesButton.click();
      jest.runAllTimers();
      await flushAsync();

      await model.togglePopup();
      jest.runAllTimers();
      await flushAsync();

      const aiChatAfter = model.getAiChatModel();
      expect(aiChatAfter.getMessages().length).toBe(1);
      expect(aiChatAfter.getMessageStatus(0)).toBe(MessageStatus.Failure);
      expect(aiChatAfter.getErrorMessage(0).text())
        .toBe('Request stopped.');
    });
  });

  describe('regeneration after failure', () => {
    it('should reset to pending and then succeed after regeneration', async () => {
      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('Sort by Name');
      jest.runAllTimers();
      getLastCallbacks().onError?.(new Error('Network error'));
      await flushAsync();

      expect(model.getAiChatModel().getMessages().length).toBe(1);
      expect(model.getAiChatModel().getMessageStatus(0))
        .toBe(MessageStatus.Failure);

      const regenerateButton = model.getAiChatModel().getRegenerateButton(0);
      expect(regenerateButton).toBeTruthy();

      regenerateButton.click();
      jest.runAllTimers();
      await flushAsync();

      expect(model.getAiChatModel().getMessages().length).toBe(1);
      expect(model.getAiChatModel().getMessageStatus(0))
        .toBe(MessageStatus.Pending);

      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sorting', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      expect(model.getAiChatModel().getMessages().length).toBe(1);
      expect(model.getAiChatModel().getMessageStatus(0))
        .toBe(MessageStatus.Success);
    });

    it('should reject regeneration while another request is processing', async () => {
      const { model } = await createDataGridWithAiAndPopup();

      model.sendAiRequest('First request');
      jest.runAllTimers();

      const messageStore = model.getMessageStore();

      const aiMessage: AIMessage = {
        id: 'assistant-old',
        author: { id: 'assistant' },
        text: MessageStatus.Failure,
        prompt: 'Old request',
        status: MessageStatus.Failure,
        headerText: 'Failed to process request',
        errorText: 'Network error',
      };

      await messageStore.insert(aiMessage);

      await expect(model.sendAiRequestRaw(aiMessage))
        .rejects.toThrow('Request already in progress. Please wait.');
    });
  });

  describe('customizeResponseTitle edge cases', () => {
    it('should handle customizeResponseTitle returning empty string', async () => {
      const mockIntegration = createMockAIIntegration();

      const { model } = await createDataGridWithAiAndPopup({
        aiAssistant: {
          enabled: true,
          aiIntegration: mockIntegration.aiIntegration,
          title: 'AI Assistant',
          customizeResponseTitle: (): string => '',
        },
      });

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      const actions = [{ name: 'sorting', args: { column: 'Name' } }];
      mockIntegration.getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Success,
          headerText: '',
        }),
      ]);
    });
  });

  describe('dispose during processing', () => {
    it('should abort request and mark message as failure on dispose', async () => {
      const { model } = await createDataGridWithAiAndPopup();

      const controller = model.getAiAssistantController();

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      const messagesBefore = await model.loadMessages();
      expect(messagesBefore[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Pending,
      }));

      controller.dispose();
      await flushAsync();

      const messagesAfter = await model.loadMessages();
      expect(messagesAfter[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Failure,
        errorText: 'Request stopped.',
      }));
    });
  });

  describe('resilience after consecutive failures', () => {
    it('should process request successfully after multiple prior failures', async () => {
      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup();
      const controller = model.getAiAssistantController();

      model.sendAiRequest('Request 1');
      jest.runAllTimers();
      getLastCallbacks().onError?.(new Error('error 1'));
      await flushAsync();

      model.sendAiRequest('Request 2');
      jest.runAllTimers();
      getLastCallbacks().onComplete?.({} as ExecuteGridAssistantCommandResult);
      await flushAsync();
      await flushAsync();

      model.sendAiRequest('Request 3');
      jest.runAllTimers();
      controller.abortRequest();
      await flushAsync();

      model.sendAiRequest('Request 4');
      jest.runAllTimers();
      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sorting', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toHaveLength(4);

      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Failure,
      }));
      expect(messages[1]).toEqual(expect.objectContaining({
        status: MessageStatus.Failure,
      }));
      expect(messages[2]).toEqual(expect.objectContaining({
        status: MessageStatus.Failure,
      }));
      expect(messages[3]).toEqual(expect.objectContaining({
        status: MessageStatus.Success,
        commands: [{ status: 'success', message: 'Done' }],
      }));
    });
  });

  describe('with remote data source', () => {
    const createRemoteDataSource = (
      data: Record<string, unknown>[],
      delay = 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any => new CustomStore({
      key: 'id',
      load: () => new Promise((resolve) => {
        // eslint-disable-next-line no-restricted-globals
        setTimeout(() => resolve(data), delay);
      }),
    });

    it('should handle error response identically with remote data', async () => {
      const remoteStore = createRemoteDataSource(LOCAL_DATA);

      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup({
        dataSource: remoteStore,
      });

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      getLastCallbacks().onError?.(new Error('Remote network error'));
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
    });

    it('should handle success response identically with remote data', async () => {
      const remoteStore = createRemoteDataSource(LOCAL_DATA);

      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup({
        dataSource: remoteStore,
      });

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sorting', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      const messages = await model.loadMessages();

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Success,
        }),
      ]);
    });

    it('should handle delayed remote data load with error response', async () => {
      const remoteStore = createRemoteDataSource(LOCAL_DATA, 100);

      const { model, getLastCallbacks } = await createDataGridWithAiAndPopup({
        dataSource: remoteStore,
      });

      model.sendAiRequest('Sort by name');
      jest.runAllTimers();

      let messages = await model.loadMessages();
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Pending,
      }));

      getLastCallbacks().onComplete?.({ actions: [] });
      await flushAsync();
      await flushAsync();

      messages = await model.loadMessages();

      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Failure,
        errorText: 'Invalid response from the AI service. Please try again.',
      }));
    });
  });
});
