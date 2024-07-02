import { enableProdMode, Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import {
  Service, WeatherIndicators, AggregationInterval, AggregationFunction,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  weatherIndicators: WeatherIndicators[];

  intervals: AggregationInterval[];

  functions: AggregationFunction[];

  useAggregation = true;

  constructor(service: Service) {
    this.weatherIndicators = service.getWeatherIndicators();
    this.intervals = service.getAggregationIntervals();
    this.functions = service.getAggregationFunctions();
  }

  customizeTooltip({
    valueText,
    point: { aggregationInfo },
    seriesName,
    value,
    argument,
    rangeValue1,
    rangeValue2,
  }) {
    const start = aggregationInfo?.intervalStart;
    const end = aggregationInfo?.intervalEnd;

    if (seriesName === 'Average temperature') {
      return {
        text: `${!aggregationInfo
          ? `Date: ${argument.toDateString()}`
          : `Interval: ${start.toDateString()
          } - ${end.toDateString()}`
        }<br/>Temperature: ${value.toFixed(2)} °C`,
      };
    } if (seriesName === 'Temperature range') {
      return {
        text: `Interval: ${start.toDateString()
        } - ${end.toDateString()
        }<br/>Temperature range: ${rangeValue1
        } - ${rangeValue2} °C`,
      };
    } if (seriesName === 'Precipitation') {
      return {
        text: `Date: ${argument.toDateString()
        }<br/>Precipitation: ${valueText} mm`,
      };
    }
  }

  calculateRangeArea(aggregationInfo: Record<string, any>) {
    if (!aggregationInfo.data.length) {
      return;
    }
    const temp = aggregationInfo.data.map((item) => item.temp);
    const maxTemp = Math.max.apply(null, temp);
    const minTemp = Math.min.apply(null, temp);

    return {
      date: new Date((aggregationInfo.intervalStart.valueOf() + aggregationInfo.intervalEnd.valueOf()) / 2),
      maxTemp,
      minTemp,
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChartModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
