import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';
import { Service, PriorityData, TypeData } from './app.service';

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
    currentDate: Date = new Date(2021, 3, 27);
    priorityData: PriorityData[];
    typeData: TypeData[];

    views: any = ['day', {
        type: 'week',
        groups: ['typeId'],
        dateCellTemplate: 'dateCellTemplate'
    }, {
        type: 'workWeek',
        startDayHour: 9,
        endDayHour: 18,
        groups: ['priorityId'],
        dateCellTemplate: 'dateCellTemplate'
    }, 'month'];

    constructor(service: Service) {
        this.dataSource = new DataSource({
            store: service.getData()
        });

        this.priorityData = service.getPriorityData();
        this.typeData = service.getTypeData();
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