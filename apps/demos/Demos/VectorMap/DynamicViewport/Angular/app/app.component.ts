import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { DxTextBoxModule, DxSwitchModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { DxSelectBoxModule, type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { DxVectorMapModule, DxVectorMapComponent, type DxVectorMapTypes } from 'devextreme-angular/ui/vector-map';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxVectorMapModule,
    DxSelectBoxModule,
    DxSwitchModule,
    DxTextBoxModule,
  ],
})

export class AppComponent {
  readonly worldMap = mapsData.world;

  readonly zoomFactorValue = signal('1.00');

  readonly centerValue = signal('0.000, 46.036');

  readonly viewportData = inject(Service).getCoordinates();

  private readonly map = viewChild.required(DxVectorMapComponent);

  onValueChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.map().instance.viewport(e.value);
  }

  zoomChanged(e: DxVectorMapTypes.ZoomFactorChangedEvent) {
    this.zoomFactorValue.set(e.zoomFactor.toFixed(2));
  }

  centerChanged(e: DxVectorMapTypes.CenterChangedEvent) {
    this.centerValue.set(`${e.center[0].toFixed(3)
    }, ${e.center[1].toFixed(3)}`);
  }
}

bootstrapApplication(AppComponent);
