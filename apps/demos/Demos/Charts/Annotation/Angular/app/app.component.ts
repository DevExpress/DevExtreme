import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxChartModule,
  ],
})
export class AppComponent {
  readonly dataSource = inject(Service).getData();

  readonly appleWWDCDate = new Date(2017, 5, 5);

  readonly appleTVAnnouncementDate = new Date(2019, 2, 25);

  readonly watchReleaseDate = new Date(2015, 3, 24);

  readonly xReleaseDate = new Date(2017, 10, 3);

  readonly seReleaseDate = new Date(2016, 2, 31);

  customizeTooltip(e) {
    return {
      html: `<div class='tooltip'>${e.description}</div>`,
    };
  }
}

bootstrapApplication(AppComponent);
