import { NgModule, Component, enableProdMode } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {DxSchedulerModule} from 'devextreme-angular';
import * as AspNetData from "devextreme-aspnet-data-nojquery";

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    appointmentsData: any;
    currentDate: Date = new Date(2021, 4, 25);

    constructor() {
        var url = "https://js.devexpress.com/Demos/Mvc/api/SchedulerData";

        this.appointmentsData = AspNetData.createStore({
            key: "AppointmentId",
            loadUrl: url + "/Get",
            insertUrl: url + "/Post",
            updateUrl: url + "/Put",
            deleteUrl: url + "/Delete",
            onBeforeSend: function (method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });
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