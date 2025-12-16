import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxActionSheetModule, DxListModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Contact, Service } from './app.service';

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
  imports: [
    DxActionSheetModule,
    DxListModule,
  ],
})
export class AppComponent {
  contacts: Contact[];

  commands: { text: string }[] = [
    { text: 'Call' },
    { text: 'Send message' },
    { text: 'Edit' },
    { text: 'Delete' },
  ];

  actionSheetVisible = false;

  actionSheetTarget = '';

  constructor(service: Service) {
    this.contacts = service.getContacts();
  }

  itemClick(e) {
    this.actionSheetTarget = e.itemElement;
    this.actionSheetVisible = true;
  }

  showNotify(text: string) {
    notify(`The "${text}" button is clicked.`);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
