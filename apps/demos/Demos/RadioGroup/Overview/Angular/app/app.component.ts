import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRadioGroupModule, DxTemplateModule } from 'devextreme-angular';
import { DxRadioGroupTypes } from 'devextreme-angular/ui/radio-group';
import { PriorityEntity, Service, Task } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
      if (item.priority == value) {
        this.currentData.push(this.tasks[index].subject);
      }
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxRadioGroupModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
