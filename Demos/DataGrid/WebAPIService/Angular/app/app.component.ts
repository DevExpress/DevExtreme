import { NgModule, Component, enableProdMode, ChangeDetectionStrategy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from "devextreme-aspnet-data-nojquery";

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    customersData: any;
    shippersData: any;
    dataSource: any;
    url: string;
    masterDetailDataSource: any;


    constructor() {
        this.url = "https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi";
        
        this.dataSource = AspNetData.createStore({
            key: "OrderID",
            loadUrl: this.url + "/Orders",
            insertUrl: this.url + "/InsertOrder",
            updateUrl: this.url + "/UpdateOrder",
            deleteUrl: this.url + "/DeleteOrder",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });

        this.customersData = AspNetData.createStore({
            key: "Value",
            loadUrl: this.url + "/CustomersLookup",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });

        this.shippersData = AspNetData.createStore({
            key: "Value",
            loadUrl: this.url + "/ShippersLookup",
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });
    }

    getMasterDetailGridDataSource(id: number) : any {   
        return {
            store: AspNetData.createStore({
                loadUrl: this.url + '/OrderDetails',
                loadParams: { orderID : id },
                onBeforeSend: function(method, ajaxOptions) {
                    ajaxOptions.xhrFields = { withCredentials: true };
                }
            })
        };
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