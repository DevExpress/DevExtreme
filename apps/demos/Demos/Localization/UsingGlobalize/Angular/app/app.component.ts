import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSelectBoxModule, DxDataGridModule } from 'devextreme-angular';

import 'devextreme/common/core/localization/globalize/number';
import 'devextreme/common/core/localization/globalize/date';
import 'devextreme/common/core/localization/globalize/currency';
import 'devextreme/common/core/localization/globalize/message';

// import 'devextreme-angular/common/core/localization';

import deMessages from 'devextreme/localization/messages/de.json';
import ruMessages from 'devextreme/localization/messages/ru.json';

import deCldrData from 'devextreme-cldr-data/de.json';
import ruCldrData from 'devextreme-cldr-data/ru.json';
import supplementalCldrData from 'devextreme-cldr-data/supplemental.json';

import Globalize from 'globalize';
import { Locale, Payment, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
