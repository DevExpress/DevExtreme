import { NgModule, Component, enableProdMode } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';

import {DxSchedulerModule} from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
const url = BASE_PATH + 'api/SchedulerSignalR';
const createStore = () => AspNetData.createStore({
    key: 'AppointmentId',
    loadUrl: url,
    insertUrl: url,
    updateUrl: url,
    deleteUrl: url,
    onBeforeSend: function(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
    }
});

const store1 = createStore();
const store2 = createStore();

const connection = new HubConnectionBuilder()
    .withUrl(BASE_PATH + 'schedulerSignalRHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
    })
    .build();

connection
    .start()
    .then(() => {
        connection.on('update', (key, data) => {
            store1.push([{ type: 'update', key: key, data: data }]);
            store2.push([{ type: 'update', key: key, data: data }]);
        });

        connection.on('insert', (data) => {
            store1.push([{ type: 'insert', data: data }]);
            store2.push([{ type: 'insert', data: data }]);
        });

        connection.on('remove', (key) => {
            store1.push([{ type: 'remove', key: key }]);
            store2.push([{ type: 'remove', key: key }]);
        });
});

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    store1: any;
    store2: any;
    currentDate: Date = new Date(2021, 4, 25);

    constructor() {
        this.store1 = store1;
        this.store2 = store2;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSchedulerModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
