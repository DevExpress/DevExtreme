import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';
import { FeatureCollection, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
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

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxVectorMapModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
