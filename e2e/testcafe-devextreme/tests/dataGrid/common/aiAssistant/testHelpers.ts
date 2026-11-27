/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';

export const GRID_SELECTOR = '#container';

export const AI_INTEGRATION_PAGE = url(__dirname, '../../../container-ai-integration.html');

const HANG_MARKER = '__HANG__';
const FAIL_MARKER = '__FAIL__';
const DEFERRED_KEY = '__deferredResponse';

export const HANG = HANG_MARKER;

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

export const getRequestSchemaCommandNames = ClientFunction(
  (index: number) => ((window as any).__aiState.requests[index]
    .data.responseSchema.properties.actions.items.anyOf as any[])
    .map((branch) => branch.properties.name.enum[0] as string),
);
