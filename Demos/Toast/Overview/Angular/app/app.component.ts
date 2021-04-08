import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule, DxToastModule } from 'devextreme-angular';

import { Product, Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [Service],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    products: Product[];
    isVisible: boolean = false;
    type: string = "info";
    message: string = "";

    constructor(service: Service) {
        this.products = service.getProducts();
    }

    checkAvailable(e, product) {
        const type = e.value ? "success" : "error";
        const text = product.Name + (e.value ? " is available" : " is not available");

        this.type = type;
        this.message = text;
        this.isVisible = true;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxCheckBoxModule,
        DxToastModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
