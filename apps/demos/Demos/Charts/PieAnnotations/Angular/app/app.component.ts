import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxPieChartModule } from 'devextreme-angular';
import { MedalistData, AnnotationInfo, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxPieChartModule,
  ],
})

export class AppComponent {
  champions: MedalistData[];

  annotations: AnnotationInfo[];

  constructor(service: Service) {
    this.champions = service.getChampionsData();
    this.annotations = service.getAnnotationSources();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
