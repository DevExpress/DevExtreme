import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from "devextreme-aspnet-data-nojquery";

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

const url = "https://js.devexpress.com/Demos/Mvc/api/RowReordering";

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    tasksStore: any;
    employeesStore: any;

    constructor() {
        this.tasksStore = AspNetData.createStore({
            key: "ID",
            loadUrl: url + "/Tasks",
            updateUrl: url + "/UpdateTask",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });

        this.employeesStore = AspNetData.createStore({
            key: "ID",
            loadUrl: url + "/Employees",           
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });

        this.onReorder = this.onReorder.bind(this);
    }

    onReorder(e) {
        e.promise = this.processReorder(e);
    }
    
    async processReorder(e) {
        var visibleRows = e.component.getVisibleRows(),
            newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;

        await this.tasksStore.update(e.itemData.ID, { OrderIndex: newOrderIndex });
        await e.component.refresh();
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