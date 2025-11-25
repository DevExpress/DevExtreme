import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTreeListModule } from 'devextreme-angular';
import { Task, Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  providers: [Service],
  imports: [
    DxTreeListModule,
  ],
})
export class AppComponent {
  tasksData: Task[];

  statusesData: string[];

  employeesData: Employee[];

  constructor(service: Service) {
    this.tasksData = service.getTasksData();
    this.employeesData = service.getEmployeesData();
    this.statusesData = [
      'Not Started',
      'Need Assistance',
      'In Progress',
      'Deferred',
      'Completed',
    ];
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
