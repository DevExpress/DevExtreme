import { getWindow } from '@js/core/utils/window';

const window = getWindow();

const getSessionStorage = function () {
  let sessionStorage;

  try {
    sessionStorage = window.sessionStorage;
  } catch (e) { /* empty */ }

  return sessionStorage;
};

export { getSessionStorage as sessionStorage };
