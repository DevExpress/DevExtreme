import { ClientFunction } from 'testcafe';

type WindowCallbackExtended =
  Window
  & typeof globalThis
  & {
    clientTesting?: {
      data: Record<string, any>;
      addCallbackResult: <T>(key: string, result: T) => void;
    };
  };

const initClientTesting = async (keyArray: string[]): Promise<void> => {
  await ClientFunction(
    () => {
      const extendedWindow = window as WindowCallbackExtended;
      extendedWindow.clientTesting = {
        data: keyArray.reduce((result, k) => {
          result[k] = [];
          return result;
        }, {}),
        addCallbackResult: (key: string, result: any) => {
          extendedWindow.clientTesting!.data[key].push(result);
        },
      };
    },
    { dependencies: { keyArray } },
  )();
};

const clearClientData = async (keyArray: string[]): Promise<void> => ClientFunction(
  () => {
    const extendedWindow = window as WindowCallbackExtended;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete extendedWindow.clientTesting;
  },
  { dependencies: { keyArray } },
)();

const getClientResults = async <T>(key: string): Promise<T[]> => ClientFunction(
  () => {
    const extendedWindow = window as WindowCallbackExtended;
    return extendedWindow.clientTesting!.data[key];
  },
  { dependencies: { key } },
)();

const CallbackTestHelper = {
  initClientTesting,
  clearClientData,
  getClientResults,
};

export type { WindowCallbackExtended };
export { CallbackTestHelper };
