import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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
})

export class AppComponent {
  worldMap = mapsData.world;

  markers: FeatureCollection;

  populations: Object;

  constructor(service: Service) {
    this.markers = service.getMarkers();
    this.populations = service.getPopulations();
    this.customizeLayers = this.customizeLayers.bind(this);
  }

  customizeText({ index, start, end }) {
    if (index === 0) {
      return '< 0.5%';
    }

    return (index === 5)
      ? '> 3%'
      : `${start}% to ${end}%`;
  }

  customizeTooltip = (arg: { attribute: Function }) => ({
    text: arg.attribute('text'),
  });

  customizeItems = (items: unknown[]) => items.reverse();

  customizeLayers(elements: { attribute: Function }[]) {
    elements.forEach((element) => {
      const name = element.attribute('name');
      const population = this.populations[name];
      if (population) {
        element.attribute('population', population);
      }
    });
  }

  customizeMarkers = ({ index }) => ['< 8000K', '8000K to 10000K', '> 10000K'][index];
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
