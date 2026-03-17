import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';
import { Service, Production } from './app.service';

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
  productionData: Production[];

  constructor(service: Service) {
    this.productionData = service.getProductionData();
  }

  customizeSeries(valueFromNameField: number) {
    return valueFromNameField === 2020
      ? { type: 'line', label: { visible: true }, color: '#ff3f7a' } : {};
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
