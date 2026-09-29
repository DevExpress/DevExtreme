import { loadMessages, locale, formatMessage } from 'localization';
// eslint-disable-next-line spellcheck/spell-checker
import zhTwMessages from 'localization/messages/zh-tw.json!';

QUnit.module('Locale messages of DevExtreme', {
}, () => {

    QUnit.test('test zh-TW locale format message', function(assert) {
        try {
            // eslint-disable-next-line spellcheck/spell-checker
            loadMessages(zhTwMessages);
            locale('zh-TW');
            assert.equal(formatMessage('Yes'), '是');
        } finally {
            locale('en');
        }
    });
});
