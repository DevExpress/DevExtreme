import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { DxSpeedDialActionModule, DxSchedulerModule, DxSchedulerComponent } from 'devextreme-angular';
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
    DxSpeedDialActionModule,
  ],
})
export class AppComponent {
  private readonly scheduler = viewChild.required(DxSchedulerComponent);

  private readonly service = inject(Service);

  readonly appointments = this.service.getAppointments();

  readonly currentDate = signal(new Date(2021, 2, 25));

  readonly cellDuration = 30;

  readonly priorities = this.service.getResources();

  showAppointmentPopup() {
    this.scheduler().instance.showAppointmentPopup();
  }
}

bootstrapApplication(AppComponent);
