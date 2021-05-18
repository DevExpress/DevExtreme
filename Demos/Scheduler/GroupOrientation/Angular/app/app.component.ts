import { NgModule, Component, enableProdMode } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {Appointment, Priority, Service} from './app.service';
import {DxSchedulerModule} from 'devextreme-angular';

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
    appointmentsData: Appointment[];
    currentDate: Date = new Date(2021, 3, 21);
    prioritiesData: Priority[];

    constructor(service: Service) {
        this.appointmentsData = service.getAppointments();
        this.prioritiesData = service.getPriorities();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSchedulerModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)
