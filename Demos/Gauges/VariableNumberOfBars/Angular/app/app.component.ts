import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxBarGaugeModule, DxCheckBoxModule } from 'devextreme-angular';

import { Product, Service } from './app.service';

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
    values: Product[];

    constructor(service: Service) {
        this.products = service.getProducts();
        this.productsToValues();
    }

    productsToValues() {
        let values = [];

        this.products.forEach(function (product) {
            if (product.active) {
                values.push(product.count);
            }
        })

        this.values = values;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxBarGaugeModule,
        DxCheckBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
