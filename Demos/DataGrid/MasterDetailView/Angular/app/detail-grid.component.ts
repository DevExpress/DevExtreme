import { Component, Input, AfterViewInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { Service, Task } from './app.service';

@Component({
    selector: 'detail-grid',
    templateUrl: 'app/detail-grid.component.html',
    styleUrls: ['app/detail-grid.component.css'],
    providers: [Service]
})
export class DetailGridComponent implements AfterViewInit {

    @Input() key: number;
    tasksDataSource: DataSource;
    tasks: Task[];

    constructor(private service: Service) {
        this.tasks = service.getTasks();
    }
    ngAfterViewInit() {
        this.tasksDataSource = new DataSource({
            store: new ArrayStore({
                data: this.tasks,
                key: "ID"
            }),
            filter: ["EmployeeID", "=", this.key]
        })
    }
    completedValue(rowData) {
        return rowData.Status == "Completed";
    }
}


