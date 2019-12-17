var extend = require('./extend').extend,
    consoleUtils = require('./console'),
    stringUtils = require('./string'),
    version = require('../version');

var ERROR_URL = 'http://js.devexpress.com/error/' + version.split('.').slice(0, 2).join('_') + '/';

module.exports = function(baseErrors, errors) {

    var exports = {

        ERROR_MESSAGES: extend(errors, baseErrors),

        Error: function() {
            return makeError([].slice.call(arguments));
        },

        log: function(id) {
            var method = 'log';

            if(/^E\d+$/.test(id)) {
                method = 'error';
            } else if(/^W\d+$/.test(id)) {
                method = 'warn';
            }

            consoleUtils.logger[method](method === 'log' ? id : combineMessage([].slice.call(arguments)));
        }
    };

    var combineMessage = function(args) {
        var id = args[0];
        args = args.slice(1);
        return formatMessage(id, formatDetails(id, args));
    };

    var formatDetails = function(id, args) {
        args = [exports.ERROR_MESSAGES[id]].concat(args);
        return stringUtils.format.apply(this, args).replace(/\.*\s*?$/, '');
    };

    var formatMessage = function(id, details) {
        return stringUtils.format.apply(this, ['{0} - {1}. See:\n{2}', id, details, getErrorUrl(id)]);
    };

    var makeError = function(args) {
        var id, details, message, url;

        id = args[0];
        args = args.slice(1);
        details = formatDetails(id, args);
        url = getErrorUrl(id);
        message = formatMessage(id, details);

        return extend(new Error(message), {
            __id: id,
            __details: details,
            url: url
        });
    };

    var getErrorUrl = function(id) {
        return ERROR_URL + id;
    };

    return exports;

};
