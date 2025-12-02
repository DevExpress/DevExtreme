import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, ViewChild, enableProdMode, provideZoneChangeDetection
} from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { DxVectorMapModule, DxVectorMapComponent, DxVectorMapTypes } from 'devextreme-angular/ui/vector-map';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { Marker, Service } from './app.service';

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
    DxVectorMapModule,
    DxButtonModule,
  ],
})

export class AppComponent {
  @ViewChild(DxVectorMapComponent, { static: false }) vectorMap: DxVectorMapComponent;

  worldMap = mapsData.world;

  markers: Marker[];

  constructor(service: Service) {
    this.markers = service.getMarkers();
  }

  customizeTooltip(arg) {
    if (arg.layer.type === 'marker') {
      return {
        text: arg.attribute('name'),
      };
    }
    return null;
  }

  markerClick(e: DxVectorMapTypes.ClickEvent) {
    if (e.target?.layer.type === 'marker') {
      e.component.center(e.target.coordinates());
      e.component.zoomFactor(10);
    }
  }

  resetClick() {
    this.vectorMap.instance.center(null);
    this.vectorMap.instance.zoomFactor(null);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
