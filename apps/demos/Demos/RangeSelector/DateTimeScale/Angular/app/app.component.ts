import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule } from 'devextreme-angular';

import { Service, MonthPeriod } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  dataSource: MonthPeriod[];

  constructor(service: Service) {
    this.dataSource = service.getPeriods();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxRangeSelectorModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
