import { Component, input } from '@angular/core';

@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class Status {
  readonly status = input.required<string>();
}
