import { ViewEncapsulation } from '@angular/compiler';
import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxGanttModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import {
  Service, Task, Dependency, Resource, ResourceAssignment,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  tasks: Task[];

  dependencies: Dependency[];

  resources: Resource[];

  resourceAssignments: ResourceAssignment[];

  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.dependencies = service.getDependencies();
    this.resources = service.getResources();
    this.resourceAssignments = service.getResourceAssignments();
  }

  getImagePath(taskId) {
    const imgPath = '../../../../images/employees';
    let img = taskId < 10 ? `0${taskId}` : taskId;
    img = `${imgPath}/${img}.png`;
    return img;
  }

  getTaskColor(taskId) {
    const color = taskId % 6;
    return `custom-task-color-${color}`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxGanttModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
