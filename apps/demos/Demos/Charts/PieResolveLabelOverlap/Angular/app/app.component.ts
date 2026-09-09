import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxPieChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { MedalsInfo, Service } from './app.service';

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
    DxPieChartModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  olympicMedals: MedalsInfo[];

  resolveOverlappingTypes = ['shift', 'hide', 'none'];

  constructor(service: Service) {
    this.olympicMedals = service.getMedalsData();
  }

  customizeLabel(arg) {
    return `${arg.argumentText} (${arg.percentText})`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
