import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxGanttModule, DxCheckBoxModule } from 'devextreme-angular';
import { Service, Task, Dependency } from './app.service';

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

  autoUpdateParentTasks: boolean;

  validateDependencies: boolean;

  enablePredecessorGap: boolean;

  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.dependencies = service.getDependencies();
    this.autoUpdateParentTasks = true;
    this.validateDependencies = true;
    this.enablePredecessorGap = true;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
