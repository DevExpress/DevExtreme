import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxMapModule, DxCheckBoxModule, DxButtonModule } from 'devextreme-angular';
import type { DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';

import { Service } from './app.service';
import type { APIKey, Marker } from './app.service';

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

  readonly markers = signal<Marker[]>(this.service.getMarkers());

  readonly apiKey: APIKey = {
    azure: '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE',
  };

  checkCustomMarker({ value }: DxCheckBoxTypes.ValueChangedEvent): void {
    this.mapMarkerUrl.set(value ? this.customMarkerUrl : '');
    this.markers.set(this.originalMarkers);
  }

  showTooltips(): void {
    this.markers.update((markers) => markers.map((item) => ({
      ...item,
      tooltip: { ...item.tooltip, isShown: true },
    })));
  }
}

bootstrapApplication(AppComponent);
