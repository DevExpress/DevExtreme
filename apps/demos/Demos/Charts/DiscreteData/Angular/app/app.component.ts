import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxPolarChartModule, DxSelectBoxModule } from 'devextreme-angular';
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
    DxPolarChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly temperaturesData = inject(Service).getTemperaturesData();

  readonly types = ['scatter', 'line', 'area', 'bar', 'stackedbar'];
}

bootstrapApplication(AppComponent);
