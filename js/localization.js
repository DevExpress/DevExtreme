"use strict";

let core = require("./localization/core");
let message = require("./localization/message");
let number = require("./localization/number");
let date = require("./localization/date");
require("./localization/currency");

/**
* @name localization
* @publicName localization
*/

/**
* @name localization_locale
* @publicName locale()
* @return string
* @static
* @module localization
* @export locale
*/

/**
* @name localization_locale
* @publicName locale(locale)
* @param1 locale:string
* @static
* @module localization
* @export locale
*/
exports.locale = core.locale.bind(core);

/**
* @name localization_loadMessages
* @publicName loadMessages(messages)
* @param1 messages:object
* @static
* @module localization
* @export loadMessages
*/
exports.loadMessages = message.load.bind(message);
/**
* @name localization_formatMessage
* @publicName formatMessage(key, value)
* @param1 key:string
* @param2 value:string|Array<string>
* @return string
* @static
* @module localization
* @export formatMessage
*/
exports.formatMessage = message.format.bind(message);

/**
* @name localization_formatNumber
* @publicName formatNumber(value, format)
* @param1 value:number
* @param2 format:format
* @return string
* @static
* @module localization
* @export formatNumber
*/
exports.formatNumber = number.format.bind(number);
/**
* @name localization_parseNumber
* @publicName parseNumber(text, format)
* @param1 text:string
* @param2 format:format
* @return number
* @static
* @module localization
* @export parseNumber
*/
exports.parseNumber = number.parse.bind(number);

/**
* @name localization_formatDate
* @publicName formatDate(value, format)
* @param1 value:date
* @param2 format:format
* @return string
* @static
* @module localization
* @export formatDate
*/
exports.formatDate = date.format.bind(date);
/**
* @name localization_parseDate
* @publicName parseDate(text, format)
* @param1 text:string
* @param2 format:format
* @return date
* @static
* @module localization
* @export parseDate
*/
exports.parseDate = date.parse.bind(date);

exports.message = message;
exports.number = number;
exports.date = date;
