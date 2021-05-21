import { NgModule, Component, enableProdMode } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {Appointment, Service} from './app.service';
import { DxSchedulerModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

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
    appointmentsData: Appointment[];
    currentDate: Date = new Date(2021, 3, 29);

    constructor(service: Service) {
        this.appointmentsData = service.getAppointments();
    }

    showToast(event, value, type) {
        notify(event + " \"" + value + "\"" + " task", type, 800);
    }

    onAppointmentAdded(e) {
        this.showToast("Added", e.appointmentData.text, "success");
    }

    onAppointmentUpdated(e) {
        this.showToast("Updated", e.appointmentData.text, "info");
    }

    onAppointmentDeleted(e) {
        this.showToast("Deleted", e.appointmentData.text, "warning");
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSchedulerModule,
        DxCheckBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)