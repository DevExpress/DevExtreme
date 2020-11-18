import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule } from 'devextreme-angular';

import { Service, Temperature } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [Service],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    highAverageColor = "#ff9b52";
    lowAverageColor = "#6199e6";
    highAverage: number;
    lowAverage: number;
    temperaturesData: Temperature[];

    constructor(service: Service) {
        this.temperaturesData = service.getTemperaturesData();
        const { highAverage, lowAverage } = service.getRangeOfAverageTemperature();
        this.highAverage = highAverage;
        this.lowAverage = lowAverage;
    }

    customizePoint = (arg: any) => {
        if (arg.value > this.highAverage) {
            return { color: this.highAverageColor };
        } else if (arg.value < this.lowAverage) {
            return { color: this.lowAverageColor };
        }
    }

    customizeLabel = (arg: any) => {
        if (arg.value > this.highAverage) {
            return getLabelsSettings(this.highAverageColor);
        } else if (arg.value < this.lowAverage) {
            return getLabelsSettings(this.lowAverageColor);
        }
    }

    customizeText = customizeText
}

function getLabelsSettings(backgroundColor: any) {
    return {
        visible: true,
        backgroundColor: backgroundColor,
        customizeText: customizeText
    };
}

function customizeText(arg: any) {
    return arg.valueText + "&#176F";
}

@NgModule({
    imports: [
        BrowserModule,
        DxChartModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
