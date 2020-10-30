import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule } from 'devextreme-angular';
import { Population, CorrelationDescription, Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
})
export class AppComponent {
    title: string = "Correlation between Total Population and\n Population with Age over 60";
    dataSource: Population[];
    correlationSource: CorrelationDescription[];

    constructor(service: Service) {
        this.dataSource = service.getPopulationData();
        this.correlationSource = service.getCorrelationSource();
    }

    customizeTooltip(arg: any) {
        return {
            text: arg.point.tag + '<br/>Total Population: ' + arg.argumentText + 'M<br/>Population with Age over 60: ' + arg.valueText + 'M (' + arg.size + '%)'
        };
    }

    argumentCustomizeText(args: any) {
        return args.value + 'M';
    }

    valueCustomizeText(args: any) {
        return args.value + 'M';
    }

    onSeriesClick(e: any) {
        var series = e.target;
        if (series.isVisible()) {
            series.hide();
        } else {
            series.show();
        }
    }
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