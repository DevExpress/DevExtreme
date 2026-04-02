import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxSelectBoxModule } from 'devextreme-angular';
import type { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import type { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import {
  Priority, Resource, Appointment, Service,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxSchedulerModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  appointmentsData: Appointment[];

  resourcesData: Resource[];

  prioritiesData: Priority[];

  currentDate: Date = new Date(2021, 1, 2);

  snapToCellsMode: DxSchedulerTypes.SnapToCellsMode = 'always';

  snapToCellsModeItems = [
    { value: 'auto', text: 'Auto' },
    { value: 'always', text: 'Always' },
    { value: 'never', text: 'Never' },
  ];

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
    this.resourcesData = service.getResources();
    this.prioritiesData = service.getPriorities();
  }

  onSnapToCellsModeChanged(e: DxSelectBoxTypes.ValueChangedEvent): void {
    this.snapToCellsMode = e.value;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
