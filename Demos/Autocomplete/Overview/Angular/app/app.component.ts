 

import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxAutocompleteModule, DxTemplateModule } from 'devextreme-angular';
import data from 'devextreme/data/odata/store';

import { Service } from './app.service';

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
    names: string[];
    surnames: string[];
    positions: string[];
    cities: string[];
    states: any;
    firstName = "";
    lastName = "";
    position: string;
    city = "";
    state = "";
    fullInfo = "";
    
    constructor(service: Service) {
        this.states = new data({
            url: "https://js.devexpress.com/Demos/DevAV/odata/States?$select=Sate_ID,State_Long,State_Short",
            key: "Sate_ID",
            keyType: "Int32"
        });
        this.names = service.getNames();
        this.surnames = service.getSurnames();
        this.positions = service.getPositions();
        this.cities = service.getCities();
        this.position = this.positions[0];
    }
    updateEmployeeInfo() {
        var result = "";
        result += ((this.firstName || "") + " " + (this.lastName || "")).trim();
        result += (result && this.position) ? (", " + this.position) : this.position;
        result += (result && this.city) ? (", " + this.city) : this.city;
        result += (result && this.state) ? (", " + this.state) : this.state;
        this.fullInfo = result;
    } 
}

@NgModule({
    imports: [
        BrowserModule,
        DxAutocompleteModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);