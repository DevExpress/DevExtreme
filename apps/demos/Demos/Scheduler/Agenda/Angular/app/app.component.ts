import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxSchedulerModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly appointmentsData = new ArrayStore({
    key: 'id',
    data: this.service.getAppointments(),
  });

  readonly assignees = this.service.getAssignees();

  readonly priorities = this.service.getPriorities();

  readonly currentDate = new Date(2021, 4, 11);
}

bootstrapApplication(AppComponent);
