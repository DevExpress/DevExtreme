import { NgModule, Component, enableProdMode, ChangeDetectionStrategy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTabPanelModule } from 'devextreme-angular';
import * as AspNetData from "devextreme-aspnet-data-nojquery";

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
})
export class AppComponent {
    url: string;
    suppliersData: any;
    productsDataMap: object = {};
    productIdBySupplier: object = {};
    orderHistoryDataMap: object = {};

    constructor() {
        this.url = "https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView";

        this.suppliersData = AspNetData.createStore({
            key: "SupplierID",
            loadUrl: this.url + "/GetSuppliers"
        });
    }

    handleValueChange(e: any, supplierID: number) {
        this.productIdBySupplier[supplierID] = e.value;
        this.orderHistoryDataMap[supplierID] = {
            store: AspNetData.createStore({
                key: "OrderID",
                loadParams: { ProductID: e.value },
                loadUrl: this.url + "/GetOrdersByProduct"
            })
        };
    }

    customizeItemTemplate(item: any) {
        item.template = "formItem";
    }

    getProductsData(supplierID: number) : any {   
        return this.productsDataMap[supplierID] = this.productsDataMap[supplierID] || {
            store: AspNetData.createStore({
                key: "ProductID",
                loadParams: { SupplierID: supplierID },
                loadUrl: this.url + "/GetProductsBySupplier",
                onLoaded: items => this.setDefaultProduct(items, supplierID)
            })
        };
    }

    setDefaultProduct(items, supplierID) {
        let firstItem = items[0];

        if(firstItem && this.productIdBySupplier[supplierID] === undefined) {
            this.productIdBySupplier[supplierID] = firstItem.ProductID;
        }
    }

    getOrderHistoryData(supplierID: number) : any {
        return this.orderHistoryDataMap[supplierID];
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxFormModule,
        DxSelectBoxModule,
        DxTabPanelModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);