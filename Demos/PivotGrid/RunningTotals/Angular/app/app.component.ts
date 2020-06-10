import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPivotGridModule, DxCheckBoxModule } from 'devextreme-angular';
import { Service, Sale } from './app.service';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

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
    pivotGridDataSource: any;

    constructor(service: Service) {
        this.pivotGridDataSource = new PivotGridDataSource({
            fields: [{
                caption: "Region",
                width: 120,
                dataField: "region",
                area: "row"
            }, {
                caption: "City",
                dataField: "city",
                width: 150,
                area: "row"
            }, {
                dataField: "date",
                dataType: "date",
                area: "column"
            }, {
                groupName: "date",
                groupInterval: "year",
                expanded: true
            }, {
                groupName: "date",
                groupInterval: "month",
                visible: false
            }, {
                caption: "Total",
                dataField: "amount",
                dataType: "number",
                summaryType: "sum",
                format: "currency",
                area: "data"
            }, {
                caption: "Running Total",
                dataField: "amount",
                dataType: "number",
                summaryType: "sum",
                format: "currency",
                area: "data",
                runningTotal: "row",
                allowCrossGroupCalculation: true
            }],
            store: service.getSales()
        });
    }

    checkBoxChanged(e) {
        this.pivotGridDataSource.field(6, { allowCrossGroupCalculation: e.value });
        this.pivotGridDataSource.load();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxPivotGridModule,
        DxCheckBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);