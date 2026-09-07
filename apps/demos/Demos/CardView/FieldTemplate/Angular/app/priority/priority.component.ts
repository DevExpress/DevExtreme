import { Component, Input, OnChanges } from '@angular/core';
import { Priority, Service } from '../app.service';

@Component({
  selector: 'priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.css'],
})
export class PriorityComponent implements OnChanges {
  priorities: Priority[];

  text: string;

  className: string;

  @Input() priorityID: number;

  constructor(service: Service) {
    this.priorities = service.getPriorities();
  }

  ngOnChanges(): void {
    const priority = this.priorities.find((p) => p.id === this.priorityID);
    this.text = priority.text;
    this.className = `priority priority--${priority.postfix}`;
  }
}
