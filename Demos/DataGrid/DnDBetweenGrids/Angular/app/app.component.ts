import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule } from 'devextreme-angular';
import { Priority, Service } from './app.service';
import * as AspNetData from "devextreme-aspnet-data-nojquery";

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true,
    providers: [Service]
})
export class AppComponent {
    statuses: Array<number>;
    dataSource: any;
    priorities: Array<Priority>;
    url: string;
    tasksStore: any;

    constructor(service: Service) {
        this.url = "https://js.devexpress.com/Demos/Mvc/api/DnDBetweenGrids";

        this.priorities = service.getPriorities();
        this.statuses = [1, 2];
        this.tasksStore = AspNetData.createStore({
            key: "ID",
            loadUrl: this.url + "/Tasks",
            updateUrl: this.url + "/UpdateTask",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        }),

        this.dataSource = {
            store: this.tasksStore,
            reshapeOnPush: true
        };

        this.onAdd = this.onAdd.bind(this);
    }

    onAdd(e) {
        var key = e.itemData.ID,
            values = { Status: e.toData };

        this.tasksStore.update(key, values).then(() => {
            this.tasksStore.push([{
                type: "update", key: key, data: values
            }])
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
