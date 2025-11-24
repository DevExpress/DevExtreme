import { Component, Input } from '@angular/core';
import { Vehicle } from '../app.service';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  standalone: false,
  selector: 'license-info',
  templateUrl: `.${modulePrefix}/license-info/license-info.component.html`,
})
export class LicenseInfo {
  vehicleLink = '';

  @Input() vehicle: Vehicle;

  ngOnChanges(): void {
    this.vehicleLink = `https://${this.vehicle.Source}`;
  }
}
