import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { ArchitectureInfo, Service } from './app.service';

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
  preserveWhitespaces: true,
  imports: [
    DxChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  types: string[] = ['spline', 'stackedspline', 'fullstackedspline'];

  architecturesInfo: ArchitectureInfo[];

  constructor(service: Service) {
    this.architecturesInfo = service.getArchitecturesInfo();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
