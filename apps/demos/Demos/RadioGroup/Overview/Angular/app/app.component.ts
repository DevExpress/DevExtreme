import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxRadioGroupModule } from 'devextreme-angular';
import { DxRadioGroupTypes } from 'devextreme-angular/ui/radio-group';
import { PriorityEntity, Service, Task } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxRadioGroupModule,
  ],
})
export class AppComponent {
  priorityEntities: PriorityEntity[];

  selectionPriorityId: number;

  colorPriority: string;

  tasks: Task[];

  currentData: string[] = [];

  priorities = [
    'Low',
    'Normal',
    'Urgent',
    'High',
  ];

  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.priorityEntities = service.getPriorityEntities();
    this.colorPriority = this.priorities[2];
    this.currentData[0] = this.tasks[1].subject;
    this.selectionPriorityId = this.priorityEntities[0].id;
  }

  onValueChanged({ value }: DxRadioGroupTypes.ValueChangedEvent) {
    this.currentData = [];

    this.tasks.forEach((item, index) => {
      if (item.priority === value) {
        this.currentData.push(this.tasks[index].subject);
      }
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
