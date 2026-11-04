import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly year = 2025;

  readonly months = inject(Service).getMonths();

  readonly selectedMonth = signal(1);

  private readonly startOfMonthStr = (month) => `${month}/01/${this.year}`;

  private readonly endOfMonthStr = (month) => {
    const nextMonth = (month === 12) ? 1 : month + 1;
    const nextYear = (month === 12) ? this.year + 1 : this.year;

    const lastDay = new Date(nextYear, nextMonth - 1, 0).getDate();

    return `${month}/${lastDay}/${this.year}`;
  };

  readonly chartDataSource = new DataSource({
    key: 'Date',
    load: () => {
      const startVisible = this.startOfMonthStr(this.selectedMonth());
      const endVisible = this.endOfMonthStr(this.selectedMonth());
      const url = 'https://js.devexpress.com/Demos/NetCore/api/TemperatureData'
        + `?startVisible=${encodeURIComponent(startVisible)}`
        + `&endVisible=${encodeURIComponent(endVisible)}`
        + `&startBound=${encodeURIComponent(startVisible)}`
        + `&endBound=${encodeURIComponent(endVisible)}`;

      return fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`Network response fails: ${r.status}`);
          return r.json();
        })
        .then((arr) => arr.map((item) => ({
          ...item,
          Temperature: (item.MinTemp + item.MaxTemp) / 2,
          Date: new Date(item.Date),
        })));
    },
    paginate: false,
  });

  customizeTooltip(arg) {
    return {
      text: `${arg.valueText}&#176C`,
    };
  }

  customizeText(arg) {
    return `${arg.valueText}&#176C`;
  }

  customizeArgumentAxisText(arg) {
    return new Date(arg.value).getDate();
  }

  onValueChanged(data) {
    this.selectedMonth.set(data.value);
    this.chartDataSource.load();
  }
}

bootstrapApplication(AppComponent);
