import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxTreeListModule } from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
})
export class AppComponent {
    dataSource: any;

    constructor(http: HttpClient) {
        this.dataSource = {
            load: function(loadOptions) {
                return http.get("https://js.devexpress.com/Demos/Mvc/api/treeListData?parentIds=" + loadOptions.parentIds)
                           .toPromise();
            }
        }
    }

    customizeSizeText(e) {
        if(e.value !== null) {
            return Math.ceil(e.value / 1024) + " KB";
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeListModule,
        HttpClientModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
