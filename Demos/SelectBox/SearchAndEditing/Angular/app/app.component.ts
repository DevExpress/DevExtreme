import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxNumberBoxModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';

import { Product, Service, SimpleProduct } from './app.service';

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
    products: Product[];
    simpleProducts: SimpleProduct[];
    productsDataSource: DataSource;

    searchModeOption: string = "contains";
    searchExprOption: any = "Name";
    searchTimeoutOption: number = 200;
    minSearchLengthOption: number = 0;
    showDataBeforeSearchOption: boolean = false;
    searchExprOptionItems: Array<any> = [{
        name: "'Name'",
        value: "Name"
    }, {
        name: "['Name', 'Category']",
        value: ['Name', 'Category']
    }]

    constructor(service: Service) {
        this.products = service.getProducts();
        this.simpleProducts = service.getSimpleProducts();
        this.productsDataSource = new DataSource({
            store: {
                data: this.simpleProducts,
                type: 'array',
                key: 'ID'
            }
        });
    }

    addCustomItem(data) {
        if(!data.text) {
            data.customItem = null;
            return;
        }

        const productIds = this.simpleProducts.map(function(item) {
            return item.ID;
        });
        const incrementedId = Math.max.apply(null, productIds) + 1;
        const newItem = {
            Name: data.text,
            ID: incrementedId
        };

        this.productsDataSource.store().insert(newItem);
        this.productsDataSource.load();
        data.customItem = newItem;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSelectBoxModule,
        DxNumberBoxModule,
        DxCheckBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);