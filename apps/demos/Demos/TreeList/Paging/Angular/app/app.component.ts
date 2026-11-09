import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxTreeListModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxTreeListModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tasksData = this.service.getTasksData();

  readonly statusesData = [
    'Not Started',
    'Need Assistance',
    'In Progress',
    'Deferred',
    'Completed',
  ];

  readonly employeesData = this.service.getEmployeesData();
}

bootstrapApplication(AppComponent);
