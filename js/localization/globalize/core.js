// eslint-disable-next-line no-restricted-imports
import Globalize from 'globalize';
import coreLocalization from '../core';
import { likelySubtags } from '../cldr-data/likely_subtags';
import { enCldr } from '../cldr-data/en.js';

if(Globalize && Globalize.load) {
    if(!Globalize.locale()) {
        Globalize.load(likelySubtags, enCldr);
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
