import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { Employee, Service, Task } from './app.service';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';


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
    employees: Employee[];
    tasks: Task[];
    tasksDataSourceStorage: any;
    constructor(private service: Service) {
        this.employees = service.getEmployees();
        this.tasks = service.getTasks();
        this.tasksDataSourceStorage = [];
    }

    completedValue(rowData) {
        return rowData.Status == "Completed";
    }

    getTasks(key) {
        let item = this.tasksDataSourceStorage.find((i) => i.key === key);
        if (!item) {
            item = {
                key: key,
                dataSourceInstance: new DataSource({
                    store: new ArrayStore({
                        data: this.tasks,
                        key: "ID"
                    }),
                    filter: ["EmployeeID", "=", key]
                })
            };
            this.tasksDataSourceStorage.push(item)
        }
        return item.dataSourceInstance;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxTemplateModule

    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);