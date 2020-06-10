import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxTreeViewModule } from 'devextreme-angular';

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
    currentItem: Product;

    constructor(service: Service) {
        this.products = service.getProducts();
        this.currentItem = this.products[0];
    }
    selectItem(e) {
        this.currentItem = e.itemData;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeViewModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);