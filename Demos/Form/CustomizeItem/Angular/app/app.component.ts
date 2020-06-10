import { NgModule, Component, ViewChild, enableProdMode, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule,
         DxTextAreaModule,
         DxFormModule,
         DxFormComponent } from 'devextreme-angular';

import { Employee, Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [ Service ],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent implements AfterViewInit {
    @ViewChild(DxFormComponent, { static: false }) myform: DxFormComponent;
    employee: Employee;
    positions: string[];
    rules: Object;

    constructor(service: Service) {
        this.employee = service.getEmployee();
        this.positions = service.getPositions();
        this.rules = { 'X': /[02-9]/ };
    }

    ngAfterViewInit() {
        this.myform.instance.validate()
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSelectBoxModule,
        DxTextAreaModule,
        DxFormModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
