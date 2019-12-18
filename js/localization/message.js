var $ = require('../core/renderer'),
    dependencyInjector = require('../core/utils/dependency_injector'),
    extend = require('../core/utils/extend').extend,
    each = require('../core/utils/iterator').each,
    stringFormat = require('../core/utils/string').format,
    humanize = require('../core/utils/inflector').humanize,
    coreLocalization = require('./core');

require('./core');

var PARENT_LOCALE_SEPARATOR = '-';

var baseDictionary = extend(true, {}, require('./default_messages'));

var parentLocales = require('./cldr-data/parentLocales');

var getParentLocale = function(locale) {
    var parentLocale = parentLocales[locale];

    if(parentLocale) {
        return parentLocale !== 'root' && parentLocale;
    }

    return locale.substr(0, locale.lastIndexOf(PARENT_LOCALE_SEPARATOR));
};

var getDataByLocale = function(localeData, locale) {
    return localeData[locale] || {};
};

var getValueByClosestLocale = function(localeData, locale, key) {
    var value = getDataByLocale(localeData, locale)[key],
        isRootLocale;

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

var newMessages = {};

var messageLocalization = dependencyInjector({
    _dictionary: baseDictionary,

    load: function(messages) {
        extend(true, this._dictionary, messages);
    },

    _localizablePrefix: '@',

    setup: function(localizablePrefix) {
        this._localizablePrefix = localizablePrefix;
    },

    localizeString: function(text) {
        var that = this,
            regex = new RegExp('(^|[^a-zA-Z_0-9' + that._localizablePrefix + '-]+)(' + that._localizablePrefix + '{1,2})([a-zA-Z_0-9-]+)', 'g'),
            escapeString = that._localizablePrefix + that._localizablePrefix;

        return text.replace(regex, function(str, prefix, escape, localizationKey) {
            var defaultResult = that._localizablePrefix + localizationKey,
                result;

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
        var that = this;

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
                            var localizedValue = that.localizeString(attr.value);

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
        var message = getValueByClosestLocale(this._dictionary, locale || coreLocalization.locale(), key);

        if(message) {
            return function() {
                var args = arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0].slice(0) : Array.prototype.slice.call(arguments, 0);
                args.unshift(message);
                return stringFormat.apply(this, args);
            };
        }
    },

    format: function(key) {
        var formatter = this.getFormatter(key);
        var values = Array.prototype.slice.call(arguments, 1);

        return formatter && formatter.apply(this, values) || '';
    }
});

module.exports = messageLocalization;
