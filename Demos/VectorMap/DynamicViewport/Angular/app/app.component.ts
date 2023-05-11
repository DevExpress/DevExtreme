import {
  NgModule, Component, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxVectorMapModule, DxSelectBoxModule, DxTextBoxModule, DxVectorMapComponent, DxSwitchModule,
} from 'devextreme-angular';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { ViewportCoordinate, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})

export class AppComponent {
  worldMap: any = mapsData.world;

  zoomFactorValue: string;

  centerValue: string;

  viewportData: ViewportCoordinate[];

  panVisible: boolean;

  zoomVisible: boolean;

  @ViewChild(DxVectorMapComponent, { static: false }) map: DxVectorMapComponent;

  constructor(service: Service) {
    this.centerValue = '0.000, 46.036';
    this.zoomFactorValue = '1.00';
    this.viewportData = service.getCoordinates();
  }

  onValueChanged(e) {
    this.map.instance.viewport(e.value);
  }

  zoomChanged(e) {
    this.zoomFactorValue = e.zoomFactor.toFixed(2);
  }

  centerChanged(e) {
    this.centerValue = `${e.center[0].toFixed(3)
    }, ${e.center[1].toFixed(3)}`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxVectorMapModule,
    DxSelectBoxModule,
    DxSwitchModule,
    DxTextBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
