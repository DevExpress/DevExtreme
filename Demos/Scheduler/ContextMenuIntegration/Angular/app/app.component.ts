import {
  NgModule, Component, enableProdMode, ViewChild, ViewChildren, QueryList,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxContextMenuModule, DxSchedulerModule, DxSchedulerComponent } from 'devextreme-angular';

import { AppointmentContextMenuEvent, CellContextMenuEvent } from 'devextreme/ui/scheduler';
import { Item, ItemClickEvent, ItemContextMenuEvent } from 'devextreme/ui/context_menu';
import { Appointment, Resource, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type ContextMenuItemClick = ItemClickEvent & {
  itemData: ContextMenuItem
};
type ContextMenuItem = Item & {
  onItemClick?: (e: ContextMenuItemClick) => void;
  id?: Resource['id'];
};

const appointmentClassName = '.dx-scheduler-appointment';
const cellClassName = '.dx-scheduler-date-table-cell';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})

export class AppComponent {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler!: DxSchedulerComponent;

  appointmentsData!: Appointment[];

  currentDate: Date = new Date(2020, 10, 25);

  resourcesData: Resource[];

  groups: any;

  crossScrollingEnabled = false;

  contextMenuItems: ContextMenuItem[] = [];

  disabled = true;

  target: string = appointmentClassName;

  constructor(service: Service) {
    this.resourcesData = service.getResources();
    this.appointmentsData = service.getAppointments();
  }

  onAppointmentContextMenu({ appointmentData, targetedAppointmentData }: AppointmentContextMenuEvent) {
    const scheduler = this.scheduler.instance;
    const resourceItems: ContextMenuItem[] = this.resourcesData
      .map((item) => ({
        ...item,
        onItemClick: ({ itemData }) => scheduler.updateAppointment(appointmentData, {
          ...appointmentData,
          ...{ roomId: [itemData.id] },
        }),
      }));
    this.target = appointmentClassName;
    this.disabled = false;
    this.contextMenuItems = [
      {
        text: 'Open',
        onItemClick: () => scheduler.showAppointmentPopup(appointmentData),
      },
      {
        text: 'Delete',
        onItemClick: () => scheduler.deleteAppointment(appointmentData),
      },
      {
        text: 'Repeat Weekly',
        beginGroup: true,
        onItemClick: () => scheduler.updateAppointment(appointmentData, {
          startDate: targetedAppointmentData.startDate,
          recurrenceRule: 'FREQ=WEEKLY',
        }),
      },
      { text: 'Set Room', beginGroup: true, disabled: true },
      ...resourceItems,
    ];
  }

  onCellContextMenu({ cellData }: CellContextMenuEvent) {
    const scheduler = this.scheduler.instance;
    this.target = cellClassName;
    this.disabled = false;
    this.contextMenuItems = [
      {
        text: 'New Appointment',
        onItemClick: () => scheduler.showAppointmentPopup(
          { startDate: cellData.startDate },
          true,
        ),
      },
      {
        text: 'New Recurring Appointment',
        onItemClick: () => scheduler.showAppointmentPopup(
          {
            startDate: cellData.startDate,
            recurrenceRule: 'FREQ=DAILY',
          },
          true,
        ),
      },
      {
        text: 'Group by Room/Ungroup',
        beginGroup: true,
        onItemClick: () => {
          if (this.groups) {
            this.crossScrollingEnabled = false;
            this.groups = null;
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

  onContextMenuItemClick(e: ContextMenuItemClick) {
    e.itemData.onItemClick(e);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
    DxContextMenuModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
