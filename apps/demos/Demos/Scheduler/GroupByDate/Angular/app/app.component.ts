import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSchedulerModule, DxSwitchModule } from 'devextreme-angular';
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
    DxSchedulerModule,
    DxSwitchModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly appointmentsData = this.service.getAppointments();

  readonly currentDate = new Date(2021, 3, 21);

  readonly prioritiesData = this.service.getPriorities();

  readonly groupByDate = signal(true);
}

bootstrapApplication(AppComponent);
