import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxChartComponent, DxButtonModule } from 'devextreme-angular';
import type { DxChartTypes } from 'devextreme-angular/ui/chart';

import { Service, BirthLife } from './app.service';

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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxChartModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  @ViewChild(DxChartComponent, { static: false }) component: DxChartComponent;

  data: BirthLife[];

  constructor(service: Service) {
    this.data = service.getData();
  }

  resetZoom() {
    this.component.instance.resetVisualRange();
  }

  customizeTooltip(pointInfo: DxChartTypes.CommonPointInfo) {
    const { data } = pointInfo.point;
    return {
      text: `${data.country} ${data.year}`,
    };
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
