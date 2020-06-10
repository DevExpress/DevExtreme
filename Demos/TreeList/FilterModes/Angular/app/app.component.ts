import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxTreeListModule, DxSelectBoxModule } from 'devextreme-angular';

import { Employee, Service } from './app.service';

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
    employees: Employee[];
    filterModes: Array<string>;
    filterModeValue: string = "matchOnly";

    constructor(service: Service) {
        this.employees = service.getEmployees();
        this.filterModes = service.getFilterModes();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeListModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);