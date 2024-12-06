const messageLocalization = require('common/core/localization/message');
const localization = require('localization');

const dictionaries = {};
dictionaries['ar'] = require('localization/messages/ar.json!');
dictionaries['ca'] = require('localization/messages/ca.json!');
dictionaries['cs'] = require('localization/messages/cs.json!');
dictionaries['de'] = require('localization/messages/de.json!');
dictionaries['el'] = require('localization/messages/el.json!');
dictionaries['en'] = require('localization/messages/en.json!');
dictionaries['es'] = require('localization/messages/es.json!');
dictionaries['fi'] = require('localization/messages/fi.json!');
dictionaries['fr'] = require('localization/messages/fr.json!');
dictionaries['hu'] = require('localization/messages/hu.json!');
dictionaries['it'] = require('localization/messages/it.json!');
dictionaries['ja'] = require('localization/messages/ja.json!');
dictionaries['lt'] = require('localization/messages/lt.json!');
dictionaries['lv'] = require('localization/messages/lv.json!');
dictionaries['nb'] = require('localization/messages/nb.json!');
dictionaries['nl'] = require('localization/messages/nl.json!');
dictionaries['pt'] = require('localization/messages/pt.json!');
dictionaries['ro'] = require('localization/messages/ro.json!');
dictionaries['ru'] = require('localization/messages/ru.json!');
dictionaries['sl'] = require('localization/messages/sl.json!');
dictionaries['sv'] = require('localization/messages/sv.json!');
dictionaries['tr'] = require('localization/messages/tr.json!');
dictionaries['vi'] = require('localization/messages/vi.json!');
dictionaries['zh-tw'] = require('localization/messages/zh-tw.json!');
dictionaries['zh'] = require('localization/messages/zh.json!');
dictionaries['fa'] = require('localization/messages/fa.json!');

const LOCALES = [
    'ar', 'ca', 'cs', 'de', 'el',
    'es', 'fa', 'fi', 'fr', 'hu',
    'it', 'ja', 'lt', 'lv', 'nb',
    'nl', 'pt', 'ro', 'ru', 'sl',
    'sv', 'tr', 'vi', 'zh-tw', 'zh'
];

LOCALES.forEach(locale => {
    localization.loadMessages(dictionaries[locale]);
});

QUnit.module('Locales of DevExtreme', {
    before() {
        this.cultures = messageLocalization.getMessagesByLocales();
        this.textConstantNames = Object.keys(this.cultures['en']);
    }
}, () => {
    LOCALES.forEach(locale => {
        QUnit.test(locale, function(assert) {
            const localeMessages = this.cultures[locale];

            this.textConstantNames.forEach((textConstantName) => {
                const localValue = localeMessages[textConstantName];

                if(localValue) {
                    if(localValue === '!TODO!') {
                        assert.ok(false, `The ${textConstantName} key is localized as "!TODO!" in the ${locale} locale. Please provide a valid translation for this key.`);
                    } else {
                        assert.ok(true, `${textConstantName} is localized in the ${locale} locale.`);
                    }
                } else {
                    assert.ok(false, `The ${locale} locale is missing the ${textConstantName} key. Run the "build:community-localization" script to fix this.`);
                }
            });
        });
    });
});
