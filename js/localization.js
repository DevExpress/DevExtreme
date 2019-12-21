let core = require('./localization/core');
let message = require('./localization/message');
let number = require('./localization/number');
let date = require('./localization/date');
require('./localization/currency');


exports.locale = core.locale.bind(core);

exports.loadMessages = message.load.bind(message);
exports.formatMessage = message.format.bind(message);

exports.formatNumber = number.format.bind(number);
exports.parseNumber = number.parse.bind(number);

exports.formatDate = date.format.bind(date);
exports.parseDate = date.parse.bind(date);

exports.message = message;
exports.number = number;
exports.date = date;

exports.disableIntl = () => {
    if(number.engine() === 'intl') {
        number.resetInjection();
    }
    if(date.engine() === 'intl') {
        date.resetInjection();
    }
};
