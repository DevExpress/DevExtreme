import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxPopupModule, DxButtonModule, DxTemplateModule } from 'devextreme-angular';
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
    currentEmployee: Employee = new Employee();
    employees: Employee[];
    popupVisible = false;

    constructor(service: Service) {
        this.employees = service.getEmployees();
    }

    showInfo(employee) {
        this.currentEmployee = employee;
        this.popupVisible = true;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxPopupModule,
        DxButtonModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);