import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule, DxDataGridModule } from 'devextreme-angular';

import { locale, loadMessages, formatMessage } from 'devextreme/localization';

import deMessages from 'npm:devextreme/common/core/localization/messages/de.json!json';
import ruMessages from 'npm:devextreme/common/core/localization/messages/ru.json!json';
import { Locale, Payment, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
})

export class AppComponent {
  locale: string;

  locales: Locale[];

  payments: Payment[];

  formatMessage = formatMessage;

  constructor(private service: Service) {
    this.locale = this.getLocale();
    this.payments = service.getPayments();
    this.locales = service.getLocales();

    this.initMessages();
    locale(this.locale);
  }

  initMessages() {
    loadMessages(deMessages);
    loadMessages(ruMessages);
    loadMessages(this.service.getDictionary());
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

@NgModule({
  imports: [
    BrowserModule,
    DxSelectBoxModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
