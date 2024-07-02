import {
  NgModule, Component, enableProdMode, Pipe, PipeTransform,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { Service, Employee, Data } from './app.service';

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
  providers: [Service],
})
export class AppComponent {
  dataSource: DataSource;

  currentDate: Date = new Date(2021, 5, 2, 11, 30);

  resourcesDataSource: Employee[];

  constructor(service: Service) {
    this.dataSource = new DataSource({
      store: service.getData(),
    });

    this.resourcesDataSource = service.getEmployees();
  }

  markWeekEnd = (cellData: Data & { groups: Data }) => {
    function isWeekEnd(date: Date) {
      const day = date.getDay();
      return day === 0 || day === 6;
    }
    const classObject = {};
    classObject[`employee-${cellData.groups.employeeID}`] = true;
    classObject[`employee-weekend-${cellData.groups.employeeID}`] = isWeekEnd(cellData.startDate);
    return classObject;
  };

  markTraining = (cellData: Data & { groups: Data }) => {
    const classObject = {
      'day-cell': true,
    };

    classObject[AppComponent.getCurrentTraining(cellData.startDate.getDate(), cellData.groups.employeeID)] = true;
    return classObject;
  };

  static getCurrentTraining = (date: number, employeeID: number) => `training-background-${(date + employeeID) % 3}`;
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
