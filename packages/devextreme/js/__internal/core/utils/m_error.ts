/* eslint-disable import/no-commonjs */
import { logger } from '@js/core/utils/console';
import { extend } from '@js/core/utils/extend';
import { format } from '@js/core/utils/string';
import { version } from '@js/core/version';

const ERROR_URL = `https://js.devexpress.com/error/${version.split('.').slice(0, 2).join('_')}/`;

function error(baseErrors, errors?) {
  const exports = {

    ERROR_MESSAGES: extend(errors, baseErrors),

    // eslint-disable-next-line object-shorthand
    Error: function (...args) {
      return makeError(args);
    },

    log(...args) {
      const id = args[0];
      let method = 'log';

      if (/^E\d+$/.test(id)) {
        method = 'error';
      } else if (/^W\d+$/.test(id)) {
        method = 'warn';
      }

      logger[method](method === 'log' ? id : combineMessage(args));
    },
  };

  function combineMessage(args) {
    const id = args[0];
    args = args.slice(1);
    return formatMessage(id, formatDetails(id, args));
  }

  function formatDetails(id, args) {
    args = [exports.ERROR_MESSAGES[id]].concat(args);
    return format.apply(this, args).replace(/\.*\s*?$/, '');
  }

  function formatMessage(id, details) {
    const kind = id?.startsWith('W') ? 'warning' : 'error';
    return format.apply(this, ['{0} - {1}.\n\nFor additional information on this {2} message, see: {3}', id, details, kind, getErrorUrl(id)]);
  }

  function makeError(args) {
    const id = args[0];
    args = args.slice(1);
    const details = formatDetails(id, args);
    const url = getErrorUrl(id);
    const message = formatMessage(id, details);

    return extend(new Error(message), {
      __id: id,
      __details: details,
      url,
    });
  }

  function getErrorUrl(id) {
    return ERROR_URL + id;
  }

  return exports;
}
export { error };
