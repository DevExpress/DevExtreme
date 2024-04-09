import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTextAreaModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
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
  valueChangeEvents = [{
    title: 'On Change',
    name: 'change',
  }, {
    title: 'On Key Up',
    name: 'keyup',
  }];

  eventValue: string;

  maxLength = null;

  value: string;

  valueForEditableTextArea: string;

  height = 90;

  autoResizeEnabled: boolean;

  constructor(private service: Service) {
    this.valueForEditableTextArea = this.service.getContent();
    this.value = this.service.getContent();
    this.eventValue = this.valueChangeEvents[0].name;
    this.autoResizeEnabled = false;
  }

  onCheckboxValueChanged({ value }: DxCheckBoxTypes.ValueChangedEvent) {
    let str = this.service.getContent();
    this.value = value ? str.substring(0, 100) : str;
    this.maxLength = value ? 100 : null;
  }

  onAutoResizeChanged({ value }: DxCheckBoxTypes.ValueChangedEvent) {
    this.height = value ? undefined : 90;
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
