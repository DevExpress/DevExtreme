import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { DxVectorMapModule, DxVectorMapComponent } from 'devextreme-angular/ui/vector-map';
import type { DxVectorMapTypes } from 'devextreme-angular/ui/vector-map';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { Service } from './app.service';

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
    DxButtonModule,
  ],
})

export class AppComponent {
  private readonly vectorMap = viewChild.required(DxVectorMapComponent);

  readonly worldMap = mapsData.world;

  readonly markers = inject(Service).getMarkers();

  readonly customizeTooltip = (arg: DxVectorMapTypes.MapLayerElement): Record<string, unknown> => {
    if (arg.layer.type === 'marker') {
      return {
        text: arg.attribute('name'),
      };
    }
    return {};
  };

  markerClick(e: DxVectorMapTypes.ClickEvent): void {
    if (e.target?.layer.type === 'marker') {
      e.component.center(e.target.coordinates());
      e.component.zoomFactor(10);
    }
  }

  resetClick(): void {
    // An empty array resets the center to its initial value
    this.vectorMap().instance.center([]);
    this.vectorMap().instance.zoomFactor(1);
  }
}

bootstrapApplication(AppComponent);
