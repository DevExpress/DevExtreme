import {
  NgModule, Component, enableProdMode, Pipe, PipeTransform,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerComponent, DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { DxFormComponent } from 'devextreme-angular/ui/form';
import { DataService } from './app.service';

@Pipe({ name: 'apply' })
export class ApplyPipe<TArgs, TReturn> implements PipeTransform {
  transform(func: ((...args: TArgs[]) => TReturn), ...args: TArgs[]): TReturn { return func(...args); }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [DataService],
})
export class AppComponent {
  dataSource: DataSource;

  dinnerTime = this.dataService.getDinnerTime();

  holidays = this.dataService.getHolidays();

  currentDate = new Date(2021, 3, 27);

  views = ['workWeek', 'month'];

  currentView = this.views[0];

  ariaDescription = () => {
    const disabledDates = this.holidays.map(date => {
        if (this.isWeekend(date)) {
          return null;
        }
        return new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
    ).filter(dateText => dateText);
    
    if (disabledDates?.length > 0) {
      return disabledDates.map(dateText => `${dateText} is a disabled date`).join('. ');
    }
  };

  constructor(public dataService: DataService) {
    this.dataSource = new DataSource({
      store: dataService.getData(),
    });
  }

  onContentReady = (e: DxSchedulerTypes.ContentReadyEvent) => {
    this.setComponentAria(e.component?.$element());
  }

  onOptionChanged = (e: DxSchedulerTypes.OptionChangedEvent) => {
    if (e.name === 'currentView') {
      this.currentView = e.value;
    }
  };

  onAppointmentFormOpening = (e: DxSchedulerTypes.AppointmentFormOpeningEvent) => {
    const startDate = e.appointmentData.startDate as Date;
    if (!this.isValidAppointmentDate(startDate)) {
      e.cancel = true;
      this.notifyDisableDate();
    }
    this.applyDisableDatesToDateEditors(e.form);
  };

  onAppointmentAdding = (e: DxSchedulerTypes.AppointmentAddingEvent) => {
    const isValidAppointment = this.isValidAppointment(e.component, e.appointmentData);
    if (!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  };

  onAppointmentUpdating = (e: DxSchedulerTypes.AppointmentUpdatingEvent) => {
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

  isValidAppointment = (component: DxSchedulerComponent['instance'], appointmentData: DxSchedulerTypes.Appointment) => {
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

  applyDisableDatesToDateEditors = (form: DxFormComponent['instance']) => {
    const holidays = this.dataService.getHolidays();
    const startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', holidays);

    const endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', holidays);
  };

  setComponentAria(element): void {
    element?.attr({
      'role': 'grid',
      'aria-label': 'Scheduler',
      'aria-roledescription': this.ariaDescription(),
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent, ApplyPipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
