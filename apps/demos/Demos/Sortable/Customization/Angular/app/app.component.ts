import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxScrollViewModule, DxNumberBoxModule } from 'devextreme-angular';
import { DxSortableModule, DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { DxCheckBoxModule, DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { DragDirection } from 'devextreme-angular/common';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  items: string[];

  dropFeedbackMode: DxSortableTypes.DragHighlight = 'push';

  itemOrientation: DxSortableTypes.Orientation = 'vertical';

  dragDirection: DragDirection = 'both';

  dragDirections: DragDirection[] = ['both', 'vertical'];

  scrollSpeed = 30;

  scrollSensitivity = 60;

  handle = '';

  dragTemplate = '';

  cursorOffset: { x: number, y: number } = null;

  constructor(service: Service) {
    this.items = service.getTasks().map((task) => task.Task_Subject);
  }

  onDragStart(e: DxSortableTypes.DragStartEvent) {
    e.itemData = this.items[e.fromIndex];
  }

  onReorder(e: DxSortableTypes.ReorderEvent) {
    this.items.splice(e.fromIndex, 1);
    this.items.splice(e.toIndex, 0, e.itemData);
  }

  onItemOrientationChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.dragDirections = ['both', e.value];
    this.dragDirection = 'both';
  }

  onHandleChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.handle = e.value ? '.handle' : '';
  }

  onDragTemplateChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.dragTemplate = e.value ? 'drag' : '';
    this.cursorOffset = e.value ? { x: 10, y: 20 } : null;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxScrollViewModule,
    DxSortableModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
