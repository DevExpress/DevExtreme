import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxMapModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';

import { Marker, APIKey, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})

export class AppComponent {
  customMarkerUrl: string;

  mapMarkerUrl: string;

  originalMarkers: Marker[];

  markers: Marker[];

  apiKey: APIKey = {};

  constructor(service: Service) {
    this.apiKey.azure = '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE';

    this.customMarkerUrl = this.mapMarkerUrl = service.getMarkerUrl();
    this.originalMarkers = this.markers = service.getMarkers();
  }

  checkCustomMarker(data) {
    this.mapMarkerUrl = data.value ? this.customMarkerUrl : null;
    this.markers = this.originalMarkers;
  }

  showTooltips() {
    this.markers = this.markers.map((item) => {
      const newItem = JSON.parse(JSON.stringify(item));
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
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
