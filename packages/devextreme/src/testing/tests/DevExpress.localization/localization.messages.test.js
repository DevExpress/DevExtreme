const localization = require('localization');
const dictionaries = {};

dictionaries['zh-tw'] = require('localization/messages/zh-tw.json!');

QUnit.module('Locale messages of DevExtreme', {
}, () => {

    QUnit.test('test zh-TW locale format message', function(assert) {
        try {
            localization.loadMessages(dictionaries['zh-tw']);
            localization.locale('zh-TW');
            assert.equal(localization.formatMessage('Yes'), '是');
        } finally {
            localization.locale('en');
        }
    });
});
