import { Component, Input } from '@angular/core';
import { Vehicle } from '../app.service';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'vehicle-card',
  templateUrl: `.${modulePrefix}/vehicle-card/vehicle-card.component.html`,
})

export class VehicleCard {
  @Input() vehicle: Vehicle;

  popupVisible = false;

    showInfo() {
        this.popupVisible = true;
    }
}
