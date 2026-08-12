/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import type { AIAssistantChat } from 'devextreme-testcafe-models/dataGrid/aiAssistantChat';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

export const GRID_SELECTOR = '#container';

export const AI_INTEGRATION_PAGE = url(__dirname, '../../../container-ai-integration.html');

export const threeRows = [
  { id: 1, name: 'Alice', value: 30 },
  { id: 2, name: 'Bob', value: 20 },
  { id: 3, name: 'Charlie', value: 10 },
];

export const twoRows = [
  { id: 1, name: 'Alice', value: 30 },
  { id: 2, name: 'Bob', value: 20 },
];

export const baseGrid = {
  keyExpr: 'id',
  columns: ['id', 'name', 'value'],
  showBorders: true,
};

const HANG_MARKER = '__HANG__';
const FAIL_MARKER = '__FAIL__';
const DEFERRED_KEY = '__deferredResponse';

export const HANG = HANG_MARKER;

export const FAIL = FAIL_MARKER;

export const deferred = (response: unknown): unknown => ({ [DEFERRED_KEY]: response });

export const resetAIState = (): Promise<void> => ClientFunction(
  () => {
    const w = window as any;
    const state: any = {
      base: {},
      gridExtra: {},
      assistantExtra: {},
      responses: [],
      callCount: 0,
      requests: [],
      abortCalled: false,
      requestResolved: false,
      selectAllStarted: false,
    };

    state.sendRequest = (params: any): any => {
      const count = state.callCount;
      const response = state.responses[count];

      state.callCount = count + 1;
      state.requests.push(params);

      const abort = (): void => { state.abortCalled = true; };

      if (response === undefined) {
        return { promise: Promise.reject(new Error(`Unexpected AI call #${count}`)), abort };
      }

      if (response === HANG_MARKER) {
        return { promise: new Promise(() => {}), abort };
      }

      if (response === FAIL_MARKER) {
        return { promise: Promise.reject(new Error('AI error')), abort };
      }

      if (response?.[DEFERRED_KEY] !== undefined) {
        return {
          promise: new Promise((resolve) => {
            state.resolveRequest = (): void => {
              state.requestResolved = true;
              resolve(response[DEFERRED_KEY]);
            };
          }),
          abort,
        };
      }

      return { promise: Promise.resolve(response), abort };
    };

    state.gridOptions = (): any => ({
      ...state.base,
      ...state.gridExtra,
      aiAssistant: {
        enabled: true,
        aiIntegration: new w.DevExpress.aiIntegration.AIIntegration({
          sendRequest: state.sendRequest,
        }),
        ...state.assistantExtra,
      },
    });

    w.__aiState = state;
  },
  { dependencies: { HANG_MARKER, FAIL_MARKER, DEFERRED_KEY } },
)();

export const setupAIState = (
  state: Record<string, unknown>,
): Promise<void> => ClientFunction(
  () => { Object.assign((window as any).__aiState, state); },
  { dependencies: { state } },
)();

const aiGridOptions = (): any => (window as any).__aiState.gridOptions();

const remoteGridOptions = (): any => {
  const w = window as any;
  const arrayStore = new w.DevExpress.data.ArrayStore({ key: 'id', data: w.__aiState.remoteData });
  const store = new w.DevExpress.data.CustomStore({
    key: 'id',
    load: (loadOptions: any) => Promise.all([
      arrayStore.load(loadOptions),
      arrayStore.totalCount(loadOptions),
    ]).then(([data, totalCount]: any[]) => ({ data, totalCount })),
  });

  return { ...w.__aiState.gridOptions(), dataSource: store, remoteOperations: true };
};

const noIntegrationGridOptions = (): any => ({
  ...(window as any).__aiState.base,
  aiAssistant: { enabled: true },
});

const deferredSelectAllGridOptions = (): any => {
  const w = window as any;
  const data = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    value: (i + 1) * 10,
  }));

  const store = new w.DevExpress.data.CustomStore({
    key: 'id',
    load(loadOptions: any) {
      if (loadOptions.take !== undefined) {
        const skip = loadOptions.skip ?? 0;

        return Promise.resolve({
          data: data.slice(skip, skip + loadOptions.take),
          totalCount: data.length,
        });
      }

      w.__aiState.selectAllStarted = true;

      return new Promise((resolve) => {
        w.__aiState.resolveSelectAll = resolve.bind(resolve, data);
      });
    },
    totalCount: () => data.length,
  });

  return {
    ...w.__aiState.gridOptions(),
    dataSource: store,
    remoteOperations: true,
    selection: { mode: 'multiple' },
  };
};

