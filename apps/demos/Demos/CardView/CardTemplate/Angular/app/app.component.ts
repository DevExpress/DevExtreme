import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxCardViewModule,
  DxPopupModule,
} from 'devextreme-angular';
import { DxCardViewTypes } from 'devextreme-angular/ui/card-view';
import { Service, type Vehicle } from './app.service';
import { VehicleCard } from './vehicle-card/vehicle-card.component';
import { LicenseInfo } from './license-info/license-info.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxCardViewModule,
    DxPopupModule,
    LicenseInfo,
    VehicleCard,
  ],
})
export class AppComponent {
  readonly vehicles = inject(Service).getVehicles();

  readonly popupVisible = signal(false);

  readonly currentVehicle = signal<Vehicle | null>(null);

  showInfo(vehicle: Vehicle) {
    this.currentVehicle.set(vehicle);
    this.popupVisible.set(true);
  }

  hideInfo() {
    this.popupVisible.set(false);
  }

  getFormattedPrice(card: DxCardViewTypes.CardInfo): string {
    const priceText = card.fields.find((f) => f?.column?.dataField === 'Price');
    return priceText?.text ?? '';
  }
}

bootstrapApplication(AppComponent);
