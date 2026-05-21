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
import type { ArrayStore } from '@js/common/data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Message } from '@js/ui/chat';
import errors from '@js/ui/widget/ui.errors';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';
import CustomStore from '@ts/data/m_custom_store';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  type DataGridInstance,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import { MessageStatus } from '@ts/grids/grid_core/ai_assistant/const';
import { GridCommands } from '@ts/grids/grid_core/ai_assistant/grid_commands';
import type { AIMessage, CommandResult } from '@ts/grids/grid_core/ai_assistant/types';
import { CLASSES } from '@ts/grids/grid_core/ai_chat/const';

interface MockAIIntegrationResult {
  aiIntegration: AIIntegration;
  getLastCallbacks: () => RequestCallbacks<ExecuteGridAssistantCommandResult>;
  getAbortSpy: () => jest.Mock;
}

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

const LOCAL_DATA = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
];

const DEFAULT_COLUMNS = [
  { dataField: 'id', caption: 'ID', dataType: 'number' as const },
  { dataField: 'name', caption: 'Name', dataType: 'string' as const },
];

const createDataGridWithAi = async (
  overrides: Record<string, unknown> = {},
): Promise<{
  instance: DataGridInstance;
  getLastCallbacks: () => RequestCallbacks<ExecuteGridAssistantCommandResult>;
  getAbortSpy: () => jest.Mock;
}> => {
  const { aiIntegration, getLastCallbacks, getAbortSpy } = createMockAIIntegration();

  const { instance } = await createDataGrid({
    dataSource: LOCAL_DATA,
    columns: DEFAULT_COLUMNS,
    aiAssistant: { enabled: true, aiIntegration, title: 'AI Assistant' },
    ...overrides,
  });

  return { instance, getLastCallbacks, getAbortSpy };
};

const createDataGridWithAiAndPopup = async (
  overrides: Record<string, unknown> = {},
): Promise<{
  instance: DataGridInstance;
  getLastCallbacks: () => RequestCallbacks<ExecuteGridAssistantCommandResult>;
  getAbortSpy: () => jest.Mock;
}> => {
  const result = await createDataGridWithAi(overrides);

  const viewController = result.instance.getController('aiAssistantViewController');
  await viewController.toggle();
  jest.runAllTimers();

  return result;
};

const sendAiRequest = (
  instance: DataGridInstance,
  text: string,
): void => {
  const controller = instance.getController('aiAssistant');

  controller.sendRequestToAI({
    author: { id: 'user', name: 'User' },
    text,
    timestamp: new Date().toISOString(),
  } as Message).catch(() => {});
  jest.runAllTimers();
};

const getMessageStore = (
  instance: DataGridInstance,
): ArrayStore<Message, string> => {
  const controller = instance.getController('aiAssistant');
  return controller.getMessageStore();
};

const loadMessages = (
  instance: DataGridInstance,
): Promise<Message[]> => getMessageStore(instance).load() as Promise<Message[]>;

const findMessageElements = (): dxElementWrapper => $(`.${CLASSES.aiChat}`).find(`.${CLASSES.message}`);

const getMessageStatusClass = ($message: dxElementWrapper): string => {
  if ($message.hasClass(CLASSES.messagePending)) return MessageStatus.Pending;
  if ($message.hasClass(CLASSES.messageSuccess)) return MessageStatus.Success;
  if ($message.hasClass(CLASSES.messageError)) return MessageStatus.Failure;
  return '';
};

