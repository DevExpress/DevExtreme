import { Component, computed, input } from '@angular/core';
import { Vehicle } from '../app.service';

@Component({
  selector: 'license-info',
  templateUrl: './license-info.component.html',
})
export class LicenseInfo {
  readonly vehicle = input.required<Vehicle>();

  readonly vehicleLink = computed(() => `https://${this.vehicle().Source}`);
}
