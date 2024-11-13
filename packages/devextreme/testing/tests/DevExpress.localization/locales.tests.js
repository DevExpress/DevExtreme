const messageLocalization = require('common/core/localization/message');
const localization = require('localization');

const dictionaries = {};
dictionaries['ar'] = require('common/core/localization/messages/ar.json!');
dictionaries['ca'] = require('common/core/localization/messages/ca.json!');
dictionaries['cs'] = require('common/core/localization/messages/cs.json!');
dictionaries['de'] = require('common/core/localization/messages/de.json!');
dictionaries['el'] = require('common/core/localization/messages/el.json!');
dictionaries['en'] = require('common/core/localization/messages/en.json!');
dictionaries['es'] = require('common/core/localization/messages/es.json!');
dictionaries['fi'] = require('common/core/localization/messages/fi.json!');
dictionaries['fr'] = require('common/core/localization/messages/fr.json!');
dictionaries['hu'] = require('common/core/localization/messages/hu.json!');
dictionaries['it'] = require('common/core/localization/messages/it.json!');
dictionaries['ja'] = require('common/core/localization/messages/ja.json!');
dictionaries['lt'] = require('common/core/localization/messages/lt.json!');
dictionaries['lv'] = require('common/core/localization/messages/lv.json!');
dictionaries['nb'] = require('common/core/localization/messages/nb.json!');
dictionaries['nl'] = require('common/core/localization/messages/nl.json!');
dictionaries['pt'] = require('common/core/localization/messages/pt.json!');
dictionaries['ro'] = require('common/core/localization/messages/ro.json!');
dictionaries['ru'] = require('common/core/localization/messages/ru.json!');
dictionaries['sl'] = require('common/core/localization/messages/sl.json!');
dictionaries['sv'] = require('common/core/localization/messages/sv.json!');
dictionaries['tr'] = require('common/core/localization/messages/tr.json!');
dictionaries['vi'] = require('common/core/localization/messages/vi.json!');
dictionaries['zh-tw'] = require('common/core/localization/messages/zh-tw.json!');
dictionaries['zh'] = require('common/core/localization/messages/zh.json!');
dictionaries['fa'] = require('common/core/localization/messages/fa.json!');

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
