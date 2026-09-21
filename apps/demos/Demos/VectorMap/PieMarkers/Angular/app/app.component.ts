import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { FeatureCollection, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxVectorMapModule,
  ],
})

export class AppComponent {
  worldMap = mapsData.world;

  markers: FeatureCollection;

  names: string[];

  constructor(service: Service) {
    this.markers = service.getMarkers();
    this.names = service.getNames();
    this.customizeText = this.customizeText.bind(this);
  }

  customizeText = ({ index }: { index: number }) => this.names[index];

  customizeTooltip = ({ layer, attribute }: { layer: Record<string, string>, attribute: Function }) => ((layer.type === 'marker')
    ? { text: attribute('tooltip') }
    : undefined);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
