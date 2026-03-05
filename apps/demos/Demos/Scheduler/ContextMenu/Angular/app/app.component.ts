import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, ViewChild, provideZoneChangeDetection } from '@angular/core';
import {
  DxSchedulerModule,
  DxSchedulerComponent,
  type DxSchedulerTypes,
} from 'devextreme-angular/ui/scheduler';
import { DxContextMenuModule, type DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';

import { Service, type Appointment, type Resource, type ContextMenuItem } from './app.service';

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
    DxContextMenuModule,
  ],
})

export class AppComponent {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler!: DxSchedulerComponent;

  appointmentsData!: Appointment[];

  currentDate: Date = new Date(2020, 10, 25);

  resourcesData: Resource[];

  groups: string[] = [];

  crossScrollingEnabled = false;

  contextMenuItems: ContextMenuItem[] = [];

  constructor(service: Service) {
    this.resourcesData = service.getResources();
    this.appointmentsData = service.getAppointments();
  }

  onContextMenuItemClick(e: DxContextMenuTypes.ItemClickEvent<ContextMenuItem>) {
    e.itemData.onItemClick(e);
  }

  onAppointmentContextMenu(e: DxSchedulerTypes.AppointmentContextMenuEvent) {
    const items = this.getAppointmentContextMenuItems(e);
    this.contextMenuItems = items;
  }

  onCellContextMenu(e: DxSchedulerTypes.CellContextMenuEvent) {
    const items = this.getCellContextMenuItems(e);
    this.contextMenuItems = items;
  }

  onContextMenuHiding() {
    this.contextMenuItems = [];
  }

  getAppointmentContextMenuItems(e: DxSchedulerTypes.AppointmentContextMenuEvent): ContextMenuItem[] {
    const {
      appointmentData: appointment,
      targetedAppointmentData: targetedAppointment,
    } = e;
    const scheduler = this.scheduler.instance;

    return [
      {
        text: 'Open',
        onItemClick: () => scheduler.showAppointmentPopup(appointment),
      },
      {
        text: 'Delete',
        onItemClick: () => scheduler.deleteAppointment(appointment),
      },
      {
        text: 'Repeat Weekly',
        beginGroup: true,
        onItemClick: () => scheduler.updateAppointment(appointment, {
          ...appointment,
          startDate: targetedAppointment.startDate,
          recurrenceRule: 'FREQ=WEEKLY',
        }),
      },
      {
        text: 'Set Room',
        beginGroup: true,
        disabled: true,
      },
      ...this.resourcesData.map((item) => ({
        ...item,
        onItemClick: ({ itemData }: DxContextMenuTypes.ItemClickEvent<Resource>) => scheduler.updateAppointment(appointment, {
          ...appointment,
          roomId: [itemData.id],
        }),
      })),
    ];
  }

  getCellContextMenuItems(e: DxSchedulerTypes.CellContextMenuEvent): ContextMenuItem[] {
    const { cellData } = e;
    const scheduler = this.scheduler.instance;

    return [
      {
        text: 'New Appointment',
        onItemClick: () => scheduler.showAppointmentPopup(
          { startDate: cellData.startDateUTC },
          true,
        ),
      },
      {
        text: 'New Recurring Appointment',
        onItemClick: () => scheduler.showAppointmentPopup(
          {
            startDate: cellData.startDateUTC,
            recurrenceRule: 'FREQ=DAILY',
          },
          true,
        ),
      },
      {
        text: 'Group by Room/Ungroup',
        beginGroup: true,
        onItemClick: () => {
          if (this.groups.length) {
            this.crossScrollingEnabled = false;
            this.groups = [];
          } else {
            this.crossScrollingEnabled = true;
            this.groups = ['roomId'];
          }
        },
      },
      {
        text: 'Go to Today',
        onItemClick: () => {
          this.currentDate = new Date();
        },
      },
    ];
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
