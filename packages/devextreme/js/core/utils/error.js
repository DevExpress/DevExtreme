/* eslint-disable import/no-commonjs */
import { extend } from './extend';
import { logger } from './console';
import { format } from './string';
import { version } from '../version';

const ERROR_URL = 'http://js.devexpress.com/error/' + version.split('.').slice(0, 2).join('_') + '/';

export default function(baseErrors, errors) {

    const exports = {

        ERROR_MESSAGES: extend(errors, baseErrors),

        Error: function() {
            return makeError([].slice.call(arguments));
        },

        log: function(id) {
            let method = 'log';

            if(/^E\d+$/.test(id)) {
                method = 'error';
            } else if(/^W\d+$/.test(id)) {
                method = 'warn';
            }

            logger[method](method === 'log' ? id : combineMessage([].slice.call(arguments)));
        }
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
        return format.apply(this, ['{0} - {1}. See:\n{2}', id, details, getErrorUrl(id)]);
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
            url: url
        });
    }

    function getErrorUrl(id) {
        return ERROR_URL + id;
    }

    return exports;

}
