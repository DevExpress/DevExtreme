import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxChartModule } from 'devextreme-angular';

import { Data, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})

export class AppComponent {
  dataSource: Data[];

  markerPath = {
    'Original Signal': 'M 0 8 C 2 4 7 4 9.5 8 C 11 12 16 12 18 8 L 18 10 C 16 14 11 14 8.5 10 C 7 6 2 6 0 10 Z',
    'Noisy Signal': 'M 18 8 L 12 12 L 7 3 L 0 7.4 L 0 10 L 6 6 L 11 15 L 18 10.6 Z',
  };

  constructor(service: Service) {
    this.dataSource = service.getData();
  }

  getMarkerPath(name) {
    return this.markerPath[name];
  }

  getMarkerColor(item) {
    return item.series.isVisible() ? item.marker.fill : '#888';
  }

  onLegendClick(e) {
    e.target.isVisible() ? e.target.hide() : e.target.show();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
