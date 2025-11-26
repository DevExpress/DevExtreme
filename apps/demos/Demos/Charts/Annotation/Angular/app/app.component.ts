import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';

import { Data, Service } from './app.service';

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
    DxChartModule,
  ],
})
export class AppComponent {
  dataSource: Data[];

  appleWWDCDate = new Date(2017, 5, 5);

  appleTVAnnouncementDate = new Date(2019, 2, 25);

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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
