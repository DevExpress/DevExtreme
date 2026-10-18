import { bootstrapApplication } from '@angular/platform-browser';
import {
  ChangeDetectorRef, Component, enableProdMode, provideZoneChangeDetection,
} from '@angular/core';
import { DxGanttModule, DxPopupModule } from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import {
  Service, Task, Dependency, Resource, ResourceAssignment,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxGanttModule,
    DxPopupModule,
  ],
})
export class AppComponent {
  tasks: Task[];

  dependencies: Dependency[];

  resources: Resource[];

  resourceAssignments: ResourceAssignment[];

  popupVisible = false;

  customButtonOptions: DxButtonTypes.Properties = {
    text: 'About',
    icon: 'info',
    stylingMode: 'text',
    onClick: () => {
      this.popupVisible = true;
      this.changeDetectorRef.detectChanges();
    },
  };

  constructor(service: Service, private changeDetectorRef: ChangeDetectorRef) {
    this.tasks = service.getTasks();
    this.dependencies = service.getDependencies();
    this.resources = service.getResources();
    this.resourceAssignments = service.getResourceAssignments();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
