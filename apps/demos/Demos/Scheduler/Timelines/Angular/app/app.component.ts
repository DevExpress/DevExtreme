import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxSelectBoxModule } from 'devextreme-angular';
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

  snapToCellsMode: 'auto' | 'always' | 'never' = 'always';
  private schedulerInstance: any;
  private pendingScrollLeft: number | undefined;

  snapToCellsModeItems = [
    { value: 'auto' as const, text: 'Auto' },
    { value: 'always' as const, text: 'Always' },
    { value: 'never' as const, text: 'Never' },
  ];

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
    this.resourcesData = service.getResources();
    this.prioritiesData = service.getPriorities();
  }

  onSnapToCellsModeChanged(e: DxSelectBoxTypes.ValueChangedEvent): void {
    this.pendingScrollLeft = this.schedulerInstance?.getWorkSpaceScrollable?.()?.scrollLeft?.() ?? 0;
    this.snapToCellsMode = e.value;
  }

  onSchedulerInitialized(e: { component: any }): void {
    this.schedulerInstance = e.component;
  }

  onSchedulerContentReady(): void {
    if (this.pendingScrollLeft === undefined) {
      return;
    }

    this.schedulerInstance?.getWorkSpaceScrollable?.()?.scrollTo?.({ x: this.pendingScrollLeft });
    this.pendingScrollLeft = undefined;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
