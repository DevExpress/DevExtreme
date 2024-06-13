import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';
import { FeatureCollection, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  projection = {
    to(coordinates: number[]) {
      return [coordinates[0] / 100, coordinates[1] / 100];
    },
    from(coordinates: number[]) {
      return [coordinates[0] * 100, coordinates[1] * 100];
    },
  };

  roomsData: FeatureCollection;

  buildingData: FeatureCollection;

  constructor(service: Service) {
    this.roomsData = service.getRoomsData();
    this.buildingData = service.getBuildingData();
  }

  customizeTooltip({ layer, attribute }) {
    if (layer.name === 'rooms') {
      return {
        text: `Square: ${attribute('square')} ft&#178`,
      };
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxVectorMapModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
