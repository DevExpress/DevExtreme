import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DxDataGridModule } from 'devextreme-angular';
import * as AspNetData from "devextreme-aspnet-data-nojquery";

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {    
    pattern: any = /^\(\d{3}\) \d{3}-\d{4}$/i;

    constructor(private httpClient: HttpClient) {        
        this.url = "https://js.devexpress.com/Demos/Mvc/api/DataGridEmployeesValidation";
        this.dataSource = AspNetData.createStore({
            key: "ID",
            loadUrl: this.url,
            insertUrl: this.url,
            updateUrl: this.url,
            deleteUrl: this.url,
            onBeforeSend: function(method, ajaxOptions) {
                ajaxOptions.xhrFields = { withCredentials: true };
            }
        });
        this.asyncValidation = this.asyncValidation.bind(this);
    }

    asyncValidation(params) {
        return this.httpClient.post("https://js.devexpress.com/Demos/Mvc/RemoteValidation/CheckUniqueEmailAddress", {            
                id: params.data.ID,
                email: params.value                       
            }, {
                responseType: "json"
            }).toPromise();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        DxDataGridModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);