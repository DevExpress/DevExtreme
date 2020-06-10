import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxMapModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';

import { Marker, Service } from './app.service';

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
    customMarkerUrl: string;
    mapMarkerUrl: string;
    originalMarkers: Marker[];
    markers: Marker[];

    constructor(service: Service) {
        this.customMarkerUrl = this.mapMarkerUrl = service.getMarkerUrl();
        this.originalMarkers = this.markers = service.getMarkers();
    }
    checkCustomMarker(data) {
        this.mapMarkerUrl = data.value ? this.customMarkerUrl : null;
        this.markers = this.originalMarkers;
    }
    showTooltips() {
        this.markers = this.markers.map(function (item) {
            let newItem = JSON.parse(JSON.stringify(item));
            newItem.tooltip.isShown = true;
            return newItem;
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxMapModule,
        DxCheckBoxModule,
        DxButtonModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
