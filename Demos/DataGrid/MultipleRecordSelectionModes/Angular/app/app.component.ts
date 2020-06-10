import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';

import { Service, Sale } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service],
    preserveWhitespaces: true
})
export class AppComponent {
    sales: Sale[];
    allMode: string;
    checkBoxesMode: string;

    constructor(service: Service) {
        this.sales = service.getSales();
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick'
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);