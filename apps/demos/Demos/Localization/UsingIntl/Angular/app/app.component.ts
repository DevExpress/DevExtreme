import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSelectBoxModule, DxDataGridModule } from 'devextreme-angular';
import type { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';

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

  private initMessages(): void {
    loadMessages(deMessages);
    loadMessages(ruMessages);
    loadMessages(this.service.getDictionary());
  }

  changeLocale({ value }: DxSelectBoxTypes.ValueChangedEvent): void {
    this.setLocale(value);
    parent.document.location.reload();
  }

  private getLocale(): string {
    const locale = sessionStorage.getItem('locale');
    return locale != null ? locale : 'en';
  }

  private setLocale(locale: string): void {
    sessionStorage.setItem('locale', locale);
  }
}

bootstrapApplication(AppComponent);
