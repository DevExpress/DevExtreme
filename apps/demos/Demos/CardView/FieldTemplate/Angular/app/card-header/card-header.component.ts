import { Component, Input } from '@angular/core';

@Component({
  selector: 'card-header',
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.css'],
})
export class CardHeader {
  @Input() text: string;
}
