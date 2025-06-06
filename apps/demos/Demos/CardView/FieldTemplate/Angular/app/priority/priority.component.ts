import { Component, Input } from '@angular/core';
import { Priority, PriorityService } from './priority.service';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'priority',
  templateUrl: `.${modulePrefix}/priority/priority.component.html`,
  styleUrls: [`.${modulePrefix}/priority/priority.component.css`],
  providers: [PriorityService],
})
export class PriorityComponent {
  priorities: Priority[];
  text: string;
  className: string;

  @Input() priorityID: number;
  @Input() field: any;

  constructor(service: PriorityService) {
    this.priorities = service.getPriorities();
  }

  ngOnChanges(): void {
    const priority = this.priorities.find(p => p.id === this.priorityID);
    this.text = priority.text;
    this.className = `priority priority--${priority.postfix}`;
  }
}
