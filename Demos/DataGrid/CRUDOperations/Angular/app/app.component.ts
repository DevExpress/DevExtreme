import { NgModule, Component, enableProdMode, ChangeDetectionStrategy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { formatDate } from 'devextreme/localization';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

var URL = "https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi";

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})
export class AppComponent {
    dataSource: any;
    customersData: any;
    shippersData: any;
    refreshModes: string[];
    refreshMode: string;
    requests: string[] = [];

    constructor(private http: HttpClient) {
        this.refreshMode = "reshape";
        this.refreshModes = ["full", "reshape", "repaint"];

        this.dataSource = new CustomStore({
            key: "OrderID",
            load: () => this.sendRequest(URL + "/Orders"),
            insert: (values) => this.sendRequest(URL + "/InsertOrder", "POST", {
                values: JSON.stringify(values)
            }),
            update: (key, values) => this.sendRequest(URL + "/UpdateOrder", "PUT", {
                key: key,
                values: JSON.stringify(values)
            }),
            remove: (key) => this.sendRequest(URL + "/DeleteOrder", "DELETE", {
                key: key
            })
        });

        this.customersData = {
            paginate: true,
            store: new CustomStore({
                key: "Value",
                loadMode: "raw",
                load: () => this.sendRequest(URL + "/CustomersLookup")
            })
        };

        this.shippersData = new CustomStore({
            key: "Value",
            loadMode: "raw",
            load: () => this.sendRequest(URL + "/ShippersLookup")
        });
    }


    sendRequest(url: string, method: string = "GET", data: any = {}): any {
        this.logRequest(method, url, data);

        let httpParams = new HttpParams({ fromObject: data });
        let httpOptions = { withCredentials: true, body: httpParams };
        let result;

        switch(method) {
            case "GET":
                result = this.http.get(url, httpOptions);
                break;
            case "PUT":
                result = this.http.put(url, httpParams, httpOptions);
                break;
            case "POST":
                result = this.http.post(url, httpParams, httpOptions);
                break;
            case "DELETE":
                result = this.http.delete(url, httpOptions);
                break;
        }

        return result
            .toPromise()
            .then((data: any) => {
                return method === "GET" ? data.data : data;
            })
            .catch(e => {
                throw e && e.error && e.error.Message;
            });
    }

    logRequest(method: string, url: string, data: object): void {
        var args = Object.keys(data || {}).map(function(key) {
            return key + "=" + data[key];
        }).join(" ");

        var time = formatDate(new Date(), "HH:mm:ss");

        this.requests.unshift([time, method, url.slice(URL.length), args].join(" "))
    }

    clearRequests() {
        this.requests = [];
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxSelectBoxModule,
        DxButtonModule,
        HttpClientModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);