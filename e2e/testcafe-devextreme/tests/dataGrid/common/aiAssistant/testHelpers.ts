/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
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

export const HANG = '__HANG__';

export const FAIL = '__FAIL__';

// Every piece of test state lives under this single window key, so it is always
// replaced as a whole and no stale key can leak into the next test.
export const setupAIState = ClientFunction((
  base: Record<string, unknown>,
  responses: unknown[],
  hangMarker?: string,
  failMarker?: string,
) => {
  (window as any).__aiState = {
    base,
    responses,
    hangMarker,
    failMarker,
    callCount: 0,
    requests: [],
    abortCalled: false,
    assistantExtra: {},
    gridExtra: {},
  };
});

const aiGridOptions = (): any => {
  const state = (window as any).__aiState;

  return {
    ...state.base,
    ...state.gridExtra,
    aiAssistant: {
      enabled: true,
      aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
        sendRequest(params: any) {
          const count = state.callCount;
          const response = state.responses[count];

          state.callCount = count + 1;
          state.requests.push(params);

          const abort = (): void => { state.abortCalled = true; };

          if (response === state.hangMarker) {
            return { promise: new Promise(() => {}), abort };
          }

          if (response === state.failMarker) {
            return { promise: Promise.reject(new Error('AI error')), abort };
          }

          if (response === undefined) {
            return { promise: Promise.reject(new Error(`Unexpected AI call #${count}`)), abort };
          }

          return { promise: Promise.resolve(response), abort };
        },
      }),
      ...state.assistantExtra,
    },
  };
};

const setAIExtras = (
  assistantExtra: Record<string, unknown>,
  gridExtra: Record<string, unknown>,
): Promise<void> => ClientFunction(
  () => {
    (window as any).__aiState.assistantExtra = assistantExtra;
    (window as any).__aiState.gridExtra = gridExtra;
  },
  { dependencies: { assistantExtra, gridExtra } },
)();

export const createGridWithAIAssistant = async (
  base: Record<string, unknown>,
  responses: unknown[],
  assistantExtra: Record<string, unknown> = {},
  gridExtra: Record<string, unknown> = {},
): Promise<void> => {
  await setupAIState(base, responses, HANG, FAIL);
  await setAIExtras(assistantExtra, gridExtra);

  return createWidget('dxDataGrid', aiGridOptions);
};

export const getRequests = ClientFunction(() => (window as any).__aiState.requests);

export const getLoggedErrorIds = async (t: TestController): Promise<string[]> => {
  const consoleMessages = await t.getBrowserConsoleMessages();

  return (consoleMessages?.error ?? [])
    .map((message) => /^E\d+/.exec(message)?.[0])
    .filter((id): id is string => id !== undefined);
};
