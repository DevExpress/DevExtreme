import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() id!: number;

  @Input() model!: string;

  @Input() price!: string;

  @Input() categoryName!: string;

  @Input() modification!: string;

  @Input() bodyStyleName!: string;

  @Input() horsepower!: string;

  @Output() showInfo = new EventEmitter<void>();
}
