// eslint-disable-next-line no-restricted-imports
import Globalize from 'globalize';
import coreLocalization from '../core';
import { enCldr } from '../cldr-data/en';
import { supplementalCldr } from '../cldr-data/supplemental';


if(Globalize && Globalize.load) {
    if(!Globalize.locale()) {
        Globalize.load(enCldr, supplementalCldr);
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
