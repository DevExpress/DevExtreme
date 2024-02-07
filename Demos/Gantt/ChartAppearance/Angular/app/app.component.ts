import { ViewEncapsulation } from '@angular/compiler/src/core';
import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule, DxSelectBoxModule, DxDateBoxModule } from 'devextreme-angular';
import { DxGanttModule, DxGanttTypes } from 'devextreme-angular/ui/gantt';
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

  scaleType: DxGanttTypes.Properties['scaleType'] = 'months';

  titlePosition: DxGanttTypes.Properties['taskTitlePosition'] = 'outside';

  showResources = true;

  showDependencies = true;

  showCustomTaskTooltip = true;

  startDateRange = new Date(2018, 11, 1);

  endDateRange = new Date(2019, 11, 1);

  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.dependencies = service.getDependencies();
    this.resources = service.getResources();
    this.resourceAssignments = service.getResourceAssignments();
  }

  getTimeEstimate(task: Task) {
    return Math.abs((task.start as unknown as number) - (task.end as unknown as number)) / 36e5;
  }

  getTimeLeft(task: Task) {
    const timeEstimate = Math.abs((task.start as unknown as number) - (task.end as unknown as number)) / 36e5;
    return Math.floor((100 - task.progress) / 100 * timeEstimate);
  }

  getTime(date: Date) {
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
