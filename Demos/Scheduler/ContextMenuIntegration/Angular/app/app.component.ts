import { NgModule, Component, enableProdMode, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {Appointment, Resource, ResourceMenuItem, Service} from './app.service';
import { DxContextMenuModule, DxContextMenuComponent } from 'devextreme-angular';
import {DxSchedulerModule, DxSchedulerComponent} from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
})

export class AppComponent {
    @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;
    @ViewChild('contextMenu', { static: false }) contextMenu: DxContextMenuComponent;
    
    appointmentsData: Appointment[];
    currentDate: Date = new Date(2020, 10, 25);
    resourcesData: Resource[];
    groups: any;
    crossScrollingEnabled: boolean = false;

    dataSource: any[] = [];
    disabled: boolean = true;
    target: any;
    onContextMenuItemClick: any;
    cellContextMenuItems: any[];
    appointmentContextMenuItems: any[];
    
    constructor(service: Service) {
        const that = this;
        const resourcesMenuItems = [];
        that.resourcesData = service.getResources();
        that.appointmentsData = service.getAppointments();
        that.cellContextMenuItems = [
            { text: 'New Appointment', onItemClick: that.createAppointment },
            { text: 'New Recurring Appointment', onItemClick: that.createRecurringAppointment },
            { text: 'Group by Room/Ungroup', beginGroup: true, onItemClick: that.groupCell },
            { text: 'Go to Today', onItemClick: that.showCurrentDate }
        ];
        
        that.resourcesData.forEach(function (item) {
            let menuItem: ResourceMenuItem = {
                text: item.text,
                id: item.id,
                color: item.color,
                onItemClick: that.setResource.bind(that)
            }

            resourcesMenuItems.push(menuItem);
        });

        that.appointmentContextMenuItems = [
            { text: 'Open', onItemClick: this.showAppointment },
            { text: 'Delete', onItemClick: this.deleteAppointment },
            { text: 'Repeat Weekly', beginGroup: true, onItemClick: this.repeatAppointmentWeekly },
            { text: 'Set Room', beginGroup: true, disabled: true }
        ];
        
        that.appointmentContextMenuItems = that.appointmentContextMenuItems.concat(resourcesMenuItems);
    }
    
    setResource(e, clickEvent) {
        const itemData = e.appointmentData;

      e.component.updateAppointment(itemData, {
            itemData,
            ...{ roomId: [clickEvent.itemData.id] }
        });
    }

    createAppointment(e) {
      e.component.showAppointmentPopup({
          startDate: e.cellData.startDate
        }, true);
    }

    createRecurringAppointment(e) {
      e.component.showAppointmentPopup({
          startDate: e.cellData.startDate,
            recurrenceRule: "FREQ=DAILY"
        }, true);
    }
    
    groupCell() {
        if(this.groups && this.groups.length) {
            this.crossScrollingEnabled = false;
            this.groups=[];
        } else {
            this.groups = ["roomId"];
            this.crossScrollingEnabled = true;
        };
    }

    showCurrentDate() {
        this.currentDate = new Date();
    }

    showAppointment(e) {
      e.component.showAppointmentPopup(e.appointmentData);
    }
    
    deleteAppointment(e) {
      e.component.deleteAppointment(e.appointmentData);
    }
    
    repeatAppointmentWeekly(e) {
      const itemData = e.appointmentData;

      e.component.updateAppointment(itemData, {
        itemData, ...{
          startDate: e.targetedAppointmentData.startDate,
          recurrenceRule: "FREQ=WEEKLY"
        }
      });
    }

    onItemClick(contextMenuEvent) {
        return function (e) {
            e.itemData.onItemClick(contextMenuEvent, e);
        }
    }

    onAppointmentContextMenu(e) {
        this.target = ".dx-scheduler-appointment";
        this.disabled = false;
        this.dataSource = this.appointmentContextMenuItems;
        this.onContextMenuItemClick = this.onItemClick(e);
    }

    onCellContextMenu(e) {
        this.target = ".dx-scheduler-date-table-cell";
        this.disabled = false;
        this.dataSource = this.cellContextMenuItems;
        this.onContextMenuItemClick = this.onItemClick(e);
    }

    onContextMenuHiding() {
        this.disabled = true;
        this.dataSource = [];
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSchedulerModule,
        DxContextMenuModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);