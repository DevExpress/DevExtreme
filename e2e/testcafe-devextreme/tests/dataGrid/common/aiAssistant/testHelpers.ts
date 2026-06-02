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

export const setupAIState = ClientFunction((
  base: Record<string, unknown>,
  responses: unknown[],
  hangMarker?: string,
  failMarker?: string,
) => {
  (window as any).__aiBase = base;
  (window as any).__aiResponses = responses;
  (window as any).__aiCallCount = 0;
  (window as any).__aiRequests = [];
  (window as any).__aiAbortCalled = false;
  (window as any).__aiAssistantExtra = {};
  (window as any).__aiGridExtra = {};
  (window as any).__aiHangMarker = hangMarker;
  (window as any).__aiFailMarker = failMarker;
});

const aiGridOptions = (): any => ({
  ...(window as any).__aiBase,
  ...((window as any).__aiGridExtra ?? {}),
  aiAssistant: {
    enabled: true,
    aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
      sendRequest(params: any) {
        const count = (window as any).__aiCallCount;
        const response = (window as any).__aiResponses[count];

        (window as any).__aiCallCount = count + 1;
        (window as any).__aiRequests.push(params);

        const abort = (): void => { (window as any).__aiAbortCalled = true; };

        if (response === (window as any).__aiHangMarker) {
          return { promise: new Promise(() => {}), abort };
        }

        if (response === (window as any).__aiFailMarker) {
          return { promise: Promise.reject(new Error('AI error')), abort };
        }

        if (response === undefined) {
          return { promise: Promise.reject(new Error(`Unexpected AI call #${count}`)), abort };
        }

        return { promise: Promise.resolve(response), abort };
      },
    }),
    ...((window as any).__aiAssistantExtra ?? {}),
  },
});

const setAIExtras = (
  assistantExtra: Record<string, unknown>,
  gridExtra: Record<string, unknown>,
): Promise<void> => ClientFunction(
  () => {
    (window as any).__aiAssistantExtra = assistantExtra;
    (window as any).__aiGridExtra = gridExtra;
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

export const getRequests = ClientFunction(() => (window as any).__aiRequests);

export const getRequestColumnNames = ClientFunction(
  (index: number) => (window as any).__aiRequests[index].data.context.columns
    .map((c: any) => c.dataField),
);

export const formatMessage = ClientFunction(
  (key: string) => (window as any).DevExpress.localization.formatMessage(key),
);
