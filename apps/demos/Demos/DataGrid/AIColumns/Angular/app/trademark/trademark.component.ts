import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'trademark',
  templateUrl: './trademark.component.html',
  styleUrls: ['./trademark.component.css'],
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
