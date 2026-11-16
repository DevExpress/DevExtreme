import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import {
  DxCardViewModule,
} from 'devextreme-angular';
import { Service } from './app.service';
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
  readonly tasks = inject(Service).getTasks();
}

bootstrapApplication(AppComponent, {
  providers: [
    Service,
  ],
});
