import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { CountryInfo, EnergyDescription, Service } from './app.service';

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
    types: string[] = ["line", "stackedline", "fullstackedline"];
    countriesInfo: CountryInfo[];
    energySources: EnergyDescription[];

    constructor(service: Service) {
        this.countriesInfo = service.getCountriesInfo();
        this.energySources = service.getEnergySources();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxChartModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);