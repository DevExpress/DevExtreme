import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';
import { Service } from './app.service';

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
  readonly weatherData = inject(Service).getWeatherData();

  readonly customizeTooltip = ({
    seriesName, value, lowErrorValue, highErrorValue,
  }) => (
    {
      text: `${seriesName}: ${value} ( range: ${lowErrorValue} - ${highErrorValue})`,
    }
  );
}

bootstrapApplication(AppComponent);
