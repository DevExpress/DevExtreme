import { Component, Input, AfterViewInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from "devextreme-aspnet-data-nojquery";


@Component({
    selector: 'detail-view',
    templateUrl: 'app/detail-view.component.html',
    styleUrls: ['app/detail-view.component.css'],
    providers: []
})
export class DetailViewComponent implements AfterViewInit {

    @Input() key: number;
    @Input() rowData: object;
    url: string;
    productIdBySupplier: number;
    productsData: DataSource;
    orderHistoryData: DataSource;

    constructor() {
        this.url = "https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView";
    }

    ngAfterViewInit() {
        this.productsData = new DataSource({
            store: AspNetData.createStore({
                key: "ProductID",
                loadParams: { SupplierID: this.key },
                loadUrl: this.url + "/GetProductsBySupplier",
                onLoaded: items => this.setDefaultProduct(items)
            })
        })
    }
    setDefaultProduct(items) {
        let firstItem = items[0];

        if(firstItem && this.productIdBySupplier === undefined) {
            this.productIdBySupplier = firstItem.ProductID;
        }
    }
    handleValueChange(e: any) {
        this.productIdBySupplier = e.value;
        this.orderHistoryData = new DataSource({
            store: AspNetData.createStore({
                key: "OrderID",
                loadParams: { ProductID: e.value },
                loadUrl: this.url + "/GetOrdersByProduct"
            })
        });
    }
    customizeItemTemplate(item: any) {
        item.template = "formItem";
    }
 
}


