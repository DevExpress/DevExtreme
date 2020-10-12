import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';
import { DataService } from './app.service';

import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [DataService]
})
export class AppComponent {
    dataSource: DataSource;
    currentDate = new Date(2021, 4, 25);
    views = ["workWeek", "month"];
    currentView = this.views[0];

    constructor(public dataService: DataService) {
        this.dataSource = new DataSource({
            store: dataService.getData()
        });
    }

    onAppointmentFormOpening(e: any) {
        const startDate = e.appointmentData.startDate;
        if(!this.isValidAppointmentDate(startDate)) {
            e.cancel = true;
            this.notifyDisableDate();
        }
        this.applyDisableDatesToDateEditors(e.form);
    }

    onAppointmentAdding(e: any) {
        const isValidAppointment = this.isValidAppointment(e.component, e.appointmentData);
        if(!isValidAppointment) {
            e.cancel = true;
            this.notifyDisableDate();
        }
    }

    onAppointmentUpdating(e: any) {
        const isValidAppointment = this.isValidAppointment(e.component, e.newData);
        if(!isValidAppointment) {
            e.cancel = true;
            this.notifyDisableDate();
        }
    }

    notifyDisableDate() {
        notify("Cannot create or move an appointment/event to disabled time/date regions.", "warning", 1000);
    }

    isHoliday(date: Date) {
        const localeDate = date.toLocaleDateString();
        const holidays = this.dataService.getHolidays();
        return holidays.filter(holiday => {
            return holiday.toLocaleDateString() === localeDate;
        }).length > 0;
    }

    isWeekend(date: Date) {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    isDinner(date: Date) {
        const hours = date.getHours();
        const dinnerTime = this.dataService.getDinnerTime();
        return hours >= dinnerTime.from && hours < dinnerTime.to;
    }

    hasCoffeeCupIcon(date: Date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const dinnerTime = this.dataService.getDinnerTime();

        return hours === dinnerTime.from && minutes === 0;
    }

    isValidAppointment(component: any, appointmentData: any) {
        const startDate = new Date(appointmentData.startDate);
        const endDate = new Date(appointmentData.endDate);
        const cellDuration = component.option('cellDuration');
        return this.isValidAppointmentInterval(startDate, endDate, cellDuration);
    }

    isValidAppointmentInterval(startDate: Date, endDate: Date, cellDuration: number) {
        const edgeEndDate = new Date(endDate.getTime() - 1);

        if(!this.isValidAppointmentDate(edgeEndDate)) {
            return false;
        }

        const durationInMs = cellDuration * 60 * 1000;
        const date = startDate;
        while(date <= endDate) {
            if(!this.isValidAppointmentDate(date)) {
                return false;
            }
            const newDateTime = date.getTime() + durationInMs - 1;
            date.setTime(newDateTime);
        }

        return true;
    }

    isValidAppointmentDate(date: Date) {
        return !this.isHoliday(date) && !this.isDinner(date) && !this.isWeekend(date);
    }

    applyDisableDatesToDateEditors(form: any) {
        const holidays = this.dataService.getHolidays();
        const startDateEditor = form.getEditor('startDate');
        startDateEditor.option('disabledDates', holidays);

        const endDateEditor = form.getEditor('endDate');
        endDateEditor.option('disabledDates', holidays);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSchedulerModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
