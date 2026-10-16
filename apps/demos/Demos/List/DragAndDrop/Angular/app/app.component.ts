import {
  ChangeDetectorRef, Component, enableProdMode, provideZoneChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxListModule } from 'devextreme-angular';
import type { DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { Task, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type DxoItemDraggingProperties = DxSortableTypes.Properties;

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [DxListModule],
})
export class AppComponent {
  doingTasks: Task[];

  plannedTasks: Task[];

  constructor(service: Service, private changeDetectorRef: ChangeDetectorRef) {
    this.doingTasks = service.getDoingTasks();
    this.plannedTasks = service.getPlannedTasks();
  }

  onDragStart: DxoItemDraggingProperties['onDragStart'] = (e) => {
    e.itemData = e.fromData[e.fromIndex];
  };

  onAdd: DxoItemDraggingProperties['onAdd'] = (e) => {
    e.toData.splice(e.toIndex, 0, e.itemData);
    this.changeDetectorRef.markForCheck();
  };

  onRemove: DxoItemDraggingProperties['onRemove'] = (e) => {
    e.fromData.splice(e.fromIndex, 1);
    this.changeDetectorRef.markForCheck();
  };

  onReorder: DxoItemDraggingProperties['onReorder'] = (e) => {
    this.onRemove(e as DxSortableTypes.RemoveEvent);
    this.onAdd(e as DxSortableTypes.AddEvent);
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
