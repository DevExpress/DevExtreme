import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSelectBoxModule, DxDataGridModule } from 'devextreme-angular';

import { locale, loadMessages, formatMessage } from 'devextreme-angular/common/core/localization';

import deMessages from 'devextreme/localization/messages/de.json';
import ruMessages from 'devextreme/localization/messages/ru.json';
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

  readonly formatMessage = formatMessage;

  constructor() {
    this.initMessages();
    locale(this.locale);
  }

  private initMessages() {
    loadMessages(deMessages);
    loadMessages(ruMessages);
    loadMessages(this.service.getDictionary());
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
