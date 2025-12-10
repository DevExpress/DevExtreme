import { Component, EventEmitter, Input, Output } from '@angular/core';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'trademark',
  standalone: true,
  templateUrl: `.${modulePrefix}/trademark/trademark.component.html`,
  styleUrls: [`.${modulePrefix}/trademark/trademark.component.css`],
})
export class Trademark {
  @Input() id!: number;

  @Input() name!: string;

  @Input() trademarkName!: string;

  @Output() showInfo = new EventEmitter<void>();

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.showInfo.emit();
    }
  };
}
