import {
  Component, computed, inject, input,
} from '@angular/core';
import { Service } from '../app.service';

@Component({
  selector: 'priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.css'],
})
export class PriorityComponent {
  private readonly priorities = inject(Service).getPriorities();

  readonly priorityID = input.required<number>();

  private readonly priority = computed(() => this.priorities.find((p) => p.id === this.priorityID()));

  readonly text = computed(() => this.priority().text);

  readonly className = computed(() => `priority priority--${this.priority().postfix}`);
}
