import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeListModule } from 'devextreme-angular';
import {
  Service, Task, Employee, Priority,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  tasks: Task[];

  employees: Employee[];

  priorities: Priority[];

  statuses: string[];

  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.employees = service.getEmployees();
    this.priorities = service.getPriorities();

    this.statuses = [
      'Not Started',
      'Need Assistance',
      'In Progress',
      'Deferred',
      'Completed',
    ];
  }

  getCompletionText(cellInfo) {
    return `${cellInfo.valueText}%`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxTreeListModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
