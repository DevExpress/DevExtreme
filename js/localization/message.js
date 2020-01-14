const $ = require('../core/renderer');
const dependencyInjector = require('../core/utils/dependency_injector');
const extend = require('../core/utils/extend').extend;
const each = require('../core/utils/iterator').each;
const stringFormat = require('../core/utils/string').format;
const humanize = require('../core/utils/inflector').humanize;
const coreLocalization = require('./core');

require('./core');

const PARENT_LOCALE_SEPARATOR = '-';

const baseDictionary = extend(true, {}, require('./default_messages'));

const parentLocales = require('./cldr-data/parentLocales');

const getParentLocale = function(locale) {
    const parentLocale = parentLocales[locale];

    if(parentLocale) {
        return parentLocale !== 'root' && parentLocale;
    }

    return locale.substr(0, locale.lastIndexOf(PARENT_LOCALE_SEPARATOR));
};

const getDataByLocale = function(localeData, locale) {
    return localeData[locale] || {};
};

const getValueByClosestLocale = function(localeData, locale, key) {
    let value = getDataByLocale(localeData, locale)[key];
    let isRootLocale;

    while(!value && !isRootLocale) {
        locale = getParentLocale(locale);

        if(locale) {
            value = getDataByLocale(localeData, locale)[key];
        } else {
            isRootLocale = true;
        }
    }

    return value;
};

const newMessages = {};

const messageLocalization = dependencyInjector({
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

        return text.replace(regex, function(str, prefix, escape, localizationKey) {
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

    _messageLoaded: function(key, locale) {
        return getValueByClosestLocale(this._dictionary, locale || coreLocalization.locale(), key) !== undefined;
    },

    localizeNode: function(node) {
        const that = this;

        $(node).each(function(index, nodeItem) {
            if(!nodeItem.nodeType) {
                return;
            }

            if(nodeItem.nodeType === 3) {
                nodeItem.nodeValue = that.localizeString(nodeItem.nodeValue);
            } else {
                if(!$(nodeItem).is('iframe')) { // T199912
                    each(nodeItem.attributes || [], function(index, attr) {
                        if(typeof attr.value === 'string') {
                            const localizedValue = that.localizeString(attr.value);

                            if(attr.value !== localizedValue) {
                                attr.value = localizedValue;
                            }
                        }
                    });

                    $(nodeItem).contents().each(function(index, node) {
                        that.localizeNode(node);
                    });
                }
            }
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
        const message = getValueByClosestLocale(this._dictionary, locale || coreLocalization.locale(), key);

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

module.exports = messageLocalization;
