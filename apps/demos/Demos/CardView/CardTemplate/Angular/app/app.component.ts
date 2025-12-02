import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
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
  imports: [
    DxCardViewModule,
    DxPopupModule,
    DxButtonModule,
    LicenseInfo,
    VehicleCard,
  ],
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
