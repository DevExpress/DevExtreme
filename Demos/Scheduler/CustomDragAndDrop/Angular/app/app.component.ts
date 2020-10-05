import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Appointment, Task, Service } from './app.service';
import { DxSchedulerModule, DxDraggableModule, DxScrollViewModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
})
export class AppComponent {
    draggingGroupName: string = "appointmentsGroup";
    tasks: Task[];
    appointments: Appointment[];
    currentDate: Date = new Date(2021, 4, 24);

    constructor(service: Service) {
        this.tasks = service.getTasks();
        this.appointments = service.getAppointments();
        this.onAppointmentRemove = this.onAppointmentRemove.bind(this);
        this.onAppointmentAdd = this.onAppointmentAdd.bind(this);
    }

    onAppointmentRemove(e) {
        const index = this.appointments.indexOf(e.itemData);

        if (index >= 0) {
            this.appointments.splice(index, 1);
            this.tasks.push(e.itemData);
        }
    }

    onAppointmentAdd(e) {
        const index = this.tasks.indexOf(e.fromData);

        if (index >= 0) {
            this.tasks.splice(index, 1);
            this.appointments.push(e.itemData);
        }
    }

    onListDragStart(e) {
        e.cancel = true;
    }

    onItemDragStart(e) {
        e.itemData = e.fromData;
    }

    onItemDragEnd(e) {
        if (e.toData) {
            e.cancel = true;
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSchedulerModule,
        DxDraggableModule,
        DxScrollViewModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
