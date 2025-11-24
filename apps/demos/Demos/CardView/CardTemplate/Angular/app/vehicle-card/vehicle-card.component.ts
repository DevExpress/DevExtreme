import { Component, EventEmitter, Input, Output } from '@angular/core';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  standalone: false,
  selector: 'vehicle-card',
  templateUrl: `.${modulePrefix}/vehicle-card/vehicle-card.component.html`,
  styleUrls: [`.${modulePrefix}/vehicle-card/vehicle-card.component.css`],
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
