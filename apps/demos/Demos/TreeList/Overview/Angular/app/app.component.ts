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
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxTreeListModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tasks = this.service.getTasks();

  readonly employees = this.service.getEmployees();

  readonly priorities = this.service.getPriorities();

  readonly statuses = [
    'Not Started',
    'Need Assistance',
    'In Progress',
    'Deferred',
    'Completed',
  ];

  getCompletionText(cellInfo) {
    return `${cellInfo.valueText}%`;
  }
}

bootstrapApplication(AppComponent);
