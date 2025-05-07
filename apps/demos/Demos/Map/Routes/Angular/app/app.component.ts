import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxMapModule } from 'devextreme-angular';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import {
  Marker, APIKey, Route, Service,
} from './app.service';

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
  preserveWhitespaces: true,
})

export class AppComponent {
  routes: Route[];

  markers: Marker[];

  apiKey: APIKey = { azure: '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE' };

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
    DxMapModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
