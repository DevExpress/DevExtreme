var Globalize = require('globalize'),
    coreLocalization = require('../core');

if(Globalize && Globalize.load) {
    var likelySubtags = {
        'supplemental': {
            'version': {
                '_cldrVersion': '28',
                '_unicodeVersion': '8.0.0',
                '_number': '$Revision: 11965 $'
            },
            'likelySubtags': {
                'en': 'en-Latn-US',
                'de': 'de-Latn-DE',
                'ru': 'ru-Cyrl-RU',
                'ja': 'ja-Jpan-JP'
            }
        }
    };

    if(!Globalize.locale()) {
        Globalize.load(likelySubtags);
        Globalize.locale('en');
    }

    coreLocalization.inject({
        locale: function(locale) {
            if(!locale) {
                return Globalize.locale().locale;
            }
            Globalize.locale(locale);
        }
    });
}
