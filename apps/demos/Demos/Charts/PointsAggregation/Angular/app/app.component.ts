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

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
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
    point: { aggregationInfo },
    seriesName,
    ...pointInfo
  }: {
    point: {
      aggregationInfo?: {
        intervalStart: Date;
        intervalEnd: Date;
      }
    },
    seriesName: 'Average temperature' | 'Temperature range' | 'Precipitation';
    value?: number;
    argument?: Date;
    rangeValue1?: number;
    rangeValue2?: number;
    valueText?: string;
  }) {
    const start = aggregationInfo?.intervalStart;
    const end = aggregationInfo?.intervalEnd;
    const handlers = {
      'Average temperature': ({ argument, value }: { argument: Date; value: number; }) => ({
        text: `${(!aggregationInfo
          ? `Date: ${argument.toDateString()}`
          : `Interval: ${start.toDateString()} - ${end.toDateString()}`)
        }<br/>Temperature: ${value.toFixed(2)} °C`,
      }),
      'Temperature range': ({ rangeValue1, rangeValue2 }: { rangeValue1: number; rangeValue2: number; }) => ({
        text: `Interval: ${start.toDateString()
        } - ${end.toDateString()
        }<br/>Temperature range: ${rangeValue1
        } - ${rangeValue2} °C`,
      }),
      Precipitation: ({ argument, valueText }: { argument: Date; valueText: string; }) => ({
        text: `Date: ${argument.toDateString()
        }<br/>Precipitation: ${valueText} mm`,
      }),
    };

    return handlers[seriesName](pointInfo);
  }

  calculateRangeArea(aggregationInfo: Record<string, any>) {
    if (!aggregationInfo.data.length) {
      return null;
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
