import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';

import { Service, WeatherIndicators, AggregationInterval, AggregationFunction } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [Service],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})
export class AppComponent {
    weatherIndicators: WeatherIndicators[];
    intervals: AggregationInterval[];
    functions: AggregationFunction[];
    useAggregation: Boolean = true;

    constructor(service: Service) {
        this.weatherIndicators = service.getWeatherIndicators();
        this.intervals = service.getAggregationIntervals();
        this.functions = service.getAggregationFunctions();
    }

    customizeTooltip(arg: any) {
        let aggregationInfo = arg.point.aggregationInfo,
            start = aggregationInfo && aggregationInfo.intervalStart,
            end = aggregationInfo && aggregationInfo.intervalEnd;

        if(arg.seriesName === "Average temperature") {
            return {
                text: (!aggregationInfo ?
                    "Date: " + arg.argument.toDateString() :
                    "Interval: " + start.toDateString() +
                    " - " + end.toDateString()) +
                    "<br/>Temperature: " + arg.value.toFixed(2) + " °C"
            };
        } else if(arg.seriesName === "Temperature range") {
            return {
                text: "Interval: " + start.toDateString() +
                    " - " + end.toDateString() +
                    "<br/>Temperature range: " + arg.rangeValue1 +
                    " - " + arg.rangeValue2 + " °C"
            };
        } else if(arg.seriesName === "Precipitation") {
            return {
                text: "Date: " + arg.argument.toDateString() +
                    "<br/>Precipitation: " + arg.valueText + " mm"
            };
        }
    }
    calculateRangeArea(aggregationInfo:any, series:any) {
        if(!aggregationInfo.data.length) {
            return;
        }
        let temp = aggregationInfo.data.map(function(item) { return item.temp; }),
            maxTemp = Math.max.apply(null, temp),
            minTemp = Math.min.apply(null, temp);

        return {
            date: new Date((aggregationInfo.intervalStart.valueOf() + aggregationInfo.intervalEnd.valueOf()) / 2),
            maxTemp: maxTemp,
            minTemp: minTemp
        };
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxChartModule,
        DxSelectBoxModule,
        DxCheckBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);