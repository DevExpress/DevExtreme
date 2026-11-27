/* eslint-disable no-underscore-dangle */
import type { Page } from '@playwright/test';
import { expect } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import type AIAssistantChat from '../../../../models/dataGrid/aiAssistantChat';
import { typeText } from '../../helpers/typeText';

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

const MARKERS = {
  hang: '__HANG__',
  fail: '__FAIL__',
  deferredKey: '__deferredResponse',
};

export const HANG = MARKERS.hang;

export const FAIL = MARKERS.fail;

export const deferred = (response: unknown): unknown => ({ [MARKERS.deferredKey]: response });

type Options = Record<string, unknown>;

// A callback can't pass through the arguments of "evaluate", so options that hold one come as a
// factory, which runs in the page.
type PageOptions = Options | (() => Options);

export const resetAIState = (page: Page): Promise<void> => page.evaluate(({
  hang, fail, deferredKey,
}) => {
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

    if (response === hang) {
      return { promise: new Promise(() => {}), abort };
    }

    if (response === fail) {
      return { promise: Promise.reject(new Error('AI error')), abort };
    }

    if (response?.[deferredKey] !== undefined) {
      return {
        promise: new Promise((resolve) => {
          state.resolveRequest = (): void => {
            state.requestResolved = true;
            resolve(response[deferredKey]);
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
}, MARKERS);

export const setupAIState = async (page: Page, state: Record<string, unknown>): Promise<void> => {
  const entries = await Promise.all(Object.entries(state).map(async ([key, value]) => [
    key,
    typeof value === 'function' ? await page.evaluateHandle(value as () => unknown) : value,
  ]));

  await page.evaluate((values) => {
    Object.assign((window as any).__aiState, values);
  }, Object.fromEntries(entries));
};

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
  page: Page,
  base: PageOptions,
  responses: unknown[],
  assistantExtra: PageOptions = {},
  gridExtra: PageOptions = {},
): Promise<void> => {
  await resetAIState(page);
  await setupAIState(page, {
    base, responses, assistantExtra, gridExtra,
  });

  return createWidget(page, 'dxDataGrid', aiGridOptions);
};

export const createRemoteGridWithAIAssistant = async (
  page: Page,
  remoteData: unknown[],
  base: PageOptions,
  responses: unknown[],
): Promise<void> => {
  await resetAIState(page);
  await setupAIState(page, { base, responses, remoteData });

  return createWidget(page, 'dxDataGrid', remoteGridOptions);
};

export const createGridWithoutAIIntegration = async (
  page: Page,
  base: PageOptions,
): Promise<void> => {
  await resetAIState(page);
  await setupAIState(page, { base });

  return createWidget(page, 'dxDataGrid', noIntegrationGridOptions);
};

export const createGridWithDeferredSelectAll = async (
  page: Page,
  responses: unknown[],
  assistantExtra: PageOptions = {},
): Promise<void> => {
  await resetAIState(page);
  await setupAIState(page, {
    base: { columns: ['id', 'name', 'value'], showBorders: true },
    responses,
    assistantExtra,
  });

  return createWidget(page, 'dxDataGrid', deferredSelectAllGridOptions);
};

export const getAICallCount = (page: Page): Promise<number> => page.evaluate(
  () => (window as any).__aiState.callCount,
);

export const getRequestCount = (page: Page): Promise<number> => page.evaluate(
  () => (window as any).__aiState.requests.length,
);

export const getRequestPayload = (page: Page, index: number): Promise<any> => page.evaluate(
  (requestIndex) => (window as any).__aiState.requests[requestIndex].data,
  index,
);

export const getRequestText = (page: Page, index: number): Promise<string> => page.evaluate(
  (requestIndex) => (window as any).__aiState.requests[requestIndex].data.text,
  index,
);

export const getRequestColumnNames = (
  page: Page,
  index: number,
): Promise<string[]> => page.evaluate(
  (requestIndex) => ((window as any).__aiState.requests[requestIndex].data.context.columns ?? [])
    .map((column: any) => column.dataField),
  index,
);

export const getRequestSchemaCommandNames = (
  page: Page,
  index: number,
): Promise<string[]> => page.evaluate(
  (requestIndex) => ((window as any).__aiState.requests[requestIndex]
    .data.responseSchema.properties.actions.items.anyOf as any[])
    .map((branch) => branch.properties.name.enum[0]),
  index,
);

export const getRequestCreatingArgs = (page: Page): Promise<any> => page.evaluate(
  () => (window as any).__aiState.requestCreatingArgs,
);

export const wasAbortCalled = (page: Page): Promise<boolean> => page.evaluate(
  () => (window as any).__aiState.abortCalled === true,
);

export const wasAIRequestResolved = (page: Page): Promise<boolean> => page.evaluate(
  () => (window as any).__aiState.requestResolved === true,
);

export const resolveAIRequest = (page: Page): Promise<void> => page.evaluate(
  () => { (window as any).__aiState.resolveRequest(); },
);

export const wasSelectAllStarted = (page: Page): Promise<boolean> => page.evaluate(
  () => (window as any).__aiState.selectAllStarted === true,
);

export const resolveSelectAll = (page: Page): Promise<void> => page.evaluate(
  () => { (window as any).__aiState.resolveSelectAll(); },
);

export const disposeGrid = (page: Page): Promise<void> => page.evaluate(
  () => { (window as any).widget.dispose(); },
);

export const getSelectedRowsCount = (page: Page): Promise<number> => page.evaluate(
  () => (window as any).widget.getSelectedRowsData().length,
);

export const formatMessage = (page: Page, key: string): Promise<string> => page.evaluate(
  (messageKey) => (window as any).DevExpress.localization.formatMessage(messageKey),
  key,
);

export const openChat = async (
  page: Page,
): Promise<{ dataGrid: DataGrid; aiChat: AIAssistantChat }> => {
  const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

  await expect.poll(() => dataGrid.isReady()).toBe(true);

  await dataGrid.getAIAssistantButton().click();

  return { dataGrid, aiChat: dataGrid.getAIAssistantChat() };
};

export const submit = async (
  page: Page,
  aiChat: AIAssistantChat,
  prompt: string,
): Promise<void> => {
  await typeText(aiChat.getInput(), prompt);
  await page.keyboard.press('Enter');
};

export const openChatAndSubmit = async (
  page: Page,
  prompt: string,
): Promise<{ dataGrid: DataGrid; aiChat: AIAssistantChat }> => {
  const { dataGrid, aiChat } = await openChat(page);

  await submit(page, aiChat, prompt);

  return { dataGrid, aiChat };
};

export const closeChatAndConfirmAbort = async (aiChat: AIAssistantChat): Promise<void> => {
  await aiChat.getCloseButton().element.click();

  const abortConfirmDialog = aiChat.getAbortConfirmDialog();

  await expect(abortConfirmDialog).toBeVisible();
  await abortConfirmDialog.getByRole('button', { name: 'Yes' }).click();
};

// The console errors of the page from the moment of the call on.
export const collectConsoleErrors = (page: Page): string[] => {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  return errors;
};

export const getLoggedErrorIds = (consoleErrors: string[]): string[] => consoleErrors
  .map((message) => /^E\d+/.exec(message)?.[0])
  .filter((id): id is string => id !== undefined);
