import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTextAreaModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';

import { Service } from './app.service';

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
  valueChangeEvents: any[];

  eventValue: string;

  maxLength = null;

  value: string;

  valueForEditableTextArea: string;

  height = 90;

  autoResizeEnabled: boolean;

  constructor(private service: Service) {
    this.valueForEditableTextArea = this.service.getContent();
    this.value = this.service.getContent();
    this.valueChangeEvents = [{
      title: 'On Change',
      name: 'change',
    }, {
      title: 'On Key Up',
      name: 'keyup',
    }];
    this.eventValue = this.valueChangeEvents[0].name;
    this.autoResizeEnabled = false;
  }

  onCheckboxValueChanged(e) {
    let str = this.service.getContent();
    this.value = e.value ? str.substring(0, 100) : str;
    this.maxLength = e.value ? 100 : null;
  }

  onAutoResizeChanged(e) {
    this.height = e.value ? undefined : 90;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTextAreaModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
