import { Component, Input } from '@angular/core';
import { Vehicle } from '../app.service';

@Component({
  selector: 'license-info',
  templateUrl: './license-info.component.html',
})
export class LicenseInfo {
  vehicleLink = '';

  @Input() vehicle!: Vehicle;

  ngOnChanges(): void {
    this.vehicleLink = `https://${this.vehicle.Source}`;
  }
}
