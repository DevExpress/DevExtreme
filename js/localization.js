"use strict";

/**
* @name localization
* @publicName localization
*/

/**
* @name localization_locale
* @publicName locale()
* @return string
* @module localization
* @export locale
*/

/**
* @name localization_locale
* @publicName locale(locale)
* @param1 locale:string
* @module localization
* @export locale
*/
exports.locale = require("./localization/core").locale;

/**
* @name localization_loadMessages
* @publicName loadMessages()
* @param1 messages:object
* @module localization
* @export loadMessages
*/
exports.loadMessages = require("./localization/message").load;

exports.message = require("./localization/message");
exports.number = require("./localization/number");
exports.date = require("./localization/date");
exports.currency = require("./localization/currency");
