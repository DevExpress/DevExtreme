import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxPieChartModule, DxChartComponent, DxPieChartComponent, DxButtonModule } from 'devextreme-angular';

import { Service, Medals } from './app.service';
import { exportWidgets } from 'devextreme/viz/export';

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
    @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;
    @ViewChild(DxPieChartComponent, { static: false }) pieChart: DxPieChartComponent;
    title: string = "Total Olympic Medals\n in 2008";
    allMedals: Medals[];
    goldMedals: Medals[];

    constructor(service: Service) {
        this.allMedals = service.getAllMedals();
        this.goldMedals = service.getGoldMedals();
    }

    export() {
        var chartInstance = this.chart.instance,
            pieChartInstance = this.pieChart.instance;

        exportWidgets([[chartInstance, pieChartInstance]], {
            fileName: "chart",
            format: 'PNG'
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxChartModule,
        DxPieChartModule,
        DxButtonModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);