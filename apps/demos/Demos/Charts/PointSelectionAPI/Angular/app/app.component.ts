import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, type DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service, CatBreed } from './app.service';

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
  ],
})
export class AppComponent {
  catBreedsData: CatBreed[];

  constructor(service: Service) {
    this.catBreedsData = service.getCatBreedsData();
  }

  done(e: DxChartTypes.DoneEvent) {
    e.component.getSeriesByPos(0).getPointsByArg('Siamese')[0].select();
  }

  pointClick(e: DxChartTypes.PointClickEvent) {
    const point = e.target;
    if (point.isSelected()) {
      point.clearSelection();
    } else {
      point.select();
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
