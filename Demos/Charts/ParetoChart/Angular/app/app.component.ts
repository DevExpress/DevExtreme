import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule } from 'devextreme-angular';

import { Service, ComplaintsWithPercent } from './app.service';

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
    dataSource: ComplaintsWithPercent[];

    constructor(service: Service) {
        this.dataSource = service.getComplaintsData()
    }

    customizeTooltip = (info: any) => {
        return {
            html: "<div><div class='tooltip-header'>" +
                info.argumentText + "</div>" +
                "<div class='tooltip-body'><div class='series-name'>" +
                "<span class='top-series-name'>" + info.points[0].seriesName + "</span>" +
                ": </div><div class='value-text'>" +
                "<span class='top-series-value'>" + info.points[0].valueText + "</span>" +
                "</div><div class='series-name'>" +
                "<span class='bottom-series-name'>" + info.points[1].seriesName + "</span>" +
                ": </div><div class='value-text'>" +
                "<span class='bottom-series-value'>" + info.points[1].valueText + "</span>" +
                "% </div></div></div>"
        };
    }

    customizeLabelText = (info: any) => {
        return info.valueText + "%";
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