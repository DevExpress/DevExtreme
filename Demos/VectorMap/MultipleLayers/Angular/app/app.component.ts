import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { FeatureCollection, Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [ Service ],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent {
    worldMap: any = mapsData.world;
    streamsData: FeatureCollection;

    constructor(service: Service) {
        this.streamsData = service.getStreamsData();
    }

    customizeText(itemInfo) {
        if(itemInfo.color === "#3c20c8") {
            return "Cold";
        } else {
            return "Warm";
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxVectorMapModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
