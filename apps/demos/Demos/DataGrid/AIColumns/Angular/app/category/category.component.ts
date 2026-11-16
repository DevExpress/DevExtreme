import { Component, input } from '@angular/core';

@Component({
  selector: 'category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class Category {
  readonly category = input.required<string>();
}
