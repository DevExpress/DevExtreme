import { Component, Input } from '@angular/core';

@Component({
  selector: 'category',
  templateUrl: 'app/category/category.component.html',
  styleUrls: ['app/category/category.component.css'],
})
export class Category {
  @Input() id!: number;

  @Input() name!: string;

  getBackgroundClass() {
    return `category-${this.id}__bg-color`;
  }
}
