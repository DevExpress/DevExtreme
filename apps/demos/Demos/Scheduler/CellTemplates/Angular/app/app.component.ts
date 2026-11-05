import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, Pipe, signal, type PipeTransform,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { type DxSchedulerComponent, DxSchedulerModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
import notify from 'devextreme/ui/notify';
import type { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import type { DxFormComponent } from 'devextreme-angular/ui/form';
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
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService],
  imports: [
    DxSchedulerModule,
    ApplyPipe,
    DatePipe,
  ],
})
export class AppComponent {
  private readonly dataService = inject(DataService);

  readonly dataSource = new DataSource({
    store: this.dataService.getData(),
  });

  private readonly dinnerTime = this.dataService.getDinnerTime();

  private readonly holidays = this.dataService.getHolidays();

  readonly currentDate = new Date(2021, 3, 27);

  readonly views = ['workWeek', 'month'];

  readonly currentView = signal(this.views[0]);

  private readonly formatHour = (hours: number) => new Date(2021, 0, 1, hours).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  private readonly disabledDatesDescription = () => {
    const disabledDates = this.holidays
      .filter((date) => !this.isWeekend(date))
      .map((date) => new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      );
    if (disabledDates?.length === 1) {
      return `${disabledDates} is a disabled date`;
    }
    if (disabledDates?.length > 1) {
      return `${disabledDates.join(', ')} are disabled dates`;
    }
    return '';
  };

  private readonly disabledTimeDescription = () => {
    const from = this.formatHour(this.dinnerTime.from);
    const to = this.formatHour(this.dinnerTime.to);
    return `The time range from ${from} to ${to} is disabled on all days`;
  };

  private readonly ariaDescription = () => [this.disabledDatesDescription(), this.disabledTimeDescription()]
    .filter(Boolean)
    .join('. ');

  readonly onContentReady = (e: DxSchedulerTypes.ContentReadyEvent) => {
    this.setComponentAria(e.component?.$element());
  };

  readonly onOptionChanged = (e: DxSchedulerTypes.OptionChangedEvent) => {
    if (e.name === 'currentView') {
      this.currentView.set(e.value);
    }
  };

  readonly onAppointmentFormOpening = (e: DxSchedulerTypes.AppointmentFormOpeningEvent) => {
    const startDate = e.appointmentData.startDate as Date;
    if (!this.isValidAppointmentDate(startDate)) {
      e.cancel = true;
      this.notifyDisableDate();
    }
    this.applyDisableDatesToDateEditors(e.form);
  };

  readonly onAppointmentAdding = (e: DxSchedulerTypes.AppointmentAddingEvent) => {
    const isValidAppointment = this.isValidAppointment(e.component, e.appointmentData);
    if (!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  };

  readonly onAppointmentUpdating = (e: DxSchedulerTypes.AppointmentUpdatingEvent) => {
    const isValidAppointment = this.isValidAppointment(e.component, e.newData);
    if (!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  };

  private readonly notifyDisableDate = () => {
    notify('Cannot create or move an appointment/event to disabled time/date regions.', 'warning', 1000);
  };

  private readonly isHoliday = (date: Date) => {
    const localeDate = date.toLocaleDateString();
    return this.holidays.filter((holiday) => holiday.toLocaleDateString() === localeDate).length > 0;
  };

  private readonly isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  readonly isDinner = (date: Date) => {
    const hours = date.getHours();
    return hours >= this.dinnerTime.from && hours < this.dinnerTime.to;
  };

  readonly isDisableDate = (date: Date) => this.isHoliday(date) || this.isWeekend(date);

  readonly isDisabledDateCell = (date: Date) => (this.currentView() === 'month' ? this.isWeekend(date) : this.isDisableDate(date));

  readonly hasCoffeeCupIcon = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return hours === this.dinnerTime.from && minutes === 0;
  };

  private readonly isValidAppointment = (component: DxSchedulerComponent['instance'], appointmentData: DxSchedulerTypes.Appointment) => {
    const startDate = new Date(appointmentData.startDate);
    const endDate = new Date(appointmentData.endDate);
    const cellDuration = component.option('cellDuration');
    return this.isValidAppointmentInterval(startDate, endDate, cellDuration);
  };

  private readonly isValidAppointmentInterval = (startDate: Date, endDate: Date, cellDuration: number) => {
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

  private readonly isValidAppointmentDate = (date: Date) => !this.isHoliday(date) && !this.isDinner(date) && !this.isWeekend(date);

  private readonly applyDisableDatesToDateEditors = (form: DxFormComponent['instance']) => {
    const holidays = this.dataService.getHolidays();
    const startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', holidays);

    const endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', holidays);
  };

  private setComponentAria(element): void {
    const prevAria = element?.attr('aria-label') || '';
    const description = this.ariaDescription();
    const nextAria = `${prevAria}${description ? ` ${description}` : ''}`;
    element?.attr('aria-label', nextAria);
  }
}

bootstrapApplication(AppComponent);
