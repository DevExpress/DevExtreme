import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, Pipe, type PipeTransform,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { DxSchedulerModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
import { Service, type Data } from './app.service';

@Pipe({ name: 'apply', standalone: true })
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
  providers: [Service],
  imports: [
    DxSchedulerModule,
    ApplyPipe,
    NgClass,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = new DataSource({
    store: this.service.getData(),
  });

  readonly currentDate = new Date(2021, 5, 2, 11, 30);

  readonly resourcesDataSource = this.service.getEmployees();

  readonly markWeekEnd = (cellData: Data & { groups: Data }) => {
    function isWeekEnd(date: Date) {
      const day = date.getDay();
      return day === 0 || day === 6;
    }
    const classObject = {};
    classObject[`employee-${cellData.groups.employeeID}`] = true;
    classObject[`employee-weekend-${cellData.groups.employeeID}`] = isWeekEnd(cellData.startDate);
    return classObject;
  };

  readonly markTraining = (cellData: Data & { groups: Data }) => {
    const classObject = {
      'day-cell': true,
    };

    classObject[AppComponent.getCurrentTraining(cellData.startDate.getDate(), cellData.groups.employeeID)] = true;
    return classObject;
  };

  static getCurrentTraining = (date: number, employeeID: number) => `training-background-${(date + employeeID) % 3}`;
}

bootstrapApplication(AppComponent);
