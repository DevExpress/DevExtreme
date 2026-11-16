import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSchedulerModule, DxRadioGroupModule } from 'devextreme-angular';
import type { DxRadioGroupTypes } from 'devextreme-angular/ui/radio-group';
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
  readonly appointmentsData = inject(Service).getAppointments();

  readonly currentDate = new Date(2021, 2, 28);

  readonly views = [
    {
      type: 'day',
      name: '4 Days',
      intervalCount: 4,
    },
    'week',
  ];

  readonly allDayPanelMode = signal('allDay');

  readonly allDayPanelModes = ['all', 'allDay', 'hidden'];

  onChangeAllDayPanelMode(e: DxRadioGroupTypes.ValueChangedEvent) {
    this.allDayPanelMode.set(e.value);
  }
}

bootstrapApplication(AppComponent);
