import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxDataGridModule, DxCheckBoxModule } from 'devextreme-angular';

import { Service, Employee, Task, Status } from './app.service';

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
    tasks: Array<Task>;
    employees: Array<Employee>;
    statuses: Array<Status>;
    showDragIcons: boolean;

    constructor(service: Service) {
        this.tasks = service.getTasks();

        this.employees = service.getEmployees();

        this.statuses = service.getStatuses();

        this.showDragIcons = true;

        this.onReorder = this.onReorder.bind(this);
    }

    onReorder(e) {
        var visibleRows = e.component.getVisibleRows(),
            toIndex = this.tasks.indexOf(visibleRows[e.toIndex].data),
            fromIndex = this.tasks.indexOf(e.itemData);

        this.tasks.splice(fromIndex, 1);
        this.tasks.splice(toIndex, 0, e.itemData);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxCheckBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);