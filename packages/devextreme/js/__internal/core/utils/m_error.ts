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

type ErrorArgs = [id: string, ...details: unknown[]];

interface ErrorFactory {
  (id: string, ...details: unknown[]): DxError;
  new (id: string, ...details: unknown[]): DxError;
}

interface ErrorUtils {
  ERROR_MESSAGES: ErrorMessages;
  Error: ErrorFactory;
  log: (id: string, ...details: unknown[]) => void;
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

  function combineMessage([id, ...details]: ErrorArgs): string {
    return formatMessage(id, formatDetails(id, details));
  }

  function makeError([id, ...args]: ErrorArgs): DxError {
    const details = formatDetails(id, args);
    const url = getErrorUrl(id);
    const message = formatMessage(id, details);

    return extend(new Error(message), {
      __id: id,
      __details: details,
      url,
    });
  }

  const exports: ErrorUtils = {

    ERROR_MESSAGES: extend(errors, baseErrors),

    Error: function Error(...args: ErrorArgs): DxError {
      return makeError(args);
    } as ErrorFactory,

    log(...args: ErrorArgs): void {
      const [id] = args;
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
