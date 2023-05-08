import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSliderModule, DxNumberBoxModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  start = 10;

  end = 90;

  label: any;

  tooltip: any;

  tooltipEnabled: any;

  constructor() {
    this.label = {
      visible: true,
      format: (value) => this.format(value),
      position: 'top',
    };
    this.tooltip = {
      enabled: true,
      format: (value) => this.format(value),
      showMode: 'always',
      position: 'bottom',
    };
    this.tooltipEnabled = {
      enabled: true,
    };
  }

  format(value) {
    return `${value}%`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxRangeSliderModule,
    DxNumberBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
