import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxMapModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';

import { Marker, APIKey, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxMapModule,
    DxCheckBoxModule,
    DxButtonModule,
  ],
})

export class AppComponent {
  customMarkerUrl: string;

  mapMarkerUrl: string;

  originalMarkers: Marker[];

  markers: Marker[];

  apiKey: APIKey = {};

  constructor(service: Service) {
    this.apiKey.azure = '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE';

    this.mapMarkerUrl = service.getMarkerUrl();
    this.customMarkerUrl = service.getMarkerUrl();
    this.markers = service.getMarkers();
    this.originalMarkers = service.getMarkers();
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
