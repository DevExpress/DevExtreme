import { enCldr } from '@ts/core/localization/cldr-data/en';
import { supplementalCldr } from '@ts/core/localization/cldr-data/supplemental';
import coreLocalization from '@ts/core/localization/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import Globalize from 'globalize';

if (Globalize?.load) {
  if (!Globalize.locale()) {
    Globalize.load(enCldr, supplementalCldr);
    Globalize.locale('en');
  }

  coreLocalization.inject({
    // eslint-disable-next-line consistent-return,@typescript-eslint/no-invalid-void-type
    locale(locale?: string): string | void {
      if (!locale) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Globalize.locale().locale;
      }
      Globalize.locale(locale);
    },
  });
}
