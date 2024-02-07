import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxMapModule } from 'devextreme-angular';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import {
  Marker, APIKey, Route, Service,
} from './app.service';

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
  routes: Route[];

  markers: Marker[];

  apiKey: APIKey = { bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC' };

  constructor(service: Service) {
    this.markers = service.getMarkers();
    this.routes = service.getRoutes();
  }

  setMode(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.routes = this.routes.map((item) => {
      item.mode = e.value;
      return item;
    });
  }

  selectColor(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.routes = this.routes.map((item) => {
      item.color = e.value;
      return item;
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxMapModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
