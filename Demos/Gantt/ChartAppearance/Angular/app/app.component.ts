import { ViewEncapsulation } from '@angular/compiler/src/core';
import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxGanttModule, DxCheckBoxModule, DxSelectBoxModule, DxDateBoxModule,
} from 'devextreme-angular';
import {
  Service, Task, Dependency, Resource, ResourceAssignment,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  tasks: Task[];

  dependencies: Dependency[];

  resources: Resource[];

  resourceAssignments: ResourceAssignment[];

  scaleType: string;

  titlePosition: string;

  showResources: boolean;

  showDependencies: boolean;

  showCustomTaskTooltip: boolean;

  startDateRange: Date;

  endDateRange: Date;

  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.dependencies = service.getDependencies();
    this.resources = service.getResources();
    this.resourceAssignments = service.getResourceAssignments();
    this.scaleType = 'months';
    this.titlePosition = 'outside';
    this.showResources = true;
    this.showDependencies = true;
    this.showCustomTaskTooltip = true;
    this.startDateRange = new Date(2018, 11, 1);
    this.endDateRange = new Date(2019, 11, 1);
  }

  getTimeEstimate(task) {
    return Math.abs(task.start - task.end) / 36e5;
  }

  getTimeLeft(task) {
    const timeEstimate = Math.abs(task.start - task.end) / 36e5;
    return Math.floor((100 - task.progress) / 100 * timeEstimate);
  }

  getTime(date) {
    return date.toLocaleString();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxGanttModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
