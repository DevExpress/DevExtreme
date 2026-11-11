import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
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
import { Service } from './app.service';

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
  private readonly service = inject(Service);

  readonly locale = this.getLocale();

  readonly payments = this.service.getPayments();

  readonly locales = this.service.getLocales();

  readonly formatMessage = Globalize.formatMessage.bind(Globalize);

  constructor() {
    this.initGlobalize();
    Globalize.locale(this.locale);
  }

  private initGlobalize() {
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

  private getLocale() {
    const locale = sessionStorage.getItem('locale');
    return locale != null ? locale : 'en';
  }

  private setLocale(locale) {
    sessionStorage.setItem('locale', locale);
  }
}

bootstrapApplication(AppComponent);
