import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxPolarChartModule } from 'devextreme-angular';
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
  ],
})
export class AppComponent {
  readonly temperaturesData = inject(Service).getTemperaturesData();

  readonly maxDay = this.temperaturesData.reduce((prev, current) => (prev.day >= current.day ? prev : current));

  readonly minNight = this.temperaturesData.reduce((prev, current) => (prev.night <= current.night ? prev : current));
}

bootstrapApplication(AppComponent);
