import {
  NgModule, Component, enableProdMode, Pipe, PipeTransform,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';
import {
  OptionChangedEvent, AppointmentFormOpeningEvent, AppointmentAddingEvent, AppointmentUpdatingEvent,
} from 'devextreme/ui/scheduler';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { DataService } from './app.service';

@Pipe({ name: 'apply' })
export class ApplyPipe<TArgs, TReturn> implements PipeTransform {
  transform(func: ((...args: TArgs[]) => TReturn), ...args: TArgs[]): TReturn { return func(...args); }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [DataService],
})
export class AppComponent {
  dataSource: DataSource;

  dinnerTime = this.dataService.getDinnerTime();

  holidays = this.dataService.getHolidays();

  currentDate = new Date(2021, 3, 27);

  views = ['workWeek', 'month'];

  currentView = this.views[0];

  constructor(public dataService: DataService) {
    this.dataSource = new DataSource({
      store: dataService.getData(),
    });
  }

  onOptionChanged = (e: OptionChangedEvent) => {
    if (e.name === 'currentView') {
      this.currentView = e.value;
    }
  };

  onAppointmentFormOpening = (e: AppointmentFormOpeningEvent) => {
    const startDate = e.appointmentData.startDate as Date;
    if (!this.isValidAppointmentDate(startDate)) {
      e.cancel = true;
      this.notifyDisableDate();
    }
    this.applyDisableDatesToDateEditors(e.form);
  };

  onAppointmentAdding = (e: AppointmentAddingEvent) => {
    const isValidAppointment = this.isValidAppointment(e.component, e.appointmentData);
    if (!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  };

  onAppointmentUpdating = (e: AppointmentUpdatingEvent) => {
    const isValidAppointment = this.isValidAppointment(e.component, e.newData);
    if (!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  };

  notifyDisableDate = () => {
    notify('Cannot create or move an appointment/event to disabled time/date regions.', 'warning', 1000);
  };

  isHoliday = (date: Date) => {
    const localeDate = date.toLocaleDateString();
    return this.holidays.filter((holiday) => holiday.toLocaleDateString() === localeDate).length > 0;
  };

  isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  isDinner = (date: Date) => {
    const hours = date.getHours();
    return hours >= this.dinnerTime.from && hours < this.dinnerTime.to;
  };

  isDisableDate = (date: Date) => this.isHoliday(date) || this.isWeekend(date);

  isDisabledDateCell = (date: Date) => (this.currentView === 'month' ? this.isWeekend(date) : this.isDisableDate(date));

  hasCoffeeCupIcon = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return hours === this.dinnerTime.from && minutes === 0;
  };

  isValidAppointment = (component: any, appointmentData: any) => {
    const startDate = new Date(appointmentData.startDate);
    const endDate = new Date(appointmentData.endDate);
    const cellDuration = component.option('cellDuration');
    return this.isValidAppointmentInterval(startDate, endDate, cellDuration);
  };

  isValidAppointmentInterval = (startDate: Date, endDate: Date, cellDuration: number) => {
    const edgeEndDate = new Date(endDate.getTime() - 1);

    if (!this.isValidAppointmentDate(edgeEndDate)) {
      return false;
    }

    const durationInMs = cellDuration * 60 * 1000;
    const date = startDate;
    while (date <= endDate) {
      if (!this.isValidAppointmentDate(date)) {
        return false;
      }
      const newDateTime = date.getTime() + durationInMs - 1;
      date.setTime(newDateTime);
    }

    return true;
  };

  isValidAppointmentDate = (date: Date) => !this.isHoliday(date) && !this.isDinner(date) && !this.isWeekend(date);

  applyDisableDatesToDateEditors = (form: any) => {
    const holidays = this.dataService.getHolidays();
    const startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', holidays);

    const endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', holidays);
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent, ApplyPipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
