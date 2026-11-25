import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxVectorMapModule } from 'devextreme-angular';
import type { DxVectorMapTypes } from 'devextreme-angular/ui/vector-map';
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
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly projection = {
    to(coordinates: number[]) {
      return [coordinates[0] / 100, coordinates[1] / 100];
    },
    from(coordinates: number[]) {
      return [coordinates[0] * 100, coordinates[1] * 100];
    },
  };

  readonly roomsData = this.service.getRoomsData();

  readonly buildingData = this.service.getBuildingData();

  readonly customizeTooltip = ({ layer, attribute }: DxVectorMapTypes.MapLayerElement): Record<string, unknown> => {
    if (layer.name === 'rooms') {
      return {
        text: `Square: ${attribute('square')} ft&#178`,
      };
    }
    return {};
  };
}

bootstrapApplication(AppComponent);
