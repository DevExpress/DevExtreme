import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { FeatureCollection, Service } from './app.service';

const RADIANS = Math.PI / 180,
    WAGNER_6_P_LAT = Math.PI / Math.sqrt(3),
    WAGNER_6_U_LAT = 2 / Math.sqrt(3) - 0.1;

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
    customProjection: any;
    coordLinesData: FeatureCollection;

    constructor(service: Service) {
        this.coordLinesData = service.getCoordLinesData();
        this.customProjection = {
            aspectRatio: 2,

            to: function (coordinates) {
                let x = coordinates[0] * RADIANS,
                    y = Math.min(Math.max(coordinates[1] * RADIANS, -WAGNER_6_P_LAT), +WAGNER_6_P_LAT),
                    t = y / Math.PI;
                return [
                    x / Math.PI * Math.sqrt(1 - 3 * t * t),
                    y * 2 / Math.PI
                ];
            },

            from: function (coordinates) {
                let x = coordinates[0],
                    y = Math.min(Math.max(coordinates[1], -WAGNER_6_U_LAT), +WAGNER_6_U_LAT),
                    t = y / 2;
                return [
                    x * Math.PI / Math.sqrt(1 - 3 * t * t) / RADIANS,
                    y * Math.PI / 2 / RADIANS
                ];
            }
        };
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
