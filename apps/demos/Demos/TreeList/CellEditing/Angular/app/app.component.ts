import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
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
    DxTreeListModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tasksData = this.service.getTasksData();

  readonly employeesData = this.service.getEmployeesData();

  readonly statusesData = [
    'Not Started',
    'Need Assistance',
    'In Progress',
    'Deferred',
    'Completed',
  ];

  initNewRow(e: DxTreeListTypes.InitNewRowEvent) {
    e.data.Task_Status = 'Not Started';
    e.data.Task_Start_Date = new Date();
    e.data.Task_Due_Date = new Date();
  }
}

bootstrapApplication(AppComponent);