export const createGridWithAIAssistant = async (
  base: Record<string, unknown>,
  responses: unknown[],
  assistantExtra: Record<string, unknown> = {},
  gridExtra: Record<string, unknown> = {},
): Promise<void> => {
  await resetAIState();
  await setupAIState({
    base, responses, assistantExtra, gridExtra,
  });

  return createWidget('dxDataGrid', aiGridOptions);
};

export const createRemoteGridWithAIAssistant = async (
  remoteData: unknown[],
  base: Record<string, unknown>,
  responses: unknown[],
): Promise<void> => {
  await resetAIState();
  await setupAIState({ base, responses, remoteData });

  return createWidget('dxDataGrid', remoteGridOptions);
};

export const createGridWithoutAIIntegration = async (
  base: Record<string, unknown>,
): Promise<void> => {
  await resetAIState();
  await setupAIState({ base });

  return createWidget('dxDataGrid', noIntegrationGridOptions);
};

export const createGridWithDeferredSelectAll = async (
  responses: unknown[],
  assistantExtra: Record<string, unknown> = {},
): Promise<void> => {
  await resetAIState();
  await setupAIState({
    base: { columns: ['id', 'name', 'value'], showBorders: true },
    responses,
    assistantExtra,
  });

  return createWidget('dxDataGrid', deferredSelectAllGridOptions);
};

export const getAICallCount = ClientFunction(
  () => (window as any).__aiState.callCount as number,
);

export const getRequestCount = ClientFunction(
  () => (window as any).__aiState.requests.length as number,
);

export const getRequestPayload = ClientFunction(
  (index: number) => (window as any).__aiState.requests[index].data,
);

export const getRequestText = ClientFunction(
  (index: number) => (window as any).__aiState.requests[index].data.text as string,
);

export const getRequestColumnNames = ClientFunction(
  (index: number) => ((window as any).__aiState.requests[index].data.context.columns ?? [])
    .map((column: any) => column.dataField as string),
);

export const getRequestSchemaCommandNames = ClientFunction(
  (index: number) => ((window as any).__aiState.requests[index]
    .data.responseSchema.properties.actions.items.anyOf as any[])
    .map((branch) => branch.properties.name.enum[0] as string),
);

export const getRequestCreatingArgs = ClientFunction(
  () => (window as any).__aiState.requestCreatingArgs,
);

export const wasAbortCalled = ClientFunction(
  () => (window as any).__aiState.abortCalled === true,
);

export const wasAIRequestResolved = ClientFunction(
  () => (window as any).__aiState.requestResolved === true,
);

export const resolveAIRequest = ClientFunction(
  () => { (window as any).__aiState.resolveRequest(); },
);

export const wasSelectAllStarted = ClientFunction(
  () => (window as any).__aiState.selectAllStarted === true,
);

export const resolveSelectAll = ClientFunction(
  () => { (window as any).__aiState.resolveSelectAll(); },
);

export const disposeGrid = ClientFunction(() => { (window as any).widget.dispose(); });

export const getSelectedRowsCount = ClientFunction(
  () => (window as any).widget.getSelectedRowsData().length as number,
);

export const formatMessage = ClientFunction(
  (key: string) => (window as any).DevExpress.localization.formatMessage(key) as string,
);

export const closeChatAndConfirmAbort = async (
  t: TestController,
  aiChat: AIAssistantChat,
): Promise<void> => {
  await t.click(aiChat.getCloseButton().element);

  const abortConfirmDialog = aiChat.getAbortConfirmDialog();

  await t.expect(abortConfirmDialog.element.exists).ok();
  await t.click(abortConfirmDialog.getConfirmButton().element);
};

export const getLoggedErrorIds = async (t: TestController): Promise<string[]> => {
  const consoleMessages = await t.getBrowserConsoleMessages();

  return (consoleMessages?.error ?? [])
    .map((message) => /^E\d+/.exec(message)?.[0])
    .filter((id): id is string => id !== undefined);
};
