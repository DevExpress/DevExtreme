import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import { Service, Location, Data } from './app.service';

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
    currentDate: Date = new Date(2017, 4, 25);
    timezone: string;
    locations: Location[];
    dataSource: Data[];

    constructor(service: Service) {
        this.locations = service.getLocations();
        this.dataSource = service.getData();
        this.timezone = this.locations[0].timeZoneId;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSchedulerModule,
        DxTemplateModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);