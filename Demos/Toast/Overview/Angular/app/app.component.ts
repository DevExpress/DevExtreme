import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

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

    constructor(service: Service) {
        this.products = service.getProducts();
    }

    checkAvailable(e, product) {
        var type = e.value ? "success" : "error",
            text = product.Name +
            (e.value ? " is available" : " is not available");

        notify(text, type, 600);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxCheckBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
