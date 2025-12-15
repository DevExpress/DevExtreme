import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSelectBoxModule, DxDataGridModule } from 'devextreme-angular';

import 'devextreme/common/core/localization/globalize/number';
import 'devextreme/common/core/localization/globalize/date';
import 'devextreme/common/core/localization/globalize/currency';
import 'devextreme/common/core/localization/globalize/message';

// import 'devextreme-angular/common/core/localization';

import deMessages from 'npm:devextreme/localization/messages/de.json!json';
import ruMessages from 'npm:devextreme/localization/messages/ru.json!json';

import deCldrData from 'npm:devextreme-cldr-data/de.json!json';
import ruCldrData from 'npm:devextreme-cldr-data/ru.json!json';
import supplementalCldrData from 'npm:devextreme-cldr-data/supplemental.json!json';

import Globalize from 'globalize';
import { Locale, Payment, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxSelectBoxModule,
    DxDataGridModule,
  ],
})

export class AppComponent {
  locale: string;

  locales: Locale[];

  payments: Payment[];

  formatMessage = Globalize.formatMessage.bind(Globalize);

  constructor(private service: Service) {
    this.locale = this.getLocale();
    this.payments = service.getPayments();
    this.locales = service.getLocales();

    this.initGlobalize();
    Globalize.locale(this.locale);
  }

  initGlobalize() {
    Globalize.load(
      deCldrData,
      ruCldrData,
      supplementalCldrData,
    );
    Globalize.loadMessages(deMessages);
    Globalize.loadMessages(ruMessages);
    Globalize.loadMessages(this.service.getDictionary());
  }

  changeLocale(data) {
    this.setLocale(data.value);
    parent.document.location.reload();
  }

  getLocale() {
    const locale = sessionStorage.getItem('locale');
    return locale != null ? locale : 'en';
  }

  setLocale(locale) {
    sessionStorage.setItem('locale', locale);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
