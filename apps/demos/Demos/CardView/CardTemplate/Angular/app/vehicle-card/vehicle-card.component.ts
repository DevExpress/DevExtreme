import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() vehicle!: Vehicle;
  @Output() showInfo = new EventEmitter<void>();

  onShowInfo() {
    this.showInfo.emit();
  }
}
