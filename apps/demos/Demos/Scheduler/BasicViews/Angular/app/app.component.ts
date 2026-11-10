import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
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
  readonly appointmentsData = inject(Service).getAppointments();

  readonly currentDate = new Date(2021, 3, 29);
}

bootstrapApplication(AppComponent);
