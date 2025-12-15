import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxVectorMapModule } from 'devextreme-angular';
import { FeatureCollection, Service } from './app.service';

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
  ],
})

export class AppComponent {
  pangaeaBorders: FeatureCollection;

  pangaeaContinents: FeatureCollection;

  projection = {
    to(coordinates: number[]) {
      return [coordinates[0] / 100, coordinates[1] / 100];
    },
    from(coordinates: number[]) {
      return [coordinates[0] * 100, coordinates[1] * 100];
    },
  };

  constructor(service: Service) {
    this.pangaeaBorders = service.getPangaeaBorders();
    this.pangaeaContinents = service.getPangaeaContinents();
  }

  customizeLayer(elements: { attribute: Function, applySettings: Function }[]) {
    elements.forEach((element) => {
      element.applySettings({
        color: element.attribute('color'),
      });
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
