import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxTreeViewModule } from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    providers: []
})
export class AppComponent {
    createChildren: any;

    constructor(http: HttpClient) {
        this.createChildren = (parent) => {
            let parentId = parent ? parent.itemData.id : "";

            return http.get("https://js.devexpress.com/Demos/Mvc/api/TreeViewData?parentId=" + parentId)
                           .toPromise();
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeViewModule,
        HttpClientModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);