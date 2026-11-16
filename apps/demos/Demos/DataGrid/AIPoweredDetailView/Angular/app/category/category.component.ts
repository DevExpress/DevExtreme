import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class Category {
  readonly id = input.required<number>();

  readonly name = input.required<string>();

  readonly wrapperClass = computed(() => `category__wrapper category-${this.id()}__bg-color`);
}
