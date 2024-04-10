import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxActionSheetModule, DxListModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Contact, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
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

@NgModule({
  imports: [
    BrowserModule,    DxActionSheetModule,
    DxListModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
