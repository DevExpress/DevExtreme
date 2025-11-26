import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DecimalPipe } from "@angular/common";
import { DxChartModule } from 'devextreme-angular';
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
    DxChartModule,
    DecimalPipe,
  ],
})
export class AppComponent {
  populationData: State[];

  constructor(service: Service) {
    this.populationData = service.getPopulationData();
  }

  getImagePath(annotation) {
    const name = annotation.argument.replace(/\s/, '');
    return `../../../../images/flags/${name}.svg`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
