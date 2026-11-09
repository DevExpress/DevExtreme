import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxRadioGroupModule } from 'devextreme-angular';
import type { DxRadioGroupTypes } from 'devextreme-angular/ui/radio-group';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxRadioGroupModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  private readonly tasks = this.service.getTasks();

  readonly priorityEntities = this.service.getPriorityEntities();

  readonly priorities = [
    'Low',
    'Normal',
    'Urgent',
    'High',
  ];

  readonly colorPriority = signal(this.priorities[2]);

  readonly selectionPriorityId = signal(this.priorityEntities[0].id);

  readonly currentData = signal<string[]>([this.tasks[1].subject]);

  onValueChanged({ value }: DxRadioGroupTypes.ValueChangedEvent) {
    const currentData: string[] = [];

    this.tasks.forEach((item, index) => {
      if (item.priority === value) {
        currentData.push(this.tasks[index].subject);
      }
    });

    this.currentData.set(currentData);
  }
}

bootstrapApplication(AppComponent);
