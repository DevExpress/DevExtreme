import dependencyInjector from '../../../core/utils/dependency_injector';
import { extend } from '../../../core/utils/extend';
import { format as stringFormat } from '../../../core/utils/string';
import { humanize } from '../../../core/utils/inflector';
import coreLocalization from './core';
import { defaultMessages } from './default_messages';

const baseDictionary = extend(true, {}, defaultMessages);

const getDataByLocale = (localeData, locale) => {
    return localeData[locale]
        || (locale?.toLowerCase && Object.entries(localeData).find(
            ([key,]) => key.toLowerCase() === locale.toLowerCase())?.[1])
        || {};
};

const newMessages = {};

const messageLocalization = dependencyInjector({
    engine: function() {
        return 'base';
    },

    _dictionary: baseDictionary,

    load: function(messages) {
        extend(true, this._dictionary, messages);
    },

    _localizablePrefix: '@',

    setup: function(localizablePrefix) {
        this._localizablePrefix = localizablePrefix;
    },

    localizeString: function(text) {
        const that = this;
        const regex = new RegExp('(^|[^a-zA-Z_0-9' + that._localizablePrefix + '-]+)(' + that._localizablePrefix + '{1,2})([a-zA-Z_0-9-]+)', 'g');
        const escapeString = that._localizablePrefix + that._localizablePrefix;

        return text.replace(regex, (str, prefix, escape, localizationKey) => {
            const defaultResult = that._localizablePrefix + localizationKey;
            let result;

            if(escape !== escapeString) {
                result = that.format(localizationKey);
            }

            if(!result) {
                newMessages[localizationKey] = humanize(localizationKey);
            }

            return prefix + (result || defaultResult);
        });
    },

    getMessagesByLocales: function() {
        return this._dictionary;
    },

    getDictionary: function(onlyNew) {
        if(onlyNew) {
            return newMessages;
        }
        return extend({}, newMessages, this.getMessagesByLocales()[coreLocalization.locale()]);
    },

    getFormatter: function(key) {
        return this._getFormatterBase(key) || this._getFormatterBase(key, 'en');
    },

    _getFormatterBase: function(key, locale) {
        const message = coreLocalization.getValueByClosestLocale((locale) => getDataByLocale(this._dictionary, locale)[key]);

        if(message) {
            return function() {
                const args = arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0].slice(0) : Array.prototype.slice.call(arguments, 0);
                args.unshift(message);
                return stringFormat.apply(this, args);
            };
        }
    },

    format: function(key) {
        const formatter = this.getFormatter(key);
        const values = Array.prototype.slice.call(arguments, 1);

        return formatter && formatter.apply(this, values) || '';
    }
});

export default messageLocalization;
