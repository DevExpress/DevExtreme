import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSchedulerModule, DxRadioGroupModule } from 'devextreme-angular';
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
    DxSchedulerModule,
    DxRadioGroupModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly appointmentsData = this.service.getAppointments();

  readonly assignees = this.service.getAssignees();

  readonly rooms = this.service.getRooms();

  readonly priorities = this.service.getPriorities();

  readonly resourcesList = ['Assignee', 'Room', 'Priority'];

  readonly currentDate = new Date(2021, 3, 27);

  readonly currentResource = signal(this.resourcesList[0]);
}

bootstrapApplication(AppComponent);
