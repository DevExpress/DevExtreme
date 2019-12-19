require('./core');

var Globalize = require('globalize'),
    messageLocalization = require('../message'),
    coreLocalization = require('../core');

require('globalize/message');

if(Globalize && Globalize.formatMessage) {

    var DEFAULT_LOCALE = 'en';

    var originalLoadMessages = Globalize.loadMessages;

    Globalize.loadMessages = function(messages) {
        messageLocalization.load(messages);
    };

    var globalizeMessageLocalization = {
        ctor: function() {
            this.load(this._dictionary);
        },

        load: function(messages) {
            this.callBase(messages);
            originalLoadMessages(messages);
        },

        getMessagesByLocales: function() {
            return Globalize.cldr.get('globalize-messages');
        },

        getFormatter: function(key, locale) {
            var currentLocale = locale || coreLocalization.locale(),
                formatter = this._getFormatterBase(key, locale);

            if(!formatter) {
                formatter = this._formatterByGlobalize(key, locale);
            }

            if(!formatter && currentLocale !== DEFAULT_LOCALE) {
                formatter = this.getFormatter(key, DEFAULT_LOCALE);
            }

            return formatter;
        },

        _formatterByGlobalize: function(key, locale) {
            var currentGlobalize = !locale || locale === coreLocalization.locale() ? Globalize : new Globalize(locale),
                result;

            if(this._messageLoaded(key, locale)) {
                result = currentGlobalize.messageFormatter(key);
            }

            return result;
        },

        _messageLoaded: function(key, locale) {
            var currentCldr = locale ? new Globalize(locale).cldr : Globalize.locale(),
                value = currentCldr.get(['globalize-messages/{bundle}', key]);

            return !!value;
        },

        _loadSingle: function(key, value, locale) {
            var data = {};

            data[locale] = {};
            data[locale][key] = value;

            this.load(data);
        }
    };

    messageLocalization.inject(globalizeMessageLocalization);
}
