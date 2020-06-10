import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeListModule } from 'devextreme-angular';

import DataSource from 'devextreme/data/data_source';
import { Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

let getOrderDay = function (rowData: any): number {
    return (new Date(rowData.OrderDate)).getDay();
};

@Component({
    selector: 'demo-app',
    providers: [ Service ],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent {
    dataSource: any;   
    filterValue: Array<any>;

    constructor(service: Service) {
        this.dataSource = new DataSource({
            store: service.getEmployees()
        });
        this.filterValue = ["City", "=", "Bentonville"];        
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeListModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
