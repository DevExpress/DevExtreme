import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxPolarChartModule, DxSelectBoxModule } from 'devextreme-angular';

import { WindRose, WindDescription, Service } from './app.service';

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
    windRoseData: WindRose[];
    windSources: WindDescription[];
    
    constructor(service: Service) {
        this.windRoseData = service.getWindRoseData();
        this.windSources = service.getWindSources();
    }

    onLegendClick(e: any) {
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
        DxPolarChartModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);