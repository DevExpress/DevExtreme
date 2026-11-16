import { Component, input, output } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';

@Component({
  selector: 'vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.css'],
  imports: [
    DxButtonModule,
  ],
})
export class VehicleCard {
  readonly id = input.required<number>();

  readonly model = input.required<string>();

  readonly price = input.required<string>();

  readonly categoryName = input.required<string>();

  readonly modification = input.required<string>();

  readonly bodyStyleName = input.required<string>();

  readonly horsepower = input.required<string>();

  readonly showInfo = output();
}
