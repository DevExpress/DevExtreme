import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxButtonModule,
  DxCardViewModule,
  DxPopupModule,
} from 'devextreme-angular';
import { CardInfo } from 'devextreme-angular/ui/card-view';
import { Service, Vehicle } from './app.service';
import { VehicleCard } from './vehicle-card/vehicle-card.component';
import { LicenseInfo } from './license-info/license-info.component';

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
  templateUrl: `.${modulePrefix}/app.component.html`,
  providers: [Service],
})
export class AppComponent {
  vehicles: Vehicle[];

  popupVisible = false;

  currentVehicle: Vehicle | null = null;

  constructor(service: Service) {
    this.vehicles = service.getVehicles();
  }

  showInfo(vehicle: Vehicle) {
    this.currentVehicle = vehicle;
    this.popupVisible = true;
  }

  hideInfo() {
    this.popupVisible = false;
  }

  getFormattedPrice(card: CardInfo): string {
    const priceText = card.fields.find((f) => f?.column?.dataField === 'Price');
    return priceText?.text ?? '';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
    DxPopupModule,
    DxButtonModule,
  ],
  declarations: [AppComponent, VehicleCard, LicenseInfo],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
