import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { CorporationInfo, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  corporationsInfo: CorporationInfo[];

  types: string[] = ['splinearea', 'stackedsplinearea', 'fullstackedsplinearea'];

  constructor(service: Service) {
    this.corporationsInfo = service.getCorporationsInfo();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
