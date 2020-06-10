import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxListModule, DxNavBarModule, DxTemplateModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';

import { Category, Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
})
export class AppComponent {
    navBarData: Category[];
    listData: any[];
    currentData: any;

    constructor(service: Service) { 
        let contacts = service.getContacts();
        this.navBarData = service.getCategories();

        this.listData = [
            {
                data: new DataSource({
                    store: contacts,
                    sort: "name"
                })
            }, {
                data: new DataSource({
                    store: contacts,
                    sort: "name",
                    filter: ["category", "=", "Missed"]
                })
            }, {
                data: new DataSource({
                    store: contacts,
                    sort: "name",
                    filter: ["category", "=", "Favorites"]
                })
            }
        ];
        this.currentData = this.listData[0].data;
    }
    selectionChanged(e) {
        this.currentData = this.listData[e.itemIndex].data;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxListModule,
        DxNavBarModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);