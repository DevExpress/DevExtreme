import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxChartModule } from 'devextreme-angular';

import { Data, Service } from './app.service';

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
  dataSource: Data[];

  wwdcDate = new Date(2017, 5, 5);

  tvAnnounceDate = new Date(2019, 2, 25);

  watchReleaseDate = new Date(2015, 3, 24);

  xReleaseDate = new Date(2017, 10, 3);

  seReleaseDate = new Date(2016, 2, 31);

  constructor(service: Service) {
    this.dataSource = service.getData();
  }

  customizeTooltip(e) {
    return {
      html: `<div class='tooltip'>${e.description}</div>`,
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
