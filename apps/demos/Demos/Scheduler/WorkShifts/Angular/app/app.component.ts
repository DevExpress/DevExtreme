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
  imports: [
    DxSchedulerModule,
    DxRadioGroupModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly appointments = this.service.getAppointments();

  readonly shifts = this.service.getShifts();

  readonly currentShift = signal(this.shifts[0]);

  readonly currentDate = new Date(2021, 2, 30);
}

bootstrapApplication(AppComponent);
