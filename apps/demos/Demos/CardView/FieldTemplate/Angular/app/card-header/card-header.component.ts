import { Component, Input } from '@angular/core';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  standalone: false,
  selector: 'card-header',
  templateUrl: `.${modulePrefix}/card-header/card-header.component.html`,
  styleUrls: [`.${modulePrefix}/card-header/card-header.component.css`],
})
export class CardHeader {
  @Input() text: string;
}
