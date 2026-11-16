import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { DxVectorMapModule, DxVectorMapComponent, type DxVectorMapTypes } from 'devextreme-angular/ui/vector-map';
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
    this.vectorMap().instance.center(null);
    this.vectorMap().instance.zoomFactor(null);
  }
}

bootstrapApplication(AppComponent);
