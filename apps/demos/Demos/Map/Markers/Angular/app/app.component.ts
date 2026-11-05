import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxMapModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';

import { Service } from './app.service';
import type { APIKey } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxMapModule,
    DxCheckBoxModule,
    DxButtonModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  private readonly customMarkerUrl = this.service.getMarkerUrl();

  private readonly originalMarkers = this.service.getMarkers();

  readonly mapMarkerUrl = signal<string>(this.service.getMarkerUrl());

  readonly markers = signal(this.service.getMarkers());

  readonly apiKey: APIKey = {
    azure: '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE',
  };

  checkCustomMarker(data) {
    this.mapMarkerUrl.set(data.value ? this.customMarkerUrl : null);
    this.markers.set(this.originalMarkers);
  }

  showTooltips() {
    this.markers.update((markers) => markers.map((item) => {
      const newItem = JSON.parse(JSON.stringify(item));
      newItem.tooltip.isShown = true;
      return newItem;
    }));
  }
}

bootstrapApplication(AppComponent);
