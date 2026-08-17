import { getWindow } from '@js/core/utils/window';

const window = getWindow();

const getSessionStorage = function (): Storage | undefined {
  let sessionStorage: Storage | undefined;

  try {
    sessionStorage = window.sessionStorage;
  } catch (e) { /* empty */ }

  return sessionStorage;
};

export { getSessionStorage as sessionStorage };
