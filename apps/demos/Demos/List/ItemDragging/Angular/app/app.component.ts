import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxListModule } from 'devextreme-angular';
import { DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { Task, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type DxoItemDraggingProperties = DxSortableTypes.Properties;

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  doingTasks: Task[];

  plannedTasks: Task[];

  constructor(service: Service) {
    this.doingTasks = service.getDoingTasks();
    this.plannedTasks = service.getPlannedTasks();
  }

  onDragStart: DxoItemDraggingProperties['onDragStart'] = (e) => {
    e.itemData = e.fromData[e.fromIndex];
  };

  onAdd: DxoItemDraggingProperties['onAdd'] = (e) => {
    e.toData.splice(e.toIndex, 0, e.itemData);
  };

  onRemove: DxoItemDraggingProperties['onRemove'] = (e) => {
    e.fromData.splice(e.fromIndex, 1);
  };

  onReorder: DxoItemDraggingProperties['onReorder'] = (e) => {
    this.onRemove(e as DxSortableTypes.RemoveEvent);
    this.onAdd(e as DxSortableTypes.AddEvent);
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxListModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
