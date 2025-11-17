import { Component, Input } from '@angular/core';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'category',
  templateUrl: `.${modulePrefix}/category/category.component.html`,
  styleUrls: [`.${modulePrefix}/category/category.component.css`],
})
export class Category {
  @Input() category: string;
}
