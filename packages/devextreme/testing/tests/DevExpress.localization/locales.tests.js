import messageLocalization from '__internal/core/localization/message';
import localization from 'localization';

import ar from 'localization/messages/ar.json!';
import bg from 'localization/messages/bg.json!';
import ca from 'localization/messages/ca.json!';
import cs from 'localization/messages/cs.json!';
import da from 'localization/messages/da.json!';
import de from 'localization/messages/de.json!';
import el from 'localization/messages/el.json!';
import en from 'localization/messages/en.json!';
import es from 'localization/messages/es.json!';
import fi from 'localization/messages/fi.json!';
import fr from 'localization/messages/fr.json!';
import hu from 'localization/messages/hu.json!';
import it from 'localization/messages/it.json!';
import ja from 'localization/messages/ja.json!';
import ko from 'localization/messages/ko.json!';
import lt from 'localization/messages/lt.json!';
import lv from 'localization/messages/lv.json!';
import nb from 'localization/messages/nb.json!';
import nl from 'localization/messages/nl.json!';
import pl from 'localization/messages/pl.json!';
import pt from 'localization/messages/pt.json!';
import ptBR from 'localization/messages/pt-BR.json!';
import ptPT from 'localization/messages/pt-PT.json!';
import ro from 'localization/messages/ro.json!';
import ru from 'localization/messages/ru.json!';
import sl from 'localization/messages/sl.json!';
import sv from 'localization/messages/sv.json!';
import tr from 'localization/messages/tr.json!';
import uk from 'localization/messages/uk.json!';
import vi from 'localization/messages/vi.json!';
// eslint-disable-next-line spellcheck/spell-checker
import zhTw from 'localization/messages/zh-tw.json!';
import zh from 'localization/messages/zh.json!';
// eslint-disable-next-line spellcheck/spell-checker
import zhCN from 'localization/messages/zh-CN.json!';
// eslint-disable-next-line spellcheck/spell-checker
import zhHans from 'localization/messages/zh-Hans.json!';
import fa from 'localization/messages/fa.json!';

const dictionaries = {
    ar, bg, ca, cs, da, de, el,
    en, es, fi, fr, hu,
    it, ja, ko, lt, lv, nb,
    nl, pl, pt, 'pt-BR': ptBR, 'pt-PT': ptPT, ro, ru, sl,
    // eslint-disable-next-line spellcheck/spell-checker
    sv, tr, uk, vi, 'zh-tw': zhTw, zh, fa,
    // eslint-disable-next-line spellcheck/spell-checker
    'zh-CN': zhCN, 'zh-Hans': zhHans
};

const LOCALES = Object.keys(dictionaries);

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
