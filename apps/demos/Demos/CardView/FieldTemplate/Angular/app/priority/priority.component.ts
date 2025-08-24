import { Component, Input, OnChanges } from '@angular/core';
import { Priority, Service } from '../app.service';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'priority',
  templateUrl: `.${modulePrefix}/priority/priority.component.html`,
  styleUrls: [`.${modulePrefix}/priority/priority.component.css`],
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
