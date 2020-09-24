

import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import { Service } from './app.service';
import ArrayStore from 'devextreme/data/array_store'

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
    dataSource: ArrayStore;

    constructor(service: Service) {
        this.dataSource = new ArrayStore({
            key: "ID",
            data: service.getEmployees()
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        DxDiagramModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);