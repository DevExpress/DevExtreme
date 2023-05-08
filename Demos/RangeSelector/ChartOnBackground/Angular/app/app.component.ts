import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  dataSource: any[];

  startSelectedValue: Date = new Date(2011, 11, 25);

  endSelectedValue: Date = new Date(2012, 0, 1);

  constructor() {
    this.dataSource = [
      { t: new Date(2011, 11, 22), costs: 19, income: 18 },
      { t: new Date(2011, 11, 29), costs: 27, income: 12 },
      { t: new Date(2012, 0, 5), costs: 30, income: 5 },
      { t: new Date(2012, 0, 12), costs: 26, income: 6 },
      { t: new Date(2012, 0, 19), costs: 18, income: 10 },
      { t: new Date(2012, 0, 26), costs: 15, income: 15 },
      { t: new Date(2012, 1, 2), costs: 14, income: 21 },
      { t: new Date(2012, 1, 9), costs: 14, income: 25 },
    ];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxRangeSelectorModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
