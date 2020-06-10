import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    dataSource: any = {};

    constructor(httpClient: HttpClient) {
        function isNotEmpty(value: any): boolean {
            return value !== undefined && value !== null && value !== "";
        }
        this.dataSource = new CustomStore({
            key: "OrderNumber",
            load: function (loadOptions: any) {
                let params: HttpParams = new HttpParams();
                [
                    "skip",
                    "take",
                    "requireTotalCount",
                    "requireGroupCount",
                    "sort",
                    "filter",
                    "totalSummary",
                    "group",
                    "groupSummary"
                ].forEach(function(i) {
                    if (i in loadOptions && isNotEmpty(loadOptions[i]))
                        params = params.set(i, JSON.stringify(loadOptions[i]));
                });
                return httpClient.get('https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders', { params: params })
                    .toPromise()
                    .then((data: any) => {
                        return {
                            data: data.data,
                            totalCount: data.totalCount,
                            summary: data.summary,
                            groupCount: data.groupCount
                        };
                    })
                    .catch(error => { throw 'Data Loading Error' });
            }
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        HttpClientModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
