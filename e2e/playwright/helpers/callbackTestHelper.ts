import type { Page } from '@playwright/test';

type WindowCallbackExtended = Window
  & typeof globalThis
  & {
    clientTesting?: {
      data: Record<string, any>;
      addCallbackResult: <T>(key: string, result: T) => void;
    };
  };

const initClientTesting = async (page: Page, keyArray: string[]): Promise<void> => page.evaluate(
  (keys) => {
    const extendedWindow = window as WindowCallbackExtended;

    extendedWindow.clientTesting = {
      data: Object.fromEntries(keys.map((key) => [key, []])),
      addCallbackResult: (key: string, result: any) => {
        extendedWindow.clientTesting!.data[key].push(result);
      },
    };
  },
  keyArray,
);

const clearClientData = async (page: Page): Promise<void> => page.evaluate(() => {
  delete (window as WindowCallbackExtended).clientTesting;
});

const getClientResults = async <T>(page: Page, key: string): Promise<T[]> => page.evaluate(
  (name) => (window as WindowCallbackExtended).clientTesting!.data[name],
  key,
);

const CallbackTestHelper = {
  initClientTesting,
  clearClientData,
  getClientResults,
};

export type { WindowCallbackExtended };
export { CallbackTestHelper };
