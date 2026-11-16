import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import {
  DxSchedulerModule,
  DxSchedulerComponent,
  type DxSchedulerTypes,
} from 'devextreme-angular/ui/scheduler';
import { DxContextMenuModule, type DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';

import { Service, type Resource, type ContextMenuItem } from './app.service';

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
    DxContextMenuModule,
  ],
})

export class AppComponent {
  private readonly scheduler = viewChild.required(DxSchedulerComponent);

  private readonly service = inject(Service);

  readonly appointmentsData = this.service.getAppointments();

  readonly currentDate = signal(new Date(2020, 10, 25));

  readonly resourcesData = this.service.getResources();

  readonly groups = signal<string[]>([]);

  readonly crossScrollingEnabled = signal(false);

  readonly contextMenuItems = signal<ContextMenuItem[]>([]);

  onContextMenuItemClick(e: DxContextMenuTypes.ItemClickEvent<ContextMenuItem>) {
    e.itemData.onItemClick(e);
  }

  onAppointmentContextMenu(e: DxSchedulerTypes.AppointmentContextMenuEvent) {
    const items = this.getAppointmentContextMenuItems(e);
    this.contextMenuItems.set(items);
  }

  onCellContextMenu(e: DxSchedulerTypes.CellContextMenuEvent) {
    const items = this.getCellContextMenuItems(e);
    this.contextMenuItems.set(items);
  }

  onContextMenuHiding() {
    this.contextMenuItems.set([]);
  }

  private getAppointmentContextMenuItems(e: DxSchedulerTypes.AppointmentContextMenuEvent): ContextMenuItem[] {
    const {
      appointmentData: appointment,
      targetedAppointmentData: targetedAppointment,
    } = e;
    const scheduler = this.scheduler().instance;

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

  private getCellContextMenuItems(e: DxSchedulerTypes.CellContextMenuEvent): ContextMenuItem[] {
    const { cellData } = e;
    const scheduler = this.scheduler().instance;

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
          if (this.groups().length) {
            this.crossScrollingEnabled.set(false);
            this.groups.set([]);
          } else {
            this.crossScrollingEnabled.set(true);
            this.groups.set(['roomId']);
          }
        },
      },
      {
        text: 'Go to Today',
        onItemClick: () => {
          this.currentDate.set(new Date());
        },
      },
    ];
  }
}

bootstrapApplication(AppComponent);
