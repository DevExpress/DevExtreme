import {
  Component, NgModule, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxCalendarModule,
  DxButtonModule,
  DxCalendarComponent,
} from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  @ViewChild(DxCalendarComponent, { static: false }) calendar: DxCalendarComponent;

  now: Date = new Date();

  value: any = [new Date(), new Date(new Date().getTime() + 1000 * 60 * 60 * 24)];

  selectionModes: string[] = [
    'single', 'multiple', 'range',
  ];

  selectionMode = 'multiple';

  minDateValue: Date | null = null;

  maxDateValue: Date | null = null;

  disabledDates: Function | null = null;

  isWeekend(date) {
    const day = date.getDay();

    return day === 0 || day === 6;
  }

  setMinDate({ value }) {
    this.minDateValue = value
      ? new Date(this.now.getTime() - 1000 * 60 * 60 * 24 * 3)
      : null;
  }

  setMaxDate({ value }) {
    this.maxDateValue = value
      ? new Date(this.now.getTime() + 1000 * 60 * 60 * 24 * 3)
      : null;
  }

  disableWeekend({ value }) {
    this.disabledDates = value
      ? (data) => data.view === 'month' && this.isWeekend(data.date)
      : null;
  }

  clearValue() {
    this.calendar.instance.clear();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSelectBoxModule,
    DxCalendarModule,
    DxCheckBoxModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
