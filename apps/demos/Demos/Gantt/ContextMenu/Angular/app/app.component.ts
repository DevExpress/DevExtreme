import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxGanttModule, DxGanttTypes } from 'devextreme-angular/ui/gantt';
import { DxCheckBoxModule, DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import {
  Service, Task, Dependency, Resource, ResourceAssignment,
} from './app.service';

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
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxGanttModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  tasks: Task[];

  dependencies: Dependency[];

  resources: Resource[];

  resourceAssignments: ResourceAssignment[];

  showResources = true;

  disableContextMenu = false;

  contextMenuItems = this.getContextMenuItems();

  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.dependencies = service.getDependencies();
    this.resources = service.getResources();
    this.resourceAssignments = service.getResourceAssignments();
  }

  onContextMenuPreparing(e: DxGanttTypes.ContextMenuPreparingEvent) {
    e.cancel = this.disableContextMenu;
  }

  onCustomizeContextMenu(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.contextMenuItems = e.value ? this.getContextMenuItems() : undefined;
  }

  onPreventContextMenuShowing(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.disableContextMenu = e.value;
  }

  onCustomCommandClick(e: DxGanttTypes.CustomCommandEvent) {
    if (e.name === 'ToggleDisplayOfResources') {
      this.showResources = !this.showResources;
    }
  }

  getContextMenuItems() {
    return [
      'addTask',
      'taskdetails',
      'deleteTask',
      {
        name: 'ToggleDisplayOfResources',
        text: 'Toggle Display of Resources',
      },
    ];
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
