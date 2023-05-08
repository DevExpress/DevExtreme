import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';

import {
  Service, WeatherIndicators, AggregationInterval, AggregationFunction,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
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

  customizeTooltip(arg: any) {
    const aggregationInfo = arg.point.aggregationInfo;
    const start = aggregationInfo && aggregationInfo.intervalStart;
    const end = aggregationInfo && aggregationInfo.intervalEnd;

    if (arg.seriesName === 'Average temperature') {
      return {
        text: `${!aggregationInfo
          ? `Date: ${arg.argument.toDateString()}`
          : `Interval: ${start.toDateString()
          } - ${end.toDateString()}`
        }<br/>Temperature: ${arg.value.toFixed(2)} °C`,
      };
    } if (arg.seriesName === 'Temperature range') {
      return {
        text: `Interval: ${start.toDateString()
        } - ${end.toDateString()
        }<br/>Temperature range: ${arg.rangeValue1
        } - ${arg.rangeValue2} °C`,
      };
    } if (arg.seriesName === 'Precipitation') {
      return {
        text: `Date: ${arg.argument.toDateString()
        }<br/>Precipitation: ${arg.valueText} mm`,
      };
    }
  }

  calculateRangeArea(aggregationInfo:any, series:any) {
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
    BrowserTransferStateModule,
    DxChartModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
