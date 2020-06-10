import { NgModule, Component, enableProdMode } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {
    DxSelectBoxModule,
    DxLoadIndicatorModule,
    DxTemplateModule
} from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';

import {Product, Service} from './app.service';

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
    simpleProducts: string[];
    products: Product[];
    data: any;
    isLoaded: boolean = true;
    selectedItem: Product;
    deferredProducts: any;

    constructor(service: Service) {
        let that = this;
        this.products = service.getProducts();
        this.selectedItem = this.products[0];
        this.simpleProducts = service.getSimpleProducts();
        this.deferredProducts = {
            loadMode: 'raw',
            load: function () {
                that.isLoaded = false;
                let promise = new Promise(function(resolve, reject) {
                    setTimeout(function () {
                        resolve(that.simpleProducts);
                        that.isLoaded = true;
                    }, 3000);
                });

                return promise;
            }
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSelectBoxModule,
        DxLoadIndicatorModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);