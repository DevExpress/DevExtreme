import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DxPieChartModule } from 'devextreme-angular';
import { Service, State } from './app.service';

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
    DxPieChartModule,
    DecimalPipe,
  ],
})
export class AppComponent {
  populationData: State[];

  constructor(service: Service) {
    this.populationData = service.getPopulationData();
  }

  getImagePath = ({ data: { name } }) => `../../../../images/flags/${name.replace(/\s/, '')}.svg`;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
