import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';
import { Service, Employee } from './app.service';

import DataSource from 'devextreme/data/data_source';

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
    dataSource: any;
    currentDate: Date = new Date(2021, 7, 2, 11, 30);
    resourcesDataSource: Employee[];

    constructor(service: Service) {
        this.dataSource = new DataSource({
            store: service.getData()
        });

        this.resourcesDataSource = service.getEmployees();
    }

    markWeekEnd(cellData) {
        function isWeekEnd(date) {
            var day = date.getDay();
            return day === 0 || day === 6;
        }
        var classObject = {};
        classObject["employee-" + cellData.groups.employeeID] = true;
        classObject['employee-weekend-' + cellData.groups.employeeID] = isWeekEnd(cellData.startDate)
        return classObject;
    }

    markTraining(cellData) {
        var classObject = {
            "day-cell": true
        }

        classObject[AppComponent.getCurrentTraining(cellData.startDate.getDate(), cellData.groups.employeeID)] = true;
        return classObject;
    }

    static getCurrentTraining(date, employeeID) {
        var result = (date + employeeID) % 3,
            currentTraining = "training-background-" + result;

        return currentTraining;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSchedulerModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
