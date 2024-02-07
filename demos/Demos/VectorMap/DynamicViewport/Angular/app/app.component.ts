import {
  NgModule, Component, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTextBoxModule, DxSwitchModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { DxVectorMapModule, DxVectorMapComponent, DxVectorMapTypes } from 'devextreme-angular/ui/vector-map';
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
  worldMap = mapsData.world;

  zoomFactorValue = '1.00';

  centerValue = '0.000, 46.036';

  viewportData: ViewportCoordinate[];

  @ViewChild(DxVectorMapComponent, { static: false }) map: DxVectorMapComponent;

  constructor(service: Service) {
    this.viewportData = service.getCoordinates();
  }

  onValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.map.instance.viewport(e.value);
  }

  zoomChanged(e: DxVectorMapTypes.ZoomFactorChangedEvent) {
    this.zoomFactorValue = e.zoomFactor.toFixed(2);
  }

  centerChanged(e: DxVectorMapTypes.CenterChangedEvent) {
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
