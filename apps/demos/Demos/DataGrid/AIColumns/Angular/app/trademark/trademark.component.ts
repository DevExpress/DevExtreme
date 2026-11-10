import { Component, input, output } from '@angular/core';

@Component({
  selector: 'trademark',
  templateUrl: './trademark.component.html',
  styleUrls: ['./trademark.component.css'],
})
export class Trademark {
  readonly id = input.required<number>();

  readonly name = input.required<string>();

  readonly trademarkName = input.required<string>();

  readonly showInfo = output();

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.showInfo.emit();
    }
  }
}
