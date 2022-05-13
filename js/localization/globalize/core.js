// eslint-disable-next-line no-restricted-imports
import Globalize from 'globalize';
import coreLocalization from '../core';
import { likelySubtags } from '../cldr-data/likely_subtags';
import { enCurrencies } from '../cldr-data/en_currencies'
import {enNumbers} from '../cldr-data/en_numbers';
import {enCaGregorian} from '../cldr-data/en_ca_gregorian'

if(Globalize && Globalize.load) {
    if(!Globalize.locale()) {
        Globalize.load(likelySubtags, enCurrencies, enNumbers, enCaGregorian);
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
