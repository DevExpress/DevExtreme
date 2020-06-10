import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import {
    DxDropDownBoxModule,
    DxTreeViewModule,
    DxDataGridModule,
    DxTreeViewComponent
} from 'devextreme-angular';

import CustomStore from 'devextreme/data/custom_store';


if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    @ViewChild(DxTreeViewComponent, { static: false }) treeView;
    treeDataSource: any;
    treeBoxValue: string;
    gridDataSource: any;
    gridBoxValue: number[] = [3];

    constructor(private httpClient: HttpClient) {
        this.treeDataSource = this.makeAsyncDataSource(this.httpClient, "treeProducts.json");
        this.gridDataSource = this.makeAsyncDataSource(this.httpClient, "customers.json");
        this.treeBoxValue = "1_1";
    }

    makeAsyncDataSource(http, jsonFile){
        return new CustomStore({
            loadMode: "raw",
            key: "ID",
            load: function() {
                return http.get('../../../../data/' + jsonFile)
                    .toPromise();
            }
        });
    };

    syncTreeViewSelection() {
        if (!this.treeView) return;

        if (!this.treeBoxValue) {
            this.treeView.instance.unselectAll();
        } else {
            this.treeView.instance.selectItem(this.treeBoxValue);
        }
    }

    treeView_itemSelectionChanged(e){
        this.treeBoxValue = e.component.getSelectedNodeKeys();
    }

    gridBox_displayExpr(item){
        return item && item.CompanyName + " <" + item.Phone + ">";
    }

}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeViewModule,
        DxDropDownBoxModule,
        HttpClientModule,
        DxDataGridModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
