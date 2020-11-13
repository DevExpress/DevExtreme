import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxMapModule, DxSelectBoxModule } from 'devextreme-angular';

import { MapSetting, Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [ Service ],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})

export class AppComponent {
    mapTypes: MapSetting[];
    keys = {};

    constructor(service: Service) {
        this.mapTypes = service.getMapTypes();
        // Specify your API keys for each map provider:
        //this.keys["bing"] = "YOUR_BING_MAPS_API_KEY";
        //this.keys["google"] = "YOUR_GOOGLE_MAPS_API_KEY";
        //this.keys["googleStatic"] = "YOUR_GOOGLE_STATIC_MAPS_API_KEY";
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxMapModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
