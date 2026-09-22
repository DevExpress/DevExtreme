import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';
import { Service, Weather } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxChartModule,
  ],
})
export class AppComponent {
  weatherData: Weather[];

  constructor(service: Service) {
    this.weatherData = service.getWeatherData();
  }

  customizeTooltip = ({
    seriesName, value, lowErrorValue, highErrorValue,
  }) => (
    {
      text: `${seriesName}: ${value} ( range: ${lowErrorValue} - ${highErrorValue})`,
    }
  );
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
