import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxCardViewModule,
} from 'devextreme-angular';
import { Task, Service } from './app.service';
import { CardHeader } from './card-header/card-header.component';
import { PriorityComponent } from './priority/priority.component';
import { EmployeeComponent } from './employee/employee.component';
import { ProgressComponent } from './progress-bar/progress-bar.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxCardViewModule,
    CardHeader,
    PriorityComponent,
    EmployeeComponent,
    ProgressComponent,
  ],
})
export class AppComponent {
  tasks: Task[];

  constructor(service: Service) {
    this.tasks = service.getTasks();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    Service,
  ],
});