describe('AI Assistant error handling', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let validateSpy: ReturnType<typeof jest.spyOn>;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let executeCommandsSpy: ReturnType<typeof jest.spyOn>;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let buildResponseSchemaSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    beforeTest();
    jest.spyOn(errors, 'log').mockImplementation(jest.fn());

    validateSpy = jest.spyOn(GridCommands.prototype, 'validate')
      .mockReturnValue(true);
    executeCommandsSpy = jest.spyOn(GridCommands.prototype, 'executeCommands')
      .mockResolvedValue([
        { status: 'success', message: 'Done' },
      ] as CommandResult[]);
    buildResponseSchemaSpy = jest.spyOn(GridCommands.prototype, 'buildResponseSchema')
      .mockReturnValue({ type: 'object' });
  });

  afterEach(() => {
    validateSpy.mockRestore();
    executeCommandsSpy.mockRestore();
    buildResponseSchemaSpy.mockRestore();
    afterTest();
  });

  describe('no aiIntegration configured', () => {
    it('should fail message and log E1068 when aiIntegration is missing', async () => {
      const { instance } = await createDataGridWithAiAndPopup({
        aiAssistant: { enabled: true, title: 'AI Assistant' },
      });

      sendAiRequest(instance, 'Sort by name');

      const messages = await loadMessages(instance);

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
      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      getLastCallbacks().onError?.(new Error('Network error'));
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          errorText: 'Invalid response from the AI service. Please try again.',
          text: MessageStatus.Failure,
        }),
      ]);

      const $messages = findMessageElements();

      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Failure);
      expect($messages.eq(0).find(`.${CLASSES.messageErrorText}`).text())
        .toBe('Invalid response from the AI service. Please try again.');
    });
  });

  describe('invalid response', () => {
    it('should fail when response has no actions property', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      getLastCallbacks().onComplete?.({} as ExecuteGridAssistantCommandResult);
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
    });

    it('should fail when response has empty actions array', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      getLastCallbacks().onComplete?.({ actions: [] });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
    });

    it('should fail when response actions is not an array', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      getLastCallbacks().onComplete?.(
        { actions: 'invalid' } as unknown as ExecuteGridAssistantCommandResult,
      );
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
    });
  });

  describe('validation failure', () => {
    it('should fail when command validation returns false', async () => {
      validateSpy.mockReturnValue(false);

      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Invalid response from the AI service. Please try again.',
        }),
      ]);
    });
  });

  describe('execution already in progress', () => {
    it('should fail when commands are already executing', async () => {
      const isExecutingSpy = jest.spyOn(GridCommands.prototype, 'isExecuting')
        .mockReturnValue(true);

      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      const actions = [{ name: 'sort', args: { column: 'Name' } }];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          errorText: 'Execution already in progress. Please wait.',
        }),
      ]);

      isExecutingSpy.mockRestore();
    });
  });

  describe('schema build failure', () => {
    it('should fail when buildResponseSchema returns undefined', async () => {
      buildResponseSchemaSpy.mockReturnValue(undefined as never);

      const { instance } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');
      await flushAsync();

      const messages = await loadMessages(instance);

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
      const { instance } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      const controller = instance.getController('aiAssistant');
      controller.abortRequest();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          headerText: 'Failed to process request',
          errorText: 'Request stopped.',
        }),
      ]);
    });

    it('should render abort message in the DOM', async () => {
      const { instance } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      const controller = instance.getController('aiAssistant');
      controller.abortRequest();
      await flushAsync();

      const $messages = findMessageElements();

      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Failure);
      expect($messages.eq(0).find(`.${CLASSES.messageErrorText}`).text())
        .toBe('Request stopped.');
    });
  });

  describe('concurrent request rejection', () => {
    it('should reject second request while first is processing', async () => {
      const { instance } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'First request');

      const controller = instance.getController('aiAssistant');

      const secondPromise = controller.sendRequestToAI({
        author: { id: 'user', name: 'User' },
        text: 'Second request',
        timestamp: new Date().toISOString(),
      } as Message);
      secondPromise.catch(() => {});

      await expect(secondPromise)
        .rejects.toThrow('Request already in progress. Please wait.');

      const messages = await loadMessages(instance);

      expect(messages).toHaveLength(1);
    });
  });

  describe('request cancelled via onAIAssistantRequestCreating', () => {
    it('should fail message when cancel is set to true', async () => {
      const { instance } = await createDataGridWithAiAndPopup({
        onAIAssistantRequestCreating: (e: { cancel: boolean }): void => {
          e.cancel = true;
        },
      });

      sendAiRequest(instance, 'Sort by name');
      await flushAsync();

      const messages = await loadMessages(instance);

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

      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort and filter');

      const actions = [
        { name: 'sorting', args: { column: 'Name' } },
        { name: 'filtering', args: { column: 'Age' } },
      ];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Failure,
          commands: [
            { status: 'success', message: 'Sorted by Name' },
            { status: 'failure', message: 'Failed to filter' },
          ],
        }),
      ]);

      const $messages = findMessageElements();
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Failure);
    });

    it('should set failure status when commands contain aborted items', async () => {
      executeCommandsSpy.mockResolvedValue([
        { status: 'success', message: 'Sorted by Name' },
        { status: 'aborted', message: 'Execution Interrupted' },
      ] as CommandResult[]);

      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort and group');

      const actions = [
        { name: 'sorting', args: { column: 'Name' } },
        { name: 'grouping', args: { column: 'Name' } },
      ];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

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

      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by Name');

      const actions = [{ name: 'sorting', args: { column: 'Name' } }];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Success,
          headerText: 'Sorting',
          commands: [{ status: 'success', message: 'Sorted by Name ascending' }],
        }),
      ]);

      const $messages = findMessageElements();
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Success);
      expect($messages.eq(0).find(`.${CLASSES.actionListItemText}`).text())
        .toBe('Sorted by Name ascending');
    });

    it('should format headerText with "and" for multiple command names', async () => {
      executeCommandsSpy.mockResolvedValue([
        { status: 'success', message: 'Sorted' },
        { status: 'success', message: 'Filtered' },
      ] as CommandResult[]);

      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort and filter');

      const actions = [
        { name: 'sorting', args: { column: 'Name' } },
        { name: 'filtering', args: { column: 'Age' } },
      ];
      getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          headerText: 'Sorting and Filtering',
        }),
      ]);
    });
  });

  describe('delayed response', () => {
    it('should show pending status before response arrives', async () => {
      const { instance } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      const messagesBefore = await loadMessages(instance);

      expect(messagesBefore).toEqual([
        expect.objectContaining({
          status: MessageStatus.Pending,
          headerText: 'Request in progress',
        }),
      ]);

      const $messages = findMessageElements();
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Pending);
    });

    it('should transition from pending to success after delayed response', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      let messages = await loadMessages(instance);
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Pending,
      }));

      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sorting', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      messages = await loadMessages(instance);
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Success,
      }));
    });

    it('should transition from pending to failure after delayed error', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      let messages = await loadMessages(instance);
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Pending,
      }));

      getLastCallbacks().onError?.(new Error('Timeout'));
      await flushAsync();

      messages = await loadMessages(instance);
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Failure,
      }));
    });
  });

  describe('chat closed during processing', () => {
    it('should abort request and show failure after closing chat with confirm', async () => {
      const { instance } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by name');

      expect(findMessageElements().length).toBe(1);
      expect(getMessageStatusClass(findMessageElements().eq(0))).toBe(MessageStatus.Pending);

      const viewController = instance.getController('aiAssistantViewController');

      await viewController.toggle().catch(() => {});
      jest.runAllTimers();
      await flushAsync();

      const confirmDialogSelector = '.dx-datagrid-ai-assistant-confirm-dialog';
      const yesButton = document.querySelectorAll(
        `${confirmDialogSelector} .dx-button`,
      )[1] as HTMLElement;
      yesButton.click();
      jest.runAllTimers();
      await flushAsync();

      await viewController.toggle();
      jest.runAllTimers();
      await flushAsync();

      const $messages = findMessageElements();

      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Failure);
      expect($messages.eq(0).find(`.${CLASSES.messageErrorText}`).text())
        .toBe('Request stopped.');
    });
  });

  describe('regeneration after failure', () => {
    it('should reset to pending and then succeed after regeneration', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'Sort by Name');
      getLastCallbacks().onError?.(new Error('Network error'));
      await flushAsync();

      let $messages = findMessageElements();
      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Failure);

      const regenerateButton = $messages.eq(0)
        .find(`.${CLASSES.messageRegenerateButton}`).get(0) as HTMLElement;
      expect(regenerateButton).toBeTruthy();

      regenerateButton.click();
      jest.runAllTimers();
      await flushAsync();

      $messages = findMessageElements();
      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Pending);

      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sorting', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      $messages = findMessageElements();
      expect($messages.length).toBe(1);
      expect(getMessageStatusClass($messages.eq(0))).toBe(MessageStatus.Success);
    });

    it('should reject regeneration while another request is processing', async () => {
      const { instance } = await createDataGridWithAiAndPopup();

      sendAiRequest(instance, 'First request');

      const controller = instance.getController('aiAssistant');
      const store = controller.getMessageStore();

      const aiMessage: AIMessage = {
        id: 'assistant-old',
        author: { id: 'assistant' },
        text: MessageStatus.Failure,
        prompt: 'Old request',
        status: MessageStatus.Failure,
        headerText: 'Failed to process request',
        errorText: 'Network error',
      };

      await store.insert(aiMessage);

      const regeneratePromise = controller.sendRequestToAI(aiMessage);
      regeneratePromise.catch(() => {});

      await expect(regeneratePromise)
        .rejects.toThrow('Request already in progress. Please wait.');
    });
  });

  describe('customizeResponseTitle edge cases', () => {
    it('should handle customizeResponseTitle returning empty string', async () => {
      const mockIntegration = createMockAIIntegration();

      const { instance } = await createDataGridWithAiAndPopup({
        aiAssistant: {
          enabled: true,
          aiIntegration: mockIntegration.aiIntegration,
          title: 'AI Assistant',
          customizeResponseTitle: (): string => '',
        },
      });

      sendAiRequest(instance, 'Sort by name');

      const actions = [{ name: 'sorting', args: { column: 'Name' } }];
      mockIntegration.getLastCallbacks().onComplete?.({ actions });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

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
      const { instance } = await createDataGridWithAiAndPopup();

      const controller = instance.getController('aiAssistant');

      sendAiRequest(instance, 'Sort by name');

      const messagesBefore = await loadMessages(instance);
      expect(messagesBefore[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Pending,
      }));

      controller.dispose();
      await flushAsync();

      const messagesAfter = await loadMessages(instance);
      expect(messagesAfter[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Failure,
        errorText: 'Request stopped.',
      }));
    });
  });

  describe('resilience after consecutive failures', () => {
    it('should process request successfully after multiple prior failures', async () => {
      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup();
      const controller = instance.getController('aiAssistant');

      sendAiRequest(instance, 'Request 1');
      getLastCallbacks().onError?.(new Error('error 1'));
      await flushAsync();

      sendAiRequest(instance, 'Request 2');
      getLastCallbacks().onComplete?.({} as ExecuteGridAssistantCommandResult);
      await flushAsync();
      await flushAsync();

      sendAiRequest(instance, 'Request 3');
      controller.abortRequest();
      await flushAsync();

      sendAiRequest(instance, 'Request 4');
      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sorting', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

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

      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup({
        dataSource: remoteStore,
      });

      sendAiRequest(instance, 'Sort by name');

      getLastCallbacks().onError?.(new Error('Remote network error'));
      await flushAsync();

      const messages = await loadMessages(instance);

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

      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup({
        dataSource: remoteStore,
      });

      sendAiRequest(instance, 'Sort by name');

      getLastCallbacks().onComplete?.({
        actions: [{ name: 'sorting', args: { column: 'Name' } }],
      });
      await flushAsync();
      await flushAsync();

      const messages = await loadMessages(instance);

      expect(messages).toEqual([
        expect.objectContaining({
          status: MessageStatus.Success,
        }),
      ]);
    });

    it('should handle delayed remote data load with error response', async () => {
      const remoteStore = createRemoteDataSource(LOCAL_DATA, 100);

      const { instance, getLastCallbacks } = await createDataGridWithAiAndPopup({
        dataSource: remoteStore,
      });

      sendAiRequest(instance, 'Sort by name');

      let messages = await loadMessages(instance);
      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Pending,
      }));

      getLastCallbacks().onComplete?.({ actions: [] });
      await flushAsync();
      await flushAsync();

      messages = await loadMessages(instance);

      expect(messages[0]).toEqual(expect.objectContaining({
        status: MessageStatus.Failure,
        errorText: 'Invalid response from the AI service. Please try again.',
      }));
    });
  });
});
