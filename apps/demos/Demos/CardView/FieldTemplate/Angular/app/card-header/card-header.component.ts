import { Component, input } from '@angular/core';

@Component({
  selector: 'card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.css'],
})
export class CardHeader {
  readonly text = input.required<string>();
}
