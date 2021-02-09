import { NgModule, Component, ViewChild, enableProdMode, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
    styleUrls: ['app/app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    @ViewChild(DxTreeViewComponent, { static: false }) treeView;
    treeDataSource: any;
    treeBoxValue: string;
    isTreeBoxOpened: boolean;
    gridDataSource: any;
    gridBoxValue: number[] = [3];
    isGridBoxOpened: boolean;
    gridColumns: any = ['CompanyName', 'City', 'Phone'];

    constructor(private httpClient: HttpClient, private ref: ChangeDetectorRef) {
        this.treeDataSource = this.makeAsyncDataSource(this.httpClient, "treeProducts.json");
        this.gridDataSource = this.makeAsyncDataSource(this.httpClient, "customers.json");
        this.isTreeBoxOpened = false;
        this.isGridBoxOpened = false;
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

    onTreeBoxOptionChanged(e){
        if (e.name === "value"){
            this.isTreeBoxOpened = false;
            this.ref.detectChanges();
        }
    }

    onGridBoxOptionChanged(e){
        if (e.name === "value"){
            this.isGridBoxOpened = false;
            this.ref.detectChanges();
        }
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
