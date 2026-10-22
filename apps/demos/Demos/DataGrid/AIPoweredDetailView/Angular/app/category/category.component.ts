import { Component, Input } from '@angular/core';

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class Category {
  @Input() id!: number;

  @Input() name!: string;

  getBackgroundClass() {
    return `category-${this.id}__bg-color`;
  }
}
