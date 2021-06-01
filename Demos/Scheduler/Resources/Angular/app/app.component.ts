import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Appointment, Service, Assignee, Room, Priority } from './app.service';
import { DxSchedulerModule, DxRadioGroupModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service],
    preserveWhitespaces: true
})
export class AppComponent {
    appointmentsData: Appointment[];
    assignees: Assignee[];
    rooms: Room[];
    priorities: Priority[];
    resourcesList: string[] = ["Assignee", "Room", "Priority"];
    currentDate: Date = new Date(2021, 3, 27);
    selectedResource: string = this.resourcesList[0];

    constructor(service: Service) {
        this.appointmentsData = service.getAppointments();
        this.assignees = service.getAssignees();
        this.rooms = service.getRooms();
        this.priorities = service.getPriorities();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSchedulerModule,
        DxRadioGroupModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
