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
  private readonly service = inject(Service);

  readonly appointmentsData = this.service.getAppointments();

  readonly currentDate = new Date(2020, 10, 25);

  readonly resourcesData = this.service.getResources();
}

bootstrapApplication(AppComponent);
