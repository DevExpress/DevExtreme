import { extend } from '@js/core/utils/extend';
import { format } from '@js/core/utils/string';
import { version } from '@js/core/version';

import consoleUtils from './m_console';

const ERROR_URL = `https://js.devexpress.com/error/${version.split('.').slice(0, 2).join('_')}/`;

export interface DxError extends Error {
  __id: string;
  __details: string;
  url: string;
}

type ErrorMessages = Record<string, string>;

interface ErrorUtils {
  ERROR_MESSAGES: ErrorMessages;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the callers use it as any
  Error: (...args: unknown[]) => any;
  log: (...args: unknown[]) => void;
}

function error(baseErrors: ErrorMessages, errors?: ErrorMessages): ErrorUtils {
  function getErrorUrl(id: string): string {
    return ERROR_URL + id;
  }

  function formatDetails(id: string, args: unknown[]): string {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define -- exports comes below
    const formatArgs: [unknown, ...unknown[]] = [exports.ERROR_MESSAGES[id], ...args];
    return format.apply(this, formatArgs).replace(/\.*\s*?$/, '');
  }

  function formatMessage(id: string, details: string): string {
    const kind = id?.startsWith('W') ? 'warning' : 'error';
    return format.apply(this, ['{0} - {1}.\n\nFor additional information on this {2} message, see: {3}', id, details, kind, getErrorUrl(id)]);
  }

  function combineMessage(args: unknown[]): string {
    const id = args[0] as string;
    const details = args.slice(1);
    return formatMessage(id, formatDetails(id, details));
  }

  function makeError(args: unknown[]): DxError {
    const id = args[0] as string;
    const details = formatDetails(id, args.slice(1));
    const url = getErrorUrl(id);
    const message = formatMessage(id, details);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- extend is not typed
    return extend(new Error(message), {
      __id: id,
      __details: details,
      url,
    });
  }

  const exports: ErrorUtils = {

    ERROR_MESSAGES: extend(errors, baseErrors),

    Error: function Error(...args: unknown[]) {
      return makeError(args);
    },

    log(...args: unknown[]): void {
      const id = args[0] as string;
      let method: 'log' | 'error' | 'warn' = 'log';

      if (/^E\d+$/.test(id)) {
        method = 'error';
      } else if (/^W\d+$/.test(id)) {
        method = 'warn';
      }

      consoleUtils.logger[method](method === 'log' ? id : combineMessage(args));
    },
  };

  return exports;
}
export { error };
export default error;
