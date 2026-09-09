import { Component, Input } from '@angular/core';

@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class Status {
  @Input() status!: string;
}
